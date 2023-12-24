"use client";

import { useState } from "react";
import { useRoomContext } from "@/app/providers/room-context";
import { useSyncedStore } from "@syncedstore/react";
import { getYjsValue } from "@syncedstore/core";
import * as Y from "yjs";
import { type Message } from "@/shared";

export default function AddRoom() {
  const [showModal, setShowConfirmation] = useState(false);
  const { store } = useRoomContext();
  const state = useSyncedStore(store);

  const handleAddRoom = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {showModal && (
        <div className="flex flex-wrap gap-2 justify-start items-center">
          <button
            className="outline outline-1 outline-red-400 rounded-full px-3 py-1 text-red-400 text-sm hover:bg-red-200 hover:text-red-500 whitespace-nowrap"
            onClick={handleAddRoom}
          >
            I’m sure! Add all messages for everyone!
          </button>
          <button
            className="outline outline-1 outline-black/40 rounded-full px-3 py-1 text-black/40 text-sm hover:bg-white/40 hover:text-black/50 whitespace-nowrap"
            onClick={() => setShowConfirmation(false)}
          >
            No, don’t clear
          </button>
        </div>
      )}
      {!showModal && (
        <button
          className="outline outline-1 outline-black/40 rounded-full px-3 py-1 text-black/40 text-sm hover:bg-white/40 hover:text-black/50 whitespace-nowrap"
          onClick={() => setShowConfirmation(true)}
        >
          Add all messages
        </button>
      )}
    </>
  );
}
