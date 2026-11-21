"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { onBoard } from "./onboard";

export const requireUser = async () => {
  const { userId } = await auth.protect();

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await onBoard();
  }

  if (!user) {
    throw new Error("User not found. Complete onboarding first.");
  }

  return user;
};