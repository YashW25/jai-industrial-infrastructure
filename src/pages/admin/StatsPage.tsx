import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller } from 'react-hook-form';
import { AdminTable } from '@/components/admin/AdminTable';
import { FormModal } from '@/components/admin/FormModal';
import { useAdminFetch, useAdminCreate, useAdminUpdate, useAdminDelete } from '@/hooks/useAdminData';
import type { Stat } from '@/types/database';

const StatsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Stat | null>(null);

  const { data = [], isLoading } = useAdminFetch<Stat>('stats', 'admin-stats');
  const createMutation = useAdminCreate<Stat>('stats', 'admin-stats');
  const updateMutation = useAdminUpdate<Stat>('stats', 'admin-stats');
  const deleteMutation = useAdminDelete('stats', 'admin-stats');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<Partial<Stat>>();

  const openModal = (item?: Stat) => {
    setEditingItem(item || null);
    reset(item || { label: '', value: '', icon: 'users', position: 0, is_active: true, status: 'draft' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    reset({});
  };

  const onSubmit = async (formData: Partial<Stat>) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ ...formData, id: editingItem.id });
    } else {
      await createMutation.mutateAsync(formData);
    }
    closeModal();
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateMutation.mutateAsync({ id, is_active: isActive });
  };

  const columns = [
    { key: 'label', label: 'Label' },
    { key: 'value', label: 'Value' },
    { key: 'icon', label: 'Icon' },
    {
      key: 'status', label: 'Status', render: (item: Stat) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
        ${item.status === 'published' ? 'bg-green-500/20 text-green-500' :
            item.status === 'archived' ? 'bg-gray-500/20 text-gray-500' :
              'bg-yellow-500/20 text-yellow-500'}`}>
          {item.status || 'draft'}
        </span>
      )
    },
    { key: 'position', label: 'Position' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Stats</h1>
        <p className="text-muted-foreground">Manage "Our Impact in Numbers" statistics</p>
      </div>

      <AdminTable
        title=""
        data={data}
        columns={columns}
        onAdd={() => openModal()}
        onEdit={openModal}
        onDelete={(id) => deleteMutation.mutate(id)}
        onToggleActive={handleToggleActive}
        isLoading={isLoading}
      />

      <FormModal
        title={editingItem ? 'Edit Stat' : 'Add Stat'}
        open={modalOpen}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="label">Label *</Label>
            <Input id="label" {...register('label', { required: 'Label is required' })} placeholder="e.g., Members" />
            {errors.label && <p className="text-sm text-destructive">{errors.label.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value *</Label>
            <Input id="value" {...register('value', { required: 'Value is required' })} placeholder="e.g., 500+" />
            {errors.value && <p className="text-sm text-destructive">{errors.value.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (lucide name)</Label>
              <Input id="icon" {...register('icon')} placeholder="users, calendar, award, etc." />
            </div>
            <div className="space-y-2">
              <Label>Publication Status</Label>
              <Controller
                name="status"
                control={control}
                defaultValue="draft"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" type="number" {...register('position', { valueAsNumber: true })} />
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default StatsPage;
