import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import VideosPage from './pages/VideosPage';
import SpecialMomentsPage from './pages/SpecialMomentsPage';
import BookingPage from './pages/BookingPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import PackageManagementPage from './pages/admin/PackageManagementPage';
import SpecialMomentsManagementPage from './pages/admin/SpecialMomentsManagementPage';
import HomepageManagementPage from './pages/admin/HomepageManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import SitewideContentPage from './pages/admin/SitewideContentPage';
import Layout from './components/Layout';
import AdminGuard from './components/AdminGuard';
import ProfileSetup from './components/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/videos',
  component: VideosPage,
});

const specialMomentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/special-moments',
  component: SpecialMomentsPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking',
  component: BookingPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminDashboardPage />
    </AdminGuard>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <AdminGuard>
      <OrderManagementPage />
    </AdminGuard>
  ),
});

const adminContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/content',
  component: () => (
    <AdminGuard>
      <ContentManagementPage />
    </AdminGuard>
  ),
});

const adminPackagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/packages',
  component: () => (
    <AdminGuard>
      <PackageManagementPage />
    </AdminGuard>
  ),
});

const adminSpecialMomentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/special-moments',
  component: () => (
    <AdminGuard>
      <SpecialMomentsManagementPage />
    </AdminGuard>
  ),
});

const adminHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/homepage',
  component: () => (
    <AdminGuard>
      <HomepageManagementPage />
    </AdminGuard>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: () => (
    <AdminGuard>
      <CategoryManagementPage />
    </AdminGuard>
  ),
});

const adminSitewideContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/sitewide-content',
  component: () => (
    <AdminGuard>
      <SitewideContentPage />
    </AdminGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  videosRoute,
  specialMomentsRoute,
  bookingRoute,
  adminDashboardRoute,
  adminOrdersRoute,
  adminContentRoute,
  adminPackagesRoute,
  adminSpecialMomentsRoute,
  adminHomepageRoute,
  adminCategoriesRoute,
  adminSitewideContentRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <ProfileSetup />
      <Toaster />
    </ThemeProvider>
  );
}
