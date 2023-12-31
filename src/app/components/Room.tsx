import { useState } from "react";
import { useRoomContext } from "@/app/providers/room-context";
import { RoomMap, Message } from "@/shared";
import { useUsers, useSelf } from "y-presence";
import Avatar from "./Avatar";
import ClearRoom from "./ClearRoom";
import { useSyncedStore } from "@syncedstore/react";
import { Y, getYjsValue } from "@syncedstore/core";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { ChatMessage } from "./Messages";
import {
  ButtonScrollToBottom,
  ChatPanel,
  type ChatPanelProps,
} from "./ChatPanel";
import { uploadFiles } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

function DialogEdit({
  open,
  setOpen,
  message,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  message: Message;
}) {
  const { store } = useRoomContext();
  const [text, setText] = useState(message.text || "");
  function handleEditMessage(newText: string) {
    if (!store) return;
    const messages = getYjsValue(store.messages) as Y.Array<Y.Map<Message>>;
    if (!messages) return;
    const index = messages.toArray().findIndex((m) => {
      const mes = m.toJSON() as Message;
      return mes.text === message.text && mes.userId === message.userId;
    });
    if (index === -1) return;
    // @ts-ignore
    messages.get(index).set("text", newText);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text) return;
            handleEditMessage(text);
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

export default function Room({
  scrollToBottom,
}: {
  scrollToBottom: () => void;
}) {
  const {
    provider,
    name,
    store: globalStore,
    currentUserId,
  } = useRoomContext();
  const [messageInput, setMessageInput] = useState("");
  const store = useSyncedStore(globalStore);

  const handleDeleteMessage = (message: Message) => {
    if (!store) return;
    const messages = getYjsValue(store.messages) as Y.Array<Y.Map<Message>>;
    console.log(messages);
    if (!messages) return;
    const index = messages.toArray().findIndex((m) => {
      const mes = m.toJSON() as Message;
      return mes.text === message.text && mes.userId === message.userId;
    });
    console.log(index);
    if (index === -1) return;
    messages.delete(index, 1);
  };

  const users = useUsers(provider!.awareness);
  const self = useSelf(provider!.awareness);
  // Get room details
  const room = RoomMap.find((r) => r.roomId === name);
  const npc = room?.npc;
  const title = room?.title;

  const handleSubmit: ChatPanelProps["append"] = (message: string) => {
    if (!self || !message || !store) return;

    const newMessage = {
      userId: currentUserId,
      name: self.name,
      initials: self.initials,
      text: message,
      isNpc: false,
      seenByNpc: false,
    } as Message;

    store.messages.push(newMessage);
    setMessageInput("");
    scrollToBottom();
  };
  const handleImageUpload: ChatPanelProps["handleImageUpload"] = async (
    value,
    file,
  ) => {
    if (!self || !store) return;
    const pendingImageText = "Processing image...";
    const newMessage = {
      userId: currentUserId,
      name: self.name,
      initials: self.initials,
      text: pendingImageText,
      isNpc: false,
      seenByNpc: false,
    } as Message;
    store.messages.push(newMessage);
    store.state.image = value;
    const imageUploadRes = await uploadFiles("imageUploader", {
      files: [file],
    });
    if (!imageUploadRes) return;
    const url = imageUploadRes[0].url;
    const imageUploadedMsg = store.messages.find(
      (m) => m.text === pendingImageText,
    );
    if (!imageUploadedMsg) return;
    imageUploadedMsg.text = `![image](${url})`;
  };

  const isLoading = store?.state.isTyping;
  const [showEdit, setShowEdit] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);

  if (!provider) return null;
  if (!room) return null;

  return (
    <>
      {messageToEdit && (
        <DialogEdit
          open={showEdit}
          setOpen={(open) => {
            setShowEdit(open);
          }}
          message={messageToEdit}
        />
      )}
      <div className="fixed z-20 top-14 right-0 p-2 justify-end flex flex-row -space-x-2">
        {npc && <Avatar initials={npc.name} variant="npc" />}
        {Array.from(users.entries())
          .sort()
          .map(([key, value]) => {
            // Skip if value (the awareness object) is empty
            if (!value.name) return null;
            const isMe = currentUserId === key.toString();
            if (isMe) return null;
            return (
              <Avatar key={key} initials={value.initials} variant="normal" />
            );
          })}
        <Avatar initials="" variant="ghost" />
      </div>
      <div className="p-4 flex flex-col gap-1 justify-start items-start">
        {self?.name && self.name === "Alex" && <ClearRoom />}
      </div>

      <div
        id="chat"
        className="h-full relative max-h-full overflow-y-scroll sm:w-3/4 lg:max-w-screen-xl sm:px-4 flex flex-col gap-6 justify-between items-stretch pb-12"
      >
        {store ? (
          <ul className="relative px-4">
            {store.messages
              .filter(
                (message) =>
                  typeof message.text === "string" &&
                  !message.text.includes("@bot"),
              )
              .map((message: Message, index: number) => {
                const isMe = currentUserId === message.userId;
                return (
                  <li key={index}>
                    <ChatMessage
                      canDelete={isMe || self?.name === "Alex"}
                      onEdit={() => {
                        setMessageToEdit(message);
                        setShowEdit(true);
                      }}
                      onDelete={() => {
                        handleDeleteMessage(message);
                      }}
                      message={{
                        id: index.toString(),
                        content: message.text,
                        name: message.initials,
                        role: message.isNpc ? "assistant" : "user",
                      }}
                    />
                    <div className="grow-0 w-3"></div>
                  </li>
                );
              })}
            <ChatScrollAnchor
              lastMessageLength={
                !store.messages.length
                  ? 0
                  : store.messages[store.messages.length - 1].text.length
              }
              trackVisibility={isLoading}
            />
          </ul>
        ) : null}
        {store?.messages.length ? (
          <ButtonScrollToBottom scrollToBottom={scrollToBottom} />
        ) : null}
        {self?.name && (
          <ChatPanel
            handleImageUpload={handleImageUpload}
            title={title}
            isLoading={!!isLoading}
            stop={() => {
              console.log("stop");
            }}
            append={handleSubmit}
            input={messageInput}
            setInput={setMessageInput}
            handleAskAi={() => {
              handleSubmit(
                "@bot answer the above but act like you've just been woken up and are quite annoyed at being disturbed",
              );
            }}
            aiName={npc?.name ?? "AI"}
          />
        )}
      </div>
    </>
  );
}
