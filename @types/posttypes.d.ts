interface Post {
  tags?: string[];
  comment: string;
  updated_at: number;
  removed?: boolean;
}

type Tag = IconTag | EmojiTag;

interface TagBase {
  tag_id: string;
  type: "icon_tag" | "emoji_tag";
  tagTitle: string;
  isNew?: boolean;
}
interface IconTag extends TagBase {
  type: "icon_tag";
  iconName: keyof IconLibrary;
  color: string;
}
interface EmojiTag extends TagBase {
  type: "emoji_tag";
  emoji: string;
  color?: string; // not used
}

interface TagDoc {
  tags: {
    [tag_id: string]: Tag;
  };
  tag_ids: string[];
}

interface TagRecord {
  updated_at: number;
  tag_id: string;
  uses: {
    [post_id: string]: boolean;
  };
}
