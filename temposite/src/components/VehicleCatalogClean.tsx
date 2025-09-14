'use client';

import { useState, useEffect } from 'react';
import { WixDataService } from '@/services/wixData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  pricePerDay: number;
  image: string;
  available: boolean;
}

export default function VehicleCatalog() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await WixDataService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Vehicles</h1>
        
        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No vehicles available</p>
            <p className="text-sm text-muted-foreground">
              Connect to Wix Studio backend to load vehicle data
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{vehicle.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{vehicle.type}</p>
                  <p className="text-2xl font-bold mb-4">${vehicle.pricePerDay}/day</p>
                  <Button 
                    className="w-full" 
                    disabled={!vehicle.available}
                  >
                    {vehicle.available ? 'Book Now' : 'Unavailable'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}