"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";

export function useAtBottom(
  messageElRef: React.RefObject<HTMLDivElement> | undefined,
) {
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  const el = messageElRef?.current || document.body;

  React.useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atBottom = scrollHeight - scrollTop - clientHeight <= clientHeight;

      setIsAtBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [el]);

  return isAtBottom;
}

export function ChatScrollAnchor({
  trackVisibility,
  lastMessageLength,
  messageElRef,
}: {
  trackVisibility?: boolean;
  lastMessageLength?: number;
  messageElRef?: React.RefObject<HTMLDivElement>;
}) {
  const isAtBottom = useAtBottom(messageElRef);
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: "0px 0px -150px 0px",
  });

  React.useEffect(() => {
    console.log("lastMessageLength", lastMessageLength);
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: "start",
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility, lastMessageLength]);

  return <div ref={ref} className="h-px w-full" />;
}
