"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CreditCard,
  Check,
  ArrowLeft,
  Car,
  Shield,
  Info,
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: number;
  features: string[];
}

interface BookingFlowProps {
  vehicle?: Vehicle;
  onComplete?: (bookingData: any) => void;
  onCancel?: () => void;
}

const BookingFlow = ({
  vehicle = {
    id: "1",
    name: "Tesla Model 3",
    type: "Electric Sedan",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80",
    pricePerDay: 89,
    features: [
      "GPS Navigation",
      "Bluetooth",
      "USB Charging",
      "Climate Control",
    ],
  },
  onComplete = () => {},
  onCancel = () => {},
}: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickupDate: null as Date | null,
    returnDate: null as Date | null,
    pickupTime: "",
    returnTime: "",
    pickupLocation: "",
    returnLocation: "",
    insurance: "basic",
    extras: [] as string[],
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    phone: "",
  });

  const locations = [
    "Downtown Location - 123 Main St",
    "Airport Terminal - Terminal 1",
    "City Center - 456 Oak Ave",
    "Mall Location - Shopping Plaza",
    "Hotel District - 789 Pine St",
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const insuranceOptions = [
    {
      id: "basic",
      name: "Basic Coverage",
      price: 0,
      description: "Standard protection included",
    },
    {
      id: "premium",
      name: "Premium Coverage",
      price: 15,
      description: "Enhanced protection with lower deductible",
    },
    {
      id: "full",
      name: "Full Coverage",
      price: 25,
      description: "Complete protection with zero deductible",
    },
  ];

  const extraOptions = [
    { id: "gps", name: "GPS Navigation", price: 8 },
    { id: "child-seat", name: "Child Safety Seat", price: 12 },
    { id: "wifi", name: "Mobile WiFi Hotspot", price: 10 },
    { id: "roadside", name: "24/7 Roadside Assistance", price: 6 },
  ];

  const calculateDays = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 0;
    const diffTime = Math.abs(
      bookingData.returnDate.getTime() - bookingData.pickupDate.getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const basePrice = vehicle.pricePerDay * days;
    const insurancePrice =
      insuranceOptions.find((opt) => opt.id === bookingData.insurance)?.price ||
      0;
    const extrasPrice = bookingData.extras.reduce((total, extraId) => {
      const extra = extraOptions.find((opt) => opt.id === extraId);
      return total + (extra?.price || 0);
    }, 0);

    return basePrice + insurancePrice * days + extrasPrice * days;
  };

  const handleExtraToggle = (extraId: string) => {
    setBookingData((prev) => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter((id) => id !== extraId)
        : [...prev.extras, extraId],
    }));
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return (
          bookingData.pickupDate &&
          bookingData.returnDate &&
          bookingData.pickupTime &&
          bookingData.returnTime &&
          bookingData.pickupLocation &&
          bookingData.returnLocation
        );
      case 3:
        return true; // Insurance and extras are optional
      case 4:
        return (
          bookingData.paymentMethod &&
          bookingData.cardNumber &&
          bookingData.expiryDate &&
          bookingData.cvv &&
          bookingData.cardName &&
          bookingData.email &&
          bookingData.phone
        );
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Dates & Times</h2>
        <p className="text-muted-foreground">
          Choose your pickup and return schedule
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Pickup Date
          </Label>
          <Calendar
            mode="single"
            selected={bookingData.pickupDate || undefined}
            onSelect={(date) =>
              setBookingData((prev) => ({ ...prev, pickupDate: date || null }))
            }
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">
            Return Date
          </Label>
          <Calendar
            mode="single"
            selected={bookingData.returnDate || undefined}
            onSelect={(date) =>
              setBookingData((prev) => ({ ...prev, returnDate: date || null }))
            }
            disabled={(date) => date < (bookingData.pickupDate || new Date())}
            className="rounded-md border"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickup-time">Pickup Time</Label>
          <Select
            value={bookingData.pickupTime}
            onValueChange={(value) =>
              setBookingData((prev) => ({ ...prev, pickupTime: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="return-time">Return Time</Label>
          <Select
            value={bookingData.returnTime}
            onValueChange={(value) =>
              setBookingData((prev) => ({ ...prev, returnTime: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickup-location">Pickup Location</Label>
          <Select
            value={bookingData.pickupLocation}
            onValueChange={(value) =>
              setBookingData((prev) => ({ ...prev, pickupLocation: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="return-location">Return Location</Label>
          <Select
            value={bookingData.returnLocation}
            onValueChange={(value) =>
              setBookingData((prev) => ({ ...prev, returnLocation: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Insurance & Extras</h2>
        <p className="text-muted-foreground">
          Customize your rental experience
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Insurance Coverage
        </h3>
        <div className="space-y-3">
          {insuranceOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                bookingData.insurance === option.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() =>
                setBookingData((prev) => ({ ...prev, insurance: option.id }))
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      bookingData.insurance === option.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {bookingData.insurance === option.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{option.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {option.price === 0 ? "Included" : `+$${option.price}/day`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Optional Extras</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {extraOptions.map((extra) => (
            <div
              key={extra.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                bookingData.extras.includes(extra.id)
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => handleExtraToggle(extra.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border ${
                      bookingData.extras.includes(extra.id)
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {bookingData.extras.includes(extra.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-medium">{extra.name}</span>
                </div>
                <span className="font-semibold">+${extra.price}/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Payment & Contact</h2>
        <p className="text-muted-foreground">Complete your booking details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h3>

          <div className="space-y-3">
            {["credit", "debit", "paypal"].map((method) => (
              <div
                key={method}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  bookingData.paymentMethod === method
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() =>
                  setBookingData((prev) => ({ ...prev, paymentMethod: method }))
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      bookingData.paymentMethod === method
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {bookingData.paymentMethod === method && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="font-medium capitalize">{method} Card</span>
                </div>
              </div>
            ))}
          </div>

          {bookingData.paymentMethod &&
            bookingData.paymentMethod !== "paypal" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={bookingData.cardNumber}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        cardNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={bookingData.expiryDate}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={bookingData.cvv}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          cvv: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={bookingData.cardName}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        cardName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={bookingData.email}
              onChange={(e) =>
                setBookingData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={bookingData.phone}
              onChange={(e) =>
                setBookingData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          Your rental has been successfully booked
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{vehicle.name}</h3>
              <p className="text-sm text-muted-foreground">{vehicle.type}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pickup:</span>
              <span>
                {bookingData.pickupDate?.toLocaleDateString()} at{" "}
                {bookingData.pickupTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Return:</span>
              <span>
                {bookingData.returnDate?.toLocaleDateString()} at{" "}
                {bookingData.returnTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>{calculateDays()} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pickup Location:</span>
              <span className="text-right">{bookingData.pickupLocation}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount:</span>
            <span>${calculateTotal()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>A confirmation email has been sent to {bookingData.email}</p>
        <p>Booking reference: #KW{Date.now().toString().slice(-6)}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {currentStep > 1 && currentStep < 4 && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Book {vehicle.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step < currentStep
                        ? "bg-green-500 text-white"
                        : step === currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step < currentStep ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Your Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.type}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {vehicle.features.slice(0, 3).map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            {currentStep > 1 && currentStep < 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base rate ({calculateDays()} days)</span>
                      <span>${vehicle.pricePerDay * calculateDays()}</span>
                    </div>

                    {bookingData.insurance !== "basic" && (
                      <div className="flex justify-between">
                        <span>Insurance ({calculateDays()} days)</span>
                        <span>
                          +$
                          {(insuranceOptions.find(
                            (opt) => opt.id === bookingData.insurance,
                          )?.price || 0) * calculateDays()}
                        </span>
                      </div>
                    )}

                    {bookingData.extras.length > 0 && (
                      <div className="flex justify-between">
                        <span>Extras ({calculateDays()} days)</span>
                        <span>
                          +$
                          {bookingData.extras.reduce((total, extraId) => {
                            const extra = extraOptions.find(
                              (opt) => opt.id === extraId,
                            );
                            return total + (extra?.price || 0);
                          }, 0) * calculateDays()}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onCancel}>
              Cancel Booking
            </Button>

            <Button
              onClick={() => {
                if (currentStep === 3) {
                  setCurrentStep(4);
                  onComplete(bookingData);
                } else {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
              disabled={!canProceedToStep(currentStep + 1)}
            >
              {currentStep === 3 ? "Complete Booking" : "Continue"}
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex justify-center mt-8">
            <Button onClick={() => (window.location.href = "/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
