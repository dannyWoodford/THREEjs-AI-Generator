import { fileIcon, ai, aiBrain, logoShirt, stylishShirt } from "../assets";

export const EditorTabs = [
	{
		name: 'filepicker',
		icon: fileIcon,
	},
	{
		name: 'aipicker',
		icon: ai,
	},
	{
		name: 'aigenerator',
		icon: aiBrain,
	},
]

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: logoShirt,
  },
  {
    name: "stylishShirt",
    icon: stylishShirt,
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
};
