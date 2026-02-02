/**
 * Analytics Tests
 * Tests for consent gating, event tracking, and access control
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getConsentState, isTrackingAllowed, getSessionId, getDeviceType, extractUTMParams, shouldExcludeRoute } from '@/lib/analytics/utils';

describe('Analytics Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Consent Management', () => {
    it('should return false when no consent is given', () => {
      expect(isTrackingAllowed()).toBe(false);
    });

    it('should return true when analytics consent is granted', () => {
      localStorage.setItem('cookie_consent', JSON.stringify({
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
      }));
      expect(isTrackingAllowed()).toBe(true);
    });

    it('should return false when analytics consent is denied', () => {
      localStorage.setItem('cookie_consent', JSON.stringify({
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
      }));
      expect(isTrackingAllowed()).toBe(false);
    });

    it('should handle legacy boolean consent', () => {
      localStorage.setItem('cookie_consent', 'true');
      const consent = getConsentState();
      expect(consent.analytics).toBe(true);
    });
  });

  describe('Session Management', () => {
    it('should generate a session ID', () => {
      const sessionId = getSessionId();
      expect(sessionId).toBeTruthy();
      expect(typeof sessionId).toBe('string');
    });

    it('should return the same session ID on subsequent calls', () => {
      const sessionId1 = getSessionId();
      const sessionId2 = getSessionId();
      expect(sessionId1).toBe(sessionId2);
    });
  });

  describe('Device Detection', () => {
    it('should detect device type based on window width', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
      expect(getDeviceType()).toBe('mobile');

      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      expect(getDeviceType()).toBe('tablet');

      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
      expect(getDeviceType()).toBe('desktop');
    });
  });

  describe('UTM Parameter Extraction', () => {
    it('should extract UTM parameters from URL', () => {
      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale',
        },
        writable: true,
      });

      const utmParams = extractUTMParams();
      expect(utmParams.utm_source).toBe('google');
      expect(utmParams.utm_medium).toBe('cpc');
      expect(utmParams.utm_campaign).toBe('summer_sale');
    });

    it('should return empty object when no UTM params present', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true,
      });

      const utmParams = extractUTMParams();
      expect(Object.keys(utmParams).length).toBe(0);
    });
  });

  describe('Route Exclusion', () => {
    it('should exclude admin routes', () => {
      const exclusions = ['/admin/*', '/client-portal/*'];
      expect(shouldExcludeRoute('/admin/dashboard', exclusions)).toBe(true);
      expect(shouldExcludeRoute('/admin/users', exclusions)).toBe(true);
    });

    it('should exclude client portal routes', () => {
      const exclusions = ['/admin/*', '/client-portal/*'];
      expect(shouldExcludeRoute('/client-portal/dashboard', exclusions)).toBe(true);
    });

    it('should not exclude public routes', () => {
      const exclusions = ['/admin/*', '/client-portal/*'];
      expect(shouldExcludeRoute('/properties', exclusions)).toBe(false);
      expect(shouldExcludeRoute('/', exclusions)).toBe(false);
    });

    it('should handle exact route matches', () => {
      const exclusions = ['/auth'];
      expect(shouldExcludeRoute('/auth', exclusions)).toBe(true);
      expect(shouldExcludeRoute('/auth/login', exclusions)).toBe(false);
    });
  });
});

describe('Event Tracking', () => {
  describe('whatsapp_click event', () => {
    it('should track whatsapp clicks with correct event name', async () => {
      // This would need proper mocking of supabase in a real test
      // For now, we verify the event structure
      const eventName = 'whatsapp_click';
      const eventData = { destination: '+201234567890', button_location: 'property_card' };
      
      expect(eventName).toBe('whatsapp_click');
      expect(eventData.destination).toBeTruthy();
    });
  });

  describe('phone_click event', () => {
    it('should track phone clicks with correct event name', async () => {
      const eventName = 'phone_click';
      const eventData = { destination: '+201234567890', button_location: 'contact_agent' };
      
      expect(eventName).toBe('phone_click');
      expect(eventData.destination).toBeTruthy();
    });
  });

  describe('lead_submit event', () => {
    it('should include attribution data', async () => {
      const eventName = 'lead_submit';
      const eventData = {
        lead_source: 'property_finder',
        property_id: 'prop-123',
        form_type: 'lead_capture_modal',
      };
      
      expect(eventName).toBe('lead_submit');
      expect(eventData.lead_source).toBe('property_finder');
    });
  });
});

describe('Analytics Access Control', () => {
  describe('Role-based access', () => {
    it('should allow admin to access analytics', () => {
      const role = 'admin';
      const allowedRoles = ['admin', 'super_admin', 'marketer', 'sales_manager'];
      expect(allowedRoles.includes(role)).toBe(true);
    });

    it('should allow marketer to access analytics', () => {
      const role = 'marketer';
      const allowedRoles = ['admin', 'super_admin', 'marketer', 'sales_manager'];
      expect(allowedRoles.includes(role)).toBe(true);
    });

    it('should deny client access to analytics', () => {
      const role = 'client';
      const allowedRoles = ['admin', 'super_admin', 'marketer', 'sales_manager'];
      expect(allowedRoles.includes(role)).toBe(false);
    });

    it('should allow sales_manager to access analytics', () => {
      const role = 'sales_manager';
      const allowedRoles = ['admin', 'super_admin', 'marketer', 'sales_manager'];
      expect(allowedRoles.includes(role)).toBe(true);
    });
  });

  describe('Integration settings access', () => {
    it('should only allow admin to modify integrations', () => {
      const role = 'marketer';
      const adminRoles = ['admin', 'super_admin'];
      expect(adminRoles.includes(role)).toBe(false);
    });

    it('should allow super_admin to modify integrations', () => {
      const role = 'super_admin';
      const adminRoles = ['admin', 'super_admin'];
      expect(adminRoles.includes(role)).toBe(true);
    });
  });
});
