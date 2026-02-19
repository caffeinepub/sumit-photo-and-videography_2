import { useState, useEffect } from 'react';
import { useUpdateCategoryMeta } from '../../hooks/useQueries';
import { Category, GalleryCategoryMeta } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface CategoryMetaFormProps {
  currentMeta?: Array<[Category, GalleryCategoryMeta]>;
}

export default function CategoryMetaForm({ currentMeta = [] }: CategoryMetaFormProps) {
  const updateCategoryMeta = useUpdateCategoryMeta();

  const [weddingsName, setWeddingsName] = useState('Weddings');
  const [weddingsDesc, setWeddingsDesc] = useState('');
  const [preWeddingName, setPreWeddingName] = useState('Pre-Wedding');
  const [preWeddingDesc, setPreWeddingDesc] = useState('');
  const [receptionsName, setReceptionsName] = useState('Receptions');
  const [receptionsDesc, setReceptionsDesc] = useState('');

  useEffect(() => {
    if (currentMeta.length > 0) {
      const metaMap = new Map(currentMeta);
      
      const weddings = metaMap.get('weddings' as Category);
      if (weddings) {
        setWeddingsName(weddings.name);
        setWeddingsDesc(weddings.description);
      }

      const preWedding = metaMap.get('preWedding' as Category);
      if (preWedding) {
        setPreWeddingName(preWedding.name);
        setPreWeddingDesc(preWedding.description);
      }

      const receptions = metaMap.get('receptions' as Category);
      if (receptions) {
        setReceptionsName(receptions.name);
        setReceptionsDesc(receptions.description);
      }
    }
  }, [currentMeta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update all three categories
      await updateCategoryMeta.mutateAsync({
        category: 'weddings' as Category,
        meta: { name: weddingsName.trim(), description: weddingsDesc.trim() }
      });

      await updateCategoryMeta.mutateAsync({
        category: 'preWedding' as Category,
        meta: { name: preWeddingName.trim(), description: preWeddingDesc.trim() }
      });

      await updateCategoryMeta.mutateAsync({
        category: 'receptions' as Category,
        meta: { name: receptionsName.trim(), description: receptionsDesc.trim() }
      });

      toast.success('Category metadata updated successfully!');
    } catch (error) {
      console.error('Error updating category metadata:', error);
      toast.error('Failed to update categories. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Category Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weddings */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">Weddings Category</h3>
            <div className="space-y-2">
              <Label htmlFor="weddings-name">Display Name</Label>
              <Input
                id="weddings-name"
                value={weddingsName}
                onChange={(e) => setWeddingsName(e.target.value)}
                placeholder="Weddings"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weddings-desc">Description</Label>
              <Textarea
                id="weddings-desc"
                value={weddingsDesc}
                onChange={(e) => setWeddingsDesc(e.target.value)}
                placeholder="Description for weddings category"
                rows={2}
              />
            </div>
          </div>

          {/* Pre-Wedding */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">Pre-Wedding Category</h3>
            <div className="space-y-2">
              <Label htmlFor="prewedding-name">Display Name</Label>
              <Input
                id="prewedding-name"
                value={preWeddingName}
                onChange={(e) => setPreWeddingName(e.target.value)}
                placeholder="Pre-Wedding"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prewedding-desc">Description</Label>
              <Textarea
                id="prewedding-desc"
                value={preWeddingDesc}
                onChange={(e) => setPreWeddingDesc(e.target.value)}
                placeholder="Description for pre-wedding category"
                rows={2}
              />
            </div>
          </div>

          {/* Receptions */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">Receptions Category</h3>
            <div className="space-y-2">
              <Label htmlFor="receptions-name">Display Name</Label>
              <Input
                id="receptions-name"
                value={receptionsName}
                onChange={(e) => setReceptionsName(e.target.value)}
                placeholder="Receptions"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receptions-desc">Description</Label>
              <Textarea
                id="receptions-desc"
                value={receptionsDesc}
                onChange={(e) => setReceptionsDesc(e.target.value)}
                placeholder="Description for receptions category"
                rows={2}
              />
            </div>
          </div>

          <Button type="submit" disabled={updateCategoryMeta.isPending} className="w-full">
            {updateCategoryMeta.isPending ? 'Saving...' : 'Save All Categories'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
