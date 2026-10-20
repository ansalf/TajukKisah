-- ==============================================================================
-- TajukKisah: Orders Migration for Wedding Invitation Ordering Service
-- Table: orders (Stores customer order submissions with strict privacy)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    template_id TEXT NOT NULL,
    template_title TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    wedding_date TEXT NOT NULL,
    ceremony_venue TEXT,
    reception_venue TEXT,
    song_title TEXT,
    song_artist TEXT,
    song_reference_url TEXT,
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'in_progress', 'completed', 'cancelled'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for querying orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 1. Public / Anonymous insert: Anyone can submit an order request
DROP POLICY IF EXISTS "Public can submit orders" ON public.orders;
CREATE POLICY "Public can submit orders"
    ON public.orders FOR INSERT
    TO public
    WITH CHECK (
        length(customer_name) >= 2 AND
        length(customer_email) >= 5 AND
        length(customer_whatsapp) >= 6 AND
        length(groom_name) >= 1 AND
        length(bride_name) >= 1
    );

-- 2. Strict Privacy: Anonymous visitors CANNOT read any customer orders
DROP POLICY IF EXISTS "Deny public select on orders" ON public.orders;
-- By default with RLS enabled and no SELECT policy for public/anon, SELECT is prohibited for anonymous users.

-- 3. Authenticated staff / owner can view and manage orders
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
CREATE POLICY "Authenticated users can view orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
CREATE POLICY "Authenticated users can update orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
