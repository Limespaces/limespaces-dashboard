"use client";

import {
  ComputerTowerIcon,
  DesktopIcon,
  MonitorIcon,
  PlusIcon,
  SlideshowIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

interface ISidebarProps {}

export function Sidebar(props: ISidebarProps) {
  return (
    <nav className="w-72">
      <div className="p-4">
        <h1 className="text-2xl text-green-800 font-semibold font-outfit flex flex-row items-center gap-2">
          <SlideshowIcon /> Limespaces
        </h1>
      </div>
      <div className="flex w-full pr-2">
        <div className="flex flex-col gap-px w-full">
          <p className="px-4 text-sm text-green-900 font-semibold mb-1">
            Workspaces
          </p>
          <Link
            href="/workspaces"
            className="flex flex-row gap-2 items-center text-green-900 hover:bg-green-800 hover:text-white py-1.5 px-4 rounded-md w-full transition-colors duration-200"
          >
            <MonitorIcon className="size-5" /> Workspaces
          </Link>
          <Link
            href="/workspaces/new"
            className="flex flex-row gap-2 items-center text-green-900 hover:bg-green-800 hover:text-white py-1.5 px-4 rounded-md w-full transition-colors duration-200"
          >
            <PlusIcon className="size-5" /> Create new
          </Link>
        </div>
      </div>
    </nav>
  );
}
