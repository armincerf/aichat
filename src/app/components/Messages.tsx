// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { useLongPress } from "@uidotdev/usehooks";

import { cn } from "./utils";
import { CodeBlock, useCopyToClipboard } from "./ui/codeblock";
import {
  IconEdit,
  IconOpenAI,
  IconSpeaker,
  IconTrash,
  IconUser,
} from "./ui/icons";
import { FC, memo, useState } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import { type Message } from "ai";

import { Button } from "./ui/button";
import { IconCheck, IconCopy } from "./ui/icons";
import Avatar from "./Avatar";
import { PiSpeakerHighLight } from "react-icons/pi";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./ui/context-menu";
import AudioStream, { convertAndStream } from "./ui/audio-stream";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
  onDelete: () => void;
  onEdit: () => void;
  canDelete: boolean;
  setLoading: (loading: boolean) => void;
  setSourceUrl: (sourceUrl: string) => void;
  setError: (error: string) => void;
}

export function ChatMessageActions({
  message,
  className,
  onDelete,
  onEdit,
  canDelete,
  setLoading,
  setSourceUrl,
  setError,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  const onShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: message.id,
          text: message.content,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log(`Web share not supported on your browser`);
    }
  };

  const onSpeak = (voiceId: string) => {
    convertAndStream({
      text: message.content,
      voiceSettings: {
        stability: 0.3,
        similarity_boost: 0.5,
      },
      voiceId,
      apiKey: "50eb40c2f0243966dd2f2891594223ed",
      setLoading,
      setSourceUrl,
      setError,
    })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };
  const onClearVoices = () => {
    setSourceUrl("");
  };

  return (
    <ContextMenuContent className="w-64">
      <ContextMenuItem onClick={onCopy}>
        Copy message
        <ContextMenuShortcut>
          {isCopied ? <IconCheck /> : <IconCopy />}
        </ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={onShare}>
        Share message
        <ContextMenuShortcut>
          <IconOpenAI />
        </ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => onSpeak("EQGubzgQs9jkhAy220Ow")}>
        Speak message (Nature doc)
        <ContextMenuShortcut>
          <div
            style={{
              fontSize: "1rem",
            }}
          >
            <PiSpeakerHighLight />
          </div>
        </ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onSpeak("cjwXchLLF0a3P7QhvU7K")}>
        Speak message (Aus)
        <ContextMenuShortcut>
          <div
            style={{
              fontSize: "1rem",
            }}
          >
            <PiSpeakerHighLight />
          </div>
        </ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onSpeak("0ap6Xx3V2DYZXDjiCnE3")}>
        Speak message (Trump)
        <ContextMenuShortcut>
          <div
            style={{
              fontSize: "1rem",
            }}
          >
            <PiSpeakerHighLight />
          </div>
        </ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={onClearVoices}>
        Clear voices
        <ContextMenuShortcut>
          <IconTrash />
        </ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />

      {canDelete && (
        <>
          <ContextMenuItem onClick={onEdit}>
            Edit message
            <ContextMenuShortcut>
              <IconEdit />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onDelete}>
            Delete message
            <ContextMenuShortcut>
              <IconTrash />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
        </>
      )}
    </ContextMenuContent>
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
  const [loading, setLoading] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [error, setError] = useState("");
  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn(
          "group select-none relative z-0 mb-4 flex items-start p-2 border rounded shadow-sm",
        )}
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
        </div>
      </ContextMenuTrigger>
      {sourceUrl && (
        <audio autoPlay controls>
          <source src={sourceUrl} type="audio/mpeg" />
        </audio>
      )}
      <ChatMessageActions
        setLoading={setLoading}
        setSourceUrl={setSourceUrl}
        setError={setError}
        canDelete={canDelete}
        onEdit={onEdit}
        onDelete={onDelete}
        message={message}
      />
    </ContextMenu>
  );
}
