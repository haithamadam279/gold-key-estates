/**
 * API Module Index
 * Exports all API functionality
 */

// Configuration
export { API_BASE_URL, IS_MOCK_MODE, getApiUrl, API_TIMEOUT } from './config';

// Client
export { apiClient, tokenManager, get, post, put, patch, del, uploadFile } from './client';

// Types
export * from './types';

// Mock handlers (for development)
export {
  mockAuth,
  mockUsersApi,
  mockPropertiesApi,
  mockInventoryApi,
  mockClientAssetsApi,
  mockLeadsApi,
  mockCMSApi,
  mockResaleApi,
  mockSyncApi,
  mockSettingsApi,
  decodeMockToken,
} from './mock/mockHandlers';

// Mock data (for development)
export {
  mockUsers,
  mockProperties,
  mockPropertyListItems,
  mockInventory,
  mockClientAssets,
  mockLeads,
  mockCMSPages,
  mockPopups,
  mockResaleRequests,
  mockSyncLogs,
  mockThemeSettings,
  mockCurrentUser,
} from './mock/mockData';
