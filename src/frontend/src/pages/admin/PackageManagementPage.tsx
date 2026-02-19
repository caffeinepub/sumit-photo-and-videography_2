import { useState } from 'react';
import { useGetAllPackages } from '../../hooks/useQueries';
import PackageForm from '../../components/admin/PackageForm';
import PackageList from '../../components/admin/PackageList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PackageManagementPage() {
  const { data: packages = [], isLoading } = useGetAllPackages();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">Package Management</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Package'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <PackageForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading packages...</p>
        </div>
      ) : (
        <PackageList packages={packages} />
      )}
    </div>
  );
}
