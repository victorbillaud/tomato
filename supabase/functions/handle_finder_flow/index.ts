import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";
import { middleware } from "../_shared/middleware.ts";
import { Database } from "../_shared/supabase_types.ts";

interface RequestPayload {
  item_id: string;
}

type NotificationInsert =
  Database["public"]["Tables"]["notification"]["Insert"];

const verifyPayload = (payload: RequestPayload) => {
  if (!payload.item_id) {
    throw new Error("Invalid item_id");
  }
};

const insertNotification = async (notification: NotificationInsert) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: notificationData, error } = await supabaseClient
    .from("notification")
    .insert(notification);

  if (error) {
    throw new Error("Error inserting notification");
  }

  return notificationData;
};

export const fetchItem = async (itemId: string) => {
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

export const getFinderIdFromRequest = async (
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

  const { data } = await supabaseClient.auth.getUser();
  return data.user?.id ?? null;
};

export const fetchConversation = async (itemId: string, finderId: string) => {
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

export const fetchConversationByToken = async (token: string) => {
  const supabaseClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: conversation_id } = await supabaseClient.rpc("get_conversation_id_from_token", { token });

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

export const createConversation = async (
  itemId: string,
  ownerId: string,
  finderId?: string,
) => {
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
    })
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error creating conversation");
  }

  // Notify the owner that a new conversation has been created for his item
  await insertNotification({
    user_id: ownerId,
    type: "system",
    title: finderId ? "A registered user found your item" : "A user found your item",
    link: `/chat/${conversation.id}`,
    metadata: {
      conversation_id: conversation.id,
      owner_id: ownerId,
      item_id: itemId,
      finder_id: finderId,
    },
  });

  // Notify the finder that a new conversation has been created for his item
  finderId &&
    (await insertNotification({
      user_id: finderId,
      type: "system",
      title: "You found an item",
      link: `/chat/${conversation.id}`,
      metadata: {
        conversation_id: conversation.id,
        owner_id: ownerId,
        item_id: itemId,
        finder_id: finderId,
      },
    }));

  return conversation;
};

const handle_finder_flow = async (_request: Request): Promise<Response> => {
  if (_request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log({ _request });

  try {
    const payload: RequestPayload = await _request.json();
    verifyPayload(payload);

    console.log({ payload });

    const item = await fetchItem(payload.item_id);
    const finder_id = await getFinderIdFromRequest(_request);
    const conversation = finder_id
      ? await fetchConversation(payload.item_id, finder_id)
      : null;
    const conversation_token = _request.headers.get(
      "x-tomato-conversation-token",
    );

    console.log({ item, finder_id, conversation, conversation_token });

    /*

        1. If the finder is the owner of the item, then we don't need to do anything.
        2. If the finder exists, and the finder is not the owner of the item, then we need to create a new conversation between the finder and the owner.
        3. If the finder does not exist, we need to create a new conversation with a unique token and send it to the finder. The token need to contain the conversation id.

        We also need to check if a conversation already exists between the finder and the owner. In this case, we don't need to create a new conversation.
        If there is a conversation and the finder is unknown we need to return the token to the finder.

        If there is a conversation_token it means that the finder is unknown and he is trying to connect to an existing conversation.
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
    }

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
    }

    /*
      From this point, we know that the finder is unknown.
    */

    if (conversation_token) {
      let conversation = await fetchConversationByToken(
        conversation_token,
      );

      if (!conversation) {
        conversation = await createConversation(
          payload.item_id,
          item.user_id,
          undefined,
        );
      }

      return new Response(
        JSON.stringify({
          conversation_id: conversation.id,
          token: conversation.token,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    } else {
      const conversation = await createConversation(
        item.id,
        item.user_id,
        undefined,
      );

      return new Response(
        JSON.stringify({
          conversation_id: conversation.id,
          token: conversation.token,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
};

Deno.serve((request: Request) => middleware(request, handle_finder_flow));
