import { Video } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
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
    <Card className="overflow-hidden group hover:shadow-xl transition-shadow">
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
  );
}
