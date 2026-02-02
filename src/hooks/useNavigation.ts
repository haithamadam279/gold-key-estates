import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NavigationItem {
  id: string;
  menu_id: string;
  parent_id: string | null;
  label_en: string;
  label_ar: string;
  url: string | null;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
  is_mega_menu: boolean;
  roles_allowed: string[];
  open_in_new_tab: boolean;
  children?: NavigationItem[];
}

export interface NavigationCTA {
  id: string;
  menu_id: string;
  label_en: string;
  label_ar: string;
  url: string;
  is_visible: boolean;
}

export interface NavigationMenu {
  id: string;
  name: string;
  description: string | null;
  items: NavigationItem[];
  cta: NavigationCTA | null;
}

// Helper to build tree structure from flat items
const buildNavigationTree = (items: NavigationItem[]): NavigationItem[] => {
  const itemMap = new Map<string, NavigationItem>();
  const rootItems: NavigationItem[] = [];

  // First pass: create map with children arrays
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: build tree
  items.forEach(item => {
    const node = itemMap.get(item.id)!;
    if (item.parent_id && itemMap.has(item.parent_id)) {
      itemMap.get(item.parent_id)!.children!.push(node);
    } else {
      rootItems.push(node);
    }
  });

  // Sort by sort_order
  const sortItems = (items: NavigationItem[]) => {
    items.sort((a, b) => a.sort_order - b.sort_order);
    items.forEach(item => {
      if (item.children?.length) {
        sortItems(item.children);
      }
    });
  };

  sortItems(rootItems);
  return rootItems;
};

export const useNavigation = (menuName: string = 'main_header') => {
  const { language } = useLanguage();

  const { data: navigation, isLoading, error } = useQuery({
    queryKey: ['navigation', menuName],
    queryFn: async (): Promise<NavigationMenu | null> => {
      // Fetch menu
      const { data: menu, error: menuError } = await supabase
        .from('navigation_menus')
        .select('*')
        .eq('name', menuName)
        .single();

      if (menuError || !menu) {
        console.error('Failed to fetch navigation menu:', menuError);
        return null;
      }

      // Fetch items
      const { data: items, error: itemsError } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_visible', true)
        .order('sort_order');

      if (itemsError) {
        console.error('Failed to fetch navigation items:', itemsError);
        return null;
      }

      // Fetch CTA
      const { data: cta, error: ctaError } = await supabase
        .from('navigation_cta')
        .select('*')
        .eq('menu_id', menu.id)
        .eq('is_visible', true)
        .single();

      if (ctaError && ctaError.code !== 'PGRST116') {
        console.error('Failed to fetch CTA:', ctaError);
      }

      return {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        items: buildNavigationTree(items || []),
        cta: cta || null,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Helper to get localized label
  const getLabel = (item: { label_en: string; label_ar: string }) => {
    return language === 'ar' ? item.label_ar : item.label_en;
  };

  return {
    navigation,
    isLoading,
    error,
    getLabel,
  };
};
