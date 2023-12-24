import * as React from "react";
import { type UseChatHelpers } from "ai/react";
import {
  IconRefresh,
  IconStop,
  IconArrowElbow,
  IconPlus,
  IconArrowDown,
} from "./ui/icons";
import Textarea from "react-textarea-autosize";
import { cn } from "./utils";
import { Button, ButtonProps, buttonVariants } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter } from "next/navigation";
import { useAtBottom } from "./chat-scroll-anchor";
import { Message } from "@/shared";
import Avatar from "./Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import imageCompression from "browser-image-compression";

import { FaCameraRetro } from "react-icons/fa";

export function ButtonScrollToBottom({
  className,
  messageElRef,
  ...props
}: ButtonProps & {
  messageElRef: React.RefObject<HTMLDivElement> | undefined;
}) {
  const isAtBottom = useAtBottom(messageElRef);

  React.useEffect(() => {
    messageElRef?.current?.scrollTo({
      top: messageElRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messageElRef]);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-4 bottom-28 z-20 bg-background transition-opacity duration-300 sm:right-8",
        className,
        isAtBottom ? "opacity-0" : "opacity-100",
      )}
      onClick={() => {
        messageElRef?.current?.scrollTo({
          top: messageElRef.current.scrollHeight,
          behavior: "smooth",
        });
      }}
      {...props}
    >
      <IconArrowDown />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}

export function useEnterSubmit(): {
  formRef: React.RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return { formRef, onKeyDown: handleKeyDown };
}

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => void;
  onImageUpload: (value: string, file: File) => Promise<void>;
  aiName: string;
  isLoading: boolean;
  handleAskAi: () => void;
}

export function PromptForm({
  onSubmit,
  onImageUpload,
  input,
  setInput,
  aiName,
  isLoading,
  handleAskAi,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  async function handleImageUpload(event) {
    setImageLoading(true);
    const imageFile = event.target.files[0];
    console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob,
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
      );
      const base64str =
        await imageCompression.getDataUrlFromFile(compressedFile);
      await onImageUpload(base64str, compressedFile);
      setImageLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  const actions = [
    {
      label: "Ask AI",
      component: null,
      icon: aiLoading ? (
        <div className="animate-spin">
          <IconRefresh />
        </div>
      ) : (
        <IconPlus />
      ),
      onClick: () => {
        setAiLoading(true);
        handleAskAi();
        setTimeout(() => {
          setAiLoading(false);
          setOpen(false);
        }, 1300);
      },
    },
    {
      label: "Add Photo",
      icon: imageLoading ? (
        <div className="animate-spin">
          <FaCameraRetro />
        </div>
      ) : (
        <FaCameraRetro />
      ),
      component: () => {
        return (
          <>
            <input
              type="file"
              id="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e);
              }}
            />
            <label htmlFor="file" className="cursor-pointer">
              Add Photo
            </label>
          </>
        );
      },
      onClick: () => {
        console.log("refresh");
      },
    },
  ] as const;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        onSubmit(input);
      }}
      ref={formRef}
    >
      <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="absolute left-4 top-4">
            <button
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "h-8 w-8 rounded-full bg-background p-0 sm:left-4",
              )}
            >
              <Avatar initials={aiName} variant="small-npc" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <ul className="flex flex-col gap-2 p-2">
              {actions.map((action) => (
                <li key={action.label}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      action.onClick();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {action.icon}
                      {action.component && action.component()}
                      {!action.component && <span>{action.label}</span>}
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild></TooltipTrigger>
          <TooltipContent>Ask AI</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message or click the AI icon to upload an image."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ""}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
export interface ChatPanelProps
  extends Pick<UseChatHelpers, "isLoading" | "stop" | "input" | "setInput"> {
  id?: string;
  title?: string;
  append: (message: string) => void;
  aiName: string;
  handleAskAi: () => void;
  handleImageUpload: (value: string, file: File) => Promise<void>;
}

export function ChatPanel({
  isLoading,
  append,
  input,
  setInput,
  aiName,
  handleAskAi,
  handleImageUpload,
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 w-screen bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={(value) => {
              append(value);
            }}
            onImageUpload={handleImageUpload}
            handleAskAi={handleAskAi}
            aiName={aiName}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
