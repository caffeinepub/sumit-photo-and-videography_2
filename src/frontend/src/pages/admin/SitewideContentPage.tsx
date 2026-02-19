import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SitewideContentForm from '../../components/admin/SitewideContentForm';
import { useSitewideContent } from '../../hooks/useQueries';

export default function SitewideContentPage() {
  const navigate = useNavigate();
  const { data: content, isLoading } = useSitewideContent();

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
        <h1 className="font-serif text-4xl font-bold text-foreground">Sitewide Content Management</h1>
        <p className="text-muted-foreground mt-2">
          Edit text content displayed across your website
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      ) : (
        <SitewideContentForm currentContent={content} />
      )}
    </div>
  );
}
