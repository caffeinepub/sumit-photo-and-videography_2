import { useState } from 'react';
import { useGetAllPackages, useSitewideContent } from '../hooks/useQueries';
import PackageCard from '../components/PackageCard';
import BookingForm from '../components/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BookingPage() {
  const { data: packages = [], isLoading } = useGetAllPackages();
  const { data: sitewideContent } = useSitewideContent();
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');

  const photoPackages = packages.filter((p) => !p.isVideo);
  const videoPackages = packages.filter((p) => p.isVideo);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-5xl font-bold text-center mb-4 text-foreground">
        Book Your Event
      </h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        {sitewideContent?.bookingIntro || "Choose from our carefully crafted packages and let us capture your special moments"}
      </p>

      {/* Packages Section */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-center mb-8 text-foreground">
          Our Packages
        </h2>
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading packages...</p>
          </div>
        ) : packages.length > 0 ? (
          <Tabs defaultValue="photography" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="photography">Photography</TabsTrigger>
              <TabsTrigger value="videography">Videography</TabsTrigger>
            </TabsList>
            <TabsContent value="photography">
              {photoPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photoPackages.map((pkg) => (
                    <PackageCard key={pkg.id} package={pkg} onSelect={setSelectedPackageId} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No photography packages available.</p>
              )}
            </TabsContent>
            <TabsContent value="videography">
              {videoPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoPackages.map((pkg) => (
                    <PackageCard key={pkg.id} package={pkg} onSelect={setSelectedPackageId} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No videography packages available.</p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center text-muted-foreground py-8">No packages available at the moment.</p>
        )}
      </section>

      {/* Booking Form Section */}
      <section className="bg-muted/20 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-center mb-8 text-foreground">
          Request a Booking
        </h2>
        <BookingForm preSelectedPackageId={selectedPackageId} />
      </section>
    </div>
  );
}
