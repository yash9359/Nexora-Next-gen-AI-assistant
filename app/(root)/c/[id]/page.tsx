import { loadChatMessages } from "@/features/ai/actions/chat-store";
import { getConversation } from "@/features/conversation/actions/conversation-actions";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type ConversationPageProps = {
    params: Promise<{ id: string }>;
};

async function ConversationContent({
    paramsPromise,
}: {
    paramsPromise: Promise<{ id: string }>;
}) {
    const { id } = await paramsPromise;

    try {
        await getConversation(id);
    } catch (error) {
        notFound();
    }

    const initialMessages = await loadChatMessages(id);
  

    return (
            <ConversationView
            key = {id}
            conversationId = {id}
            initialMessages={initialMessages}

            />
    );
}

const page = ({ params }: ConversationPageProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConversationContent paramsPromise={params} />
        </Suspense>
    );
};

export default page;
