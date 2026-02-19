import { Booking, Package, BookingStatus } from '../../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import BookingActions from './BookingActions';

interface BookingTableProps {
  bookings: Booking[];
  packages: Package[];
}

export default function BookingTable({ bookings, packages }: BookingTableProps) {
  const getPackageName = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    return pkg ? pkg.name : 'Unknown Package';
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.pending:
        return <Badge variant="outline">Pending</Badge>;
      case BookingStatus.confirmed:
        return <Badge className="bg-green-600">Confirmed</Badge>;
      case BookingStatus.completed:
        return <Badge className="bg-blue-600">Completed</Badge>;
      case BookingStatus.rejected:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookings in this category.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Photographer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.customerName}</TableCell>
              <TableCell>{booking.customerEmail}</TableCell>
              <TableCell>{getPackageName(booking.packageId)}</TableCell>
              <TableCell>{booking.eventDate}</TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell>
                {booking.assignedPhotographer
                  ? booking.assignedPhotographer.toString().slice(0, 8) + '...'
                  : 'Not assigned'}
              </TableCell>
              <TableCell className="text-right">
                <BookingActions booking={booking} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
