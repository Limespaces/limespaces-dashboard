"use client";

import {
  ComputerTowerIcon,
  DesktopIcon,
  MonitorIcon,
  PlusIcon,
  SlideshowIcon,
  SignOutIcon,
  Icon,
  UserIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface ISidebarProps {}

export function Sidebar(props: ISidebarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="w-72 flex flex-col justify-between h-full pb-4">
      <div>
        <div className="p-4">
          <h1 className="text-2xl text-green-700 font-semibold font-outfit flex flex-row items-center gap-2">
            <SlideshowIcon /> Limespaces
          </h1>
        </div>

        <SidebarGroup label="Workspaces">
          <SidebarLink
            href="/workspaces"
            label="My workspaces"
            icon={MonitorIcon}
          />
          <SidebarLink
            href="/workspaces/new"
            label="Create new"
            icon={PlusIcon}
          />
        </SidebarGroup>
      </div>

      {user && (
        <div className="mt-auto">
          <SidebarGroup label="Account">
            <SidebarLink
              href="/account"
              icon={UserIcon}
              label={user.name ?? "Account"}
            />
            <SidebarLink
              onClick={() => {
                window.location.href = "/api/auth/logout";
              }}
              icon={SignOutIcon}
              label="Sign out"
            />
          </SidebarGroup>
        </div>
      )}
    </nav>
  );
}

interface ISidebarGroupProps {
  label: string;
  children: ReactNode | ReactNode[];
}

export function SidebarGroup(props: ISidebarGroupProps) {
  return (
    <div className="flex flex-col gap-px w-full mb-4 pr-2">
      <p className="px-4 text-sm text-gray-900 font-semibold mb-1">
        {props.label}
      </p>
      {props.children}
    </div>
  );
}

type ISidebarLinkProps = {
  label: string;
  icon: Icon;
} & (
  | {
      href: string;
    }
  | {
      onClick: () => void;
    }
);

export function SidebarLink(props: ISidebarLinkProps) {
  return (
    <Link
      href={"href" in props ? props.href : ""}
      onClick={
        "onClick" in props
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();

              props.onClick();
            }
          : undefined
      }
      className="flex flex-row gap-2 items-center text-gray-900 hover:bg-gray-800 hover:text-white py-1.5 px-4 rounded-md w-full transition-colors duration-200"
    >
      <props.icon className="size-5" /> {props.label}
    </Link>
  );
}
