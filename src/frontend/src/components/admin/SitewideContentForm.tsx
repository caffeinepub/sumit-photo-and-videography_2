import { useState, useEffect } from 'react';
import { useUpdateSitewideContent } from '../../hooks/useQueries';
import { SitewideContent } from '../../backend';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface SitewideContentFormProps {
  currentContent?: SitewideContent;
}

export default function SitewideContentForm({ currentContent }: SitewideContentFormProps) {
  const updateContent = useUpdateSitewideContent();

  const [servicesDescription, setServicesDescription] = useState('');
  const [bookingIntro, setBookingIntro] = useState('');
  const [footerContent, setFooterContent] = useState('');

  useEffect(() => {
    if (currentContent) {
      setServicesDescription(currentContent.servicesDescription);
      setBookingIntro(currentContent.bookingIntro);
      setFooterContent(currentContent.footerContent);
    }
  }, [currentContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!servicesDescription.trim() || !bookingIntro.trim() || !footerContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newContent: SitewideContent = {
        servicesDescription: servicesDescription.trim(),
        bookingIntro: bookingIntro.trim(),
        footerContent: footerContent.trim(),
      };

      await updateContent.mutateAsync(newContent);
      toast.success('Sitewide content updated successfully!');
    } catch (error) {
      console.error('Error updating sitewide content:', error);
      toast.error('Failed to update content. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Sitewide Text Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="servicesDescription">Services Section Description</Label>
            <Textarea
              id="servicesDescription"
              value={servicesDescription}
              onChange={(e) => setServicesDescription(e.target.value)}
              placeholder="Describe your photography and videography services"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Displayed on the homepage below the "Our Services" heading
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookingIntro">Booking Page Introduction</Label>
            <Textarea
              id="bookingIntro"
              value={bookingIntro}
              onChange={(e) => setBookingIntro(e.target.value)}
              placeholder="Welcome message for the booking page"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Displayed at the top of the booking page
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footerContent">Footer Content</Label>
            <Textarea
              id="footerContent"
              value={footerContent}
              onChange={(e) => setFooterContent(e.target.value)}
              placeholder="Footer description or tagline"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Displayed in the footer section of every page
            </p>
          </div>

          <Button type="submit" disabled={updateContent.isPending} className="w-full">
            {updateContent.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
