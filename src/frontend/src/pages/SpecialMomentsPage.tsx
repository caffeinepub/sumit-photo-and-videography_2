import { useState } from 'react';
import { useGetPhotos, useSpecialMomentGalleries } from '../hooks/useQueries';
import CategoryFilter from '../components/CategoryFilter';
import PhotoCard from '../components/PhotoCard';
import SpecialMomentGalleryCard from '../components/SpecialMomentGalleryCard';
import SpecialMomentGalleryView from '../components/SpecialMomentGalleryView';
import { Category, SpecialMomentGallery } from '../backend';
import { Button } from '@/components/ui/button';

export default function SpecialMomentsPage() {
  const { data: photos = [], isLoading: photosLoading } = useGetPhotos();
  const { data: galleries = [], isLoading: galleriesLoading } = useSpecialMomentGalleries();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [viewMode, setViewMode] = useState<'category' | 'date'>('category');
  const [selectedGallery, setSelectedGallery] = useState<SpecialMomentGallery | null>(null);

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const isLoading = viewMode === 'category' ? photosLoading : galleriesLoading;

  return (
    <div className="min-h-screen relative">
      {/* Decorative background accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-64 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'url(/assets/generated/wedding-accent.dim_1200x400.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
        }}
      ></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-center mb-4 text-foreground">
          Special Moments
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
          A collection of beautiful memories captured with love and artistry
        </p>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            variant={viewMode === 'category' ? 'default' : 'outline'}
            onClick={() => setViewMode('category')}
          >
            By Category
          </Button>
          <Button
            variant={viewMode === 'date' ? 'default' : 'outline'}
            onClick={() => setViewMode('date')}
          >
            By Date
          </Button>
        </div>

        {viewMode === 'category' ? (
          <>
            <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading photos...</p>
              </div>
            ) : filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No photos found in this category.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading galleries...</p>
              </div>
            ) : galleries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <SpecialMomentGalleryCard 
                    key={gallery.id} 
                    gallery={gallery} 
                    photos={photos}
                    onClick={() => setSelectedGallery(gallery)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No date-organized galleries available yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedGallery && (
        <SpecialMomentGalleryView
          gallery={selectedGallery}
          photos={photos}
          onClose={() => setSelectedGallery(null)}
        />
      )}
    </div>
  );
}
