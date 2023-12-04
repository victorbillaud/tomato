export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
      [_ in never]: never
    }
    Enums: {
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
  test: {
    Tables: {
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
      [_ in never]: never
    }
    Enums: {
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
}

