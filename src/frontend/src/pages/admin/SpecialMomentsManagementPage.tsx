import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpecialMomentGalleryForm from '../../components/admin/SpecialMomentGalleryForm';
import SpecialMomentGalleryList from '../../components/admin/SpecialMomentGalleryList';

export default function SpecialMomentsManagementPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/admin/orders' })}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">Special Moments Galleries</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage date-organized photo galleries
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Hide Form' : 'New Gallery'}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8">
          <SpecialMomentGalleryForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <SpecialMomentGalleryList />
    </div>
  );
}
