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
      maplerad_events: {
        Row: {
          created_at: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          event_type: string
          id?: string
          payload?: Json
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
        }
        Relationships: []
      }
      monthly_stats: {
        Row: {
          created_at: string
          id: string
          total_incoming: number
          total_outgoing: number
          transaction_count: number
          updated_at: string
          wallet_id: string
          year_month: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_incoming?: number
          total_outgoing?: number
          transaction_count?: number
          updated_at?: string
          wallet_id: string
          year_month: string
        }
        Update: {
          created_at?: string
          id?: string
          total_incoming?: number
          total_outgoing?: number
          transaction_count?: number
          updated_at?: string
          wallet_id?: string
          year_month?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_stats_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string
          avatar_url: string | null
          company_name: string | null
          created_at: string
          display_name: string | null
          email: string
          firebase_uid: string
          first_name: string | null
          id: string
          kyc_level: number
          last_name: string | null
          maplerad_customer_id: string | null
          maplerad_tier: number | null
          phone: string | null
          siret: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          firebase_uid: string
          first_name?: string | null
          id?: string
          kyc_level?: number
          last_name?: string | null
          maplerad_customer_id?: string | null
          maplerad_tier?: number | null
          phone?: string | null
          siret?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          firebase_uid?: string
          first_name?: string | null
          id?: string
          kyc_level?: number
          last_name?: string | null
          maplerad_customer_id?: string | null
          maplerad_tier?: number | null
          phone?: string | null
          siret?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sms_campaigns: {
        Row: {
          created_at: string
          delivered_count: number
          failed_count: number
          firebase_uid: string
          id: string
          message_content: string
          name: string
          scheduled_at: string | null
          sender_name: string
          sent_count: number
          status: string
          total_recipients: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivered_count?: number
          failed_count?: number
          firebase_uid: string
          id?: string
          message_content: string
          name: string
          scheduled_at?: string | null
          sender_name?: string
          sent_count?: number
          status?: string
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivered_count?: number
          failed_count?: number
          firebase_uid?: string
          id?: string
          message_content?: string
          name?: string
          scheduled_at?: string | null
          sender_name?: string
          sent_count?: number
          status?: string
          total_recipients?: number
          updated_at?: string
        }
        Relationships: []
      }
      sms_contacts: {
        Row: {
          created_at: string
          firebase_uid: string
          group_name: string | null
          id: string
          name: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          firebase_uid: string
          group_name?: string | null
          id?: string
          name?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          firebase_uid?: string
          group_name?: string | null
          id?: string
          name?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      sms_credits: {
        Row: {
          created_at: string
          firebase_uid: string
          id: string
          total_credits: number
          updated_at: string
          used_credits: number
        }
        Insert: {
          created_at?: string
          firebase_uid: string
          id?: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
        }
        Update: {
          created_at?: string
          firebase_uid?: string
          id?: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
        }
        Relationships: []
      }
      sms_incoming: {
        Row: {
          created_at: string
          id: string
          message: string
          message_id: string | null
          processed: boolean
          received_at: string
          receiver_phone: string | null
          sender_phone: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_id?: string | null
          processed?: boolean
          received_at?: string
          receiver_phone?: string | null
          sender_phone: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_id?: string | null
          processed?: boolean
          received_at?: string
          receiver_phone?: string | null
          sender_phone?: string
          type?: string
        }
        Relationships: []
      }
      sms_messages: {
        Row: {
          campaign_id: string | null
          created_at: string
          delivered_at: string | null
          error_code: string | null
          error_message: string | null
          external_id: string | null
          firebase_uid: string
          id: string
          message_content: string
          recipient_phone: string
          sender_name: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          external_id?: string | null
          firebase_uid: string
          id?: string
          message_content: string
          recipient_phone: string
          sender_name?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          external_id?: string | null
          firebase_uid?: string
          id?: string
          message_content?: string
          recipient_phone?: string
          sender_name?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sms_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_oauth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          provider: string
          updated_at: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          provider: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      sms_optouts: {
        Row: {
          created_at: string
          id: string
          opted_out: boolean
          opted_out_at: string
          phone: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          opted_out?: boolean
          opted_out_at?: string
          phone: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          opted_out?: boolean
          opted_out_at?: string
          phone?: string
          reason?: string | null
        }
        Relationships: []
      }
      sms_pack_purchases: {
        Row: {
          created_at: string
          currency: string
          firebase_uid: string
          id: string
          pack_name: string
          payment_reference: string | null
          price_per_sms: number
          sms_count: number
          status: string
          total_price: number
        }
        Insert: {
          created_at?: string
          currency?: string
          firebase_uid: string
          id?: string
          pack_name: string
          payment_reference?: string | null
          price_per_sms?: number
          sms_count: number
          status?: string
          total_price: number
        }
        Update: {
          created_at?: string
          currency?: string
          firebase_uid?: string
          id?: string
          pack_name?: string
          payment_reference?: string | null
          price_per_sms?: number
          sms_count?: number
          status?: string
          total_price?: number
        }
        Relationships: []
      }
      sms_status_logs: {
        Row: {
          id: string
          message_id: string
          raw_payload: Json | null
          received_at: string
          status: string
        }
        Insert: {
          id?: string
          message_id: string
          raw_payload?: Json | null
          received_at?: string
          status: string
        }
        Update: {
          id?: string
          message_id?: string
          raw_payload?: Json | null
          received_at?: string
          status?: string
        }
        Relationships: []
      }
      store_orders: {
        Row: {
          buyer_email: string | null
          buyer_name: string | null
          buyer_phone: string | null
          created_at: string
          currency: string
          id: string
          payment_reference: string | null
          payment_status: string
          product_id: string
          quantity: number
          store_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_reference?: string | null
          payment_status?: string
          product_id: string
          quantity?: number
          store_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_reference?: string | null
          payment_status?: string
          product_id?: string
          quantity?: number
          store_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          price: number
          redirect_url: string | null
          stock: number | null
          store_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          redirect_url?: string | null
          stock?: number | null
          store_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          redirect_url?: string | null
          stock?: number | null
          store_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          domain: string | null
          firebase_uid: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          firebase_uid: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          domain?: string | null
          firebase_uid?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          completed_at: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          reference: string | null
          status: string
          title: string
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          category: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference?: string | null
          status?: string
          title: string
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          category?: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference?: string | null
          status?: string
          title?: string
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_passcodes: {
        Row: {
          created_at: string
          firebase_uid: string
          id: string
          passcode_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          firebase_uid: string
          id?: string
          passcode_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          firebase_uid?: string
          id?: string
          passcode_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      virtual_cards: {
        Row: {
          balance: number
          card_name: string
          card_number_last4: string
          card_status: string
          card_type: string
          created_at: string
          daily_limit: number
          expires_at: string
          id: string
          monthly_limit: number
          wallet_id: string
        }
        Insert: {
          balance?: number
          card_name?: string
          card_number_last4: string
          card_status?: string
          card_type?: string
          created_at?: string
          daily_limit?: number
          expires_at: string
          id?: string
          monthly_limit?: number
          wallet_id: string
        }
        Update: {
          balance?: number
          card_name?: string
          card_number_last4?: string
          card_status?: string
          card_type?: string
          created_at?: string
          daily_limit?: number
          expires_at?: string
          id?: string
          monthly_limit?: number
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_cards_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          is_active: boolean
          max_balance: number
          profile_id: string
          updated_at: string
          wallet_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          max_balance?: number
          profile_id: string
          updated_at?: string
          wallet_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          max_balance?: number
          profile_id?: string
          updated_at?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
