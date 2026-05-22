/**
 * Minimal Database type for Supabase clients. Tracks the MVP tables only.
 * Regenerate later via `supabase gen types typescript` when the schema
 * stabilizes — for now this is hand-maintained to unblock typed inserts.
 */

type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

type Table<TRow, TInsert, TUpdate> = {
  Row: TRow;
  Insert: TInsert;
  Update: TUpdate;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          full_name: string | null;
          role: "visitor" | "staff" | "admin";
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          full_name?: string | null;
          role?: "visitor" | "staff" | "admin";
        },
        Partial<{
          full_name: string | null;
          role: "visitor" | "staff" | "admin";
        }>
      >;
      events: Table<
        {
          id: string;
          slug: string;
          title: string;
          summary: string;
          body_md: string | null;
          date: string;
          start_time: string | null;
          end_time: string | null;
          location: string;
          flyer_path: string | null;
          capacity: number | null;
          status: "draft" | "published" | "cancelled";
          kind: "free_rsvp" | "ticketed" | "external";
          external_url: string | null;
          highlights: Json;
          partners: Json;
          tagline: string | null;
          price_cents: number | null;
          themes: Json;
          included_perks: Json;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          slug: string;
          title: string;
          summary: string;
          date: string;
          location: string;
          body_md?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          flyer_path?: string | null;
          capacity?: number | null;
          status?: "draft" | "published" | "cancelled";
          kind?: "free_rsvp" | "ticketed" | "external";
          external_url?: string | null;
          highlights?: Json;
          partners?: Json;
          tagline?: string | null;
          price_cents?: number | null;
          themes?: Json;
          included_perks?: Json;
          is_featured?: boolean;
        },
        Partial<{
          slug: string;
          title: string;
          summary: string;
          body_md: string | null;
          date: string;
          start_time: string | null;
          end_time: string | null;
          location: string;
          flyer_path: string | null;
          capacity: number | null;
          status: "draft" | "published" | "cancelled";
          kind: "free_rsvp" | "ticketed" | "external";
          external_url: string | null;
          highlights: Json;
          partners: Json;
          tagline: string | null;
          price_cents: number | null;
          themes: Json;
          included_perks: Json;
          is_featured: boolean;
        }>
      >;
      bookings: Table<
        {
          id: string;
          event_id: string;
          user_id: string | null;
          attendee_name: string;
          attendee_email: string;
          party_size: number;
          status: "confirmed" | "cancelled";
          notes: string | null;
          created_at: string;
        },
        {
          event_id: string;
          attendee_name: string;
          attendee_email: string;
          user_id?: string | null;
          party_size?: number;
          status?: "confirmed" | "cancelled";
          notes?: string | null;
        },
        Partial<{
          event_id: string;
          user_id: string | null;
          attendee_name: string;
          attendee_email: string;
          party_size: number;
          status: "confirmed" | "cancelled";
          notes: string | null;
        }>
      >;
      vendor_applications: Table<
        {
          id: string;
          user_id: string | null;
          business_name: string;
          contact_name: string | null;
          contact_email: string;
          phone: string | null;
          category: string | null;
          website: string | null;
          instagram: string | null;
          blurb: string | null;
          booth_needs: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        },
        {
          business_name: string;
          contact_email: string;
          user_id?: string | null;
          contact_name?: string | null;
          phone?: string | null;
          category?: string | null;
          website?: string | null;
          instagram?: string | null;
          blurb?: string | null;
          booth_needs?: string | null;
          status?: "pending" | "approved" | "rejected";
        },
        Partial<{
          user_id: string | null;
          business_name: string;
          contact_name: string | null;
          contact_email: string;
          phone: string | null;
          category: string | null;
          website: string | null;
          instagram: string | null;
          blurb: string | null;
          booth_needs: string | null;
          status: "pending" | "approved" | "rejected";
        }>
      >;
      subscribers: Table<
        {
          id: string;
          email: string;
          status: "pending" | "active" | "unsubscribed" | "bounced";
          source: string | null;
          confirmation_token: string;
          confirmed_at: string | null;
          created_at: string;
        },
        {
          email: string;
          status?: "pending" | "active" | "unsubscribed" | "bounced";
          source?: string | null;
        },
        Partial<{
          email: string;
          status: "pending" | "active" | "unsubscribed" | "bounced";
          source: string | null;
          confirmed_at: string | null;
        }>
      >;
      gallery_photos: Table<
        {
          id: string;
          path: string;
          alt: string;
          caption: string | null;
          event_id: string | null;
          taken_at: string | null;
          sort_order: number;
          created_at: string;
        },
        {
          path: string;
          alt: string;
          caption?: string | null;
          event_id?: string | null;
          taken_at?: string | null;
          sort_order?: number;
        },
        Partial<{
          path: string;
          alt: string;
          caption: string | null;
          event_id: string | null;
          taken_at: string | null;
          sort_order: number;
        }>
      >;
      contact_messages: Table<
        {
          id: string;
          name: string;
          email: string;
          body: string;
          created_at: string;
        },
        {
          name: string;
          email: string;
          body: string;
        },
        Partial<{
          name: string;
          email: string;
          body: string;
        }>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
