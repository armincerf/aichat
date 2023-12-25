"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "../utils";
import { siteConfig } from "./mobile-nav";
import { RoomMap } from "@/shared";

export function MainNav() {
  const pathname = useSearchParams().get("room");

  return (
    <div className="mr-4 hidden md:flex  w-4/6">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm overflow-x-scroll">
        {RoomMap.map(({ roomId, title }) => (
          <Link
            key={roomId}
            href={`?room=${roomId}`}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === roomId ? "text-foreground" : "text-foreground/60",
            )}
          >
            {title.replace(/_|room/g, " ").trim()}
          </Link>
        ))}
      </nav>
    </div>
  );
}
