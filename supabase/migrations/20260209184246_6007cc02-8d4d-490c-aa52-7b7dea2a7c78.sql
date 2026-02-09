-- Add 'broker' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'broker';

-- Add broker assignment columns to leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS assigned_broker_id uuid,
  ADD COLUMN IF NOT EXISTS broker_assigned_at timestamp with time zone;

-- RLS: only admins can update broker assignment (already covered by existing admin ALL policy)
-- No additional policies needed since admins already have full access to leads