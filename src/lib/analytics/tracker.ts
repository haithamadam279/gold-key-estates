/**
 * Analytics Event Tracker
 * Central tracking service with debouncing and consent awareness
 *
 * Taxonomy: CLICK · VIEW · ACTION · SYSTEM
 */

import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsEventName, EventPayload, EventCategory } from './types';
import { EVENT_CATEGORY } from './types';
import {
  getSessionId,
  getDeviceType,
  getPersistedUTMParams,
  isTrackingAllowed,
  debounce,
} from './utils';

// ── Helpers ─────────────────────────────────────────────

/** Derive category from dot-prefixed event name (e.g. "click.whatsapp" → "click") */
function deriveCategory(eventName: string): EventCategory {
  const prefix = eventName.split('.')[0] as EventCategory;
  if (Object.values(EVENT_CATEGORY).includes(prefix)) return prefix;
  return EVENT_CATEGORY.ACTION; // fallback
}

// ── Core Tracking ───────────────────────────────────────

async function trackToDatabase(
  eventName: AnalyticsEventName,
  eventData: EventPayload = {}
): Promise<void> {
  const utmParams = getPersistedUTMParams();

  const { error } = await supabase.from('analytics_events').insert([{
    event_name: eventName,
    event_data: JSON.parse(JSON.stringify({
      ...eventData,
      category: deriveCategory(eventName),
    })),
    session_id: getSessionId(),
    page_url: window.location.href,
    page_title: document.title,
    referrer: document.referrer || null,
    device_type: getDeviceType(),
    language: document.documentElement.lang || 'en',
    utm_source: utmParams.utm_source || null,
    utm_medium: utmParams.utm_medium || null,
    utm_campaign: utmParams.utm_campaign || null,
    utm_term: utmParams.utm_term || null,
    utm_content: utmParams.utm_content || null,
  }]);

  if (error) {
    console.error('Analytics tracking error:', error);
  }
}

// Track to external pixels (GA4, Meta, etc.)
function trackToPixels(eventName: string, eventData: EventPayload = {}): void {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, eventData);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('trackCustom', eventName, eventData);
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && (window as unknown as { ttq?: { track: (...args: unknown[]) => void } }).ttq) {
    (window as unknown as { ttq: { track: (...args: unknown[]) => void } }).ttq.track(eventName, eventData);
  }
}

// ── Public API ──────────────────────────────────────────

export async function trackEvent(
  eventName: AnalyticsEventName,
  eventData: EventPayload = {}
): Promise<void> {
  // Always track to first-party database
  await trackToDatabase(eventName, eventData);

  // Only track to third-party pixels if consent given
  if (isTrackingAllowed()) {
    trackToPixels(eventName, eventData);
  }
}

export const trackEventDebounced = debounce(trackEvent, 300);

// ── Convenience Methods ─────────────────────────────────

export const analytics = {
  // ─── VIEW ──────────────────────────────────────────
  trackPageView: (pageTitle?: string) =>
    trackEvent('view.page', { page_title: pageTitle || document.title }),

  trackPropertyView: (propertyId: string, propertyTitle?: string, price?: number) =>
    trackEvent('view.property', { property_id: propertyId, property_title: propertyTitle, property_price: price }),

  trackProjectView: (projectId: string, projectTitle?: string) =>
    trackEvent('view.project', { property_id: projectId, property_title: projectTitle }),

  trackCompareView: () =>
    trackEvent('view.compare', {}),

  // ─── CLICK ─────────────────────────────────────────
  trackWhatsAppClick: (destination?: string, context?: string) =>
    trackEvent('click.whatsapp', { destination, button_location: context }),

  trackPhoneClick: (destination?: string, context?: string) =>
    trackEvent('click.phone', { destination, button_location: context }),

  trackCTAClick: (buttonText: string, buttonLocation: string) =>
    trackEvent('click.cta', { button_text: buttonText, button_location: buttonLocation }),

  trackShareClick: (propertyId?: string, method?: string) =>
    trackEvent('click.share', { property_id: propertyId, button_text: method }),

  trackFavoriteClick: (propertyId: string, isFavorite: boolean) =>
    trackEvent('click.favorite', { property_id: propertyId, button_text: isFavorite ? 'add' : 'remove' }),

  trackBrochureClick: (propertyId?: string) =>
    trackEvent('click.brochure', { property_id: propertyId }),

  trackCompareAdd: (propertyId: string, propertyTitle?: string) =>
    trackEvent('click.compare_add', { property_id: propertyId, property_title: propertyTitle }),

  trackCompareRemove: (propertyId: string) =>
    trackEvent('click.compare_remove', { property_id: propertyId }),

  // ─── ACTION ────────────────────────────────────────
  trackSearch: (query: string, filters?: Record<string, unknown>, resultsCount?: number) =>
    trackEvent('action.search', { query, filters, results_count: resultsCount }),

  trackFilterApply: (filters: Record<string, unknown>) =>
    trackEvent('action.filter_apply', { filters }),

  trackLeadSubmit: (source: string, propertyId?: string, formType?: string) =>
    trackEvent('action.lead_submit', { lead_source: source, property_id: propertyId, form_type: formType }),

  trackContactSubmit: (formData: { name?: string; hasPhone?: boolean }) =>
    trackEvent('action.contact_submit', { button_text: formData.name ? 'with_name' : 'anonymous', button_location: formData.hasPhone ? 'with_phone' : 'no_phone' }),

  trackLoginSuccess: (method?: string) =>
    trackEvent('action.login_success', { method } as unknown as EventPayload),

  trackLoginFail: (errorCode?: string) =>
    trackEvent('action.login_fail', { error_code: errorCode } as unknown as EventPayload),

  trackLogout: () =>
    trackEvent('action.logout', {}),

  trackResaleRequest: (propertyId: string) =>
    trackEvent('action.resale_request', { property_id: propertyId }),

  trackAdminApprove: (entityType: string, entityId: string) =>
    trackEvent('action.admin_approve', { entity_type: entityType, entity_id: entityId } as unknown as EventPayload),

  trackAdminReject: (entityType: string, entityId: string) =>
    trackEvent('action.admin_reject', { entity_type: entityType, entity_id: entityId } as unknown as EventPayload),

  trackLeadAssign: (leadId: string, agentId: string) =>
    trackEvent('action.lead_assign', { entity_id: leadId, action_detail: agentId } as unknown as EventPayload),

  trackPropertyFinderStart: () =>
    trackEvent('action.property_finder_start', {}),

  trackPropertyFinderStep: (step: number, stepName: string) =>
    trackEvent('action.property_finder_step', { step, step_name: stepName } as unknown as EventPayload),

  trackPropertyFinderComplete: (preferences: Record<string, unknown>) =>
    trackEvent('action.property_finder_complete', { preferences } as unknown as EventPayload),

  // ─── SYSTEM ────────────────────────────────────────
  trackScrollDepth: (depthPercent: number) =>
    trackEventDebounced('system.scroll_depth', { depth_percent: depthPercent }),

  trackConsentGranted: () =>
    trackEvent('system.consent_granted', {}),

  trackConsentDeclined: () =>
    trackEvent('system.consent_declined', {}),
};

export default analytics;
