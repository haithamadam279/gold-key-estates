/**
 * Admin - Edit User Page
 * Full user edit form with validation
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Loader2,
  Save,
  Upload,
  Mail,
  Phone,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { User as UserType, UserRole, mockUsersApi } from '@/lib/api';
import { useApiAuth } from '@/contexts/ApiAuthContext';
import { z } from 'zod';

const updateUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['super_admin', 'admin', 'agent', 'sales_agent', 'client']),
  status: z.enum(['active', 'inactive', 'pending']),
});

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  agent: 'Agent',
  sales_agent: 'Sales Agent',
  client: 'Client',
};

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useApiAuth();
  
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'client' as UserRole,
    status: 'active' as 'active' | 'inactive' | 'pending',
    avatarUrl: '',
  });

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const userData = await mockUsersApi.getById(userId);
      if (userData) {
        setUser(userData);
        setFormData({
          fullName: userData.fullName || '',
          email: userData.email,
          phone: userData.phone || '',
          role: userData.role,
          status: userData.status,
          avatarUrl: userData.avatarUrl || '',
        });
      } else {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive',
        });
        navigate('/admin/users');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      toast({
        title: 'Error',
        description: 'Failed to load user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validate form
    const result = updateUserSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    // Prevent admin from disabling themselves
    if (id === currentUser?.id && formData.status === 'inactive') {
      toast({
        title: 'Error',
        description: 'You cannot disable your own account',
        variant: 'destructive',
      });
      return;
    }

    // Prevent admin from changing their own role
    if (id === currentUser?.id && formData.role !== currentUser.role) {
      toast({
        title: 'Error',
        description: 'You cannot change your own role',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await mockUsersApi.update(id!, {
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        role: formData.role,
        status: formData.status,
        avatarUrl: formData.avatarUrl || undefined,
      });

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      navigate('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <PortalLayout role="admin">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PortalLayout>
    );
  }

  if (!user) {
    return (
      <PortalLayout role="admin">
        <div className="text-center py-20">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </PortalLayout>
    );
  }

  const isSelf = id === currentUser?.id;

  return (
    <PortalLayout role="admin">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/users')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Edit User
            </h1>
            <p className="text-muted-foreground mt-1">
              Update user information and permissions
            </p>
          </div>
        </div>

        {/* Self-edit warning */}
        {isSelf && (
          <Alert className="border-warning/50 bg-warning/10">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <AlertDescription className="text-warning">
              You are editing your own account. Some changes are restricted.
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                User Information
              </CardTitle>
              <CardDescription>
                Update the user's profile and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 border-2 border-border/30">
                  <AvatarImage src={formData.avatarUrl} alt={formData.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {getInitials(formData.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button type="button" variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name *
                </Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="input-luxury mt-1"
                />
                {formErrors.fullName && (
                  <p className="text-sm text-destructive mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address *
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="input-luxury mt-1"
                  disabled // Email changes require verification
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email address cannot be changed here. Contact support if needed.
                </p>
                {formErrors.email && (
                  <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="input-luxury mt-1"
                />
              </div>

              {/* Role */}
              <div>
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Role *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                  disabled={isSelf} // Can't change own role
                >
                  <SelectTrigger className="input-luxury mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border/50">
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isSelf && (
                  <p className="text-xs text-muted-foreground mt-1">
                    You cannot change your own role
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label>Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive' | 'pending') => 
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isSelf} // Can't disable self
                >
                  <SelectTrigger className="input-luxury mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border/50">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {isSelf && (
                  <p className="text-xs text-muted-foreground mt-1">
                    You cannot disable your own account
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="btn-gold flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </PortalLayout>
  );
};

export default EditUser;
