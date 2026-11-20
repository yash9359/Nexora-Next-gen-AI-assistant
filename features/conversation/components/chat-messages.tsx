"use client";

import { isTextUIPart, type ChatStatus, type UIMessage } from "ai";
import { CheckCircle2, Loader2, Wrench } from "lucide-react";

import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
};

function ToolBadge({
  toolName,
  state,
}: {
  toolName: string;
  state: "loading" | "complete";
}) {
  return (
    <div className="my-1.5 inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground">
      {state === "loading" ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <CheckCircle2 className="size-3.5 text-emerald-500" />
      )}
      <Wrench className="size-3" />
      <span className="font-medium text-foreground">{toolName}</span>
    </div>
  );
}

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  const isWaiting =
    status === "submitted" && messages.at(-1)?.role === "user";

  return (
    <Conversation className="flex-1 overflow-y-auto">
      <ConversationContent className="mx-auto max-w-3xl py-8">
        {messages.map((message) => (
          <Message key={message.id} from={message.role}>
            <MessageContent>
              {message.parts?.map((part, index) => {
                if (isTextUIPart(part)) {
                  return (
                    <MessageResponse key={index}>
                      {part.text}
                    </MessageResponse>
                  );
                }

                if (
                  part.type.startsWith("tool-") ||
                  part.type === "dynamic-tool"
                ) {
                  const p = part as Record<string, unknown>;
                  const toolName =
                    (typeof p.toolName === "string" && p.toolName) ||
                    part.type.replace("tool-", "") ||
                    "tool";
                  const isDone =
                    p.state === "output-available" ||
                    p.state === "result" ||
                    p.output !== undefined;

                  return (
                    <ToolBadge
                      key={index}
                      toolName={toolName}
                      state={isDone ? "complete" : "loading"}
                    />
                  );
                }

                return null;
              })}
            </MessageContent>
          </Message>
        ))}

        {isWaiting ? (
          <Message from="assistant">
            <MessageContent>
              <Loader />
            </MessageContent>
          </Message>
        ) : null}
      </ConversationContent>
    </Conversation>
  );
}