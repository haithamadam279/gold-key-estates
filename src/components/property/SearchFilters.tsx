import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SearchFiltersProps {
  onSearch?: (filters: any) => void;
  compact?: boolean;
}

const SearchFilters = ({ onSearch, compact = false }: SearchFiltersProps) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(!compact);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [areaRange, setAreaRange] = useState([0, 500]);
  const [bedrooms, setBedrooms] = useState<string>('any');
  const [status, setStatus] = useState<string>('any');
  const [propertyType, setPropertyType] = useState<string>('any');

  const handleSearch = () => {
    onSearch?.({
      query: searchQuery,
      priceRange,
      areaRange,
      bedrooms,
      status,
      propertyType,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 10000000]);
    setAreaRange([0, 500]);
    setBedrooms('any');
    setStatus('any');
    setPropertyType('any');
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('hero.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury pl-12 h-12"
          />
        </div>
        {compact && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-4 border-border/50 hover:border-primary/50"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        )}
        <Button onClick={handleSearch} className="btn-gold h-12 px-8">
          {t('common.search')}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={compact ? { opacity: 0, height: 0 } : false}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-border/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {t('search.propertyType')}
              </label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="input-luxury">
                  <SelectValue placeholder={t('search.any')} />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="any">{t('search.any')}</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {t('search.bedrooms')}
              </label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="input-luxury">
                  <SelectValue placeholder={t('search.any')} />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="any">{t('search.any')}</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5+">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {t('search.status')}
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="input-luxury">
                  <SelectValue placeholder={t('search.any')} />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="any">{t('search.any')}</SelectItem>
                  <SelectItem value="available">{t('property.status.available')}</SelectItem>
                  <SelectItem value="reserved">{t('property.status.reserved')}</SelectItem>
                  <SelectItem value="sold">{t('property.status.sold')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                {t('search.priceRange')}: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} {t('common.currency')}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000000}
                step={100000}
                className="mt-3"
              />
            </div>
          </div>

          {/* Area Range */}
          <div className="mt-6">
            <label className="block text-sm text-muted-foreground mb-2">
              {t('search.areaRange')}: {areaRange[0]} - {areaRange[1]} {t('property.sqm')}
            </label>
            <Slider
              value={areaRange}
              onValueChange={setAreaRange}
              max={500}
              step={10}
              className="mt-3"
            />
          </div>

          {/* Clear Filters */}
          <div className="mt-6 flex justify-end">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <X className="w-4 h-4" />
              {t('search.clearFilters')}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchFilters;
