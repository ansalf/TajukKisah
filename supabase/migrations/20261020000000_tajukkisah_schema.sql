-- ==============================================================================
-- TajukKisah: Complete PostgreSQL Schema for Supabase
-- Phase 5: Authentication, Profiles, Weddings, Events, Photos, Guests, RSVPs, Wishes
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE wedding_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('attending', 'regret', 'tentative');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
-- Extends auth.users with user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. WEDDINGS TABLE
-- Represents a wedding invitation campaign/website
CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    template_id TEXT NOT NULL DEFAULT 'editorial-romance',
    status wedding_status NOT NULL DEFAULT 'draft',
    monogram TEXT NOT NULL DEFAULT 'A & B',
    quote TEXT,
    quote_source TEXT,
    story_narrative TEXT,
    groom_full_name TEXT NOT NULL,
    groom_short_name TEXT NOT NULL,
    groom_father TEXT,
    groom_mother TEXT,
    groom_photo_url TEXT,
    bride_full_name TEXT NOT NULL,
    bride_short_name TEXT NOT NULL,
    bride_father TEXT,
    bride_mother TEXT,
    bride_photo_url TEXT,
    hero_photo_url TEXT,
    wedding_date DATE NOT NULL,
    wedding_date_formatted TEXT NOT NULL,
    audio_url TEXT,
    digital_gifts_enabled BOOLEAN NOT NULL DEFAULT true,
    digital_gifts_description TEXT,
    bank_accounts JSONB NOT NULL DEFAULT '[]'::jsonb,
    physical_gift_address JSONB,
    features JSONB NOT NULL DEFAULT '{
        "showRsvp": true,
        "showGuestWishes": true,
        "showAudio": true,
        "showStory": true,
        "showGallery": true,
        "showGift": true,
        "showCountdown": true
    }'::jsonb,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT slug_format CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE INDEX IF NOT EXISTS idx_weddings_user_id ON public.weddings(user_id);
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON public.weddings(slug);

-- 5. WEDDING EVENTS TABLE
-- Specific events belonging to a wedding (e.g. Akad Nikah, Holy Matrimony, Reception)
CREATE TABLE IF NOT EXISTS public.wedding_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    time_formatted TEXT NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    google_maps_embed_url TEXT,
    google_maps_direction_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wedding_events_wedding_id ON public.wedding_events(wedding_id);

-- 6. WEDDING PHOTOS TABLE
-- Photo gallery associated with a wedding
CREATE TABLE IF NOT EXISTS public.wedding_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    location TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wedding_photos_wedding_id ON public.wedding_photos(wedding_id);

-- 7. GUESTS TABLE
-- Managed guest list for personalized links and invitation distribution
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    group_tag TEXT,
    pax_allowed INTEGER NOT NULL DEFAULT 2,
    personalized_slug TEXT,
    has_opened BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_guests_wedding_id ON public.guests(wedding_id);

-- 8. RSVPS TABLE
-- Guest RSVP confirmations
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    attendance attendance_status NOT NULL DEFAULT 'attending',
    pax_confirmed INTEGER NOT NULL DEFAULT 1,
    dietary_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rsvps_wedding_id ON public.rsvps(wedding_id);

-- 9. WISHES TABLE
-- Guestbook prayers, congratulations, and wishes
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT,
    message TEXT NOT NULL,
    attendance attendance_status NOT NULL DEFAULT 'attending',
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wishes_wedding_id ON public.wishes(wedding_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Weddings Policies
-- Owners can do full CRUD on their own weddings
CREATE POLICY "Owners can view their own weddings"
    ON public.weddings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published weddings"
    ON public.weddings FOR SELECT
    USING (status = 'published');

CREATE POLICY "Owners can insert their own weddings"
    ON public.weddings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their own weddings"
    ON public.weddings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their own weddings"
    ON public.weddings FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Wedding Events Policies
CREATE POLICY "Public can view events for published weddings"
    ON public.wedding_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = wedding_events.wedding_id
            AND (weddings.status = 'published' OR weddings.user_id = auth.uid())
        )
    );

CREATE POLICY "Owners can manage their wedding events"
    ON public.wedding_events FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = wedding_events.wedding_id
            AND weddings.user_id = auth.uid()
        )
    );

-- 4. Wedding Photos Policies
CREATE POLICY "Public can view photos for published weddings"
    ON public.wedding_photos FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = wedding_photos.wedding_id
            AND (weddings.status = 'published' OR weddings.user_id = auth.uid())
        )
    );

CREATE POLICY "Owners can manage their wedding photos"
    ON public.wedding_photos FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = wedding_photos.wedding_id
            AND weddings.user_id = auth.uid()
        )
    );

-- 5. Guests Policies (Strictly private to wedding owner)
CREATE POLICY "Owners can view and manage their guest list"
    ON public.guests FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = guests.wedding_id
            AND weddings.user_id = auth.uid()
        )
    );

-- 6. RSVPs Policies
-- Public can submit an RSVP to a published wedding
CREATE POLICY "Public can submit RSVP to published weddings"
    ON public.rsvps FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = rsvps.wedding_id
            AND weddings.status = 'published'
        )
    );

-- Only wedding owners can inspect full RSVP list (protecting phone and email privacy)
CREATE POLICY "Owners can view RSVPs for their weddings"
    ON public.rsvps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = rsvps.wedding_id
            AND weddings.user_id = auth.uid()
        )
    );

-- 7. Wishes Policies
-- Public can read approved wishes on published weddings
CREATE POLICY "Public can view approved wishes for published weddings"
    ON public.wishes FOR SELECT
    USING (
        is_approved = true
        AND EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = wishes.wedding_id
            AND (weddings.status = 'published' OR weddings.user_id = auth.uid())
        )
    );

-- Public can post a wish to a published wedding
CREATE POLICY "Public can submit wishes to published weddings"
    ON public.wishes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = wishes.wedding_id
            AND weddings.status = 'published'
        )
    );

-- Owners can moderate or delete wishes
CREATE POLICY "Owners can manage wishes for their weddings"
    ON public.wishes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weddings
            WHERE weddings.id = wishes.wedding_id
            AND weddings.user_id = auth.uid()
        )
    );
