"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";

export function useAtBottom() {
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const atBottom =
        scrollHeight - scrollTop - clientHeight <= clientHeight / 4;
      setIsAtBottom(atBottom);
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return isAtBottom;
}

export function ChatScrollAnchor({
  trackVisibility,
  lastMessageLength,
}: {
  trackVisibility?: boolean;
  lastMessageLength?: number;
}) {
  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: "0px 0px -150px 0px",
  });

  React.useEffect(() => {
    setTimeout(() => {
      entry?.target.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }, 100);
  }, [entry]);

  React.useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [inView, entry, isAtBottom, trackVisibility, lastMessageLength]);

  return (
    <div id="chat-scroll-anchor" ref={ref} className="h-px mt-14 w-full" />
  );
}
