import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";
import { nanoid } from "nanoid";
import type { IconType } from "react-icons";
import {
  FaDog,
  FaHashtag,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaMusic,
  FaRunning,
  FaTheaterMasks,
} from "react-icons/fa";
import {
  GiCandleLight,
  GiClothes,
  GiHealthNormal,
  GiMaterialsScience,
  GiShinyApple,
} from "react-icons/gi";
import {
  MdComputer,
  MdFamilyRestroom,
  MdNaturePeople,
  MdPeople,
  MdWork,
} from "react-icons/md";
import { RiMentalHealthFill, RiMovieFill } from "react-icons/ri";

export type IconLibrary = { [iconName: string]: IconType };
export const icons: IconLibrary = {
  clothes: GiClothes,
  computer: MdComputer,
  entertainment: RiMovieFill,
  environment: FaMapMarkerAlt,
  exercise: FaRunning,
  family: MdFamilyRestroom,
  food: GiShinyApple,
  health: GiHealthNormal,
  home: FaHome,
  "mental health": RiMentalHealthFill,
  money: FaMoneyBill,
  music: FaMusic,
  nature: MdNaturePeople,
  pets: FaDog,
  relationships: MdPeople,
  science: GiMaterialsScience,
  spritual: GiCandleLight,
  theater: FaTheaterMasks,
  work: MdWork,
  other: FaHashtag,
};

export const colors = {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
};

export const defaultTags: IconTag[] = Object.entries(icons).map(
  ([iconName, icon], i) => {
    const tag_id = `icontag_${nanoid(5)}`;
    const colorArr = Object.entries(colors);
    const type = "icon_tag";
    const [colorName, colorObj] = colorArr[i % colorArr.length];
    const color = colorObj[600];
    return { iconName, tagTitle: iconName, tag_id, color, type };
  }
);
export const defaultTagObj: { [tag_id: string]: Tag } = defaultTags.reduce(
  (obj: { [tag_id: string]: Tag }, tag) => {
    obj[tag.tag_id] = tag;
    return obj;
  },
  {}
);
