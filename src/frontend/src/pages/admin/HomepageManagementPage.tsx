import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HomepageContentForm from '../../components/admin/HomepageContentForm';
import { useHomepageContent } from '../../hooks/useQueries';

export default function HomepageManagementPage() {
  const navigate = useNavigate();
  const { data: content, isLoading } = useHomepageContent();

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
        <h1 className="font-serif text-4xl font-bold text-foreground">Homepage Content Management</h1>
        <p className="text-muted-foreground mt-2">
          Edit the hero section content displayed on your homepage
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      ) : (
        <HomepageContentForm currentContent={content} />
      )}
    </div>
  );
}
