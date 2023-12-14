import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";
import { middleware } from "../_shared/middleware.ts";
import { Database } from "../_shared/supabase_types.ts";

interface RequestPayload {
  email: string;
  conversation_tokens?: Record<string, {
    token: string;
    conversation_id: string;
  }>;
}

const verifyPayload = (payload: RequestPayload) => {
  if (!payload.email) {
    throw new Error("Invalid email");
  }
};

const supabaseClient = createClient<Database>(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

export const fetchConversationByToken = async (token: string) => {
  const { data: conversation_id } = await supabaseClient.rpc(
    "get_conversation_id_from_token",
    { token },
  );

  if (!conversation_id) {
    return null;
  }

  const { data: conversation } = await supabaseClient
    .from("conversation")
    .select("*")
    .eq("token", token)
    .eq("id", conversation_id)
    .single();

  return conversation;
};

export const createUser = async (email: string, tokens: string[]) => {
  const { data: { user }, error } = await supabaseClient.auth.admin
    .inviteUserByEmail(email);

  if (error || !user) {
    throw new Error("Error creating user");
  }

  try {
    await supabaseClient.rpc("update_user_conversations_and_messages", {
      user_id: user.id,
      tokens: tokens,
    });

  } catch {
    throw new Error("Error updating user conversations and messages");
  }

  return user;
};

const handle_finder_registration = async (
  _request: Request,
): Promise<Response> => {
  if (_request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: RequestPayload = await _request.json();
    verifyPayload(payload);

    const tokens = payload.conversation_tokens
      ? Object.entries(payload.conversation_tokens).map(([_, value]) =>
        value.token
      )
      : [];

    const user = await createUser(payload.email, tokens);

    return new Response(JSON.stringify({ user }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
};

Deno.serve((request: Request) =>
  middleware(request, handle_finder_registration)
);
