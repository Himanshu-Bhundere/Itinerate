-- Supabase Schema for Itinerate

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY
);
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS display_name TEXT,
    ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS home_city TEXT,
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS cover_url TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS saves_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rating NUMERIC,
    ADD COLUMN IF NOT EXISTS travel_style TEXT,
    ADD COLUMN IF NOT EXISTS top_destinations TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY
);
ALTER TABLE public.plans 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS location TEXT,
    ADD COLUMN IF NOT EXISTS duration_days INTEGER,
    ADD COLUMN IF NOT EXISTS duration_nights INTEGER,
    ADD COLUMN IF NOT EXISTS budget_level TEXT,
    ADD COLUMN IF NOT EXISTS category TEXT,
    ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Saved Plans Table
CREATE TABLE IF NOT EXISTS public.saved_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY
);
ALTER TABLE public.saved_plans 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS collection_name TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'saved_plans_user_id_plan_id_key'
    ) THEN
        ALTER TABLE public.saved_plans ADD CONSTRAINT saved_plans_user_id_plan_id_key UNIQUE(user_id, plan_id);
    END IF;
END $$;

-- 4. Itinerary Days Table
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY
);
ALTER TABLE public.itinerary_days
    ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS day_number INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS title TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS activities JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS stay_name TEXT,
    ADD COLUMN IF NOT EXISTS stay_type TEXT,
    ADD COLUMN IF NOT EXISTS stay_notes TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent "policy already exists" errors when re-running
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

DROP POLICY IF EXISTS "Plans are viewable by everyone." ON public.plans;
DROP POLICY IF EXISTS "Users can insert their own plans." ON public.plans;
DROP POLICY IF EXISTS "Users can update own plans." ON public.plans;
DROP POLICY IF EXISTS "Users can delete own plans." ON public.plans;

DROP POLICY IF EXISTS "Users can view own saved plans." ON public.saved_plans;
DROP POLICY IF EXISTS "Users can insert own saved plans." ON public.saved_plans;
DROP POLICY IF EXISTS "Users can delete own saved plans." ON public.saved_plans;

DROP POLICY IF EXISTS "Itinerary days are viewable by plan viewers." ON public.itinerary_days;
DROP POLICY IF EXISTS "Users can insert itinerary days for own plans." ON public.itinerary_days;
DROP POLICY IF EXISTS "Users can update itinerary days for own plans." ON public.itinerary_days;
DROP POLICY IF EXISTS "Users can delete itinerary days for own plans." ON public.itinerary_days;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Plans Policies
CREATE POLICY "Plans are viewable by everyone." 
ON public.plans FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans." 
ON public.plans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans." 
ON public.plans FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans." 
ON public.plans FOR DELETE USING (auth.uid() = user_id);

-- Saved Plans Policies
CREATE POLICY "Users can view own saved plans." 
ON public.saved_plans FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved plans." 
ON public.saved_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved plans." 
ON public.saved_plans FOR DELETE USING (auth.uid() = user_id);

-- Itinerary Days Policies
CREATE POLICY "Itinerary days are viewable by plan viewers."
ON public.itinerary_days FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND (plans.visibility = 'public' OR plans.user_id = auth.uid()))
);

CREATE POLICY "Users can insert itinerary days for own plans."
ON public.itinerary_days FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND plans.user_id = auth.uid())
);

CREATE POLICY "Users can update itinerary days for own plans."
ON public.itinerary_days FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND plans.user_id = auth.uid())
);

CREATE POLICY "Users can delete itinerary days for own plans."
ON public.itinerary_days FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND plans.user_id = auth.uid())
);
