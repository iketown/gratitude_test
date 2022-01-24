import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { db } from "~/utils/firebase";
import {
  onSnapshot,
  collection,
  query,
  setDoc,
  doc,
  where,
  deleteDoc,
  deleteField,
  updateDoc,
} from "firebase/firestore";
import { useAuthCtx } from "./AuthCtx";
import { useTagCtx } from "./TagCtx";

interface PostCtxI {
  postRecordsByDate: PostRecordsByDate;
  updatePost: (
    post: UpdatePostI,
    tagsToAdd: string[],
    tagsToRemove: string[]
  ) => Promise<void>;
  recentUpdates: { [date_id: string]: Post };
  removePost: (post_id: string, tagsToRemove: string[]) => Promise<any>;
}

type PostRecordsByYear = {
  [year_id: string]: PostRecordsByDate;
};
type PostRecordsByDate = {
  [date_id: string]: PostRecord | "removed";
};
type PostRecord = {
  updated_at: number;
};

interface UpdatePostI {
  date_id: string;
  comment: string;
  tags: string[];
}

//@ts-ignore
const PostCtx = createContext<PostCtxI>({});

export const PostCtxProvider: React.FC = ({ children }) => {
  const { user, user_id } = useAuthCtx();
  const { updateTagRecords } = useTagCtx();
  const [postRecordsYears, setPostRecordsYears] = useState<PostRecordsByYear>(
    {}
  );
  const [postRecordsByDate, setPostRecordsByDate] = useState<PostRecordsByDate>(
    {}
  );
  const [recentUpdates, setRecentUpdates] = useState<{
    [date_id: string]: Post;
  }>({});

  const updatePost = useCallback(
    async (post: UpdatePostI, tagsToAdd: string[], tagsToRemove: string[]) => {
      if (!user_id) return;
      const { date_id, ...postInfo } = post;
      const [year] = date_id.split("-");
      const updated_at = new Date().valueOf();
      const docP = setDoc(
        doc(db, "users", user_id, "posts", date_id),
        { ...postInfo, updated_at, removed: false },
        {
          merge: true,
        }
      );
      const docRecordP = setDoc(
        doc(db, "users", user_id, "years", year),
        {
          [date_id]: { updated_at },
        },
        { merge: true }
      );
      const tagsP = updateTagRecords(date_id, { tagsToAdd, tagsToRemove });
      await Promise.all([docP, docRecordP, tagsP]);
    },
    [user_id]
  );

  const removePost = useCallback(
    async (post_id: string, tagsToRemove: string[]) => {
      //TODO remove this post's tag_use refs
      if (!user_id) return;
      const [year] = post_id.split("-");
      const updated_at = new Date().valueOf();
      const docP = setDoc(
        doc(db, "users", user_id, "posts", post_id),
        { removed: true, updated_at },
        { merge: false }
      );
      const docRecordP = updateDoc(doc(db, "users", user_id, "years", year), {
        [post_id]: deleteField(),
      });
      const tagsP = updateTagRecords(post_id, { tagsToAdd: [], tagsToRemove });
      await Promise.all([docP, docRecordP, tagsP]);
    },
    [user_id]
  );

  useEffect(() => {
    let _pRBD = {};
    Object.entries(postRecordsYears).forEach(([year, prb]) => {
      _pRBD = { ..._pRBD, ...prb };
    });
    console.log("prd", _pRBD);
    setPostRecordsByDate(_pRBD);
  }, [postRecordsYears]);

  useEffect(() => {
    if (!user_id) {
      console.log("no user_id");
      setPostRecordsYears({});
      setPostRecordsByDate({});
      return;
    }
    const q = query(collection(db, "users", user_id, "years"));
    const unsub = onSnapshot(q, (snap) => {
      const _postRecords: PostRecordsByYear = {};
      snap.docChanges().forEach(({ doc, type }) => {
        const year = doc.id;
        const postRecordYear: { [date_id: string]: PostRecord } = {};
        Object.entries(doc.data()).forEach(([date_id, postRecord]) => {
          postRecordYear[date_id] = postRecord;
        });
        _postRecords[year] = postRecordYear;
      });
      console.log("adding", _postRecords);
      setPostRecordsYears((old) => ({ ...old, ..._postRecords }));
    });
    return unsub;
  }, [user_id]);

  useEffect(() => {
    if (!user_id) return;
    const startTime = new Date().valueOf();
    const q = query(
      collection(db, "users", user_id, "posts"),
      where("updated_at", ">", startTime)
    );
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) return;
      const _recentUpdates: { [date_id: string]: Post } = {};
      snap.docChanges().forEach(({ doc }) => {
        _recentUpdates[doc.id] = doc.data() as Post;
      });
      setRecentUpdates((old) => ({ ...old, ..._recentUpdates }));
    });
    return unsub;
  }, [user_id]);

  return (
    <PostCtx.Provider
      value={{ postRecordsByDate, updatePost, removePost, recentUpdates }}
    >
      {children}
    </PostCtx.Provider>
  );
};

export const usePostCtx = () => useContext(PostCtx);
