import HeroSection from '../components/HeroSection';
import FeaturedGallery from '../components/FeaturedGallery';
import { Camera, Video } from 'lucide-react';
import { useHomepageContent, useSitewideContent, useGetVideos, useGetPhotos } from '../hooks/useQueries';

export default function HomePage() {
  const { data: homepageContent } = useHomepageContent();
  const { data: sitewideContent } = useSitewideContent();
  const { data: videos = [] } = useGetVideos();
  const { data: photos = [] } = useGetPhotos();

  return (
    <div>
      <HeroSection 
        title={homepageContent?.heroTitle}
        subtitle={homepageContent?.heroSubtitle}
        buttonText={homepageContent?.callOutButtonText}
        backgroundImage={homepageContent?.heroBackgroundImage}
      />

      {/* Services Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Our Services
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
            {sitewideContent?.servicesDescription || "We offer a range of photography and videography services tailored to your special day."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Photography Service Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: 'url(/assets/generated/photography-services.dim_800x600.png)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
              <div className="relative z-10 p-8 h-80 flex flex-col justify-end">
                <div className="bg-rose-gold/90 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-3">Photography</h3>
                <p className="text-white/90 text-base leading-relaxed">
                  Timeless moments captured with artistic precision. From intimate portraits to grand celebrations, 
                  we preserve your memories in stunning detail.
                </p>
              </div>
            </div>

            {/* Videography Service Card */}
            <div className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: 'url(/assets/generated/videography-services.dim_800x600.png)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
              <div className="relative z-10 p-8 h-80 flex flex-col justify-end">
                <div className="bg-rose-gold/90 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-3">Videography</h3>
                <p className="text-white/90 text-base leading-relaxed">
                  Cinematic storytelling that brings your day to life. Professional editing and 
                  creative direction to create films you'll treasure forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <FeaturedGallery videos={videos} photos={photos} />
    </div>
  );
}
