import { Link } from '@tanstack/react-router';
import { 
  Package, 
  Calendar, 
  Image, 
  Video, 
  Home, 
  Tag, 
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile } from '@/hooks/useQueries';

export default function AdminDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  const adminSections = [
    {
      title: 'Order Management',
      description: 'View and manage customer bookings, approve requests, assign photographers, and update order status.',
      icon: Calendar,
      link: '/admin/orders',
      color: 'text-rose-gold',
    },
    {
      title: 'Videos & Photos',
      description: 'Upload and manage video and photo content for your portfolio galleries.',
      icon: Video,
      link: '/admin/content',
      color: 'text-champagne',
    },
    {
      title: 'Date Galleries',
      description: 'Create and organize special moment galleries by date with curated photo collections.',
      icon: Image,
      link: '/admin/special-moments',
      color: 'text-rose-gold',
    },
    {
      title: 'Package Management',
      description: 'Create and edit photography and videography packages with pricing and descriptions.',
      icon: Package,
      link: '/admin/packages',
      color: 'text-champagne',
    },
    {
      title: 'Homepage Content',
      description: 'Edit the hero section including title, subtitle, call-to-action button, and background image.',
      icon: Home,
      link: '/admin/homepage',
      color: 'text-rose-gold',
    },
    {
      title: 'Category Metadata',
      description: 'Customize display names and descriptions for gallery categories (Weddings, Pre-Wedding, Receptions).',
      icon: Tag,
      link: '/admin/categories',
      color: 'text-champagne',
    },
    {
      title: 'Sitewide Content',
      description: 'Manage sitewide text content including services description, booking intro, and footer text.',
      icon: FileText,
      link: '/admin/sitewide-content',
      color: 'text-rose-gold',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <LayoutDashboard className="w-10 h-10 text-rose-gold" />
          <h1 className="font-serif text-4xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Welcome back, {userProfile?.name || 'Admin'}! Manage your wedding photography business from here.
        </p>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.link} className="group hover:shadow-soft-lg transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Icon className={`w-8 h-8 ${section.color} group-hover:scale-110 transition-transform`} />
                </div>
                <CardTitle className="font-serif text-xl mt-4">{section.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={section.link}>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-rose-gold group-hover:text-white group-hover:border-rose-gold transition-colors"
                  >
                    Manage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats or Additional Info */}
      <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border">
        <h2 className="font-serif text-xl font-semibold mb-2 text-foreground">Quick Tips</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Start by uploading your best work to Videos & Photos to showcase your portfolio</li>
          <li>• Create packages with competitive pricing to attract customers</li>
          <li>• Regularly check Order Management for new booking requests</li>
          <li>• Keep your homepage content fresh and engaging</li>
        </ul>
      </div>
    </div>
  );
}
