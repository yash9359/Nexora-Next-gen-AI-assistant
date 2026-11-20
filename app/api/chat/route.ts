import { loadChatMessages, saveChatMessages } from "@/features/ai/actions/chat-store";
import { getChatModel } from "@/features/ai/utils/model";
import { requireUser } from "@/features/auth/action/require-user";
import { SystemPrompt } from "@/features/messages/actions/system-prompt";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {convertToModelMessages, createIdGenerator, createUIMessageStream, createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage} from "ai"
export async function POST(req:Request) {

    await auth.protect();

    const {message,id} :{message: UIMessage, id:string} = await req.json();

    if(!message || !id) {return new Response("Missing message or Conversation id");}


    const user = await requireUser();


    const conversation = await prisma.conversation.findFirst({
        where:{
            id,
            userId:user.id
        }
    });

    if(!conversation){
        return new Response("Conversation not found",{status:404});
    }
    
    const previousMessages = await loadChatMessages(id);

    const alreadySaved = previousMessages.some((storedMessage)=> storedMessage.id === message.id);

    if(!alreadySaved){
        await saveChatMessages(id,[message])
    }

     
  const allMessages = [
    ...previousMessages,
    ...(alreadySaved ? [] : [message]),
  ];


    const result  =   streamText({
            model:getChatModel(conversation.model),
            system:conversation.systemPrompt ?? SystemPrompt,
         messages: await convertToModelMessages(allMessages),
    })

    result.consumeStream();

    return createUIMessageStreamResponse({
        stream :toUIMessageStream({
            stream:result.stream,
            originalMessages:allMessages,
            generateMessageId:createIdGenerator({prefix:"msg",size:16}),
            onEnd:async({messages:finalMessages})=>{
                try {
                    await saveChatMessages(id,finalMessages,{updateTitle:false})
                } catch (error) {
                    console.error(error)
                }
            }
        })
    } )


}
