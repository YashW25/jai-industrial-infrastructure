import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminTable } from '@/components/admin/AdminTable';
import { FormModal } from '@/components/admin/FormModal';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useTeamMembers } from '@/hooks/useSiteData';
import { useUpsertTeamMember, useDeleteTeamMember } from '@/hooks/useAdminData';
import type { TeamMember } from '@/types/database';

const TeamPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data = [], isLoading } = useTeamMembers();
  // We no longer have category DB table in new schema so using static categories for now or mapping from UI
  const categories = [{ name: 'core', label: 'Core Team' }, { name: 'leadership', label: 'Leadership' }];
  const upsertMutation = useUpsertTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<Partial<TeamMember>>();

  const openModal = (item?: TeamMember) => {
    setEditingItem(item || null);
    if (item) {
      reset(item);
    } else {
      reset({ name: '', role: '', position: 0, status: 'draft', bio: '', image_url: '', linkedin_url: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    reset({});
  };

  const onSubmit = async (payload: Partial<TeamMember>) => {
    if (editingItem) {
      await upsertMutation.mutateAsync({ ...payload, id: editingItem.id });
    } else {
      await upsertMutation.mutateAsync(payload as any);
    }
    closeModal();
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    // DB uses status string not is_active boolean
    await upsertMutation.mutateAsync({ id, status: isActive ? 'published' : 'archived' });
  };

  const columns = [
    {
      key: 'image_url', label: 'Photo', render: (item: TeamMember) => (
        item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        )
      )
    },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    {
      key: 'status', label: 'Status', render: (item: TeamMember) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
        ${item.status === 'published' ? 'bg-green-500/20 text-green-500' :
            item.status === 'archived' ? 'bg-gray-500/20 text-gray-500' :
              'bg-yellow-500/20 text-yellow-500'}`}>
          {item.status || 'draft'}
        </span>
      )
    },
    { key: 'position', label: 'Order' },
  ];

  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(data.map(m => m.role).filter(Boolean))];
    return roles.sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus || (!item.status && filterStatus === 'draft');
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Team Members</h1>
        <p className="text-muted-foreground">Manage team members</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-card border border-border">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AdminTable
        title=""
        data={filteredData}
        columns={columns}
        onAdd={() => openModal()}
        onEdit={openModal}
        onDelete={(id) => deleteMutation.mutate(id)}
        onToggleActive={handleToggleActive}
        isLoading={isLoading}
      />

      <FormModal
        title={editingItem ? 'Edit Team Member' : 'Add Team Member'}
        open={modalOpen}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <ImageUpload
              value={watch('image_url') || ''}
              onChange={(url) => setValue('image_url', url)}
              folder="team"
              fileName={watch('name') || ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input id="role" {...register('role', { required: 'Role is required' })} placeholder="President" />
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" {...register('bio')} rows={2} placeholder="Brief bio or description" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position Order</Label>
              <Input id="position" type="number" {...register('position', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" {...register('linkedin_url')} placeholder="https://linkedin.com/in/username" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" disabled={upsertMutation.isPending}>
              {upsertMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </FormModal>
    </div >
  );
};

export default TeamPage;