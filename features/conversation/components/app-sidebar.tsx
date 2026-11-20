"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Loader2Icon,
    LogOutIcon,
    MessageSquareIcon,
    MoonIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PinIcon,
    PinOffIcon,
    PlusIcon,
    SunIcon,
    Trash2Icon,
} from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useConversations,
    useCreateConversation,
    useDeleteConversation,
    useUpdateConversation,
} from "@/features/conversation/hooks/use-conversation";
import { cn } from "@/lib/utils";

type Conversation = NonNullable<
    ReturnType<typeof useConversations>["data"]
>[number];

/**
 * Main application sidebar — logo, new chat, conversation list, theme toggle, and account.
 */
export function AppSidebar() {
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();
    const { data: conversations, isLoading } = useConversations();
    const createConversation = useCreateConversation();

    const activeId = pathname.startsWith("/c/")
        ? pathname.split("/")[2]
        : undefined;

    // A selected chat should take the user straight to its contents on phones.
    // Keep the persistent desktop sidebar unchanged.
    React.useEffect(() => {
        if (isMobile) setOpenMobile(false);
    }, [isMobile, pathname, setOpenMobile]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="gap-3 pb-2">
                <SidebarMenu className="gap-2">
                    {/* Brand Logo */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="rounded-xl font-semibold tracking-tight hover:bg-sidebar-accent/60"
                            render={<Link href="/" />}
                        >
                            <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                                <Image
                                    src="/nexoraIcon_transparentsvg.svg"
                                    alt="Nexora AI logo"
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                />
                            </span>
                            <span className="text-[15px] font-semibold tracking-tight">
                                Nexora AI
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Styled New Chat Button */}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="New chat"
                            onClick={() => createConversation.mutate()}
                            disabled={createConversation.isPending}
                            className="h-9 rounded-xl border border-sidebar-border/80 bg-sidebar-accent/40 font-medium shadow-none transition-colors hover:bg-sidebar-accent"
                        >
                            {createConversation.isPending ? (
                                <Loader2Icon className="animate-spin" />
                            ) : (
                                <PlusIcon />
                            )}
                            <span>
                                {createConversation.isPending ? "Creating..." : "New chat"}
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-1">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                        Recent Chats
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            <ChatList
                                conversations={conversations}
                                isLoading={isLoading}
                                activeId={activeId}
                            />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60 pt-2">
                <SidebarFooterMenu />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

/** Renders the conversation list with loading skeletons or an empty-state message. */
function ChatList({
    conversations,
    isLoading,
    activeId,
}: {
    conversations: Conversation[] | undefined;
    isLoading: boolean;
    activeId: string | undefined;
}) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-1.5 px-1">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (!conversations?.length) {
        return (
            <p className="px-2 py-2 text-xs text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
                No chats yet
            </p>
        );
    }

    return (
        <>
            {conversations.map((conversation) => (
                <ChatItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={activeId === conversation.id}
                />
            ))}
        </>
    );
}

function ChatItem({
    conversation,
    isActive,
}: {
    conversation: Conversation;
    isActive: boolean;
}) {
    const updateConversation = useUpdateConversation();
    const deleteConversation = useDeleteConversation(
        isActive ? conversation.id : undefined
    );

    function handleRename() {
        const next = window.prompt("Rename chat", conversation.title);
        if (!next || next.trim() === conversation.title) return;
        updateConversation.mutate({ id: conversation.id, title: next.trim() });
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                isActive={isActive}
                tooltip={conversation.title}
                render={<Link href={`/c/${conversation.id}`} />}
                className={cn(
                    "h-9 rounded-lg px-2.5 text-[13px] transition-colors",
                    isActive
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                )}
            >
                {conversation.isPinned ? (
                    <PinIcon className="size-3.5 shrink-0 text-primary" />
                ) : (
                    <MessageSquareIcon className="size-3.5 shrink-0 text-muted-foreground/70" />
                )}
                <span className="truncate">{conversation.title}</span>
            </SidebarMenuButton>

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <SidebarMenuAction
                            showOnHover
                            className="top-2 rounded-md data-popup-open:bg-sidebar-accent"
                        />
                    }
                >
                    <MoreHorizontalIcon />
                    <span className="sr-only">Chat actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-40">
                    <DropdownMenuItem onClick={handleRename}>
                        <PencilIcon />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            updateConversation.mutate({
                                id: conversation.id,
                                isPinned: !conversation.isPinned,
                            })
                        }
                    >
                        {conversation.isPinned ? <PinOffIcon /> : <PinIcon />}
                        {conversation.isPinned ? "Unpin" : "Pin"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => deleteConversation.mutate(conversation.id)}
                    >
                        <Trash2Icon />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}


function SidebarFooterMenu() {
    const { resolvedTheme, setTheme } = useTheme();
    const clerk = useClerk();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center justify-between gap-2 rounded-xl px-1 py-1">
                    {/* Left: Avatar + Account */}
                    <div className="flex min-w-0 items-center gap-2.5">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "size-8",
                                },
                            }}
                        />
                        <span className="truncate text-xs font-medium text-foreground/90 group-data-[collapsible=icon]:hidden">
                            Account
                        </span>
                    </div>

                    {/* Right: Theme Toggle + Sign Out */}
                    <div className="flex items-center gap-0.5 group-data-[collapsible=icon]:hidden">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                            onClick={() =>
                                setTheme(resolvedTheme === "dark" ? "light" : "dark")
                            }
                            aria-label="Toggle theme"
                            title="Toggle theme"
                        >
                            {mounted && resolvedTheme === "dark" ? (
                                <SunIcon className="size-4" />
                            ) : (
                                <MoonIcon className="size-4" />
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => clerk.signOut({ redirectUrl: "/sign-in" })}
                            aria-label="Sign out"
                            title="Sign out"
                        >
                            <LogOutIcon className="size-4" />
                        </Button>
                    </div>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
