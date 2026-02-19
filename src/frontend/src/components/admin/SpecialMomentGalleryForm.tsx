import { useState } from 'react';
import { useCreateSpecialMomentGallery, useGetPhotos } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface SpecialMomentGalleryFormProps {
  onSuccess: () => void;
}

export default function SpecialMomentGalleryForm({ onSuccess }: SpecialMomentGalleryFormProps) {
  const createGallery = useCreateSpecialMomentGallery();
  const { data: photos = [] } = useGetPhotos();

  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);

  const handlePhotoToggle = (photoId: string) => {
    setSelectedPhotoIds(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (selectedPhotoIds.length === 0) {
      toast.error('Please select at least one photo');
      return;
    }

    try {
      await createGallery.mutateAsync({
        date,
        title: title.trim(),
        description: description.trim(),
        photoIds: selectedPhotoIds,
      });

      toast.success('Gallery created successfully!');
      setDate('');
      setTitle('');
      setDescription('');
      setSelectedPhotoIds([]);
      onSuccess();
    } catch (error) {
      console.error('Error creating gallery:', error);
      toast.error('Failed to create gallery. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Gallery Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Smith Wedding"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this special moment"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Select Photos ({selectedPhotoIds.length} selected)</Label>
            <ScrollArea className="h-64 border rounded-md p-4">
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <div className="aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-rose-gold transition-colors">
                        <img
                          src={photo.blob.getDirectURL()}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          id={`photo-${photo.id}`}
                          checked={selectedPhotoIds.includes(photo.id)}
                          onCheckedChange={() => handlePhotoToggle(photo.id)}
                        />
                        <Label
                          htmlFor={`photo-${photo.id}`}
                          className="text-xs cursor-pointer line-clamp-1"
                        >
                          {photo.title}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No photos available. Upload photos first in Content Management.
                </p>
              )}
            </ScrollArea>
          </div>

          <Button type="submit" disabled={createGallery.isPending} className="w-full">
            {createGallery.isPending ? 'Creating...' : 'Create Gallery'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
