/**
 * Admin - Manage Leads
 * Lead pipeline management — reads from real Supabase leads table
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Phone,
  Mail,
  Filter,
  Search,
  ChevronRight,
  Loader2,
  MessageCircle,
  UserCheck,
} from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  source: string | null;
  status: string;
  created_at: string;
  property_id: string | null;
  budget_min: number | null;
  budget_max: number | null;
  assigned_broker_id: string | null;
  broker_assigned_at: string | null;
  brokerName?: string;
}

interface BrokerOption {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  contacted: { label: 'Contacted', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  qualified: { label: 'Qualified', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  won: { label: 'Won', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  lost: { label: 'Lost', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const ManageLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [brokers, setBrokers] = useState<BrokerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [brokerModalLead, setBrokerModalLead] = useState<Lead | null>(null);
  const [brokerSearch, setBrokerSearch] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch leads, brokers (role='broker'), and profiles for broker names
      const [{ data: leadsData, error: leadsErr }, { data: brokerRoles }, { data: profiles }] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id').eq('role', 'broker' as any),
        supabase.from('profiles').select('user_id, full_name, email, phone'),
      ]);

      if (leadsErr) throw leadsErr;

      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      const brokerUserIds = new Set((brokerRoles || []).map(r => r.user_id));

      // Build broker options list
      const brokerList: BrokerOption[] = [];
      brokerUserIds.forEach(uid => {
        const p = profileMap.get(uid);
        if (p) {
          brokerList.push({ user_id: uid, full_name: p.full_name, email: p.email, phone: p.phone });
        }
      });
      setBrokers(brokerList);

      // Enrich leads with broker name
      setLeads(
        (leadsData || []).map(l => ({
          ...l,
          brokerName: l.assigned_broker_id
            ? (profileMap.get(l.assigned_broker_id)?.full_name || profileMap.get(l.assigned_broker_id)?.email || 'Unknown')
            : undefined,
        }))
      );
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.map((l) => (l.id === leadId ? { ...l, status } : l)));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status });
      }
      toast.success('Lead status updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update lead status');
    }
  };

  const assignBroker = async (lead: Lead, broker: BrokerOption) => {
    setAssigning(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          assigned_broker_id: broker.user_id,
          broker_assigned_at: new Date().toISOString(),
        } as any)
        .eq('id', lead.id);

      if (error) throw error;

      // Update local state
      const updatedLead = {
        ...lead,
        assigned_broker_id: broker.user_id,
        broker_assigned_at: new Date().toISOString(),
        brokerName: broker.full_name || broker.email || 'Unknown',
      };
      setLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
      if (selectedLead?.id === lead.id) setSelectedLead(updatedLead);

      toast.success(`Assigned to ${broker.full_name || broker.email}`);

      // Open WhatsApp
      if (broker.phone) {
        const phone = broker.phone.replace(/[^+\d]/g, '');
        const budget = lead.budget_min || lead.budget_max
          ? `${lead.budget_min ? `EGP ${lead.budget_min.toLocaleString()}` : ''}${lead.budget_min && lead.budget_max ? ' – ' : ''}${lead.budget_max ? `EGP ${lead.budget_max.toLocaleString()}` : ''}`
          : 'Not specified';
        const msg = [
          `New lead from Source Egypt:`,
          ``,
          `Name: ${lead.name}`,
          `Phone: ${lead.phone || 'N/A'}`,
          `Email: ${lead.email}`,
          `Budget: ${budget}`,
          lead.message ? `Notes: ${lead.message}` : '',
          `Date: ${new Date(lead.created_at).toLocaleDateString()}`,
          ``,
          `Please follow up and update status.`,
        ].filter(Boolean).join('\n');

        window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        toast.info('Broker has no phone number — WhatsApp could not be opened.');
      }

      setBrokerModalLead(null);
      setBrokerSearch('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign broker');
    } finally {
      setAssigning(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getLeadsByStatus = (status: LeadStatus) =>
    leads.filter((l) => l.status === status).length;

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as LeadStatus];
    if (!config) return <Badge variant="outline">{status}</Badge>;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredBrokers = brokers.filter(b => {
    const q = brokerSearch.toLowerCase();
    return (
      (b.full_name || '').toLowerCase().includes(q) ||
      (b.email || '').toLowerCase().includes(q) ||
      (b.phone || '').toLowerCase().includes(q)
    );
  });

  return (
    <PortalLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Lead Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage property inquiries and prospects
          </p>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(Object.keys(statusConfig) as LeadStatus[]).map((status) => (
            <Card key={status} className="glass-card border-border/30">
              <CardContent className="pt-4 pb-3">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">
                    {getLeadsByStatus(status)}
                  </p>
                  <Badge className={`mt-1 ${statusConfig[status].color}`}>
                    {statusConfig[status].label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="glass-card border-border/30">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-luxury"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as LeadStatus | 'all')}
              >
                <SelectTrigger className="w-[180px] input-luxury">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {(Object.keys(statusConfig) as LeadStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusConfig[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads List */}
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Leads ({filteredLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No leads found</div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                        {lead.brokerName && (
                          <p className="text-xs text-primary/80 flex items-center gap-1 mt-0.5">
                            <UserCheck className="w-3 h-3" />
                            Broker: {lead.brokerName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {lead.source && (
                        <Badge variant="outline" className="border-border/50 text-xs hidden sm:inline-flex">
                          {lead.source}
                        </Badge>
                      )}
                      {getStatusBadge(lead.status)}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Detail Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="glass-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Lead Details
              </DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{selectedLead.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{selectedLead.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <Badge variant="outline" className="border-border/50 mt-1">
                      {selectedLead.source || 'Unknown'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedLead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Broker</p>
                    {selectedLead.brokerName ? (
                      <p className="font-medium text-primary flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        {selectedLead.brokerName}
                      </p>
                    ) : (
                      <p className="text-muted-foreground text-sm">Not assigned</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                {selectedLead.message && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Message</p>
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                      <p className="text-foreground text-sm whitespace-pre-wrap">{selectedLead.message}</p>
                    </div>
                  </div>
                )}

                {/* Assign to Broker Button */}
                <div>
                  <Button
                    variant="outline"
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBrokerModalLead(selectedLead);
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {selectedLead.assigned_broker_id ? 'Reassign Broker (WhatsApp)' : 'Assign to Broker (WhatsApp)'}
                  </Button>
                </div>

                {/* Status Update */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(statusConfig) as LeadStatus[]).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedLead.status === status ? 'default' : 'outline'}
                        onClick={() => updateLeadStatus(selectedLead.id, status)}
                        className={
                          selectedLead.status === status
                            ? 'bg-primary text-primary-foreground'
                            : 'border-border/50'
                        }
                      >
                        {statusConfig[status].label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Broker Assignment Modal */}
        <Dialog open={!!brokerModalLead} onOpenChange={() => { setBrokerModalLead(null); setBrokerSearch(''); }}>
          <DialogContent className="glass-card border-border/50 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Assign to Broker
              </DialogTitle>
              <DialogDescription>
                Select a broker to assign this lead. WhatsApp will open with pre-filled details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={brokerSearch}
                  onChange={(e) => setBrokerSearch(e.target.value)}
                  placeholder="Search brokers..."
                  className="pl-10 input-luxury"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredBrokers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    {brokers.length === 0 ? 'No brokers found. Add users with the "broker" role first.' : 'No matching brokers.'}
                  </p>
                ) : (
                  filteredBrokers.map((broker) => (
                    <button
                      key={broker.user_id}
                      disabled={assigning}
                      onClick={() => brokerModalLead && assignBroker(brokerModalLead, broker)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">
                          {(broker.full_name || broker.email || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {broker.full_name || broker.email || 'Unknown'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {broker.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {broker.phone}
                            </span>
                          )}
                          {broker.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {broker.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
};

export default ManageLeads;
