import { useGetAllBookings, useGetAllPackages } from '../../hooks/useQueries';
import BookingTable from '../../components/admin/BookingTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingStatus } from '../../backend';

export default function OrderManagementPage() {
  const { data: bookings = [], isLoading } = useGetAllBookings();
  const { data: packages = [] } = useGetAllPackages();

  const pendingBookings = bookings.filter((b) => b.status === BookingStatus.pending);
  const confirmedBookings = bookings.filter((b) => b.status === BookingStatus.confirmed);
  const completedBookings = bookings.filter((b) => b.status === BookingStatus.completed);
  const rejectedBookings = bookings.filter((b) => b.status === BookingStatus.rejected);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold mb-8 text-foreground">Order Management</h1>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedBookings.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <BookingTable bookings={pendingBookings} packages={packages} />
          </TabsContent>
          <TabsContent value="confirmed">
            <BookingTable bookings={confirmedBookings} packages={packages} />
          </TabsContent>
          <TabsContent value="completed">
            <BookingTable bookings={completedBookings} packages={packages} />
          </TabsContent>
          <TabsContent value="rejected">
            <BookingTable bookings={rejectedBookings} packages={packages} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
