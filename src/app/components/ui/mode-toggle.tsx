"use client";

import * as React from "react";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useRoomContext } from "@/app/providers/room-context";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Textarea } from "./textarea";
import { SettingsIcon } from "lucide-react";

export function DialogDemo({
  open,
  setOpen,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  const { store } = useRoomContext();
  const [text, setText] = React.useState(store?.state?.userPrompt || "");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text || !store) return;
            store.state.userPrompt = text;
            setOpen?.(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Room Prompt</DialogTitle>
            <DialogDescription>
              This prompt defines the personality of the AI in the room. Try
              things like 'use an irish accent', or 'Remember that dad is bald'
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="room-prompt"
              placeholder="Enter a prompt"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ModeToggle() {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <>
      <DialogDemo
        open={showForm}
        setOpen={(open) => {
          setShowForm(open);
        }}
      />
      <Button
        onClick={() => {
          setShowForm(true);
        }}
        variant="ghost"
        className="w-9 px-0"
      >
        <SettingsIcon />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
