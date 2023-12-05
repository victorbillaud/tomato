import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { generateConversationToken } from "../_shared/jwt.ts";
import { middleware } from "../_shared/middleware.ts";
import { Database } from "../_shared/supabase_types.ts";

console.log("Hello from Functions!");

interface RequestPayload {
  item_id: string;
}

const verifyPayload = (payload: RequestPayload) => {
  if (!payload.item_id) {
    throw new Error("No item_id in payload");
  }
};

const fetchConversation = async (itemId: string, finderId: string) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: conversation } = await supabaseClient
    .from("conversation")
    .select("*")
    .eq("item_id", itemId)
    .eq("finder_id", finderId)
    .single();

  return conversation;
};

const createConversation = async (itemId: string, ownerId: string, finderId?: string, token?: string) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: conversation, error } = await supabaseClient
    .from("conversation")
    .insert({
      owner_id: ownerId,
      item_id: itemId,
      finder_id: finderId,
      token: token,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("Error creating conversation");
  }

  return conversation;
}

const fetchItem = async (itemId: string) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: item, error } = await supabaseClient
    .from("item")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    throw new Error("Error fetching item");
  }

  if (!item.lost) {
    throw new Error("Item is not lost");
  }

  return item;
};

const getFinderIdFromRequest = async (
  _request: Request,
): Promise<string | null> => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      global: {
        headers: { Authorization: _request.headers.get("Authorization")! },
      },
    },
  );

  console.log(`Authorization: ${_request.headers.get("Authorization")!}`);

  const { data } = await supabaseClient.auth.getUser();
  return data.user?.id ?? null;
};

const handle_finder_flow = async (_request: Request): Promise<Response> => {
  if (_request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: RequestPayload = await _request.json();
    verifyPayload(payload);

    const item = await fetchItem(payload.item_id);
    const finder_id = await getFinderIdFromRequest(_request);
    const conversation = finder_id
      ? await fetchConversation(payload.item_id, finder_id)
      : null;

    /*
        1. If the finder is the owner of the item, then we don't need to do anything.
        2. If the finder exists, and the finder is not the owner of the item, then we need to create a new conversation between the finder and the owner.
        3. If the finder does not exist, we need to create a new conversation with a unique token and send it to the finder. The token need to contain the conversation id.

        We also need to check if a conversation already exists between the finder and the owner. In this case, we don't need to create a new conversation.
        If there is a conversation and the finder is unknown we need to return the token to the finder.
    */

    if (item.user_id === finder_id) {
      throw new Error("Finder is the owner of the item");
    }

    if (conversation) {
      return new Response(
        finder_id
          ? JSON.stringify({ item, conversation })
          : JSON.stringify({ item, conversation_id: conversation.id }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    } else {
      if (finder_id) {
        const conversation = await createConversation(
          payload.item_id,
          item.user_id,
          finder_id,
        );

        return new Response(
          JSON.stringify({ item, conversation }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      } else {
        const conversation = await createConversation(
          payload.item_id,
          item.user_id,
          undefined,
          await generateConversationToken(payload.item_id),
        );

        return new Response(
          JSON.stringify({ conversation_id: conversation.id, token: conversation.token }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }
    }


  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
};

Deno.serve((request: Request) => middleware(request, handle_finder_flow));
