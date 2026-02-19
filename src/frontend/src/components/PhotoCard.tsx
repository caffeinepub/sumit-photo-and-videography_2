import { Photo } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
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
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer">
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
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <img
          src={photo.blob.getDirectURL()}
          alt={photo.title}
          className="w-full h-auto"
        />
      </DialogContent>
    </Dialog>
  );
}
