import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backgroundImage?: string;
}

export default function HeroSection({ 
  title = "Capture Your Special Moments",
  subtitle = "Professional Wedding Photography & Videography",
  buttonText = "Book Now",
  backgroundImage
}: HeroSectionProps) {
  const navigate = useNavigate();

  const bgImageUrl = backgroundImage || '/assets/generated/hero-wedding.dim_1920x1080.png';

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      >
        {/* Enhanced gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-lg font-light">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-rose-gold hover:bg-rose-gold/90 text-white shadow-xl"
            onClick={() => navigate({ to: '/booking' })}
          >
            {buttonText}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl"
            onClick={() => navigate({ to: '/special-moments' })}
          >
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}
