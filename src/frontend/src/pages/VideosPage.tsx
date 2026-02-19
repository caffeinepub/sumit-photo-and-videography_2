import { useState } from 'react';
import { useGetVideos } from '../hooks/useQueries';
import CategoryFilter from '../components/CategoryFilter';
import VideoCard from '../components/VideoCard';
import { Category } from '../backend';

export default function VideosPage() {
  const { data: videos = [], isLoading } = useGetVideos();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredVideos = activeCategory === 'all'
    ? videos
    : videos.filter((v) => v.category === activeCategory);

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
          Our Videos
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
          Experience the magic of your special moments through our cinematic videography
        </p>

        <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No videos found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
