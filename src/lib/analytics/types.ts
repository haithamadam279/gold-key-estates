/**
 * Analytics Event Taxonomy
 * 4-category system: CLICK · VIEW · ACTION · SYSTEM
 * Stable event names and payload schemas for the analytics system
 */

// ── Event Categories ────────────────────────────────────
// CLICK  – user taps / clicks a UI element
// VIEW   – user sees a page or entity
// ACTION – user completes a business workflow step
// SYSTEM – automated / lifecycle events

export const EVENT_CATEGORY = {
  CLICK: 'click',
  VIEW: 'view',
  ACTION: 'action',
  SYSTEM: 'system',
} as const;

export type EventCategory = typeof EVENT_CATEGORY[keyof typeof EVENT_CATEGORY];

// ── Core Event Names ────────────────────────────────────
// Naming convention: <category>.<noun>_<verb>  (snake_case)
// Examples: view.page, click.whatsapp, action.lead_submit, system.session_start

export const ANALYTICS_EVENTS = {
  // ─── VIEW events ───────────────────────────────────
  PAGE_VIEW: 'view.page',
  VIEW_PROPERTY: 'view.property',
  VIEW_PROJECT: 'view.project',
  VIEW_COMPARE: 'view.compare',

  // ─── CLICK events ──────────────────────────────────
  CLICK_WHATSAPP: 'click.whatsapp',
  CLICK_PHONE: 'click.phone',
  CLICK_CTA: 'click.cta',
  CLICK_SHARE: 'click.share',
  CLICK_FAVORITE: 'click.favorite',
  CLICK_BROCHURE: 'click.brochure',
  CLICK_COMPARE_ADD: 'click.compare_add',
  CLICK_COMPARE_REMOVE: 'click.compare_remove',

  // ─── ACTION events ─────────────────────────────────
  ACTION_SEARCH: 'action.search',
  ACTION_FILTER_APPLY: 'action.filter_apply',
  ACTION_LEAD_SUBMIT: 'action.lead_submit',
  ACTION_CONTACT_SUBMIT: 'action.contact_submit',
  ACTION_LOGIN_SUCCESS: 'action.login_success',
  ACTION_LOGIN_FAIL: 'action.login_fail',
  ACTION_LOGOUT: 'action.logout',
  ACTION_RESALE_REQUEST: 'action.resale_request',
  ACTION_ADMIN_APPROVE: 'action.admin_approve',
  ACTION_ADMIN_REJECT: 'action.admin_reject',
  ACTION_LEAD_ASSIGN: 'action.lead_assign',
  ACTION_PROPERTY_FINDER_START: 'action.property_finder_start',
  ACTION_PROPERTY_FINDER_STEP: 'action.property_finder_step',
  ACTION_PROPERTY_FINDER_COMPLETE: 'action.property_finder_complete',

  // ─── SYSTEM events ─────────────────────────────────
  SYSTEM_SESSION_START: 'system.session_start',
  SYSTEM_SESSION_END: 'system.session_end',
  SYSTEM_SCROLL_DEPTH: 'system.scroll_depth',
  SYSTEM_TIME_ON_PAGE: 'system.time_on_page',
  SYSTEM_CONSENT_GRANTED: 'system.consent_granted',
  SYSTEM_CONSENT_DECLINED: 'system.consent_declined',

  // ─── Legacy aliases (backward compat) ──────────────
  /** @deprecated Use ANALYTICS_EVENTS.PAGE_VIEW */
  SEARCH: 'action.search',
  /** @deprecated Use ANALYTICS_EVENTS.ACTION_FILTER_APPLY */
  FILTER_APPLY: 'action.filter_apply',
  /** @deprecated Use ANALYTICS_EVENTS.ACTION_LEAD_SUBMIT */
  LEAD_SUBMIT: 'action.lead_submit',
  /** @deprecated Use ANALYTICS_EVENTS.CLICK_WHATSAPP */
  WHATSAPP_CLICK: 'click.whatsapp',
  /** @deprecated Use ANALYTICS_EVENTS.CLICK_PHONE */
  PHONE_CLICK: 'click.phone',
  /** @deprecated Use ANALYTICS_EVENTS.CLICK_CTA */
  CTA_BOOK_CONSULTATION: 'click.cta',
  /** @deprecated Use ANALYTICS_EVENTS.CLICK_COMPARE_ADD */
  COMPARE_ADD: 'click.compare_add',
  /** @deprecated Use ANALYTICS_EVENTS.CLICK_COMPARE_REMOVE */
  COMPARE_REMOVE: 'click.compare_remove',
  /** @deprecated Use ANALYTICS_EVENTS.VIEW_COMPARE */
  COMPARE_VIEW: 'view.compare',
  /** @deprecated Use ANALYTICS_EVENTS.SYSTEM_SCROLL_DEPTH */
  SCROLL_DEPTH: 'system.scroll_depth',
  /** @deprecated Use ANALYTICS_EVENTS.SYSTEM_TIME_ON_PAGE */
  TIME_ON_PAGE: 'system.time_on_page',
  /** @deprecated Use ANALYTICS_EVENTS.SYSTEM_SESSION_START */
  SESSION_START: 'system.session_start',
  /** @deprecated Use ANALYTICS_EVENTS.SYSTEM_SESSION_END */
  SESSION_END: 'system.session_end',
  /** @deprecated Use ANALYTICS_EVENTS.ACTION_PROPERTY_FINDER_START */
  PROPERTY_FINDER_START: 'action.property_finder_start',
  /** @deprecated Use ANALYTICS_EVENTS.ACTION_PROPERTY_FINDER_STEP */
  PROPERTY_FINDER_STEP: 'action.property_finder_step',
  /** @deprecated Use ANALYTICS_EVENTS.ACTION_PROPERTY_FINDER_COMPLETE */
  PROPERTY_FINDER_COMPLETE: 'action.property_finder_complete',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

// ── Event Payload Schemas ───────────────────────────────

export interface BaseEventPayload {
  timestamp?: number;
  page_url?: string;
  page_title?: string;
  category?: EventCategory;
}

export interface PropertyEventPayload extends BaseEventPayload {
  property_id?: string;
  property_title?: string;
  property_price?: number;
  property_location?: string;
}

export interface SearchEventPayload extends BaseEventPayload {
  query?: string;
  filters?: Record<string, unknown>;
  results_count?: number;
}

export interface LeadEventPayload extends BaseEventPayload {
  lead_source?: string;
  property_id?: string;
  form_type?: string;
}

export interface ScrollEventPayload extends BaseEventPayload {
  depth_percent: number;
}

export interface CTAEventPayload extends BaseEventPayload {
  button_text?: string;
  button_location?: string;
  destination?: string;
}

export interface AuthEventPayload extends BaseEventPayload {
  method?: string;
  error_code?: string;
}

export interface AdminEventPayload extends BaseEventPayload {
  entity_type?: string;
  entity_id?: string;
  action_detail?: string;
}

export type EventPayload =
  | BaseEventPayload
  | PropertyEventPayload
  | SearchEventPayload
  | LeadEventPayload
  | ScrollEventPayload
  | CTAEventPayload
  | AuthEventPayload
  | AdminEventPayload;

// ── UTM Parameters ──────────────────────────────────────

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// ── Device Types ────────────────────────────────────────

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// ── Analytics Settings from DB ──────────────────────────

export interface AnalyticsSetting {
  id: string;
  key: string;
  value: string | null;
  enabled: boolean;
}

// ── Consent State ───────────────────────────────────────

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: number;
}
