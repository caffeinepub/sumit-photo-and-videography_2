import { Video, Photo } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

interface FeaturedGalleryProps {
  videos: Video[];
  photos: Photo[];
}

export default function FeaturedGallery({ videos, photos }: FeaturedGalleryProps) {
  const featuredVideos = videos.filter((v) => v.isFeatured).slice(0, 3);
  const featuredPhotos = photos.filter((p) => p.isFeatured).slice(0, 6);

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

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif text-4xl font-bold text-center mb-12 text-foreground">
              Featured Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-muted">
                      <video
                        src={video.blob.getDirectURL()}
                        className="w-full h-full object-cover"
                        controls
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black/60 text-white">
                          {getCategoryLabel(video.category)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-semibold text-foreground">{video.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Photos */}
        {featuredPhotos.length > 0 && (
          <div>
            <h2 className="font-serif text-4xl font-bold text-center mb-12 text-foreground">
              Featured Moments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      <img
                        src={photo.blob.getDirectURL()}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black/60 text-white">
                          {getCategoryLabel(photo.category)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-semibold text-foreground">{photo.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {featuredVideos.length === 0 && featuredPhotos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No featured content yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
