// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "./utils";
import { CodeBlock, useCopyToClipboard } from "./ui/codeblock";
import { IconEdit, IconOpenAI, IconTrash, IconUser } from "./ui/icons";
import { FC, memo, useState } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import { type Message } from "ai";

import { Button } from "./ui/button";
import { IconCheck, IconCopy } from "./ui/icons";
import Avatar from "./Avatar";
import { useRoomContext } from "../providers/room-context";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
  onDelete: () => void;
  onEdit: () => void;
  canDelete: boolean;
}

export function ChatMessageActions({
  message,
  className,
  onDelete,
  onEdit,
  canDelete,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:right-0 md:pr-2 md:top-4 md:opacity-0",
        className,
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? <IconCheck /> : <IconCopy />}
        <span className="sr-only">Copy message</span>
      </Button>
      {canDelete && (
        <>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <IconEdit />
            <span className="sr-only">Edit message</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <IconTrash />
            <span className="sr-only">Delete message</span>
          </Button>
        </>
      )}
    </div>
  );
}
const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className,
);
export interface ChatMessageProps {
  onDelete: () => void;
  canDelete: boolean;
  onEdit: () => void;
  message: Message;
}

export function ChatMessage({
  message,
  onDelete,
  canDelete,
  onEdit,
  ...props
}: ChatMessageProps) {
  const [hideActions, setHideActions] = useState(true);
  return (
    <div
      className={cn(
        "group relative z-0 mb-4 flex items-start p-2 border rounded shadow-sm",
      )}
      onMouseEnter={() => setHideActions(false)}
      onMouseLeave={() => setHideActions(true)}
      onTouchStart={() => setHideActions((prev) => !prev)}
      {...props}
    >
      <div
        className={cn("flex h-8 w-8 select-none items-center justify-center")}
      >
        <Avatar
          variant={message.role === "assistant" ? "small-npc" : "small"}
          initials={message.name ?? ""}
        />
      </div>
      <div className="relative flex flex-row justify-between px-1 ml-4 -z-10 w-full">
        <MemoizedReactMarkdown
          className=" prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-[60vw] md:max-w-full"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const inline =
                node?.position?.start.line === node?.position?.end.line;

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "absolute z-50 top-0 right-0 bg-white rounded transition-opacity group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300 md:ease-in-out md:delay-100",
            hideActions ? "hidden" : "block",
          )}
        >
          <ChatMessageActions
            canDelete={canDelete}
            onEdit={onEdit}
            onDelete={onDelete}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}
