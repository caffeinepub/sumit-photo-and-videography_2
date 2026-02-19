import { useSpecialMomentGalleries } from '../../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from 'lucide-react';

export default function SpecialMomentGalleryList() {
  const { data: galleries = [], isLoading } = useSpecialMomentGalleries();

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading galleries...</p>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-muted/20">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No galleries created yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Photos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galleries.map((gallery) => {
            const formattedDate = new Date(gallery.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <TableRow key={gallery.id}>
                <TableCell className="font-medium">{formattedDate}</TableCell>
                <TableCell>{gallery.title}</TableCell>
                <TableCell className="max-w-md truncate">{gallery.description}</TableCell>
                <TableCell className="text-right">{gallery.photoIds.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
