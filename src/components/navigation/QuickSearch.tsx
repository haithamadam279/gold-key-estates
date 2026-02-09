import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, MapPin, Home, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface QuickSearchProps {
  variant?: 'header' | 'expanded';
  className?: string;
  onSearch?: () => void;
}

const propertyTypes = [
  { value: 'all', labelEn: 'All Types', labelAr: 'جميع الأنواع' },
  { value: 'apartment', labelEn: 'Apartment', labelAr: 'شقة' },
  { value: 'villa', labelEn: 'Villa', labelAr: 'فيلا' },
  { value: 'townhouse', labelEn: 'Townhouse', labelAr: 'تاون هاوس' },
  { value: 'penthouse', labelEn: 'Penthouse', labelAr: 'بنتهاوس' },
  { value: 'duplex', labelEn: 'Duplex', labelAr: 'دوبلكس' },
];

const priceRanges = [
  { value: 'all', labelEn: 'Any Price', labelAr: 'أي سعر' },
  { value: '0-1000000', labelEn: 'Under 1M', labelAr: 'أقل من 1 مليون' },
  { value: '1000000-3000000', labelEn: '1M - 3M', labelAr: '1 - 3 مليون' },
  { value: '3000000-5000000', labelEn: '3M - 5M', labelAr: '3 - 5 مليون' },
  { value: '5000000-10000000', labelEn: '5M - 10M', labelAr: '5 - 10 مليون' },
  { value: '10000000+', labelEn: '10M+', labelAr: 'أكثر من 10 مليون' },
];

const locations = [
  { value: 'all', labelEn: 'All Locations', labelAr: 'جميع المواقع' },
  { value: 'new-cairo', labelEn: 'New Cairo', labelAr: 'القاهرة الجديدة' },
  { value: 'sixth-october', labelEn: '6th October', labelAr: '6 أكتوبر' },
  { value: 'new-capital', labelEn: 'New Capital', labelAr: 'العاصمة الإدارية' },
  { value: 'north-coast', labelEn: 'North Coast', labelAr: 'الساحل الشمالي' },
  { value: 'ain-sokhna', labelEn: 'Ain Sokhna', labelAr: 'العين السخنة' },
];

export const QuickSearch = ({ variant = 'header', className, onSearch }: QuickSearchProps) => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if on search/listing pages
  const isSearchPage = location.pathname === '/properties' || location.pathname === '/projects';

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (propertyType !== 'all') params.set('type', propertyType);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (locationFilter !== 'all') params.set('location', locationFilter);
    if (keyword.trim()) params.set('q', keyword.trim());

    const searchUrl = `/properties${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(searchUrl);
    setIsExpanded(false);
    onSearch?.();
  }, [propertyType, priceRange, locationFilter, keyword, navigate, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const getLabel = (item: { labelEn: string; labelAr: string }) => {
    return language === 'ar' ? item.labelAr : item.labelEn;
  };

  // Compact header variant
  if (variant === 'header' && !isSearchPage) {
    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              aria-label={t('common.search')}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden md:inline">{t('common.search')}</span>
            </motion.button>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, width: 200 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 200 }}
              className="glass-card p-2 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
                    isRTL ? "right-3" : "left-3"
                  )} />
                  <Input
                    ref={inputRef}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('hero.searchPlaceholder')}
                    className={cn(
                      "bg-secondary/50 border-border/50 h-9 text-sm",
                      isRTL ? "pr-9 pl-3" : "pl-9 pr-3"
                    )}
                  />
                </div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[140px] h-9 bg-secondary/50 border-border/50 text-sm">
                    <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border/50">
                    {locations.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {getLabel(loc)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSearch}
                  size="sm"
                  className="btn-gold h-9 px-4"
                >
                  {t('common.search')}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="h-9 w-9 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Expanded variant for search pages
  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-secondary/30 border border-border/30">
        {/* Keyword Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('hero.searchPlaceholder')}
            className={cn(
              "bg-background/50 border-border/50 h-10",
              isRTL ? "pr-10 pl-3" : "pl-10 pr-3"
            )}
          />
        </div>

        {/* Property Type */}
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="w-[140px] h-10 bg-background/50 border-border/50">
            <Home className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-border/50">
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {getLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[160px] h-10 bg-background/50 border-border/50">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-border/50">
            {locations.map((loc) => (
              <SelectItem key={loc.value} value={loc.value}>
                {getLabel(loc)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-[140px] h-10 bg-background/50 border-border/50">
            <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-border/50">
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {getLabel(range)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button onClick={handleSearch} className="btn-gold h-10 px-6">
          <Search className="w-4 h-4 mr-2" />
          {t('common.search')}
        </Button>
      </div>
    </div>
  );
};

export default QuickSearch;
