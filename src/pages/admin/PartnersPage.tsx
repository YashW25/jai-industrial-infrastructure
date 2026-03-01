import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminTable } from '@/components/admin/AdminTable';
import { FormModal } from '@/components/admin/FormModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminFetch, useAdminCreate, useAdminUpdate, useAdminDelete } from '@/hooks/useAdminData';
import type { Partner } from '@/types/database';

const PartnersPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);

  const { data = [], isLoading } = useAdminFetch<Partner>('partners', 'admin-partners');
  const createMutation = useAdminCreate<Partner>('partners', 'admin-partners');
  const updateMutation = useAdminUpdate<Partner>('partners', 'admin-partners');
  const deleteMutation = useAdminDelete('partners', 'admin-partners');

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<Partial<Partner>>();

  const openModal = (item?: Partner) => {
    setEditingItem(item || null);
    reset(item || { name: '', logo_url: '', website_url: '', position: 0, is_active: true, status: 'draft' });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    reset({});
  };

  const onSubmit = async (formData: Partial<Partner>) => {
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
    {
      key: 'logo_url', label: 'Logo', render: (item: Partner) => item.logo_url ? (
        <img src={item.logo_url} alt={item.name} className="w-16 h-10 object-contain rounded" />
      ) : '-'
    },
    { key: 'name', label: 'Name' },
    {
      key: 'website_url', label: 'Website', render: (item: Partner) => item.website_url ? (
        <a href={item.website_url} target="_blank" rel="noopener" className="text-primary hover:underline">{item.website_url}</a>
      ) : '-'
    },
    {
      key: 'status', label: 'Status', render: (item: Partner) => (
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
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Partners</h1>
        <p className="text-muted-foreground">Manage industry partners</p>
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
        title={editingItem ? 'Edit Partner' : 'Add Partner'}
        open={modalOpen}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Partner Name *</Label>
            <Input id="name" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Partner Logo</Label>
            <Controller
              name="logo_url"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value || ''}
                  onChange={field.onChange}
                  folder="partners"
                  fileName={editingItem?.name || ''}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" {...register('website_url')} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" type="number" {...register('position', { valueAsNumber: true })} />
            </div>
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

export default PartnersPage;
