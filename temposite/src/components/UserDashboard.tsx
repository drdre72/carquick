"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Car,
  CreditCard,
  Star,
  MapPin,
  Clock,
  Award,
  Settings,
  Bell,
  History,
} from "lucide-react";

interface UserDashboardProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    memberSince: string;
    kwickCardsPoints: number;
    kwickCardsLevel: string;
  };
}

const UserDashboard = ({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    memberSince: "January 2023",
    kwickCardsPoints: 2450,
    kwickCardsLevel: "Gold",
  },
}: UserDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for bookings
  const upcomingBookings = [
    {
      id: "1",
      vehicleName: "Tesla Model 3",
      vehicleImage:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&q=80",
      pickupDate: "2024-01-15",
      returnDate: "2024-01-18",
      pickupLocation: "Downtown Location",
      status: "confirmed",
      totalCost: 267,
    },
    {
      id: "2",
      vehicleName: "BMW X5",
      vehicleImage:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&q=80",
      pickupDate: "2024-01-25",
      returnDate: "2024-01-27",
      pickupLocation: "Airport Terminal",
      status: "pending",
      totalCost: 250,
    },
  ];

  const pastBookings = [
    {
      id: "3",
      vehicleName: "Honda Civic",
      vehicleImage:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&q=80",
      pickupDate: "2023-12-10",
      returnDate: "2023-12-12",
      pickupLocation: "City Center",
      status: "completed",
      totalCost: 90,
      rating: 5,
      review: "Great car, smooth ride!",
    },
    {
      id: "4",
      vehicleName: "Ford Mustang",
      vehicleImage:
        "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=200&q=80",
      pickupDate: "2023-11-20",
      returnDate: "2023-11-22",
      pickupLocation: "Downtown Location",
      status: "completed",
      totalCost: 190,
      rating: 4,
      review: "Amazing performance car!",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "secondary";
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

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user.name.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">
                  Member since {user.memberSince}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Bookings
                  </p>
                  <p className="text-2xl font-bold">
                    {upcomingBookings.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <History className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Rentals</p>
                  <p className="text-2xl font-bold">
                    {pastBookings.length + upcomingBookings.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 ${getLevelColor(user.kwickCardsLevel)} rounded-lg`}
                >
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    KWICKCards Level
                  </p>
                  <p className="text-2xl font-bold">{user.kwickCardsLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Points Balance
                  </p>
                  <p className="text-2xl font-bold">
                    {user.kwickCardsPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="loyalty">KWICKCards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Upcoming Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <img
                          src={booking.vehicleImage}
                          alt={booking.vehicleName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {booking.vehicleName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {booking.pickupDate} - {booking.returnDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {booking.pickupLocation}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <p className="text-lg font-bold mt-1">
                            ${booking.totalCost}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No upcoming bookings
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Booking confirmed for Tesla Model 3
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      2 hours ago
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Earned 50 KWICKCards points</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      1 day ago
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">
                      Review submitted for Honda Civic
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      3 days ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Rentals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={booking.vehicleImage}
                          alt={booking.vehicleName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold">
                            {booking.vehicleName}
                          </h4>
                          <Badge
                            variant={getStatusColor(booking.status)}
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pickup:</span>
                          <span>{booking.pickupDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Return:</span>
                          <span>{booking.returnDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Location:
                          </span>
                          <span>{booking.pickupLocation}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${booking.totalCost}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="destructive" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Past Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Rental History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={booking.vehicleImage}
                          alt={booking.vehicleName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {booking.vehicleName}
                          </h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < (booking.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline">{booking.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>
                            {booking.pickupDate} - {booking.returnDate}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total:</span>
                          <span>${booking.totalCost}</span>
                        </div>
                        {booking.review && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            &quot;{booking.review}&quot;
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                      >
                        Book Again
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="loyalty">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points Balance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className={`p-2 ${getLevelColor(user.kwickCardsLevel)} rounded-lg`}
                    >
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    KWICKCards {user.kwickCardsLevel}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold mb-2">
                      {user.kwickCardsPoints.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground">Available Points</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Next Level (Platinum):</span>
                      <span>500 points to go</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "83%" }}
                      ></div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Level Benefits:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 15% discount on all rentals</li>
                      <li>• Priority customer support</li>
                      <li>• Free upgrades when available</li>
                      <li>• Extended cancellation window</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Rewards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Free Weekend Rental</h4>
                      <Badge variant="secondary">1,500 pts</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get a free weekend rental for any compact or economy
                      vehicle
                    </p>
                    <Button size="sm" disabled={user.kwickCardsPoints < 1500}>
                      Redeem
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">$50 Rental Credit</h4>
                      <Badge variant="secondary">1,000 pts</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Apply $50 credit to your next rental booking
                    </p>
                    <Button size="sm">Redeem</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Premium Car Upgrade</h4>
                      <Badge variant="secondary">800 pts</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to premium category at no extra cost
                    </p>
                    <Button size="sm">Redeem</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
