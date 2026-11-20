"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { useConversations } from "../hooks/use-conversation";
import { useChat } from "@ai-sdk/react";
import { querykeys } from "../utils/query-keys";
import toast from "react-hot-toast";
import ChatEmpty from "./Chat-empty";
import { ChatMessages } from "./chat-messages";
import { ChatComposer } from "./chat-composer";

type ConversationViewProps = {
  conversationId: string;
  initialMessages: UIMessage[];
};

const ConversationView = ({
  conversationId,
  initialMessages,
}: ConversationViewProps) => {
  const queryClient = useQueryClient();
  const { data: conversations } = useConversations();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: {
            id,
            message: messages.at(-1),
          },
        }),
      }),
    []
  );

  const { messages, sendMessage, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      void queryClient.invalidateQueries({
        queryKey: querykeys.conversations.all,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const title =
    conversations?.find((item) => item.id === conversationId)?.title ?? "Chat";

  return (
    <div className="flex h-svh min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-sm">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-1 h-4" />
        <h1 className="truncate text-sm font-medium">{title}</h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {messages.length === 0 ? (
          <ChatEmpty onSelectPrompt={(text) => void sendMessage({ text })} />
        ) : (
          <ChatMessages messages={messages} status={status} />
        )}
      </div>

      <div className="shrink-0 bg-background pt-2">
        <ChatComposer
          onSend={(text) => {
            void sendMessage({ text });
          }}
          isSending={status !== "ready"}
          autoFocus
        />
      </div>
    </div>
  );
};

export default ConversationView;