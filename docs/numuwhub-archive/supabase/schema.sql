-- =====================================================
-- NUMUWHUB - PUBLIC DEMO BOOKING FOUNDATION
-- =====================================================
-- Run this in the Supabase SQL editor on a fresh project.
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'JOD',
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'ar')),
  package_type TEXT NOT NULL CHECK (package_type IN ('demo', 'starter', 'growth', 'scale')),
  package_label TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Amman',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  source TEXT NOT NULL DEFAULT 'website',
  notes TEXT,
  admin_notes TEXT,
  request_launch_offer BOOLEAN NOT NULL DEFAULT FALSE,
  launch_offer_awarded BOOLEAN NOT NULL DEFAULT FALSE,
  launch_offer_awarded_at TIMESTAMPTZ,
  notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending', 'queued', 'sent', 'not_configured', 'failed')),
  notification_error TEXT,
  calendar_status TEXT NOT NULL DEFAULT 'pending' CHECK (calendar_status IN ('pending', 'scheduled', 'manual_required', 'not_configured', 'failed')),
  calendar_error TEXT,
  calendar_event_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.offer_awards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMPTZ,
  package_type TEXT NOT NULL,
  discount_value DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.launch_offer_quota (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  max_awards INTEGER NOT NULL DEFAULT 2,
  current_awards INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.launch_offer_quota (id, max_awards, current_awards)
VALUES (1, 2, 0)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_offer_quota ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt()->>'email' = email);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id OR auth.jwt()->>'email' = email);

CREATE POLICY "Anyone can view availability"
  ON public.availability FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Users can view their own offer awards"
  ON public.offer_awards FOR SELECT
  USING (
    auth.jwt()->>'email' = email
    OR EXISTS (
      SELECT 1
      FROM public.bookings
      WHERE bookings.id = offer_awards.booking_id
        AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can create offer awards for matching booking email"
  ON public.offer_awards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.bookings
      WHERE bookings.id = offer_awards.booking_id
        AND bookings.email = offer_awards.email
        AND bookings.request_launch_offer = TRUE
    )
  );

CREATE POLICY "Everyone can view quota status"
  ON public.launch_offer_quota FOR SELECT
  USING (true);

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_date ON public.bookings(date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_launch_offer_awarded ON public.bookings(launch_offer_awarded);
CREATE INDEX idx_services_active ON public.services(is_active);
CREATE INDEX idx_availability_day ON public.availability(day_of_week);
CREATE INDEX idx_offer_awards_booking_id ON public.offer_awards(booking_id);
CREATE INDEX idx_offer_awards_status ON public.offer_awards(status);
CREATE INDEX idx_offer_awards_email ON public.offer_awards(email);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.enforce_launch_offer_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_current_awards INTEGER;
  v_max_awards INTEGER;
BEGIN
  SELECT current_awards, max_awards
    INTO v_current_awards, v_max_awards
    FROM public.launch_offer_quota
   WHERE id = 1
   FOR UPDATE;

  IF v_current_awards >= v_max_awards THEN
    RAISE EXCEPTION 'Launch offer quota exceeded. Maximum % awards already approved.', v_max_awards
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_launch_offer_quota_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND COALESCE(OLD.status, '') != 'approved' THEN
    UPDATE public.launch_offer_quota
       SET current_awards = current_awards + 1,
           last_updated = NOW()
     WHERE id = 1;

    NEW.approved_at = COALESCE(NEW.approved_at, NOW());
  END IF;

  IF OLD.status = 'approved' AND NEW.status != 'approved' THEN
    UPDATE public.launch_offer_quota
       SET current_awards = GREATEST(current_awards - 1, 0),
           last_updated = NOW()
     WHERE id = 1;

    NEW.approved_at = NULL;
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.sync_booking_launch_offer_state()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.bookings
     SET launch_offer_awarded = (NEW.status = 'approved'),
         launch_offer_awarded_at = CASE
           WHEN NEW.status = 'approved' THEN COALESCE(NEW.approved_at, NOW())
           ELSE NULL
         END,
         updated_at = NOW()
   WHERE id = NEW.booking_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.approve_offer_award(p_award_id UUID)
RETURNS JSON AS $$
DECLARE
  v_award RECORD;
  v_current_awards INTEGER;
  v_max_awards INTEGER;
BEGIN
  SELECT *
    INTO v_award
    FROM public.offer_awards
   WHERE id = p_award_id
   FOR UPDATE;

  IF v_award IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Award not found');
  END IF;

  IF v_award.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Award is not pending approval');
  END IF;

  SELECT current_awards, max_awards
    INTO v_current_awards, v_max_awards
    FROM public.launch_offer_quota
   WHERE id = 1
   FOR UPDATE;

  IF v_current_awards >= v_max_awards THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Launch offer quota exceeded',
      'current_awards', v_current_awards,
      'max_awards', v_max_awards
    );
  END IF;

  UPDATE public.offer_awards
     SET status = 'approved'
   WHERE id = p_award_id;

  SELECT current_awards, max_awards
    INTO v_current_awards, v_max_awards
    FROM public.launch_offer_quota
   WHERE id = 1;

  RETURN json_build_object(
    'success', true,
    'award_id', p_award_id,
    'current_awards', v_current_awards,
    'max_awards', v_max_awards,
    'message', 'Launch offer approved successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.reject_offer_award(p_award_id UUID)
RETURNS JSON AS $$
DECLARE
  v_award RECORD;
BEGIN
  SELECT *
    INTO v_award
    FROM public.offer_awards
   WHERE id = p_award_id
   FOR UPDATE;

  IF v_award IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Award not found');
  END IF;

  IF v_award.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Award is not pending approval');
  END IF;

  UPDATE public.offer_awards
     SET status = 'rejected'
   WHERE id = p_award_id;

  RETURN json_build_object(
    'success', true,
    'award_id', p_award_id,
    'message', 'Launch offer rejected'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_launch_offer_status()
RETURNS JSON AS $$
DECLARE
  v_quota RECORD;
BEGIN
  SELECT *
    INTO v_quota
    FROM public.launch_offer_quota
   WHERE id = 1;

  RETURN json_build_object(
    'available', v_quota.current_awards < v_quota.max_awards,
    'current_awards', v_quota.current_awards,
    'max_awards', v_quota.max_awards,
    'remaining', v_quota.max_awards - v_quota.current_awards,
    'last_updated', v_quota.last_updated
  );
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offer_awards_updated_at
  BEFORE UPDATE ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER trg_enforce_launch_quota
  BEFORE INSERT ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_launch_offer_quota();

CREATE TRIGGER trg_update_quota_on_status_change
  BEFORE UPDATE OF status ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_launch_offer_quota_on_status_change();

CREATE TRIGGER trg_sync_booking_launch_offer_state
  AFTER INSERT OR UPDATE OF status ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_booking_launch_offer_state();

/*
INSERT INTO public.availability (day_of_week, start_time, end_time) VALUES
  (0, '09:00', '17:00'),
  (1, '09:00', '17:00'),
  (2, '09:00', '17:00'),
  (3, '09:00', '17:00'),
  (4, '09:00', '17:00');
*/
