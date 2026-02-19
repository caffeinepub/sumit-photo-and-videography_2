import { Package } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Video } from 'lucide-react';

interface PackageCardProps {
  package: Package;
  onSelect: (packageId: string) => void;
}

export default function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  const formatPrice = (price: bigint) => {
    return `$${price.toString()}`;
  };

  return (
    <Card className="hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {pkg.isVideo ? (
            <Video className="w-5 h-5 text-rose-gold" />
          ) : (
            <Camera className="w-5 h-5 text-rose-gold" />
          )}
          <span className="text-sm text-muted-foreground">
            {pkg.isVideo ? 'Videography' : 'Photography'}
          </span>
        </div>
        <CardTitle className="font-serif text-2xl">{pkg.name}</CardTitle>
        <CardDescription className="text-lg font-semibold text-rose-gold">
          {formatPrice(pkg.price)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">{pkg.description}</p>
        <Button onClick={() => onSelect(pkg.id)} className="w-full">
          Select Package
        </Button>
      </CardContent>
    </Card>
  );
}
