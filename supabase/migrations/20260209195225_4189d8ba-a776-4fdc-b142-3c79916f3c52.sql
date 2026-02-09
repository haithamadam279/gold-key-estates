
-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: email on new lead
CREATE OR REPLACE FUNCTION public.email_on_lead_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _payload jsonb;
  _url text;
  _anon_key text;
BEGIN
  _url := 'https://savzdjxsjecgntvjzhvv.supabase.co/functions/v1/send-notification-email';
  _anon_key := current_setting('app.settings.supabase_anon_key', true);
  
  -- Fallback anon key if setting not available
  IF _anon_key IS NULL OR _anon_key = '' THEN
    _anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdnpkanhzamVjZ250dmp6aHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4OTU3NzAsImV4cCI6MjA4NTQ3MTc3MH0.fu6LS8crj1mNBZ2JkRNzTWXcf9HwRn5uqt4qEptLtMU';
  END IF;

  _payload := jsonb_build_object(
    'type', 'lead_created',
    'record', row_to_json(NEW)::jsonb
  );

  PERFORM extensions.http_post(
    _url,
    _payload::text,
    'application/json',
    ARRAY[
      extensions.http_header('Authorization', 'Bearer ' || _anon_key),
      extensions.http_header('Content-Type', 'application/json')
    ],
    5000
  );

  RETURN NEW;
END;
$function$;

-- Trigger function: email on property progress change
CREATE OR REPLACE FUNCTION public.email_on_property_progress_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _payload jsonb;
  _url text;
  _anon_key text;
BEGIN
  -- Only fire if progress_status actually changed and there's an assigned user
  IF NEW.assigned_user_id IS NULL OR 
     OLD.progress_status IS NOT DISTINCT FROM NEW.progress_status THEN
    RETURN NEW;
  END IF;

  _url := 'https://savzdjxsjecgntvjzhvv.supabase.co/functions/v1/send-notification-email';
  _anon_key := current_setting('app.settings.supabase_anon_key', true);
  
  IF _anon_key IS NULL OR _anon_key = '' THEN
    _anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdnpkanhzamVjZ250dmp6aHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4OTU3NzAsImV4cCI6MjA4NTQ3MTc3MH0.fu6LS8crj1mNBZ2JkRNzTWXcf9HwRn5uqt4qEptLtMU';
  END IF;

  _payload := jsonb_build_object(
    'type', 'property_progress_updated',
    'record', row_to_json(NEW)::jsonb,
    'old_record', row_to_json(OLD)::jsonb
  );

  PERFORM extensions.http_post(
    _url,
    _payload::text,
    'application/json',
    ARRAY[
      extensions.http_header('Authorization', 'Bearer ' || _anon_key),
      extensions.http_header('Content-Type', 'application/json')
    ],
    5000
  );

  RETURN NEW;
END;
$function$;

-- Create triggers
CREATE TRIGGER trg_email_on_lead_created
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.email_on_lead_created();

CREATE TRIGGER trg_email_on_property_progress_changed
  AFTER UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.email_on_property_progress_changed();
