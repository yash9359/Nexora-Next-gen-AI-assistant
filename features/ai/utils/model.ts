import {groq} from '@ai-sdk/groq';

export const DEFAULT_CHAT_MODEL = 'llama-3.3-70b-versatile';


export function getChatModel(modelId?:string | null){
    return  groq(modelId?.trim()  || DEFAULT_CHAT_MODEL)
}