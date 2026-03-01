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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          file_url: string
          id: string
          is_private: boolean | null
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          is_private?: boolean | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          is_private?: boolean | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          image_url: string
          position: number | null
          status: Database["public"]["Enums"]["content_status"] | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url: string
          position?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string
          position?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          content: string | null
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          section_identifier: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_identifier: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section_identifier?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      organization_settings: {
        Row: {
          accent_color: string | null
          address: string | null
          background_color: string | null
          email: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          name: string
          phone: string | null
          primary_color: string | null
          tagline: string | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          background_color?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          background_color?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_enquiries: {
        Row: {
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_read: boolean | null
          message: string | null
          name: string | null
          phone: string | null
          product_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name?: string | null
          phone?: string | null
          product_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name?: string | null
          phone?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_enquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          position: number | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          position?: number | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          position?: number | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          position: number | null
          price_inr: number | null
          price_usd: number | null
          slug: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          position?: number | null
          price_inr?: number | null
          price_usd?: number | null
          slug: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          position?: number | null
          price_inr?: number | null
          price_usd?: number | null
          slug?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_name: string | null
          completion_date: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          image_url: string | null
          position: number | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_name?: string | null
          completion_date?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          position?: number | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_name?: string | null
          completion_date?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          position?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_image: string | null
          page_path: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_path: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_path?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string
          icon: string | null
          id: string
          image_url: string | null
          position: number | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description: string
          icon?: string | null
          id?: string
          image_url?: string | null
          position?: number | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          position?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          position: number | null
          role: string
          status: Database["public"]["Enums"]["content_status"] | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          position?: number | null
          role: string
          status?: Database["public"]["Enums"]["content_status"] | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          position?: number | null
          role?: string
          status?: Database["public"]["Enums"]["content_status"] | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_name: string
          company: string | null
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          position: number | null
          rating: number | null
          status: Database["public"]["Enums"]["content_status"] | null
        }
        Insert: {
          client_name: string
          company?: string | null
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          position?: number | null
          rating?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
        }
        Update: {
          client_name?: string
          company?: string | null
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          position?: number | null
          rating?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_club_with_admin: {
        Args: {
          admin_user: string
          club_name: string
          club_slug: string
          college: string
        }
        Returns: undefined
      }
      has_role: {
        Args: { _club: string; _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_editor: { Args: never; Returns: boolean }
      is_any_club_admin: { Args: never; Returns: boolean }
      log_admin_action: {
        Args: {
          p_action: string
          p_new_data?: Json
          p_old_data?: Json
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "editor"
      app_role:
        | "admin"
        | "teacher"
        | "student"
        | "super_admin"
        | "platform_admin"
        | "club_admin"
        | "editor"
        | "member"
      content_status: "draft" | "published" | "archived"
      user_role_type: "super_admin" | "admin" | "editor" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      admin_role: ["super_admin", "admin", "editor"],
      app_role: [
        "admin",
        "teacher",
        "student",
        "super_admin",
        "platform_admin",
        "club_admin",
        "editor",
        "member",
      ],
      content_status: ["draft", "published", "archived"],
      user_role_type: ["super_admin", "admin", "editor", "user"],
    },
  },
} as const
