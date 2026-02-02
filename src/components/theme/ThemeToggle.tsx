/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */

import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, Theme } from '@/hooks/useTheme';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown';
  className?: string;
}

export const ThemeToggle = ({ variant = 'dropdown', className = '' }: ThemeToggleProps) => {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();
  const { language } = useLanguage();

  const labels = {
    light: language === 'ar' ? 'فاتح' : 'Light',
    dark: language === 'ar' ? 'داكن' : 'Dark',
    system: language === 'ar' ? 'تلقائي' : 'System',
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={`relative w-9 h-9 rounded-lg ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? 0 : 180,
            scale: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute"
        >
          <Moon className="w-5 h-5 text-primary" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? -180 : 0,
            scale: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute"
        >
          <Sun className="w-5 h-5 text-primary" />
        </motion.div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative w-9 h-9 rounded-lg ${className}`}
          aria-label="Select theme"
        >
          <motion.div
            key={resolvedTheme}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card border-border/30">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`gap-2 cursor-pointer ${theme === 'light' ? 'text-primary' : ''}`}
        >
          <Sun className="w-4 h-4" />
          {labels.light}
          {theme === 'light' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`gap-2 cursor-pointer ${theme === 'dark' ? 'text-primary' : ''}`}
        >
          <Moon className="w-4 h-4" />
          {labels.dark}
          {theme === 'dark' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`gap-2 cursor-pointer ${theme === 'system' ? 'text-primary' : ''}`}
        >
          <Monitor className="w-4 h-4" />
          {labels.system}
          {theme === 'system' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
