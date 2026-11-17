"use server";

import { isTextUIPart, type UIMessage } from "ai";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db";


/** Extracts plain text from an AI SDK `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
    return message.parts.filter(isTextUIPart).map((part) => part.text).join("");
}

/**
 * Normalizes stored message parts from the database into AI SDK `UIMessage` parts.
 * Falls back to a single text part when no structured parts are stored.
 */
function toUIMessageParts(
    parts: Prisma.JsonValue | null,
    content: string
): UIMessage["parts"] {
    const stored = parts as UIMessage["parts"] | null;
    if (Array.isArray(stored) && stored.length > 0) {
        return stored;
    }

    return [{ type: "text", text: content }];
}

/** Loads all persisted messages for a conversation, oldest first. */
export async function loadChatMessages(
    conversationId: string,
): Promise<UIMessage[]> {
    const rows = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
    });

    return rows.map((row) => ({
        id: row.id,
        role: row.role === "ASSISTANT" ? "assistant" : "user",
        parts: toUIMessageParts(row.parts, row.content),
    }));
}

export async function getUserMessageCount(conversationId: string) {
    return prisma.message.count({
        where: {
            conversationId,
            role: "USER",
        },
    });
}

type SaveChatMessagesOptions = {
    updateTitle?: boolean;
};

/**
 * Upserts AI SDK `UIMessage`s into the database for a conversation.
 *
 * @param conversationId - Target conversation ID.
 * @param messages - Messages to persist (system messages are skipped).
 * @param options.updateTitle - When true, auto-titles "New Chat" from the first user message.
 */
export async function saveChatMessages(
    conversationId: string,
    messages: UIMessage[],
    options: SaveChatMessagesOptions = {}
) {
    const { updateTitle = true } = options;

    await prisma.$transaction(async (tx) => {
        for (const message of messages) {
            if (message.role === "system") continue;

            const content = getMessageText(message);
            const role = message.role === "assistant" ? "ASSISTANT" : "USER";

            await tx.message.upsert({
                where: { id: message.id },
                create: {
                    id: message.id,
                    conversationId,
                    role,
                    status: "COMPLETE",
                    content,
                    parts: message.parts as Prisma.InputJsonValue,
                },
                update: {
                    content,
                    parts: message.parts as Prisma.InputJsonValue,
                    status: "COMPLETE",
                },
            });
        }
    });

    const conversation = await prisma.conversation.findUniqueOrThrow({
        where: { id: conversationId },
        select: { title: true },
    });

    const firstUser = messages.find((message) => message.role === "user");
    const firstUserText = firstUser ? getMessageText(firstUser).trim() : "";

    const nextTitle = updateTitle && conversation.title === "New Chat" && firstUserText
        ? firstUserText.replace(/\s+/g, " ").trim().slice(0, 48)
        : conversation.title;

    await prisma.conversation.update({
        where: { id: conversationId },
        data: {
            lastMessageAt: new Date(),
            title: nextTitle || "New Chat",
        },
    });
}
