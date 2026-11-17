"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQueryClient } from '@tanstack/react-query';
import {type UIMessage } from 'ai';
import React from 'react'
import { Separator } from 'react-resizable-panels';
import { useConversations } from '../hooks/use-conversation';

type ConversationViewProps = {
    conversationId:string,
    initialMessages:UIMessage[];
}

const ConversationView = ({conversationId,initialMessages}:ConversationViewProps) => {
    
    const queruClient = useQueryClient();

    const {data:conversations} = useConversations();

    
  
    return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mx-1 h-4" />
                <h1 className="truncate text-sm font-medium">{title}</h1>
            </header>

            {messages.length === 0 ? (
                <ChatEmpty />
            ) : (
                <ChatMessages messages={messages} status={status} />
            )}

            <ChatComposer
                onSend={(text) => {
                    void sendMessage({ text });
                }}
                isSending={status !== "ready"}
                autoFocus
            />
        </div>
  )
}

export default ConversationView
