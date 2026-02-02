-- Analytics settings table for pixel integrations
CREATE TABLE public.analytics_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view analytics settings"
ON public.analytics_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage analytics settings"
ON public.analytics_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Updated at trigger
CREATE TRIGGER update_analytics_settings_updated_at
BEFORE UPDATE ON public.analytics_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO public.analytics_settings (key, value, enabled) VALUES
  ('ga4_measurement_id', NULL, false),
  ('gtm_container_id', NULL, false),
  ('meta_pixel_id', NULL, false),
  ('tiktok_pixel_id', NULL, false),
  ('linkedin_partner_id', NULL, false),
  ('clarity_project_id', NULL, false);

-- Analytics events table for built-in tracking
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_id UUID,
  page_url TEXT,
  page_title TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  device_type TEXT,
  language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies - only admins and marketers can view
CREATE POLICY "Analytics roles can view events"
ON public.analytics_events FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'marketer'::app_role) OR 
  has_role(auth.uid(), 'sales_manager'::app_role)
);

-- Anyone can insert events (for tracking)
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events FOR INSERT
WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_analytics_events_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_session ON public.analytics_events(session_id);

-- Heatmap exclusions table
CREATE TABLE public.heatmap_exclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_pattern TEXT NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.heatmap_exclusions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view heatmap exclusions"
ON public.heatmap_exclusions FOR SELECT
USING (true);

CREATE POLICY "Admins can manage heatmap exclusions"
ON public.heatmap_exclusions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default exclusions (admin and client portals)
INSERT INTO public.heatmap_exclusions (route_pattern, reason) VALUES
  ('/admin/*', 'Admin Dashboard - privacy'),
  ('/client/*', 'Client Portal - privacy'),
  ('/agent/*', 'Agent Portal - privacy'),
  ('/auth', 'Authentication page - sensitive');