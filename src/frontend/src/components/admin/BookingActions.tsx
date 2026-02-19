import { Booking, BookingStatus } from '../../backend';
import {
  useApproveBooking,
  useRejectBooking,
  useUpdateBookingStatus,
  useAssignPhotographer,
} from '../../hooks/useQueries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Check, X, User } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { Principal } from '@dfinity/principal';

interface BookingActionsProps {
  booking: Booking;
}

export default function BookingActions({ booking }: BookingActionsProps) {
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();
  const updateStatus = useUpdateBookingStatus();
  const assignPhotographer = useAssignPhotographer();

  const [photographerPrincipal, setPhotographerPrincipal] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApprove = async () => {
    try {
      await approveBooking.mutateAsync(booking.id);
      toast.success('Booking approved successfully');
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Failed to approve booking');
    }
  };

  const handleReject = async () => {
    try {
      await rejectBooking.mutateAsync(booking.id);
      toast.success('Booking rejected');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    }
  };

  const handleStatusChange = async (status: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ id: booking.id, status });
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAssignPhotographer = async () => {
    try {
      const principal = Principal.fromText(photographerPrincipal);
      await assignPhotographer.mutateAsync({ id: booking.id, photographer: principal });
      toast.success('Photographer assigned successfully');
      setDialogOpen(false);
      setPhotographerPrincipal('');
    } catch (error) {
      console.error('Error assigning photographer:', error);
      toast.error('Invalid principal or assignment failed');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {booking.status === BookingStatus.pending && (
        <>
          <Button size="sm" variant="outline" onClick={handleApprove} disabled={approveBooking.isPending}>
            <Check className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleReject} disabled={rejectBooking.isPending}>
            <X className="w-4 h-4" />
          </Button>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <User className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Photographer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Photographer Principal ID</Label>
              <Input
                id="principal"
                value={photographerPrincipal}
                onChange={(e) => setPhotographerPrincipal(e.target.value)}
                placeholder="Enter principal ID"
              />
            </div>
            <Button onClick={handleAssignPhotographer} disabled={assignPhotographer.isPending} className="w-full">
              {assignPhotographer.isPending ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleStatusChange(BookingStatus.confirmed)}>
            Mark as Confirmed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(BookingStatus.completed)}>
            Mark as Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(BookingStatus.rejected)}>
            Mark as Rejected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
