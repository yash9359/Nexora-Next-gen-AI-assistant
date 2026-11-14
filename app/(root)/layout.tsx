import { Suspense } from "react";
import { onBoard } from "@/features/auth/action/onboard";
import { auth } from "@clerk/nextjs/server";

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
      {children}
    </div>
  );
};

export default RootGrouplayout;