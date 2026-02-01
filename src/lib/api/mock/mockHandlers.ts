/**
 * Mock Handlers
 * Simulates API responses for development
 */

import { IS_MOCK_MODE } from '../config';
import {
  User,
  LoginResponse,
  Property,
  PropertyListItem,
  PropertyFilters,
  Inventory,
  ClientAsset,
  Lead,
  CMSPage,
  CMSPopup,
  ResaleRequest,
  SyncLog,
  ThemeSettings,
  PaginatedResponse,
  AuthTokens,
  JWTPayload,
} from '../types';
import {
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
} from './mockData';

// Simulate network delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock JWT
const generateMockToken = (user: User): string => {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    iat: Math.floor(Date.now() / 1000),
  };
  // In mock mode, just base64 encode (not a real JWT)
  return btoa(JSON.stringify(payload));
};

// Decode mock token
export const decodeMockToken = (token: string): JWTPayload | null => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// ============ Auth Handlers ============
export const mockAuth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(500);
    
    // Find user by email (password check is mocked)
    const user = mockUsers.find((u) => u.email === email);
    if (!user || password.length < 6) {
      throw { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } };
    }

    const tokens: AuthTokens = {
      accessToken: generateMockToken(user),
      refreshToken: `refresh_${user.id}_${Date.now()}`,
      expiresIn: 3600,
    };

    return { user, tokens };
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(200);
    return mockUsers[0]; // Return admin for mock
  },

  logout: async (): Promise<void> => {
    await delay(100);
  },
};

// ============ Users Handlers ============
export const mockUsersApi = {
  list: async (): Promise<User[]> => {
    await delay(300);
    return mockUsers;
  },

  getById: async (id: string): Promise<User | null> => {
    await delay(200);
    return mockUsers.find((u) => u.id === id) || null;
  },

  create: async (userData: Partial<User>): Promise<User> => {
    await delay(400);
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email || '',
      fullName: userData.fullName || '',
      phone: userData.phone,
      avatarUrl: userData.avatarUrl,
      role: userData.role || 'client',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    await delay(400);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } };
    }
    mockUsers[index] = { ...mockUsers[index], ...userData, updatedAt: new Date().toISOString() };
    return mockUsers[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  },
};

// ============ Properties Handlers ============
export const mockPropertiesApi = {
  list: async (filters?: PropertyFilters): Promise<PaginatedResponse<PropertyListItem>> => {
    await delay(400);
    
    let filtered = [...mockPropertyListItems];
    
    // Apply filters
    if (filters?.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((p) => 
        p.title.toLowerCase().includes(search) || 
        p.location.toLowerCase().includes(search)
      );
    }
    if (filters?.minPrice) {
      filtered = filtered.filter((p) => p.price >= (filters.minPrice || 0));
    }
    if (filters?.maxPrice) {
      filtered = filtered.filter((p) => p.price <= (filters.maxPrice || Infinity));
    }
    if (filters?.bedrooms) {
      filtered = filtered.filter((p) => p.bedrooms >= (filters.bedrooms || 0));
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'area_desc':
          filtered.sort((a, b) => b.area - a.area);
          break;
        default:
          break;
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return {
      data: paged,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  listPublic: async (filters?: PropertyFilters): Promise<PaginatedResponse<PropertyListItem>> => {
    await delay(400);
    // Only return published properties for public API
    const publicOnly = mockPropertyListItems.filter((p) => p.status === 'published');
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const start = (page - 1) * limit;
    const paged = publicOnly.slice(start, start + limit);

    return {
      data: paged,
      total: publicOnly.length,
      page,
      limit,
      totalPages: Math.ceil(publicOnly.length / limit),
    };
  },

  getById: async (id: string): Promise<Property | null> => {
    await delay(300);
    return mockProperties.find((p) => p.id === id) || null;
  },

  compare: async (ids: string[]): Promise<Property[]> => {
    await delay(300);
    return mockProperties.filter((p) => ids.includes(p.id) && p.status === 'published');
  },

  create: async (data: Partial<Property>): Promise<Property> => {
    await delay(500);
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      ...data,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Property;
    mockProperties.push(newProperty);
    return newProperty;
  },

  update: async (id: string, data: Partial<Property>): Promise<Property> => {
    await delay(400);
    const index = mockProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } };
    }
    mockProperties[index] = { ...mockProperties[index], ...data, updatedAt: new Date().toISOString() };
    return mockProperties[index];
  },

  submitForApproval: async (id: string): Promise<Property> => {
    await delay(300);
    const index = mockProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } };
    }
    mockProperties[index].status = 'pending_approval';
    mockProperties[index].submittedAt = new Date().toISOString();
    return mockProperties[index];
  },

  approve: async (id: string, approverId: string): Promise<Property> => {
    await delay(300);
    const index = mockProperties.findIndex((p) => p.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'Property not found' } };
    }
    mockProperties[index].status = 'published';
    mockProperties[index].approvedBy = approverId;
    mockProperties[index].approvedAt = new Date().toISOString();
    mockProperties[index].publishedAt = new Date().toISOString();
    return mockProperties[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockProperties.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockProperties.splice(index, 1);
    }
  },
};

// ============ Inventory Handlers ============
export const mockInventoryApi = {
  list: async (): Promise<Inventory[]> => {
    await delay(300);
    return mockInventory;
  },

  update: async (id: string, data: Partial<Inventory>): Promise<Inventory> => {
    await delay(400);
    const index = mockInventory.findIndex((i) => i.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'Inventory not found' } };
    }
    mockInventory[index] = { ...mockInventory[index], ...data, lastUpdated: new Date().toISOString() };
    return mockInventory[index];
  },
};

// ============ Client Assets Handlers ============
export const mockClientAssetsApi = {
  getByClientId: async (clientId: string): Promise<ClientAsset[]> => {
    await delay(300);
    return mockClientAssets.filter((a) => a.clientId === clientId);
  },
};

// ============ Leads Handlers ============
export const mockLeadsApi = {
  list: async (): Promise<Lead[]> => {
    await delay(300);
    return mockLeads;
  },

  create: async (data: Partial<Lead>): Promise<Lead> => {
    await delay(400);
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      message: data.message,
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle,
      status: 'new',
      source: data.source || 'website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLeads.push(newLead);
    return newLead;
  },

  updateStatus: async (id: string, status: Lead['status']): Promise<Lead> => {
    await delay(300);
    const index = mockLeads.findIndex((l) => l.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } };
    }
    mockLeads[index].status = status;
    mockLeads[index].updatedAt = new Date().toISOString();
    return mockLeads[index];
  },
};

// ============ CMS Handlers ============
export const mockCMSApi = {
  getPages: async (): Promise<CMSPage[]> => {
    await delay(300);
    return mockCMSPages;
  },

  getPageBySlug: async (slug: string): Promise<CMSPage | null> => {
    await delay(200);
    return mockCMSPages.find((p) => p.slug === slug) || null;
  },

  updatePage: async (id: string, data: Partial<CMSPage>): Promise<CMSPage> => {
    await delay(400);
    const index = mockCMSPages.findIndex((p) => p.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'Page not found' } };
    }
    mockCMSPages[index] = { ...mockCMSPages[index], ...data, updatedAt: new Date().toISOString() };
    return mockCMSPages[index];
  },

  getPopups: async (): Promise<CMSPopup[]> => {
    await delay(200);
    return mockPopups;
  },

  getActivePopups: async (): Promise<CMSPopup[]> => {
    await delay(200);
    return mockPopups.filter((p) => p.isActive);
  },
};

// ============ Resale Requests Handlers ============
export const mockResaleApi = {
  list: async (): Promise<ResaleRequest[]> => {
    await delay(300);
    return mockResaleRequests;
  },

  create: async (data: Partial<ResaleRequest>): Promise<ResaleRequest> => {
    await delay(400);
    const newRequest: ResaleRequest = {
      id: `resale-${Date.now()}`,
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      clientEmail: data.clientEmail || '',
      assetId: data.assetId || '',
      propertyTitle: data.propertyTitle || '',
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockResaleRequests.push(newRequest);
    return newRequest;
  },

  updateStatus: async (id: string, status: ResaleRequest['status']): Promise<ResaleRequest> => {
    await delay(300);
    const index = mockResaleRequests.findIndex((r) => r.id === id);
    if (index === -1) {
      throw { success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    }
    mockResaleRequests[index].status = status;
    mockResaleRequests[index].updatedAt = new Date().toISOString();
    return mockResaleRequests[index];
  },
};

// ============ Sync Handlers ============
export const mockSyncApi = {
  getLogs: async (): Promise<SyncLog[]> => {
    await delay(300);
    return mockSyncLogs;
  },

  triggerSync: async (type: 'inventory' | 'properties' | 'documents'): Promise<SyncLog> => {
    await delay(1000);
    const newLog: SyncLog = {
      id: `sync-${Date.now()}`,
      type,
      source: type === 'documents' ? 'google_drive' : 'google_sheets',
      status: 'completed',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      rowsProcessed: Math.floor(Math.random() * 50) + 10,
      rowsUpdated: Math.floor(Math.random() * 20),
      rowsFailed: 0,
    };
    mockSyncLogs.unshift(newLog);
    return newLog;
  },
};

// ============ Settings Handlers ============
export const mockSettingsApi = {
  getTheme: async (): Promise<ThemeSettings> => {
    await delay(200);
    return mockThemeSettings;
  },

  updateTheme: async (data: Partial<ThemeSettings>): Promise<ThemeSettings> => {
    await delay(400);
    Object.assign(mockThemeSettings, data);
    return mockThemeSettings;
  },
};

// Log mock mode status
if (IS_MOCK_MODE) {
  console.log('[Mock Handlers] Mock API handlers loaded');
}
