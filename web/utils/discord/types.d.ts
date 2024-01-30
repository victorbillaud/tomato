export interface WebHookBody {
  username?: string;
  avatar_url?: string;
  content: string;
  embeds?: {
    author?: {
      name: string;
      url?: string;
      icon_url?: string;
    };
    title: string;
    url?: string;
    description?: string;
    color?: number;
    fields?: { name: string; value: string; inline?: boolean }[];
    thumbnail?: { url: string };
    image?: {
      url: string;
    };
    footer?: {
      text: string;
      icon_url?: string;
    };
  }[];
}
