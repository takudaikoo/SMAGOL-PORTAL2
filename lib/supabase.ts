import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Running in localStorage mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Type definitions for database tables
export type Database = {
    public: {
        Tables: {
            partners: {
                Row: {
                    id: string;
                    name: string;
                    category: string;
                    logo_url: string | null;
                    description: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    category: string;
                    logo_url?: string | null;
                    description?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    category?: string;
                    logo_url?: string | null;
                    description?: string | null;
                    created_at?: string;
                };
            };
            coupons: {
                Row: {
                    id: string;
                    partner_id: string;
                    title: string;
                    description: string | null;
                    discount: string;
                    expiry_date: string;
                    usage_type: string;
                    image_url: string | null;
                    terms: string | null;
                    is_used: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    partner_id: string;
                    title: string;
                    description?: string | null;
                    discount: string;
                    expiry_date: string;
                    usage_type: string;
                    image_url?: string | null;
                    terms?: string | null;
                    is_used?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    partner_id?: string;
                    title?: string;
                    description?: string | null;
                    discount?: string;
                    expiry_date?: string;
                    usage_type?: string;
                    image_url?: string | null;
                    terms?: string | null;
                    is_used?: boolean;
                    created_at?: string;
                };
            };
            news: {
                Row: {
                    id: string;
                    title: string;
                    date: string;
                    image_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    date: string;
                    image_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    date?: string;
                    image_url?: string | null;
                    created_at?: string;
                };
            };
            config: {
                Row: {
                    id: string;
                    key: string;
                    value: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    key: string;
                    value: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    key?: string;
                    value?: string;
                    updated_at?: string;
                };
            };
        };
    };
};
