import { Video, Photo } from '../../backend';
import { useDeleteVideo, useDeletePhoto, useSetVideoFeatured, useSetPhotoFeatured } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MediaGridProps {
  items: Video[] | Photo[];
  type: 'video' | 'photo';
}

export default function MediaGrid({ items, type }: MediaGridProps) {
  const deleteVideo = useDeleteVideo();
  const deletePhoto = useDeletePhoto();
  const setVideoFeatured = useSetVideoFeatured();
  const setPhotoFeatured = useSetPhotoFeatured();

  const handleDelete = async (id: string) => {
    try {
      if (type === 'video') {
        await deleteVideo.mutateAsync(id);
      } else {
        await deletePhoto.mutateAsync(id);
      }
      toast.success(`${type === 'video' ? 'Video' : 'Photo'} deleted successfully`);
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete. Please try again.');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      if (type === 'video') {
        await setVideoFeatured.mutateAsync({ id, isFeatured: !currentFeatured });
      } else {
        await setPhotoFeatured.mutateAsync({ id, isFeatured: !currentFeatured });
      }
      toast.success(`${currentFeatured ? 'Removed from' : 'Added to'} featured`);
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update. Please try again.');
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'weddings':
        return 'Weddings';
      case 'preWedding':
        return 'Pre-Wedding';
      case 'receptions':
        return 'Receptions';
      default:
        return category;
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {type === 'video' ? 'videos' : 'photos'} uploaded yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted">
              {type === 'video' ? (
                <video src={item.blob.getDirectURL()} className="w-full h-full object-cover" controls />
              ) : (
                <img src={item.blob.getDirectURL()} alt={item.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant="secondary">{getCategoryLabel(item.category)}</Badge>
                {item.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={item.isFeatured ? 'default' : 'outline'}
                  onClick={() => handleToggleFeatured(item.id, item.isFeatured)}
                  className="flex-1"
                >
                  <Star className="w-4 h-4 mr-1" />
                  {item.isFeatured ? 'Featured' : 'Feature'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the {type}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
