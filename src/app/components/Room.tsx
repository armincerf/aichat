import classNames from "classnames";
import { useState, useRef } from "react";
import { useRoomContext } from "@/app/providers/room-context";
import { RoomMap, Message } from "@/shared";
import { useUsers, useSelf } from "y-presence";
import Avatar from "./Avatar";
import ClearRoom from "./ClearRoom";
import { useSyncedStore } from "@syncedstore/react";
import { Y, getYjsValue } from "@syncedstore/core";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { ChatMessage } from "./Messages";
import { Separator } from "./ui/seperator";
import {
  ButtonScrollToBottom,
  ChatPanel,
  type ChatPanelProps,
} from "./ChatPanel";
import { uploadFiles } from "./utils";

export default function Room() {
  const {
    provider,
    name,
    store: globalStore,
    currentUserId,
  } = useRoomContext();
  const [messageInput, setMessageInput] = useState("");
  const store = useSyncedStore(globalStore);
  const chatListRef = useRef<HTMLDivElement>(null);

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
  const room = RoomMap[name];
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
    chatListRef?.current?.scrollTo({
      top: chatListRef.current.scrollHeight,
      behavior: "smooth",
    });
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
  if (isLoading) console.log("loading");

  if (!provider) return null;
  if (!room) return null;

  return (
    <div className="h-full flex flex-col justify-start items-center">
      <div className="absolute top-0 right-0 p-2 justify-end flex flex-row -space-x-2">
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
        <div className="flex flex-row gap-2">
          <div className="prose">
            <h1>{title}</h1>
          </div>
        </div>
        {room?.subtitle && (
          <h4 className="text-black/50 font-semibold text-lg w-2/3">
            {room.subtitle}
          </h4>
        )}

        {self?.name && self.name === "Alex" && <ClearRoom />}
      </div>

      <div
        id="chat"
        className="h-full relative max-h-full overflow-hidden sm:w-3/4 lg:max-w-screen-xl sm:px-4 flex flex-col gap-6 justify-between items-stretch"
      >
        <div
          ref={chatListRef}
          className="overflow-y-scroll pt-2 pb-24 relative"
        >
          {store ? (
            <ul className="relative px-4">
              {store.messages
                .filter((message) => message.text !== "@bot")
                .map((message: Message, index: number) => {
                  const isMe = currentUserId === message.userId;
                  return (
                    <li key={index}>
                      <ChatMessage
                        canDelete={isMe || self?.name === "Alex"}
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
                messageElRef={chatListRef}
                lastMessageLength={
                  !store.messages.length
                    ? 0
                    : store.messages[store.messages.length - 1].text.length
                }
                trackVisibility={isLoading}
              />
            </ul>
          ) : null}
        </div>
        {store?.messages.length ? (
          <ButtonScrollToBottom messageElRef={chatListRef} />
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
              handleSubmit("@bot");
            }}
            aiName={npc?.name ?? "AI"}
          />
        )}
      </div>
    </div>
  );
}
