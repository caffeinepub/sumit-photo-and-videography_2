import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetVideos, useGetPhotos } from '../../hooks/useQueries';
import MediaUploadForm from '../../components/admin/MediaUploadForm';
import MediaGrid from '../../components/admin/MediaGrid';

export default function ContentManagementPage() {
  const { data: videos = [], isLoading: videosLoading } = useGetVideos();
  const { data: photos = [], isLoading: photosLoading } = useGetPhotos();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold mb-8 text-foreground">Content Management</h1>

      <Tabs defaultValue="videos">
        <TabsList className="mb-6">
          <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="photos">Photos ({photos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <div className="space-y-8">
            <MediaUploadForm type="video" />
            {videosLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading videos...</p>
              </div>
            ) : (
              <MediaGrid items={videos} type="video" />
            )}
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="space-y-8">
            <MediaUploadForm type="photo" />
            {photosLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading photos...</p>
              </div>
            ) : (
              <MediaGrid items={photos} type="photo" />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
