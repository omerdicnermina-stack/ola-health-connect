import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Pill, 
  Search, 
  MapPin, 
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function PatientPrescriptions() {
  const prescriptions = [
    {
      id: 1,
      medication: 'Ibuprofen 400mg',
      prescriber: 'Dr. Sarah Johnson',
      dateIssued: '2024-12-15',
      quantity: '30 tablets',
      dosage: 'Take 1 tablet every 6-8 hours as needed',
      refillsRemaining: 2,
      refillsTotal: 3,
      status: 'Ready for pickup',
      pharmacy: 'Hilton Hawaiian Village Pharmacy',
      address: '2005 Kalia Rd, Honolulu, HI 96815',
      lastFilled: '2024-12-15',
      nextRefillAvailable: '2024-12-29'
    },
    {
      id: 2,
      medication: 'Vitamin D3 2000IU',
      prescriber: 'Dr. Michael Brown',
      dateIssued: '2024-12-10',
      quantity: '90 capsules',
      dosage: 'Take 1 capsule daily with food',
      refillsRemaining: 3,
      refillsTotal: 3,
      status: 'Delivered',
      pharmacy: 'Hilton Hawaiian Village Pharmacy',
      address: '2005 Kalia Rd, Honolulu, HI 96815',
      lastFilled: '2024-12-10',
      nextRefillAvailable: '2025-03-10'
    },
    {
      id: 3,
      medication: 'Amoxicillin 500mg',
      prescriber: 'Dr. Emily Chen',
      dateIssued: '2024-11-20',
      quantity: '21 capsules',
      dosage: 'Take 1 capsule 3 times daily',
      refillsRemaining: 0,
      refillsTotal: 0,
      status: 'Completed',
      pharmacy: 'Hilton Hawaiian Village Pharmacy',
      address: '2005 Kalia Rd, Honolulu, HI 96815',
      lastFilled: '2024-11-20',
      nextRefillAvailable: null
    },
    {
      id: 4,
      medication: 'Lisinopril 10mg',
      prescriber: 'Dr. Sarah Johnson',
      dateIssued: '2024-11-15',
      quantity: '30 tablets',
      dosage: 'Take 1 tablet daily in the morning',
      refillsRemaining: 1,
      refillsTotal: 3,
      status: 'Refill needed',
      pharmacy: 'Hilton Hawaiian Village Pharmacy',
      address: '2005 Kalia Rd, Honolulu, HI 96815',
      lastFilled: '2024-11-15',
      nextRefillAvailable: '2024-12-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready for pickup': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Refill needed': return 'bg-orange-100 text-orange-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready for pickup': return <Clock className="h-4 w-4" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Refill needed': return <AlertCircle className="h-4 w-4" />;
      case 'Processing': return <RefreshCw className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const canRefill = (prescription: any) => {
    return prescription.refillsRemaining > 0 && prescription.status !== 'Completed';
  };

  const isRefillAvailable = (prescription: any) => {
    if (!prescription.nextRefillAvailable) return false;
    return new Date(prescription.nextRefillAvailable) <= new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Prescriptions</h1>
          <p className="text-muted-foreground">Manage your medications and refills</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search prescriptions..." 
          className="pl-10"
        />
      </div>

      {/* Active Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Active Prescriptions
          </CardTitle>
          <CardDescription>Your current medications and available refills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {prescriptions.filter(p => p.status !== 'Completed').map((prescription) => (
            <div key={prescription.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{prescription.medication}</h3>
                  <p className="text-muted-foreground">Prescribed by {prescription.prescriber}</p>
                </div>
                <Badge className={getStatusColor(prescription.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(prescription.status)}
                    <span>{prescription.status}</span>
                  </div>
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Dosage:</span>
                    <p className="text-muted-foreground">{prescription.dosage}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Quantity:</span>
                    <span className="text-muted-foreground ml-2">{prescription.quantity}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Refills:</span>
                    <span className="text-muted-foreground ml-2">
                      {prescription.refillsRemaining} of {prescription.refillsTotal} remaining
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Issued: {prescription.dateIssued}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{prescription.pharmacy}</p>
                      <p className="text-xs text-muted-foreground">{prescription.address}</p>
                    </div>
                  </div>
                  {prescription.nextRefillAvailable && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Next refill: {prescription.nextRefillAvailable}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {canRefill(prescription) && isRefillAvailable(prescription) && (
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Order Refill
                  </Button>
                )}
                {prescription.status === 'Ready for pickup' && (
                  <Button size="sm" variant="outline">
                    <Truck className="h-4 w-4 mr-2" />
                    Request Delivery to Room
                  </Button>
                )}
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" variant="outline">Contact Prescriber</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Prescription History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Prescription History
          </CardTitle>
          <CardDescription>Your completed prescriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptions.filter(p => p.status === 'Completed').map((prescription) => (
            <div key={prescription.id} className="border rounded-lg p-4 space-y-3 opacity-75">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{prescription.medication}</h4>
                  <p className="text-sm text-muted-foreground">Prescribed by {prescription.prescriber}</p>
                </div>
                <Badge className={getStatusColor(prescription.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(prescription.status)}
                    <span>{prescription.status}</span>
                  </div>
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Completed: {prescription.lastFilled}</div>
                <div>Quantity: {prescription.quantity}</div>
              </div>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}