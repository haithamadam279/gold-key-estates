-- Navigation Menus table for CMS-managed navigation
CREATE TABLE public.navigation_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, -- e.g., 'main_header', 'footer', 'mobile'
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Navigation Items table with full CMS control
CREATE TABLE public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES public.navigation_menus(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  label_en text NOT NULL,
  label_ar text NOT NULL,
  url text,
  icon text, -- Lucide icon name
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  is_mega_menu boolean NOT NULL DEFAULT false,
  roles_allowed text[] DEFAULT '{}', -- Empty array = public, otherwise role names
  open_in_new_tab boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- CTA Settings for header
CREATE TABLE public.navigation_cta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid REFERENCES public.navigation_menus(id) ON DELETE CASCADE NOT NULL,
  label_en text NOT NULL DEFAULT 'Book a Consultation',
  label_ar text NOT NULL DEFAULT 'احجز استشارة',
  url text NOT NULL DEFAULT '/contact',
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_cta ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, admin manage
CREATE POLICY "Anyone can view navigation menus"
ON public.navigation_menus FOR SELECT
USING (true);

CREATE POLICY "Admins can manage navigation menus"
ON public.navigation_menus FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view visible navigation items"
ON public.navigation_items FOR SELECT
USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage navigation items"
ON public.navigation_items FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view navigation CTA"
ON public.navigation_cta FOR SELECT
USING (true);

CREATE POLICY "Admins can manage navigation CTA"
ON public.navigation_cta FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default main header menu
INSERT INTO public.navigation_menus (name, description)
VALUES ('main_header', 'Main website header navigation');

-- Insert default navigation items for main header
WITH menu AS (SELECT id FROM public.navigation_menus WHERE name = 'main_header')
INSERT INTO public.navigation_items (menu_id, label_en, label_ar, url, icon, sort_order, is_mega_menu)
VALUES
  ((SELECT id FROM menu), 'Properties', 'العقارات', '/properties', 'Building2', 1, true),
  ((SELECT id FROM menu), 'Projects', 'المشاريع', '/projects', 'Landmark', 2, true),
  ((SELECT id FROM menu), 'Developers', 'المطورون', '/developers', 'Building', 3, false),
  ((SELECT id FROM menu), 'Locations', 'المواقع', '/locations', 'MapPin', 4, true),
  ((SELECT id FROM menu), 'Compare', 'مقارنة', '/compare', 'ArrowLeftRight', 5, false),
  ((SELECT id FROM menu), 'Tools', 'الأدوات', null, 'Calculator', 6, true);

-- Insert sub-items for Properties mega menu
WITH menu AS (SELECT id FROM public.navigation_menus WHERE name = 'main_header'),
     parent AS (SELECT id FROM public.navigation_items WHERE label_en = 'Properties' AND menu_id = (SELECT id FROM menu))
INSERT INTO public.navigation_items (menu_id, parent_id, label_en, label_ar, url, sort_order)
VALUES
  ((SELECT id FROM menu), (SELECT id FROM parent), 'All Properties', 'جميع العقارات', '/properties', 1),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'For Sale', 'للبيع', '/properties?type=sale', 2),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'For Rent', 'للإيجار', '/properties?type=rent', 3),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'New Projects', 'مشاريع جديدة', '/projects', 4),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'Resale', 'إعادة البيع', '/properties?type=resale', 5),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'Featured', 'المميزة', '/properties?featured=true', 6);

-- Insert sub-items for Projects mega menu
WITH menu AS (SELECT id FROM public.navigation_menus WHERE name = 'main_header'),
     parent AS (SELECT id FROM public.navigation_items WHERE label_en = 'Projects' AND menu_id = (SELECT id FROM menu))
INSERT INTO public.navigation_items (menu_id, parent_id, label_en, label_ar, url, sort_order)
VALUES
  ((SELECT id FROM menu), (SELECT id FROM parent), 'All Projects', 'جميع المشاريع', '/projects', 1),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'By Developer', 'حسب المطور', '/projects?group=developer', 2),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'By Location', 'حسب الموقع', '/projects?group=location', 3),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'Under Construction', 'قيد الإنشاء', '/projects?status=construction', 4),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'Delivered', 'تم التسليم', '/projects?status=delivered', 5);

-- Insert sub-items for Tools mega menu
WITH menu AS (SELECT id FROM public.navigation_menus WHERE name = 'main_header'),
     parent AS (SELECT id FROM public.navigation_items WHERE label_en = 'Tools' AND menu_id = (SELECT id FROM menu))
INSERT INTO public.navigation_items (menu_id, parent_id, label_en, label_ar, url, sort_order)
VALUES
  ((SELECT id FROM menu), (SELECT id FROM parent), 'Mortgage Calculator', 'حاسبة التمويل العقاري', '/tools/mortgage', 1),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'Payment Plan Calculator', 'حاسبة خطة الدفع', '/tools/payment-plan', 2),
  ((SELECT id FROM menu), (SELECT id FROM parent), 'ROI Calculator', 'حاسبة العائد على الاستثمار', '/tools/roi', 3);

-- Insert default CTA
WITH menu AS (SELECT id FROM public.navigation_menus WHERE name = 'main_header')
INSERT INTO public.navigation_cta (menu_id, label_en, label_ar, url)
VALUES ((SELECT id FROM menu), 'Book a Consultation', 'احجز استشارة', '/contact');

-- Create indexes for performance
CREATE INDEX idx_navigation_items_menu_id ON public.navigation_items(menu_id);
CREATE INDEX idx_navigation_items_parent_id ON public.navigation_items(parent_id);
CREATE INDEX idx_navigation_items_sort_order ON public.navigation_items(sort_order);

-- Trigger for updated_at
CREATE TRIGGER update_navigation_menus_updated_at
BEFORE UPDATE ON public.navigation_menus
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_navigation_items_updated_at
BEFORE UPDATE ON public.navigation_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_navigation_cta_updated_at
BEFORE UPDATE ON public.navigation_cta
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();