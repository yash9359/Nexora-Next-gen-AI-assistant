import { Suspense } from "react";
import { onBoard } from "@/features/auth/action/onboard";
import { auth } from "@clerk/nextjs/server";
import { ChatShell } from "@/features/conversation/components/chat-shell";

async function OnBoardSync() {
  await auth.protect();
  await onBoard();
  return null;
}

const RootGrouplayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Suspense fallback={null}>
        <OnBoardSync />
      </Suspense>
      <ChatShell>
      {children}
      </ChatShell>
    </div>
  );
};

export default RootGrouplayout;