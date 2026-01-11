import menuDots from "../../../../public/menu-dots.svg";
import { Dropdown, type DropdownMenuItem } from "../common/Dropdown";

const menuItems: DropdownMenuItem[] = [
	{
		label: "publish",
		onClick: () => {},
	},
	{
		label: "view site",
		onClick: () => {},
	},
	{
		label: "copy link",
		onClick: () => {},
	},
	{
		label: "remove",
		onClick: () => {},
	},
];

export const CardMoreAuthDropdown = () => {
	return (
		<Dropdown
			trigger={
				<img
					src={menuDots}
					width={12}
					height={12}
					alt="menu-dot"
					style={{ cursor: "pointer" }}
				/>
			}
			items={menuItems}
			position="bottom-right"
		/>
	);
};
