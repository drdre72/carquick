"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Car,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: "rented" | "idle" | "maintenance" | "unlisted" | "listed";
  location: string;
  pricePerDay: number;
  lastRented: string;
  totalRentals: number;
  image: string;
  licensePlate: string;
  year: number;
  mileage: number;
  currentRenter?: string;
}

const VehicleTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock vehicle data
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      name: "Tesla Model 3",
      type: "Electric Sedan",
      status: "rented",
      location: "Downtown Location",
      pricePerDay: 89,
      lastRented: "2024-01-10",
      totalRentals: 45,
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&q=80",
      licensePlate: "ABC-123",
      year: 2023,
      mileage: 15000,
      currentRenter: "John Doe",
    },
    {
      id: "2",
      name: "BMW X5",
      type: "Luxury SUV",
      status: "idle",
      location: "Airport Terminal",
      pricePerDay: 125,
      lastRented: "2024-01-08",
      totalRentals: 32,
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&q=80",
      licensePlate: "XYZ-789",
      year: 2022,
      mileage: 22000,
    },
    {
      id: "3",
      name: "Honda Civic",
      type: "Compact Car",
      status: "maintenance",
      location: "Service Center",
      pricePerDay: 45,
      lastRented: "2024-01-05",
      totalRentals: 67,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=100&q=80",
      licensePlate: "DEF-456",
      year: 2021,
      mileage: 35000,
    },
    {
      id: "4",
      name: "Ford Mustang",
      type: "Sports Car",
      status: "listed",
      location: "City Center",
      pricePerDay: 95,
      lastRented: "2024-01-12",
      totalRentals: 28,
      image:
        "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=100&q=80",
      licensePlate: "GHI-789",
      year: 2023,
      mileage: 8000,
    },
    {
      id: "5",
      name: "Toyota Camry",
      type: "Sedan",
      status: "unlisted",
      location: "Warehouse",
      pricePerDay: 65,
      lastRented: "2023-12-20",
      totalRentals: 89,
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&q=80",
      licensePlate: "JKL-012",
      year: 2020,
      mileage: 45000,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rented":
        return "destructive";
      case "idle":
        return "default";
      case "maintenance":
        return "secondary";
      case "listed":
        return "outline";
      case "unlisted":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "rented":
        return "Rented";
      case "idle":
        return "Available";
      case "maintenance":
        return "Maintenance";
      case "listed":
        return "Listed";
      case "unlisted":
        return "Unlisted";
      default:
        return status;
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType =
      typeFilter === "all" ||
      vehicle.type.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (
    vehicleId: string,
    newStatus: Vehicle["status"],
  ) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              status: newStatus,
              currentRenter:
                newStatus === "rented" ? vehicle.currentRenter : undefined,
            }
          : vehicle,
      ),
    );
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
  };

  return (
    <div className="bg-background">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Management
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="idle">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="listed">Listed</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sports">Sports Car</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Current Renter</TableHead>
                  <TableHead>Last Rented</TableHead>
                  <TableHead>Total Rentals</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.licensePlate} • {vehicle.year}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={vehicle.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            vehicle.id,
                            value as Vehicle["status"],
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <Badge variant={getStatusColor(vehicle.status)}>
                            {getStatusText(vehicle.status)}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="idle">Available</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="listed">Listed</SelectItem>
                          <SelectItem value="unlisted">Unlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {vehicle.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        {vehicle.pricePerDay}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.currentRenter || "None"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {vehicle.lastRented}
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.totalRentals}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No vehicles found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleTable;
