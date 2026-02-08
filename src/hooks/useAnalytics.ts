/**
 * useAnalytics Hook
 * Easy access to analytics tracking in components
 */

import { useCallback } from 'react';
import { analytics } from '@/lib/analytics';

export const useAnalytics = () => {
  // ─── VIEW ──────────────────────────────────────────
  const trackPropertyView = useCallback((
    propertyId: string,
    propertyTitle?: string,
    price?: number
  ) => {
    analytics.trackPropertyView(propertyId, propertyTitle, price);
  }, []);

  // ─── CLICK ─────────────────────────────────────────
  const trackWhatsAppClick = useCallback((destination?: string, context?: string) => {
    analytics.trackWhatsAppClick(destination, context);
  }, []);

  const trackPhoneClick = useCallback((destination?: string, context?: string) => {
    analytics.trackPhoneClick(destination, context);
  }, []);

  const trackCTAClick = useCallback((buttonText: string, buttonLocation: string) => {
    analytics.trackCTAClick(buttonText, buttonLocation);
  }, []);

  const trackShareClick = useCallback((propertyId?: string, method?: string) => {
    analytics.trackShareClick(propertyId, method);
  }, []);

  const trackFavoriteClick = useCallback((propertyId: string, isFavorite: boolean) => {
    analytics.trackFavoriteClick(propertyId, isFavorite);
  }, []);

  const trackBrochureClick = useCallback((propertyId?: string) => {
    analytics.trackBrochureClick(propertyId);
  }, []);

  const trackCompareAdd = useCallback((propertyId: string, propertyTitle?: string) => {
    analytics.trackCompareAdd(propertyId, propertyTitle);
  }, []);

  const trackCompareRemove = useCallback((propertyId: string) => {
    analytics.trackCompareRemove(propertyId);
  }, []);

  // ─── ACTION ────────────────────────────────────────
  const trackSearch = useCallback((
    query: string,
    filters?: Record<string, unknown>,
    resultsCount?: number
  ) => {
    analytics.trackSearch(query, filters, resultsCount);
  }, []);

  const trackFilterApply = useCallback((filters: Record<string, unknown>) => {
    analytics.trackFilterApply(filters);
  }, []);

  const trackLeadSubmit = useCallback((
    source: string,
    propertyId?: string,
    formType?: string
  ) => {
    analytics.trackLeadSubmit(source, propertyId, formType);
  }, []);

  const trackContactSubmit = useCallback((formData: { name?: string; hasPhone?: boolean }) => {
    analytics.trackContactSubmit(formData);
  }, []);

  const trackLoginSuccess = useCallback((method?: string) => {
    analytics.trackLoginSuccess(method);
  }, []);

  const trackLoginFail = useCallback((errorCode?: string) => {
    analytics.trackLoginFail(errorCode);
  }, []);

  const trackLogout = useCallback(() => {
    analytics.trackLogout();
  }, []);

  const trackResaleRequest = useCallback((propertyId: string) => {
    analytics.trackResaleRequest(propertyId);
  }, []);

  const trackPropertyFinderStart = useCallback(() => {
    analytics.trackPropertyFinderStart();
  }, []);

  const trackPropertyFinderStep = useCallback((step: number, stepName: string) => {
    analytics.trackPropertyFinderStep(step, stepName);
  }, []);

  const trackPropertyFinderComplete = useCallback((preferences: Record<string, unknown>) => {
    analytics.trackPropertyFinderComplete(preferences);
  }, []);

  return {
    // VIEW
    trackPropertyView,
    // CLICK
    trackWhatsAppClick,
    trackPhoneClick,
    trackCTAClick,
    trackShareClick,
    trackFavoriteClick,
    trackBrochureClick,
    trackCompareAdd,
    trackCompareRemove,
    // ACTION
    trackSearch,
    trackFilterApply,
    trackLeadSubmit,
    trackContactSubmit,
    trackLoginSuccess,
    trackLoginFail,
    trackLogout,
    trackResaleRequest,
    trackPropertyFinderStart,
    trackPropertyFinderStep,
    trackPropertyFinderComplete,
  };
};

export default useAnalytics;
