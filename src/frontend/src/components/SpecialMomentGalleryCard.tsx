import { SpecialMomentGallery, Photo } from '../backend';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SpecialMomentGalleryCardProps {
  gallery: SpecialMomentGallery;
  photos: Photo[];
  onClick: () => void;
}

export default function SpecialMomentGalleryCard({ gallery, photos, onClick }: SpecialMomentGalleryCardProps) {
  // Find the first photo in the gallery for preview
  const previewPhoto = photos.find(p => gallery.photoIds.includes(p.id));
  const previewImageUrl = previewPhoto?.blob.getDirectURL();

  const formattedDate = new Date(gallery.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden bg-muted">
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt={gallery.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No preview available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-rose-gold transition-colors">
          {gallery.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {gallery.description}
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          {gallery.photoIds.length} {gallery.photoIds.length === 1 ? 'photo' : 'photos'}
        </p>
      </CardContent>
    </Card>
  );
}
