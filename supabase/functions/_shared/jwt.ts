import * as djwt from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const JWT_TOKEN = Deno.env.get("TOMATO_JWT_SECRET") as string;

const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_TOKEN),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
);


export const generateConversationToken = async (conversationId: string) => {
    const payload = {
        conversation_id: conversationId,
    };

    const token = await djwt.create({ alg: "HS256", typ: "JWT" }, payload, key);

    return token;
};
