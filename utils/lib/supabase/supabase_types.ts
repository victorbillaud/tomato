export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      conversation: {
        Row: {
          created_at: string
          finder_id: string | null
          id: string
          item_id: string
          owner_id: string
          token: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          finder_id?: string | null
          id?: string
          item_id: string
          owner_id: string
          token?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          finder_id?: string | null
          id?: string
          item_id?: string
          owner_id?: string
          token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_finder_id_fkey"
            columns: ["finder_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      item: {
        Row: {
          activated: boolean
          created_at: string
          description: string | null
          id: string
          lost: boolean
          lost_at: string | null
          name: string
          notify_anyway: boolean
          qrcode_id: string | null
          user_id: string
        }
        Insert: {
          activated?: boolean
          created_at?: string
          description?: string | null
          id?: string
          lost?: boolean
          lost_at?: string | null
          name: string
          notify_anyway?: boolean
          qrcode_id?: string | null
          user_id: string
        }
        Update: {
          activated?: boolean
          created_at?: string
          description?: string | null
          id?: string
          lost?: boolean
          lost_at?: string | null
          name?: string
          notify_anyway?: boolean
          qrcode_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_qrcode_id_fkey"
            columns: ["qrcode_id"]
            referencedRelation: "qrcode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      message: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notification: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["NotificationType"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["NotificationType"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      qrcode: {
        Row: {
          barcode_data: string | null
          created_at: string
          id: string
          item_id: string | null
          name: string
          user_id: string
        }
        Insert: {
          barcode_data?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          name?: string
          user_id: string
        }
        Update: {
          barcode_data?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qrcode_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qrcode_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      scan: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          qrcode_id: string | null
          type: Database["public"]["Enums"]["ScanType"][] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          qrcode_id?: string | null
          type?: Database["public"]["Enums"]["ScanType"][] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          qrcode_id?: string | null
          type?: Database["public"]["Enums"]["ScanType"][] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_qrcode_id_fkey"
            columns: ["qrcode_id"]
            referencedRelation: "qrcode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      test_tenant: {
        Row: {
          details: string | null
          id: number
        }
        Insert: {
          details?: string | null
          id?: number
        }
        Update: {
          details?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_conversations_with_last_message: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          item_id: string
          owner_id: string
          finder_id: string
          last_message: Json
        }[]
      }
    }
    Enums: {
      NotificationType: "email" | "system"
      ScanType:
        | "activation"
        | "creation"
        | "owner_scan"
        | "registered_user_scan"
        | "non_registered_user_scan"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

