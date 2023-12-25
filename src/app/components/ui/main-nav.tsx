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
        {Object.keys(RoomMap).map((room) => (
          <Link
            key={room}
            href={`?room=${room}`}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === room ? "text-foreground" : "text-foreground/60",
            )}
          >
            {room.replace(/_|room/g, " ").trim()}
          </Link>
        ))}
      </nav>
    </div>
  );
}
