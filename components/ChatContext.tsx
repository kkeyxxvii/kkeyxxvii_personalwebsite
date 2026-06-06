"use client";

/**
 * ChatContext — single source of truth for the KKEYXXVIIAI panel.
 * Both Navbar (opens) and ShiftLayout (shifts content) read from here.
 */

import { createContext, useContext, useState, type ReactNode } from "react";

interface ChatContextValue {
  open: boolean;
  openChat:   () => void;
  closeChat:  () => void;
  toggleChat: () => void;
  /* About modal */
  aboutOpen:  boolean;
  openAbout:  () => void;
  closeAbout: () => void;
}

const ChatContext = createContext<ChatContextValue>({
  open:        false,
  openChat:    () => {},
  closeChat:   () => {},
  toggleChat:  () => {},
  aboutOpen:   false,
  openAbout:   () => {},
  closeAbout:  () => {},
});

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open,      setOpen]      = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        open,
        openChat:    () => setOpen(true),
        closeChat:   () => setOpen(false),
        toggleChat:  () => setOpen((v) => !v),
        aboutOpen,
        openAbout:   () => setAboutOpen(true),
        closeAbout:  () => setAboutOpen(false),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
