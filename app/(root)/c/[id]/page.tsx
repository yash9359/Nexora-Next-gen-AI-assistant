import { Skeleton } from "@/components/ui/skeleton";
import { loadChatMessages } from "@/features/ai/actions/chat-store";
import { getConversation } from "@/features/conversation/actions/conversation-actions";
import ConversationView from "@/features/conversation/components/conversationView";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type ConversationPageProps = {
  params: Promise<{ id: string }>;
};

function ConversationSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
     
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-4 w-36 rounded-md" />
      </header>

      
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-6">
          
          <div className="flex justify-end">
            <Skeleton className="h-10 w-48 rounded-2xl" />
          </div>

         
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>

        
          <div className="flex justify-end">
            <Skeleton className="h-10 w-64 rounded-2xl" />
          </div>

          
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </div>
      </div>

      
      <div className="shrink-0 px-4 pb-6 pt-2 md:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <Skeleton className="h-14 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

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
      key={id}
      conversationId={id}
      initialMessages={initialMessages}
    />
  );
}

const Page = ({ params }: ConversationPageProps) => {
  return (
    <Suspense fallback={<ConversationSkeleton />}>
      <ConversationContent paramsPromise={params} />
    </Suspense>
  );
};

export default Page;