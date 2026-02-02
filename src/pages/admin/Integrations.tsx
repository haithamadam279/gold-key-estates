/**
 * Admin Integrations Settings
 * Manage GA4, GTM, Meta Pixel, and other tracking integrations
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plug,
  Save,
  Loader2,
  BarChart2,
  Code,
  Facebook,
  Music2,
  Linkedin,
  Eye,
} from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IntegrationSetting {
  id: string;
  key: string;
  value: string | null;
  enabled: boolean;
}

const INTEGRATIONS = [
  {
    key: 'ga4_measurement_id',
    name: 'Google Analytics 4',
    icon: BarChart2,
    placeholder: 'G-XXXXXXXXXX',
    description: 'Track website traffic and user behavior',
    color: 'text-orange-500',
  },
  {
    key: 'gtm_container_id',
    name: 'Google Tag Manager',
    icon: Code,
    placeholder: 'GTM-XXXXXXX',
    description: 'Manage all your tracking tags in one place',
    color: 'text-blue-500',
  },
  {
    key: 'meta_pixel_id',
    name: 'Meta Pixel',
    icon: Facebook,
    placeholder: '1234567890123456',
    description: 'Track conversions for Facebook & Instagram ads',
    color: 'text-blue-600',
  },
  {
    key: 'tiktok_pixel_id',
    name: 'TikTok Pixel',
    icon: Music2,
    placeholder: 'XXXXXXXXXXXXXXXXXX',
    description: 'Track conversions for TikTok ads',
    color: 'text-pink-500',
  },
  {
    key: 'linkedin_partner_id',
    name: 'LinkedIn Insight Tag',
    icon: Linkedin,
    placeholder: '1234567',
    description: 'Track conversions for LinkedIn ads',
    color: 'text-blue-700',
  },
  {
    key: 'clarity_project_id',
    name: 'Microsoft Clarity',
    icon: Eye,
    placeholder: 'abcdefghij',
    description: 'Heatmaps and session recordings',
    color: 'text-purple-500',
  },
];

const IntegrationsSettings = () => {
  const [settings, setSettings] = useState<IntegrationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('analytics_settings')
        .select('*');

      if (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load integration settings');
      } else {
        setSettings(data || []);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleValueChange = (key: string, value: string) => {
    setSettings(prev =>
      prev.map(s => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleToggle = (key: string, enabled: boolean) => {
    setSettings(prev =>
      prev.map(s => (s.key === key ? { ...s, enabled } : s))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      for (const setting of settings) {
        const { error } = await supabase
          .from('analytics_settings')
          .update({
            value: setting.value,
            enabled: setting.enabled,
          })
          .eq('key', setting.key);

        if (error) throw error;
      }

      toast.success('Integration settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const getSetting = (key: string) => {
    return settings.find(s => s.key === key);
  };

  if (isLoading) {
    return (
      <PortalLayout title="Integrations" subtitle="Manage tracking pixels and analytics">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      title="Integrations"
      subtitle="Manage tracking pixels and analytics integrations"
    >
      <div className="max-w-4xl space-y-6">
        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Plug className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Privacy-First Analytics</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All tracking scripts are loaded only after user consent. Scripts are lazy-loaded
                  for optimal performance and never track admin or client portal pages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Cards */}
        <div className="grid gap-4">
          {INTEGRATIONS.map((integration, index) => {
            const setting = getSetting(integration.key);
            const Icon = integration.icon;

            return (
              <motion.div
                key={integration.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card border-border/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${integration.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={setting?.enabled || false}
                        onCheckedChange={(checked) => handleToggle(integration.key, checked)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        {integration.key === 'ga4_measurement_id' && 'Measurement ID'}
                        {integration.key === 'gtm_container_id' && 'Container ID'}
                        {integration.key === 'meta_pixel_id' && 'Pixel ID'}
                        {integration.key === 'tiktok_pixel_id' && 'Pixel ID'}
                        {integration.key === 'linkedin_partner_id' && 'Partner ID'}
                        {integration.key === 'clarity_project_id' && 'Project ID'}
                      </Label>
                      <Input
                        value={setting?.value || ''}
                        onChange={(e) => handleValueChange(integration.key, e.target.value)}
                        placeholder={integration.placeholder}
                        className="input-luxury font-mono text-sm"
                        disabled={!setting?.enabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-gold gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default IntegrationsSettings;
