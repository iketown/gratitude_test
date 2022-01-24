import type { User, UserCredential } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  TwitterAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import nookies from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import type { FC, Dispatch, SetStateAction } from "react";
import { app, db } from "~/utils/firebase";
const auth = getAuth();

// auth emulator
// https://firebase.google.com/docs/emulator-suite/connect_auth

interface AuthCtxI {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  user_id: string | null;
  signedOut: boolean | undefined;
  logOut: () => Promise<void>;
  register: ({
    email,
    password,
    firstName,
    lastName,
  }: SignUpUserI) => Promise<Error | undefined>;
  loginEmailPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  // loginWithGoogle: () => Promise<void>;
  // loginWithFaceBook: () => Promise<void>;
  // loginWithTwitter: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const createUserInfo = async ({
  uid,
  firstName = null,
  lastName = null,
  displayName = null,
  photoURL = null,
  authType,
  email,
}: UserProfileI) => {
  const docRef = doc(db, "users", uid);
  const response = await setDoc(
    docRef,
    {
      uid,
      firstName,
      lastName,
      displayName,
      photoURL,
      authType,
      email,
    },
    { merge: true }
  );
};

const resetPassword = async (email: string) => {
  // TODO implement reset password
  console.log(email);
};

// const createUserInfoFromCred = (
//   userCred: UserCredential,
//   authType: AuthType
// ) => {
//   const { displayName, email, photoURL, uid } = userCred.user;
//   return createUserInfo({ uid, displayName, email, photoURL, authType });
// };

const register = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpUserI) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCred?.user.uid;
  if (!uid) {
    return new Error("no uid from firebase");
  }
  const displayName = `${firstName} ${lastName}`;
  const authType = "email";
  await createUserInfo({
    uid,
    email,
    authType,
    firstName,
    lastName,
    displayName,
  });
};

const loginEmailPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// const loginWithGoogle = async () => {
//   const provider = new GoogleAuthProvider();
//   const userCred = await signInWithPopup(auth, provider);
//   return createUserInfoFromCred(userCred, "google");
// };

// const loginWithFaceBook = async () => {
//   const provider = new FacebookAuthProvider();
//   const userCred = await signInWithPopup(auth, provider);
//   return createUserInfoFromCred(userCred, "facebook");
// };

// const loginWithTwitter = async () => {
//   const provider = new TwitterAuthProvider();
//   const userCred = await signInWithPopup(auth, provider);
//   return createUserInfoFromCred(userCred, "twitter");
// };

const logOut = () => {
  const auth = getAuth(app);
  return auth.signOut();
};

const errorFxn = (args?: any) => {
  throw new Error(`out of context ${JSON.stringify(args)}`);
};

const AuthCtx = createContext<AuthCtxI>({
  signedOut: false,
  user: null,
  setUser: errorFxn,
  user_id: null,
  logOut: errorFxn,
  register: errorFxn,
  loginEmailPassword: errorFxn,
  // loginWithGoogle: errorFxn,
  // loginWithFaceBook: errorFxn,
  // loginWithTwitter: errorFxn,
  resetPassword: errorFxn,
});

export const AuthCtxProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [signedOut, setSignedOut] = useState<boolean>(false); // if loading user, different than if there is NO user.
  const user_id = user?.uid || null;
  // handle auth logic;
  useEffect(() => {
    return onIdTokenChanged(getAuth(app), async (user) => {
      console.log("id token changed", new Date().toTimeString(), user);
      if (!user) {
        setUser(null);
        setSignedOut(true);
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken(true);
        setUser(user);
        setSignedOut(false);
        nookies.set(undefined, "token", token, { path: "/" });
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const _user = getAuth(app).currentUser;
      if (_user) await _user.getIdToken(true);
    }, 10 * 60 * 1000);
    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        user,
        setUser,
        user_id,
        signedOut,
        logOut,
        register,
        loginEmailPassword,
        // loginWithGoogle,
        // loginWithFaceBook,
        // loginWithTwitter,
        resetPassword,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export function useAuthCtx() {
  return useContext(AuthCtx);
}
