import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryMetaForm from '../../components/admin/CategoryMetaForm';
import { useAllCategoryMeta } from '../../hooks/useQueries';

export default function CategoryManagementPage() {
  const navigate = useNavigate();
  const { data: categoryMeta, isLoading } = useAllCategoryMeta();

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
        <h1 className="font-serif text-4xl font-bold text-foreground">Category Management</h1>
        <p className="text-muted-foreground mt-2">
          Customize display names and descriptions for gallery categories
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      ) : (
        <CategoryMetaForm currentMeta={categoryMeta} />
      )}
    </div>
  );
}
