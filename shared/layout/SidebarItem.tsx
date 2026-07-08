import Link from "next/link";

import { SidebarItem as Item } from "./sidebarItems";

interface Props {
  item: Item;
}

export default function SidebarItem({ item }: Props) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="
        flex
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-slate-700
        transition
        hover:bg-blue-50
        hover:text-blue-600
      "
    >
      <Icon size={22} />

      <span className="font-medium">
        {item.title}
      </span>
    </Link>
  );
}