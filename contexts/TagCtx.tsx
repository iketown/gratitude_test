import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import type { FC, Dispatch, SetStateAction } from "react";
import { useAuthCtx } from "./AuthCtx";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "~/utils/firebase";
import { defaultTagObj } from "~/utils/tagIcons";
const default_tag_ids = Object.keys(defaultTagObj);

export interface TagUpdates {
  tagsToAdd: string[];
  tagsToRemove: string[];
}
interface TagUseDoc {
  [tag_id: string]: {
    [doc_id: string]: number | false;
  };
}

interface TagCtxI {
  updateTagRecords: (doc_id: string, updates: TagUpdates) => Promise<void>;
  tagUseDoc: TagUseDoc;
  setListenToTagUse: Dispatch<SetStateAction<boolean>>;
  myTags?: { [tag_id: string]: Tag };
  setMyTags: Dispatch<
    SetStateAction<
      | {
          [tag_id: string]: Tag;
        }
      | undefined
    >
  >;
  tag_ids?: string[];
  setTagIds: Dispatch<SetStateAction<string[] | undefined>>;
}
const errorFxn = () => {
  throw new Error("out of Tag Context");
};
const TagCtx = createContext<TagCtxI>({
  updateTagRecords: errorFxn,
  setListenToTagUse: errorFxn,
  tagUseDoc: {},
  setTagIds: errorFxn,
  setMyTags: errorFxn,
});

export const TagCtxProvider: FC = ({ children }) => {
  const { user_id } = useAuthCtx();
  const [tagUseDoc, setTagUseDoc] = useState<TagUseDoc>({});
  const [listenToTagUse, setListenToTagUse] = useState(false);

  const [myTags, setMyTags] = useState<{ [tag_id: string]: Tag }>();
  const [tag_ids, setTagIds] = useState<string[]>();

  useEffect(() => {
    if (!user_id || !listenToTagUse) return; // this is reading ALL the tag docs.  dont do it if not using it.
    const q = query(collection(db, "users", user_id, "tag_use"));
    const unsub = onSnapshot(q, (snap) => {
      const _tagUseDocChanges: TagUseDoc = {};
      snap.docChanges().forEach(({ doc }) => {
        if (doc.exists()) {
          _tagUseDocChanges[doc.id] = doc.data();
        }
      });
      console.log("tagUseDoc changes", _tagUseDocChanges);
      setTagUseDoc((old) => ({ ...old, ..._tagUseDocChanges }));
    });
    return unsub;
  }, [user_id, listenToTagUse]);

  useEffect(() => {
    // my_tagset listener;
    if (!user_id) return;
    const docRef = doc(db, "users", user_id, "tags", "my_tagset");
    onSnapshot(docRef, (doc) => {
      const data = doc.data() as TagDoc;
      if (!data) return;
      const { tags, tag_ids } = data;
      console.log("updating tags", data);
      setMyTags(tags);
      setTagIds(tag_ids);
    });
  }, [user_id]);

  const updateTagRecords = useCallback(
    async (doc_id: string, { tagsToAdd, tagsToRemove }: TagUpdates) => {
      if (!user_id) return;
      const updated_at = new Date().valueOf();
      const tagCollRef = collection(db, "users", user_id, "tag_use");
      const addsP = tagsToAdd.map((tag_id) => {
        return setDoc(
          doc(tagCollRef, tag_id),
          { [doc_id]: updated_at },
          { merge: true }
        );
      });
      const removesP = tagsToRemove.map((tag_id) => {
        return setDoc(
          doc(tagCollRef, tag_id),
          { [doc_id]: false },
          { merge: true }
        );
      });
      await Promise.all([...addsP, ...removesP]);
    },
    [user_id]
  );

  return (
    <TagCtx.Provider
      value={{
        updateTagRecords,
        setListenToTagUse,
        tagUseDoc,
        myTags,
        setMyTags,
        tag_ids,
        setTagIds,
      }}
    >
      {children}
    </TagCtx.Provider>
  );
};

export const useTagCtx = () => useContext(TagCtx);
