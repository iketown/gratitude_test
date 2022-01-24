// similar to auth ctx, but focused on user profile stuff
// instead of signin/signout stuff.
import {
  doc,
  onSnapshot,
  setDoc,
  DocumentData,
  collection,
} from "firebase/firestore";

import { useSnackbar } from "notistack";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { FC, SetStateAction, Dispatch } from "react";
import { db } from "~/utils/firebase";
import { useAuthCtx } from "./AuthCtx";

const errorFxn = () => {
  throw new Error("out of context");
};

interface UserCtxI {
  userInfo: UserInfo | null;
  updateUserInfo: (userInfo: any) => Promise<void>;
  tags: TagDoc;
  setTags: Dispatch<SetStateAction<TagDoc>>;
}

const UserCtx = createContext<UserCtxI>({
  userInfo: null,
  updateUserInfo: errorFxn,
  setTags: errorFxn,
  tags: { tags: {}, tag_ids: [] },
});

export const UserCtxProvider: React.FC = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tags, setTags] = useState<TagDoc>({ tags: {}, tag_ids: [] });
  const { user } = useAuthCtx();
  const user_id = user?.uid;

  // get userInfo when user is signed in
  useEffect(() => {
    if (!user_id) {
      console.log("no user_id userinfo listener");
      return;
    }
    const unsub = onSnapshot(doc(db, `users/${user_id}`), (snap) => {
      if (snap.data()) {
        const userInfo = snap.data() as UserInfo;
        setUserInfo(userInfo);
      } else {
        const { email, uid } = user;
        updateUserInfo({ email, uid });
        // setUserInfo(null);
      }
    });
    return unsub;
  }, [user_id, user]);

  useEffect(() => {
    if (!user_id) {
      console.log("no user_id tags listener");
      return;
    }
    const unsub = onSnapshot(
      doc(db, "users", user_id, "tags", "my_tagset"),
      (snap) => {
        if (snap.data()) {
          setTags(snap.data() as TagDoc);
        } else {
        }
      }
    );
    return unsub;
  }, [user_id]);

  const updateUserInfo = useCallback(
    (userInfo: any) => {
      if (!user_id)
        throw new Error("must be signed in before you can updateUserInfo");
      return setDoc(doc(db, `users/${user.uid}`), userInfo, { merge: true });
    },
    [user_id]
  );

  return (
    <UserCtx.Provider
      value={{
        userInfo,
        updateUserInfo,
        tags,
        setTags,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export const useUserCtx = () => useContext(UserCtx);
