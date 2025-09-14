"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import VehicleCard from "./VehicleCard";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

interface Vehicle {
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
}

interface VehicleCatalogProps {
  isLoggedIn?: boolean;
  onBook?: (vehicleId: string) => void;
  onViewDetails?: (vehicleId: string) => void;
}

const VehicleCatalog = ({
  isLoggedIn = false,
  onBook = () => {},
  onViewDetails = () => {},
}: VehicleCatalogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFuel, setSelectedFuel] = useState("all");
  const [selectedSeats, setSelectedSeats] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock vehicle data
  const vehicles: Vehicle[] = [
    {
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
    {
      id: "2",
      name: "BMW X5",
      type: "Luxury SUV",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
      pricePerDay: 125,
      rating: 4.6,
      reviewCount: 89,
      features: [
        "Leather Seats",
        "Sunroof",
        "Premium Audio",
        "All-Wheel Drive",
      ],
      fuelType: "Gasoline",
      seats: 7,
      transmission: "Automatic",
      available: true,
    },
    {
      id: "3",
      name: "Honda Civic",
      type: "Compact Car",
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80",
      pricePerDay: 45,
      rating: 4.3,
      reviewCount: 156,
      features: ["Fuel Efficient", "Bluetooth", "Backup Camera", "USB Ports"],
      fuelType: "Gasoline",
      seats: 5,
      transmission: "Manual",
      available: true,
    },
    {
      id: "4",
      name: "Ford Mustang",
      type: "Sports Car",
      image:
        "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=400&q=80",
      pricePerDay: 95,
      rating: 4.7,
      reviewCount: 203,
      features: [
        "Performance Engine",
        "Sport Suspension",
        "Premium Sound",
        "Racing Seats",
      ],
      fuelType: "Gasoline",
      seats: 4,
      transmission: "Manual",
      available: false,
    },
    {
      id: "5",
      name: "Toyota Prius",
      type: "Hybrid",
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80",
      pricePerDay: 55,
      rating: 4.4,
      reviewCount: 98,
      features: ["Hybrid Engine", "Eco Mode", "Touch Screen", "Keyless Entry"],
      fuelType: "Hybrid",
      seats: 5,
      transmission: "Automatic",
      available: true,
    },
    {
      id: "6",
      name: "Jeep Wrangler",
      type: "Off-Road SUV",
      image:
        "https://images.unsplash.com/photo-1606016159991-8b2d0d6e7c7d?w=400&q=80",
      pricePerDay: 78,
      rating: 4.5,
      reviewCount: 167,
      features: ["4WD", "Removable Doors", "Off-Road Tires", "Tow Package"],
      fuelType: "Gasoline",
      seats: 5,
      transmission: "Manual",
      available: true,
    },
  ];

  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      vehicle.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesFuel =
      selectedFuel === "all" ||
      vehicle.fuelType.toLowerCase() === selectedFuel.toLowerCase();
    const matchesSeats =
      selectedSeats === "all" || vehicle.seats.toString() === selectedSeats;

    return matchesSearch && matchesType && matchesFuel && matchesSeats;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedFuel("all");
    setSelectedSeats("all");
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vehicle Catalog</h1>
          <p className="text-muted-foreground">
            {isLoggedIn
              ? "Browse and book from our premium vehicle collection"
              : "Sign in to view pricing and book vehicles"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search vehicles by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>

            {(selectedType !== "all" ||
              selectedFuel !== "all" ||
              selectedSeats !== "all") && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Vehicle Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fuel Type
                </label>
                <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel Types</SelectItem>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Seats</label>
                <Select value={selectedSeats} onValueChange={setSelectedSeats}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Seats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Seats</SelectItem>
                    <SelectItem value="2">2 Seats</SelectItem>
                    <SelectItem value="4">4 Seats</SelectItem>
                    <SelectItem value="5">5 Seats</SelectItem>
                    <SelectItem value="7">7+ Seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>

          {/* Active Filters */}
          <div className="flex gap-2">
            {selectedType !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedType("all")}
              >
                {selectedType} ×
              </Badge>
            )}
            {selectedFuel !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedFuel("all")}
              >
                {selectedFuel} ×
              </Badge>
            )}
            {selectedSeats !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedSeats("all")}
              >
                {selectedSeats} seats ×
              </Badge>
            )}
          </div>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isLoggedIn={isLoggedIn}
                onBook={onBook}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No vehicles found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCatalog;
