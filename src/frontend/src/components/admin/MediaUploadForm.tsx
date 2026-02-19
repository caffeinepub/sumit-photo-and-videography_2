import { useState } from 'react';
import { useAddVideo, useAddPhoto } from '../../hooks/useQueries';
import { ExternalBlob, Category } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface MediaUploadFormProps {
  type: 'video' | 'photo';
}

export default function MediaUploadForm({ type }: MediaUploadFormProps) {
  const addVideo = useAddVideo();
  const addPhoto = useAddPhoto();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('weddings' as Category);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !file) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      if (type === 'video') {
        await addVideo.mutateAsync({ title: title.trim(), category, blob });
      } else {
        await addPhoto.mutateAsync({ title: title.trim(), category, blob });
      }

      toast.success(`${type === 'video' ? 'Video' : 'Photo'} uploaded successfully!`);
      setTitle('');
      setCategory('weddings' as Category);
      setFile(null);
      setUploadProgress(0);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload. Please try again.');
      setUploadProgress(0);
    }
  };

  const isUploading = addVideo.isPending || addPhoto.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload {type === 'video' ? 'Video' : 'Photo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weddings">Weddings</SelectItem>
                <SelectItem value="preWedding">Pre-Wedding</SelectItem>
                <SelectItem value="receptions">Receptions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-input">File</Label>
            <Input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept={type === 'video' ? 'video/*' : 'image/*'}
              required
            />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
            </div>
          )}

          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? 'Uploading...' : `Upload ${type === 'video' ? 'Video' : 'Photo'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
