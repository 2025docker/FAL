export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          currency: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          auto_save_rate: number;
          dca_value: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          auto_save_rate?: number;
          dca_value?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          auto_save_rate?: number;
          dca_value?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          type: string;
          icon: string | null;
          user_id: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          icon?: string | null;
          user_id?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          icon?: string | null;
          user_id?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          category_id: string | null;
          category_name: string;
          date: string;
          note: string | null;
          currency: string;
          locked_amount: number;
          auto_save_rate: number | null;
          reference_id: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          amount: number;
          category_id?: string | null;
          category_name: string;
          date: string;
          note?: string | null;
          currency?: string;
          locked_amount?: number;
          auto_save_rate?: number | null;
          reference_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          amount?: number;
          category_id?: string | null;
          category_name?: string;
          date?: string;
          note?: string | null;
          currency?: string;
          locked_amount?: number;
          auto_save_rate?: number | null;
          reference_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      dca_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          date: string;
          note: string | null;
          currency: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          amount: number;
          date: string;
          note?: string | null;
          currency?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          amount?: number;
          date?: string;
          note?: string | null;
          currency?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
    };
    Views: {
      transaction_summary: {
        Row: {
          user_id: string;
          income_count: number;
          total_income: number;
          expense_count: number;
          total_expense: number;
          asset_buy_count: number;
          total_asset_buys: number;
          asset_sell_count: number;
          total_asset_sells: number;
          unlock_count: number;
          total_unlocked: number;
        };
      };
    };
    Functions: {
      get_transactions_paginated: {
        Args: {
          p_user_id: string;
          p_limit?: number;
          p_offset?: number;
          p_type?: string;
          p_category?: string;
          p_date_from?: string;
          p_date_to?: string;
          p_min_amount?: number;
          p_max_amount?: number;
          p_keyword?: string;
          p_sort_by?: string;
          p_sort_order?: string;
        };
        Returns: {
          id: string;
          user_id: string;
          type: string;
          amount: number;
          category_name: string;
          date: string;
          note: string | null;
          currency: string;
          locked_amount: number;
          reference_id: string | null;
          metadata: Json | null;
          created_at: string;
          total_count: number;
        }[];
      };
    };
  };
}
