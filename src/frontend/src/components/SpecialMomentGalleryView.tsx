import { SpecialMomentGallery, Photo } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import PhotoCard from './PhotoCard';
import { Calendar } from 'lucide-react';

interface SpecialMomentGalleryViewProps {
  gallery: SpecialMomentGallery;
  photos: Photo[];
  onClose: () => void;
}

export default function SpecialMomentGalleryView({ gallery, photos, onClose }: SpecialMomentGalleryViewProps) {
  const galleryPhotos = photos.filter(p => gallery.photoIds.includes(p.id));

  const formattedDate = new Date(gallery.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl">{gallery.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </DialogDescription>
          {gallery.description && (
            <p className="text-muted-foreground mt-2">{gallery.description}</p>
          )}
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No photos in this gallery.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
