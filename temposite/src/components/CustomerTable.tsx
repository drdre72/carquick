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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Users,
  Edit,
  Trash2,
  Plus,
  Phone,
  MapPin,
  Car,
  Calendar,
  Star,
  Award,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  lastKnownLocation: string;
  currentRental?: string;
  totalRentals: number;
  memberSince: string;
  kwickCardsPoints: number;
  kwickCardsLevel: string;
  avatar: string;
  address: string;
  dateOfBirth: string;
  licenseNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  rentalHistory: {
    vehicleName: string;
    startDate: string;
    endDate: string;
    cost: number;
    rating: number;
  }[];
}

const CustomerTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // Mock customer data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      lastKnownLocation: "Downtown, NYC",
      currentRental: "Tesla Model 3",
      totalRentals: 12,
      memberSince: "2023-01-15",
      kwickCardsPoints: 2450,
      kwickCardsLevel: "Gold",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      address: "123 Main St, New York, NY 10001",
      dateOfBirth: "1985-06-15",
      licenseNumber: "NY123456789",
      emergencyContact: {
        name: "Jane Doe",
        phone: "+1 (555) 987-6543",
      },
      rentalHistory: [
        {
          vehicleName: "Tesla Model 3",
          startDate: "2024-01-10",
          endDate: "2024-01-15",
          cost: 445,
          rating: 5,
        },
        {
          vehicleName: "BMW X5",
          startDate: "2023-12-20",
          endDate: "2023-12-25",
          cost: 625,
          rating: 4,
        },
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 234-5678",
      status: "active",
      lastKnownLocation: "Airport Terminal, NYC",
      currentRental: undefined,
      totalRentals: 8,
      memberSince: "2023-03-22",
      kwickCardsPoints: 1200,
      kwickCardsLevel: "Silver",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      address: "456 Oak Ave, Brooklyn, NY 11201",
      dateOfBirth: "1990-09-22",
      licenseNumber: "NY987654321",
      emergencyContact: {
        name: "Bob Smith",
        phone: "+1 (555) 876-5432",
      },
      rentalHistory: [
        {
          vehicleName: "Honda Civic",
          startDate: "2024-01-05",
          endDate: "2024-01-08",
          cost: 135,
          rating: 5,
        },
      ],
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1 (555) 345-6789",
      status: "suspended",
      lastKnownLocation: "City Center, NYC",
      currentRental: undefined,
      totalRentals: 3,
      memberSince: "2023-11-10",
      kwickCardsPoints: 150,
      kwickCardsLevel: "Bronze",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      address: "789 Pine St, Manhattan, NY 10002",
      dateOfBirth: "1988-03-10",
      licenseNumber: "NY456789123",
      emergencyContact: {
        name: "Sarah Johnson",
        phone: "+1 (555) 765-4321",
      },
      rentalHistory: [
        {
          vehicleName: "Ford Mustang",
          startDate: "2023-12-01",
          endDate: "2023-12-03",
          cost: 190,
          rating: 3,
        },
      ],
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1 (555) 456-7890",
      status: "inactive",
      lastKnownLocation: "Uptown, NYC",
      currentRental: undefined,
      totalRentals: 15,
      memberSince: "2022-08-05",
      kwickCardsPoints: 3200,
      kwickCardsLevel: "Platinum",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      address: "321 Elm St, Queens, NY 11375",
      dateOfBirth: "1982-12-18",
      licenseNumber: "NY789123456",
      emergencyContact: {
        name: "Tom Wilson",
        phone: "+1 (555) 654-3210",
      },
      rentalHistory: [
        {
          vehicleName: "Toyota Camry",
          startDate: "2023-10-15",
          endDate: "2023-10-20",
          cost: 325,
          rating: 4,
        },
      ],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-yellow-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "gold":
        return "bg-yellow-500";
      case "silver":
        return "bg-gray-400";
      case "bronze":
        return "bg-orange-600";
      case "platinum":
        return "bg-purple-600";
      default:
        return "bg-blue-500";
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    customerId: string,
    newStatus: Customer["status"],
  ) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: newStatus }
          : customer,
      ),
    );
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
  };

  return (
    <div className="bg-background">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Management
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search customers..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Current Rental</TableHead>
                  <TableHead>Last Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={customer.avatar}
                                alt={customer.name}
                              />
                              <AvatarFallback>
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {customer.email}
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={customer.avatar}
                                  alt={customer.name}
                                />
                                <AvatarFallback>
                                  {customer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-xl">{customer.name}</div>
                                <div className="text-sm text-muted-foreground font-normal">
                                  Member since {customer.memberSince}
                                </div>
                              </div>
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Contact Information */}
                            <div>
                              <h3 className="font-semibold mb-3">
                                Contact Information
                              </h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Email:
                                  </span>
                                  <div>{customer.email}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Phone:
                                  </span>
                                  <div>{customer.phone}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Address:
                                  </span>
                                  <div>{customer.address}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Date of Birth:
                                  </span>
                                  <div>{customer.dateOfBirth}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    License Number:
                                  </span>
                                  <div>{customer.licenseNumber}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Emergency Contact:
                                  </span>
                                  <div>{customer.emergencyContact.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {customer.emergencyContact.phone}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Account Status */}
                            <div>
                              <h3 className="font-semibold mb-3">
                                Account Status
                              </h3>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                  <div className="text-2xl font-bold">
                                    {customer.totalRentals}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Total Rentals
                                  </div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                  <div className="text-2xl font-bold">
                                    {customer.kwickCardsPoints}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    KWICKCards Points
                                  </div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                  <div
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${getLevelColor(customer.kwickCardsLevel)}`}
                                  >
                                    <Award className="w-4 h-4" />
                                    {customer.kwickCardsLevel}
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Level
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Current Rental */}
                            <div>
                              <h3 className="font-semibold mb-3">
                                Current Rental
                              </h3>
                              {customer.currentRental ? (
                                <div className="p-4 border rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Car className="w-4 h-4" />
                                    <span className="font-medium">
                                      {customer.currentRental}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                      Last known location:{" "}
                                      {customer.lastKnownLocation}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4 border rounded-lg text-center text-muted-foreground">
                                  No active rental
                                </div>
                              )}
                            </div>

                            <Separator />

                            {/* Rental History */}
                            <div>
                              <h3 className="font-semibold mb-3">
                                Rental History
                              </h3>
                              <div className="space-y-3">
                                {customer.rentalHistory.map((rental, index) => (
                                  <div
                                    key={index}
                                    className="p-4 border rounded-lg"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="font-medium">
                                        {rental.vehicleName}
                                      </div>
                                      <div className="text-sm font-medium">
                                        ${rental.cost}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {rental.startDate} - {rental.endDate}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-3 h-3 ${
                                              i < rental.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      {customer.currentRental ? (
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          {customer.currentRental}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {customer.lastKnownLocation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusIndicator(customer.status)}`}
                        ></div>
                        <Select
                          value={customer.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              customer.id,
                              value as Customer["status"],
                            )
                          }
                        >
                          <SelectTrigger className="w-[100px]">
                            <Badge
                              variant={getStatusColor(customer.status)}
                              className="text-xs"
                            >
                              {customer.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCustomer(customer.id)}
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

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No customers found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerTable;
