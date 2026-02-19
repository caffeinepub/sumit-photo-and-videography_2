import { useState, useEffect } from 'react';
import { useUpdateHomepageContent } from '../../hooks/useQueries';
import { HomepageContent, ExternalBlob } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface HomepageContentFormProps {
  currentContent?: HomepageContent;
}

export default function HomepageContentForm({ currentContent }: HomepageContentFormProps) {
  const updateContent = useUpdateHomepageContent();

  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [callOutButtonText, setCallOutButtonText] = useState('');
  const [heroBackgroundImage, setHeroBackgroundImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (currentContent) {
      setHeroTitle(currentContent.heroTitle);
      setHeroSubtitle(currentContent.heroSubtitle);
      setCallOutButtonText(currentContent.callOutButtonText);
      setHeroBackgroundImage(currentContent.heroBackgroundImage);
    }
  }, [currentContent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!heroTitle.trim() || !heroSubtitle.trim() || !callOutButtonText.trim()) {
      toast.error('Please fill in all text fields');
      return;
    }

    try {
      let imageUrl = heroBackgroundImage;

      // Upload new image if selected
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
        imageUrl = blob.getDirectURL();
      }

      const newContent: HomepageContent = {
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        callOutButtonText: callOutButtonText.trim(),
        heroBackgroundImage: imageUrl,
      };

      await updateContent.mutateAsync(newContent);
      toast.success('Homepage content updated successfully!');
      setImageFile(null);
      setUploadProgress(0);

      // Reset file input
      const fileInput = document.getElementById('image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error updating homepage content:', error);
      toast.error('Failed to update content. Please try again.');
      setUploadProgress(0);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g., Capture Your Special Moments"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="e.g., Professional Wedding Photography & Videography"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callOutButtonText">Call-to-Action Button Text</Label>
              <Input
                id="callOutButtonText"
                value={callOutButtonText}
                onChange={(e) => setCallOutButtonText(e.target.value)}
                placeholder="e.g., Book Now"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-input">Hero Background Image (optional)</Label>
              <Input
                id="image-input"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to keep current image
              </p>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
              </div>
            )}

            <Button type="submit" disabled={updateContent.isPending} className="w-full">
              {updateContent.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: heroBackgroundImage 
                  ? `url(${heroBackgroundImage})` 
                  : 'url(/assets/generated/hero-wedding.dim_1920x1080.png)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">
                {heroTitle || 'Hero Title'}
              </h1>
              <p className="text-lg text-white/95 mb-6 drop-shadow-lg">
                {heroSubtitle || 'Hero Subtitle'}
              </p>
              <Button className="bg-rose-gold hover:bg-rose-gold/90 text-white">
                {callOutButtonText || 'Button Text'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
