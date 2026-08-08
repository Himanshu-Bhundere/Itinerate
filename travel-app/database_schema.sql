-- Supabase Schema for Itinerate

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    username TEXT UNIQUE,
    home_city TEXT,
    is_verified BOOLEAN DEFAULT false,
    bio TEXT,
    cover_url TEXT,
    avatar_url TEXT,
    saves_count INTEGER DEFAULT 0,
    rating NUMERIC,
    travel_style TEXT,
    top_destinations TEXT,
    travel_level TEXT,
    country TEXT,
    languages TEXT[],
    interests TEXT[],
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    countries_visited INTEGER DEFAULT 0,
    cities_visited INTEGER DEFAULT 0,
    trips_completed INTEGER DEFAULT 0,
    distance_travelled INTEGER DEFAULT 0,
    days_travelled INTEGER DEFAULT 0,
    treks_completed INTEGER DEFAULT 0,
    highest_elevation INTEGER DEFAULT 0,
    longest_trip INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    location TEXT,
    duration_days INTEGER,
    duration_nights INTEGER,
    budget_level TEXT,
    category TEXT,
    visibility TEXT DEFAULT 'public',
    status TEXT DEFAULT 'draft',
    description TEXT,
    image_url TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Saved Plans Table
CREATE TABLE IF NOT EXISTS public.saved_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
    collection_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, plan_id)
);

-- 4. Itinerary Days Table
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL DEFAULT 1,
    title TEXT,
    description TEXT,
    activities JSONB DEFAULT '[]',
    stay_name TEXT,
    stay_type TEXT,
    stay_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Plans Policies
DROP POLICY IF EXISTS "Plans are viewable by everyone." ON public.plans;
CREATE POLICY "Plans are viewable by everyone." 
ON public.plans FOR SELECT USING (visibility = 'public' OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can insert their own plans." ON public.plans;
CREATE POLICY "Users can insert their own plans." 
ON public.plans FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can update own plans." ON public.plans;
CREATE POLICY "Users can update own plans." 
ON public.plans FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can delete own plans." ON public.plans;
CREATE POLICY "Users can delete own plans." 
ON public.plans FOR DELETE USING (auth.uid() = creator_id);

-- Saved Plans Policies
DROP POLICY IF EXISTS "Users can view own saved plans." ON public.saved_plans;
CREATE POLICY "Users can view own saved plans." 
ON public.saved_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved plans." ON public.saved_plans;
CREATE POLICY "Users can insert own saved plans." 
ON public.saved_plans FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved plans." ON public.saved_plans;
CREATE POLICY "Users can delete own saved plans." 
ON public.saved_plans FOR DELETE USING (auth.uid() = user_id);

-- Itinerary Days Policies
DROP POLICY IF EXISTS "Itinerary days are viewable by plan viewers." ON public.itinerary_days;
CREATE POLICY "Itinerary days are viewable by plan viewers."
ON public.itinerary_days FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND (plans.visibility = 'public' OR plans.creator_id = auth.uid()))
);

DROP POLICY IF EXISTS "Users can insert itinerary days for own plans." ON public.itinerary_days;
CREATE POLICY "Users can insert itinerary days for own plans."
ON public.itinerary_days FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND plans.creator_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update itinerary days for own plans." ON public.itinerary_days;
CREATE POLICY "Users can update itinerary days for own plans."
ON public.itinerary_days FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND plans.creator_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can delete itinerary days for own plans." ON public.itinerary_days;
CREATE POLICY "Users can delete itinerary days for own plans."
ON public.itinerary_days FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.plans WHERE plans.id = itinerary_days.plan_id AND plans.creator_id = auth.uid())
);

-- 5. Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Avatars are publicly accessible." ON storage.objects;
CREATE POLICY "Avatars are publicly accessible." 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload an avatar." ON storage.objects;
CREATE POLICY "Users can upload an avatar." 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
CREATE POLICY "Users can update their own avatar." 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;
CREATE POLICY "Users can delete their own avatar." 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');


-- 6. Storage Cleanup Logic (Trigger-based)
-- Automatically delete the old avatar from storage when a user updates their profile avatar
CREATE OR REPLACE FUNCTION public.handle_avatar_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.avatar_url IS NOT NULL AND OLD.avatar_url <> COALESCE(NEW.avatar_url, '') THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'avatars' 
      AND OLD.avatar_url LIKE '%' || name;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_avatar_update ON public.profiles;
CREATE TRIGGER on_avatar_update
  AFTER UPDATE OF avatar_url ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_avatar_update();

-- Automatically delete the avatar from storage when a profile is deleted
CREATE OR REPLACE FUNCTION public.handle_profile_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.avatar_url IS NOT NULL THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'avatars' 
      AND OLD.avatar_url LIKE '%' || name;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_delete ON public.profiles;
CREATE TRIGGER on_profile_delete
  AFTER DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_delete();