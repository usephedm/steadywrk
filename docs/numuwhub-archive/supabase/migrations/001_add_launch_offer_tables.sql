-- =====================================================
-- LAUNCH OFFER ENFORCEMENT SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.offer_awards (
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

CREATE TABLE IF NOT EXISTS public.launch_offer_quota (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  max_awards INTEGER NOT NULL DEFAULT 2,
  current_awards INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.launch_offer_quota (id, max_awards, current_awards)
VALUES (1, 2, 0)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_offer_awards_booking_id ON public.offer_awards(booking_id);
CREATE INDEX IF NOT EXISTS idx_offer_awards_status ON public.offer_awards(status);
CREATE INDEX IF NOT EXISTS idx_offer_awards_email ON public.offer_awards(email);

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

DROP TRIGGER IF EXISTS trg_enforce_launch_quota ON public.offer_awards;
CREATE TRIGGER trg_enforce_launch_quota
  BEFORE INSERT ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_launch_offer_quota();

DROP TRIGGER IF EXISTS trg_update_quota_on_status_change ON public.offer_awards;
CREATE TRIGGER trg_update_quota_on_status_change
  BEFORE UPDATE OF status ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_launch_offer_quota_on_status_change();

DROP TRIGGER IF EXISTS trg_sync_booking_launch_offer_state ON public.offer_awards;
CREATE TRIGGER trg_sync_booking_launch_offer_state
  AFTER INSERT OR UPDATE OF status ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_booking_launch_offer_state();

DROP TRIGGER IF EXISTS update_offer_awards_updated_at ON public.offer_awards;
CREATE TRIGGER update_offer_awards_updated_at
  BEFORE UPDATE ON public.offer_awards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.offer_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_offer_quota ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own offer awards" ON public.offer_awards;
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

DROP POLICY IF EXISTS "Public can create offer awards for matching booking email" ON public.offer_awards;
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

DROP POLICY IF EXISTS "Everyone can view quota status" ON public.launch_offer_quota;
CREATE POLICY "Everyone can view quota status"
  ON public.launch_offer_quota FOR SELECT
  USING (true);
