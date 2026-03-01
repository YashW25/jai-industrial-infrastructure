import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdminTable } from '@/components/admin/AdminTable';
import { FormModal } from '@/components/admin/FormModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller } from 'react-hook-form';
import { useAdminFetch, useAdminCreate, useAdminUpdate, useAdminDelete } from '@/hooks/useAdminData';
import type { AboutFeature } from '@/types/database';

const FeaturesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutFeature | null>(null);

  const { data = [], isLoading } = useAdminFetch<AboutFeature>('about_features', 'admin-features');
  const createMutation = useAdminCreate<AboutFeature>('about_features', 'admin-features');
  const updateMutation = useAdminUpdate<AboutFeature>('about_features', 'admin-features');
  const deleteMutation = useAdminDelete('about_features', 'admin-features');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<Partial<AboutFeature>>();

  const openModal = (item?: AboutFeature) => {
    setEditingItem(item || null);
    reset(item || { title: '', description: '', icon: 'star', position: 0, is_active: true, status: 'draft' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    reset({});
  };

  const onSubmit = async (formData: Partial<AboutFeature>) => {
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
    { key: 'title', label: 'Title' },
    {
      key: 'description', label: 'Description', render: (item: AboutFeature) => (
        <span className="line-clamp-2 max-w-sm">{item.description}</span>
      )
    },
    { key: 'icon', label: 'Icon' },
    {
      key: 'status', label: 'Status', render: (item: AboutFeature) => (
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
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">About Features</h1>
        <p className="text-muted-foreground">Manage "Why Choose Us" features</p>
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
        title={editingItem ? 'Edit Feature' : 'Add Feature'}
        open={modalOpen}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register('description', { required: 'Description is required' })} rows={3} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (lucide name)</Label>
              <Input id="icon" {...register('icon')} placeholder="award, star, etc." />
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

export default FeaturesPage;
