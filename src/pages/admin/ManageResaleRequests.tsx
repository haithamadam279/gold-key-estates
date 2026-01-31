import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Search, 
  Loader2, 
  Building2,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ResaleRequest {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  property: { id: string; title: string; location: string | null } | null;
  user: { full_name: string | null; email: string | null } | null;
}

const ManageResaleRequests = () => {
  const [requests, setRequests] = useState<ResaleRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState<ResaleRequest | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('resale_requests')
        .select(`
          id,
          status,
          notes,
          created_at,
          updated_at,
          property:properties(id, title, location)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user info for each request
      const requestsWithUsers = await Promise.all(
        (data || []).map(async (req) => {
          const { data: reqData } = await supabase
            .from('resale_requests')
            .select('user_id')
            .eq('id', req.id)
            .single();
          
          if (reqData?.user_id) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('user_id', reqData.user_id)
              .maybeSingle();
            return { ...req, user: userData };
          }
          return { ...req, user: null };
        })
      );

      setRequests(requestsWithUsers);
    } catch (err) {
      console.error('Error fetching requests:', err);
      toast.error('Failed to load resale requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenEdit = (request: ResaleRequest) => {
    setEditingRequest(request);
    setNewStatus(request.status);
    setNotes(request.notes || '');
  };

  const handleSave = async () => {
    if (!editingRequest) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('resale_requests')
        .update({
          status: newStatus,
          notes: notes || null,
        })
        .eq('id', editingRequest.id);

      if (error) throw error;

      toast.success('Request updated successfully');
      setEditingRequest(null);
      fetchRequests();
    } catch (err) {
      console.error('Error updating request:', err);
      toast.error('Failed to update request');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/20 text-success border-success/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Rejected</Badge>;
      case 'in_review':
        return <Badge className="bg-primary/20 text-primary border-primary/30">In Review</Badge>;
      case 'completed':
        return <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">Completed</Badge>;
      default:
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
    }
  };

  const filteredRequests = requests.filter((req) => {
    const query = searchQuery.toLowerCase();
    return (
      req.property?.title.toLowerCase().includes(query) ||
      req.user?.full_name?.toLowerCase().includes(query) ||
      req.user?.email?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <PortalLayout title="Resale Requests" subtitle="Review and manage resale requests">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Resale Requests" subtitle="Review and manage resale requests">
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests..."
            className="input-luxury pl-12"
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRequest} onOpenChange={(open) => !open && setEditingRequest(null)}>
        <DialogContent className="glass-card border-border/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Update Request</DialogTitle>
            <DialogDescription>
              Update the status and add notes for this resale request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="input-luxury mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes (visible to client)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this request..."
                className="input-luxury mt-1 min-h-24"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full btn-gold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Request'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 border border-border/20 text-center"
        >
          <RefreshCw className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No Resale Requests
          </h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try a different search term' : 'No resale requests have been submitted yet'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 border border-border/20 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => handleOpenEdit(request)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  {/* Property */}
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {request.property?.title || 'Unknown Property'}
                    </span>
                  </div>

                  {/* User */}
                  {request.user && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{request.user.full_name || request.user.email}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(request.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Notes */}
                  {request.notes && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground pt-2 border-t border-border/20">
                      <MessageSquare className="w-3 h-3 mt-1" />
                      <span>{request.notes}</span>
                    </div>
                  )}
                </div>

                <div>
                  {getStatusBadge(request.status)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
};

export default ManageResaleRequests;
