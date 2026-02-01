/**
 * Admin - Manage Inventory
 * CRUD for inventory records (admin-only)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw, Edit2, Save, X, TrendingUp, TrendingDown } from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Inventory, mockInventoryApi } from '@/lib/api';

const ManageInventory = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inventory>>({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await mockInventoryApi.list();
      setInventory(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch inventory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: Inventory) => {
    setEditingId(item.id);
    setEditData({
      availableUnits: item.availableUnits,
      reservedUnits: item.reservedUnits,
      soldUnits: item.soldUnits,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id: string) => {
    try {
      const updated = await mockInventoryApi.update(id, editData);
      setInventory(inventory.map((i) => (i.id === id ? updated : i)));
      setEditingId(null);
      setEditData({});
      toast({
        title: 'Success',
        description: 'Inventory updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update inventory',
        variant: 'destructive',
      });
    }
  };

  const getOccupancyRate = (item: Inventory) => {
    return Math.round(((item.soldUnits + item.reservedUnits) / item.totalUnits) * 100);
  };

  return (
    <PortalLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage property unit availability and stock levels
            </p>
          </div>
          <Button onClick={fetchInventory} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {inventory.reduce((sum, i) => sum + i.totalUnits, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {inventory.reduce((sum, i) => sum + i.availableUnits, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {inventory.reduce((sum, i) => sum + i.reservedUnits, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Reserved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {inventory.reduce((sum, i) => sum + i.soldUnits, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Inventory Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Available</TableHead>
                    <TableHead className="text-center">Reserved</TableHead>
                    <TableHead className="text-center">Sold</TableHead>
                    <TableHead className="text-center">Occupancy</TableHead>
                    <TableHead>Sync Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.propertyTitle}</TableCell>
                      <TableCell className="text-center">{item.totalUnits}</TableCell>
                      <TableCell className="text-center">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editData.availableUnits}
                            onChange={(e) =>
                              setEditData({ ...editData, availableUnits: parseInt(e.target.value) })
                            }
                            className="w-20 text-center"
                          />
                        ) : (
                          item.availableUnits
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editData.reservedUnits}
                            onChange={(e) =>
                              setEditData({ ...editData, reservedUnits: parseInt(e.target.value) })
                            }
                            className="w-20 text-center"
                          />
                        ) : (
                          item.reservedUnits
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editData.soldUnits}
                            onChange={(e) =>
                              setEditData({ ...editData, soldUnits: parseInt(e.target.value) })
                            }
                            className="w-20 text-center"
                          />
                        ) : (
                          item.soldUnits
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            getOccupancyRate(item) > 80
                              ? 'border-destructive/50 text-destructive'
                              : getOccupancyRate(item) > 50
                              ? 'border-warning/50 text-warning'
                              : 'border-success/50 text-success'
                          }
                        >
                          {getOccupancyRate(item)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border/50">
                          {item.syncSource || 'manual'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === item.id ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => saveEdit(item.id)}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default ManageInventory;
