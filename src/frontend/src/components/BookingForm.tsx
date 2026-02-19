import { useState } from 'react';
import { useCreateBooking, useGetAllPackages } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface BookingFormProps {
  preSelectedPackageId?: string;
}

export default function BookingForm({ preSelectedPackageId }: BookingFormProps) {
  const { data: packages = [] } = useGetAllPackages();
  const createBooking = useCreateBooking();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [packageId, setPackageId] = useState(preSelectedPackageId || '');
  const [eventDate, setEventDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !packageId || !eventDate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createBooking.mutateAsync({
        packageId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        eventDate,
      });
      toast.success('Booking request submitted successfully! We will contact you soon.');
      setCustomerName('');
      setCustomerEmail('');
      setPackageId('');
      setEventDate('');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="package">Select Package</Label>
        <Select value={packageId} onValueChange={setPackageId} required>
          <SelectTrigger id="package">
            <SelectValue placeholder="Choose a package" />
          </SelectTrigger>
          <SelectContent>
            {packages.map((pkg) => (
              <SelectItem key={pkg.id} value={pkg.id}>
                {pkg.name} - ${pkg.price.toString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Event Date</Label>
        <Input
          id="date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={createBooking.isPending}>
        {createBooking.isPending ? 'Submitting...' : 'Submit Booking Request'}
      </Button>
    </form>
  );
}
