import { useState } from 'react';
import { useCreatePackage, useUpdatePackage } from '../../hooks/useQueries';
import { Package } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface PackageFormProps {
  package?: Package;
  onSuccess: () => void;
}

export default function PackageForm({ package: pkg, onSuccess }: PackageFormProps) {
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();

  const [name, setName] = useState(pkg?.name || '');
  const [description, setDescription] = useState(pkg?.description || '');
  const [price, setPrice] = useState(pkg ? pkg.price.toString() : '');
  const [isVideo, setIsVideo] = useState(pkg?.isVideo || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const priceValue = BigInt(price);
      const details = {
        name: name.trim(),
        description: description.trim(),
        price: priceValue,
        isVideo,
      };

      if (pkg) {
        await updatePackage.mutateAsync({ id: pkg.id, details });
        toast.success('Package updated successfully');
      } else {
        await createPackage.mutateAsync(details);
        toast.success('Package created successfully');
      }

      setName('');
      setDescription('');
      setPrice('');
      setIsVideo(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pkg ? 'Edit Package' : 'Create New Package'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Premium Wedding Package"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what's included in this package"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 2500"
              min="0"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isVideo" checked={isVideo} onCheckedChange={(checked) => setIsVideo(checked as boolean)} />
            <Label htmlFor="isVideo" className="cursor-pointer">
              This is a videography package
            </Label>
          </div>

          <Button type="submit" disabled={createPackage.isPending || updatePackage.isPending} className="w-full">
            {createPackage.isPending || updatePackage.isPending
              ? 'Saving...'
              : pkg
                ? 'Update Package'
                : 'Create Package'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
