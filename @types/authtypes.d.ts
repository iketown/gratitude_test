interface UserI {
  firstName: string;
  lastName: string;
}
interface SignInUserI {
  email: string;
  password: string;
}
interface SignUpUserI extends UserI {
  email: string;
  password: string;
}
interface UserProfileI extends UserI {
  uid: string;
  authType: "google" | "facebook" | "email" | "twitter";
  photoURL?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string | null;
}

interface UserInfo {
  uid: string;
  email: string;
  hasCustomTags?: boolean;
  tagset_ids?: string[]; // always use "my_tagset" but could import other peoples tags by adding them as another doc at user/uid/tags/other_id
}
