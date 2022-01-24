import { useState, useEffect, useCallback } from "react";
import { useUserCtx } from "~/contexts/UserCtx";
import { useAuthCtx } from "~/contexts/AuthCtx";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  FieldValue,
  deleteField,
  arrayRemove,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "~/utils/firebase";
import { defaultTagObj } from "~/utils/tagIcons";

export const useTagFxns = () => {
  const { user_id, user } = useAuthCtx();
  const { userInfo } = useUserCtx();

  const updateTag = useCallback(
    async (tag: Tag) => {
      if (!user_id) return;
      const updated_at = new Date().valueOf();
      const { tag_id } = tag;
      const docRef = doc(db, "users", user_id, "tags", "my_tagset");
      return updateDoc(docRef, { [`tags.${tag_id}`]: tag, updated_at });
    },
    [user_id, userInfo]
  );

  const addNewTag = useCallback(
    async (tag: Tag, tag_ids: string[] = []) => {
      if (!user_id) return;
      const newTagIds = [tag.tag_id, ...tag_ids];
      const updated_at = new Date().valueOf();
      const { tag_id } = tag;
      const docRef = doc(db, "users", user_id, "tags", "my_tagset");
      try {
        await updateDoc(docRef, {
          [`tags.${tag_id}`]: tag,
          tag_ids: newTagIds,
          updated_at,
        });
      } catch (error) {
        // errors out if this is the first tag
        await setDoc(docRef, {
          tags: {
            [tag_id]: tag,
          },
          tag_ids: newTagIds,
        });
      }
    },
    [user_id]
  );

  const updateTagOrder = useCallback(
    async (tag_ids: string[]) => {
      if (!user_id) return;
      const updated_at = new Date().valueOf();
      const docRef = doc(db, "users", user_id, "tags", "my_tagset");
      return updateDoc(docRef, { tag_ids, updated_at });
    },
    [user_id, userInfo]
  );

  const removeTag = useCallback(
    async (tag_id: string) => {
      if (!user_id) return;
      const docRef = doc(db, "users", user_id, "tags", "my_tagset");
      const updated_at = new Date().valueOf();
      updateDoc(docRef, {
        [`tags.${tag_id}`]: deleteField(),
        tag_ids: arrayRemove(tag_id),
        updated_at,
      });
    },
    [user_id, userInfo]
  );

  return { updateTag, addNewTag, updateTagOrder, removeTag };
};
