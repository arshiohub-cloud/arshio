export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_bookings: {
        Row: {
          company: string | null
          confirmed: boolean
          created_at: string
          email: string
          id: string
          lead_id: string | null
          name: string
          notes: string | null
          phone: string | null
          requested_slot: string
          scheduled_at: string | null
          source: string
          timezone: string | null
        }
        Insert: {
          company?: string | null
          confirmed?: boolean
          created_at?: string
          email: string
          id?: string
          lead_id?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          requested_slot: string
          scheduled_at?: string | null
          source?: string
          timezone?: string | null
        }
        Update: {
          company?: string | null
          confirmed?: boolean
          created_at?: string
          email?: string
          id?: string
          lead_id?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          requested_slot?: string
          scheduled_at?: string | null
          source?: string
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_files: {
        Row: {
          created_at: string
          engagement_id: string
          filename: string
          id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          engagement_id: string
          filename: string
          id?: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          engagement_id?: string
          filename?: string
          id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_files_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          engagement_id: string
          id: string
          read_at: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          engagement_id: string
          id?: string
          read_at?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          engagement_id?: string
          id?: string
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_messages_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_milestones: {
        Row: {
          created_at: string
          done: boolean
          engagement_id: string
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          done?: boolean
          engagement_id: string
          id?: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          done?: boolean
          engagement_id?: string
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "engagement_milestones_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_updates: {
        Row: {
          author_id: string
          body: string
          created_at: string
          engagement_id: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          engagement_id: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          engagement_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_updates_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          created_at: string
          id: string
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["engagement_status"]
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["engagement_status"]
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["engagement_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_submissions: {
        Row: {
          created_at: string
          id: string
          ip: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip: string
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          converted_engagement_id: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          notes: string | null
          phone: string | null
          read_at: string | null
          source_page: string | null
          status: Database["public"]["Enums"]["lead_status"]
          type: Database["public"]["Enums"]["lead_type"]
        }
        Insert: {
          company?: string | null
          converted_engagement_id?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          read_at?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          type?: Database["public"]["Enums"]["lead_type"]
        }
        Update: {
          company?: string | null
          converted_engagement_id?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          read_at?: string | null
          source_page?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          type?: Database["public"]["Enums"]["lead_type"]
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_engagement_id_fkey"
            columns: ["converted_engagement_id"]
            isOneToOne: false
            referencedRelation: "engagements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      engagement_status: "pending" | "active" | "delivered" | "closed"
      lead_status: "new" | "in_progress" | "won" | "lost" | "spam"
      lead_type: "contact" | "pilot" | "audit"
      service_type:
        | "audit"
        | "consulting"
        | "rag"
        | "automation"
        | "agent"
        | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      engagement_status: ["pending", "active", "delivered", "closed"],
      lead_status: ["new", "in_progress", "won", "lost", "spam"],
      lead_type: ["contact", "pilot", "audit"],
      service_type: [
        "audit",
        "consulting",
        "rag",
        "automation",
        "agent",
        "custom",
      ],
    },
  },
} as const
