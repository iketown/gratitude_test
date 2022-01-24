export const reorder = (
  oldList: string[],
  startIndex: number,
  endIndex: number
) => {
  const newList = [...oldList];
  const [removed] = newList.splice(startIndex, 1);
  newList.splice(endIndex, 0, removed);

  return newList;
};
import { icons, colors } from "~/utils/tagIcons";

//   const files = reorder(
//     this.state.files,
//     result.source.index,
//     result.destination.index
//   );

export const getTagIcon = (tag: Tag) => {
  switch (tag.type) {
    case "icon_tag": {
      const iconKey = tag.iconName as string;
      return icons[iconKey];
    }
    case "emoji_tag":
      return (props: any) => <span {...props}>{tag.emoji}</span>;
    default:
      return () => <div>NOPE</div>;
  }
};
