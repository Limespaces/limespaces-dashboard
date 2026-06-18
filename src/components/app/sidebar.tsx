"use client";

import {
  ComputerTowerIcon,
  DesktopIcon,
  MonitorIcon,
  PlusIcon,
  SlideshowIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface ISidebarProps {}

export function Sidebar(props: ISidebarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="w-72 flex flex-col justify-between h-full pb-4">
      <div>
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
      </div>

      {user && (
        <div className="px-4 py-3 border-t border-green-200/50 flex flex-col gap-2 mx-2 bg-green-100/30 rounded-lg">
          <div className="flex items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="w-9 h-9 rounded-full border border-green-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-sm select-none">
                {user.name ? user.name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-green-900 truncate">
                {user.name || "User"}
              </p>
              <p className="text-xs text-green-700 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex flex-row gap-2 items-center text-green-800 hover:bg-green-800 hover:text-white py-1.5 px-3 rounded-md w-full transition-colors duration-200 text-sm font-medium mt-1 cursor-pointer"
          >
            <SignOutIcon className="size-4" /> Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
