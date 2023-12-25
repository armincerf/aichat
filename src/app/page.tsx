"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";

import AnimatedRoomContainer from "./components/AnimatedRoomContainer";
import Navigator from "./components/Navigator";
import RoomContextProvider from "./providers/room-context";
import Room from "./components/Room";
import Settings from "./components/Settings";
import Avatar from "./components/Avatar";
import SettingsCTA from "./components/SettingsCTA";

import { useSearchParams, useRouter } from "next/navigation";

import { RoomMap, type RoomName, type User } from "@/shared";
import { TooltipProvider } from "./components/ui/tooltip";
import { SiteHeader } from "./components/Header";
import { cn } from "./components/utils";

const makeInitials = (name: string) => {
  const words = name.split(" ");
  switch (words.length) {
    case 0:
      return "";
    case 1:
      return words[0].slice(0, 1).toUpperCase();
    default:
      return (
        words[0].slice(0, 1).toUpperCase() +
        words[words.length - 1].slice(0, 1).toUpperCase()
      );
  }
};

const makeUser = (name: string) => {
  return {
    name: name,
    initials: makeInitials(name),
  } as User;
};

export default function Page() {
  const searchParams = useSearchParams();
  const currentRoom = searchParams.get("room") ?? "clojure_room";

  const [previousRoom] = useState(currentRoom);
  const [, setIsTransitioning] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const name = window.localStorage.getItem("spatial-chat:name");
    if (name) {
      setUser(makeUser(name));
    } else {
      setShowSettings(true);
    }
    setInitialLoad(false);
  }, []);

  const custom = { source: previousRoom, destination: currentRoom };
  const scrollToBottom = () => {
    console.log("scrolling to bottom");
    const el = document.getElementById("chat-scroll-anchor");
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <>
      <main className="relative flex flex-col pt-10">
        {showSettings && (
          <Settings
            name={user?.name ?? null}
            setName={(name) => setUser(makeUser(name))}
            dismiss={() => setShowSettings(false)}
          />
        )}
        <div
          className={cn({
            "flex flex-col items-center justify-center w-full": true,
            "pointer-events-none overscroll-none": showSettings,
          })}
        >
          {!initialLoad && !user && (
            <SettingsCTA
              settingsOpen={showSettings}
              showSettings={() => setShowSettings(true)}
            />
          )}
          <div className="fixed top-14 right-0 p-2 z-30">
            <div
              onClick={() => setShowSettings(true)}
              className="cursor-pointer"
            >
              {user !== null ? (
                <Avatar initials={user.initials} variant="highlight" />
              ) : (
                <Avatar initials="" variant="ghost" />
              )}
            </div>
          </div>
          <AnimatePresence
            custom={custom}
            onExitComplete={() => setIsTransitioning(false)}
          >
            {
              // Iterate over PaneMap getting the pane name and details object
              RoomMap.map((room) => {
                const roomName = room.roomId;
                return (
                  currentRoom === roomName && (
                    <RoomContextProvider
                      key={roomName}
                      name={roomName as RoomName}
                      currentUser={user}
                    >
                      <TooltipProvider>
                        <SiteHeader />
                        <Room scrollToBottom={scrollToBottom} />
                      </TooltipProvider>
                    </RoomContextProvider>
                  )
                );
              })
            }
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
