"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Fuel, Settings } from "lucide-react";

interface VehicleCardProps {
  vehicle?: {
    id: string;
    name: string;
    type: string;
    image: string;
    pricePerDay?: number;
    rating: number;
    reviewCount: number;
    features: string[];
    fuelType: string;
    seats: number;
    transmission: string;
    available: boolean;
  };
  isLoggedIn?: boolean;
  onBook?: (vehicleId: string) => void;
  onViewDetails?: (vehicleId: string) => void;
}

const VehicleCard = ({
  vehicle = {
    id: "1",
    name: "Tesla Model 3",
    type: "Electric Sedan",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80",
    pricePerDay: 89,
    rating: 4.8,
    reviewCount: 124,
    features: [
      "GPS Navigation",
      "Bluetooth",
      "USB Charging",
      "Climate Control",
    ],
    fuelType: "Electric",
    seats: 5,
    transmission: "Automatic",
    available: true,
  },
  isLoggedIn = false,
  onBook = () => {},
  onViewDetails = () => {},
}: VehicleCardProps) => {
  return (
    <div className="bg-background">
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={vehicle.available ? "default" : "destructive"}>
                {vehicle.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <CardTitle className="text-lg mb-2">{vehicle.name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-3">{vehicle.type}</p>

          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{vehicle.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({vehicle.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{vehicle.seats} seats</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>

          {isLoggedIn && vehicle.pricePerDay && (
            <div className="text-2xl font-bold text-primary mb-2">
              ${vehicle.pricePerDay}
              <span className="text-sm font-normal text-muted-foreground">
                /day
              </span>
            </div>
          )}

          {!isLoggedIn && (
            <div className="text-sm text-muted-foreground mb-2">
              Sign in to view pricing
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(vehicle.id)}
          >
            View Details
          </Button>
          {isLoggedIn && vehicle.available && (
            <Button className="flex-1" onClick={() => onBook(vehicle.id)}>
              Book Now
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VehicleCard;
