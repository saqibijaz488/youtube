"use client";

import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import AddressFormDialog from "@/components/AddressFormDialog";
import Container from "@/components/Container";
import NoAccess from "@/components/NoAccess";
import PriceFormatter from "@/components/PriceFormatter";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Address } from "@/sanity.types";
import { backendClient } from "@/sanity/lib/backendClient";
import { urlFor } from "@/sanity/lib/image";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { CreditCard, Home, ShoppingBag, Truck, User, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const CheckoutPage = () => {
  const t = useTranslations("checkout");
  const cartT = useTranslations("cart");
  const {
    getTotalPrice,
    getSubTotalPrice,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/address');
      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log("User not authenticated");
          setAddresses([]);
          return;
        }
        throw new Error(result.error || 'Failed to fetch addresses');
      }
      
      setAddresses(result.addresses);
      const defaultAddress = result.addresses.find((addr: Address) => addr.default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (result.addresses.length > 0) {
        setSelectedAddress(result.addresses[0]);
      }
    } catch (error) {
      console.error("Addresses fetching error:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressSubmit = () => {
    if (!selectedAddress) {
      toast.error("Please select or add a delivery address");
      return;
    }
    setCurrentStep(2); // Move to payment step
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      // Validate address selection
      if (!selectedAddress) {
        toast.error(cartT("selectAddress"));
        setLoading(false);
        return;
      }

      // For COD orders, create order in Sanity and redirect to success page
      if (paymentMethod === "cod") {
        const orderNumber = crypto.randomUUID();
        
        try {
          // Create order in Sanity for COD using server-side API
          const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderNumber,
              customerName: user?.fullName ?? "Unknown",
              email: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
              clerkUserId: user?.id ?? "unknown",
              products: groupedItems,
              totalPrice: getTotalPrice(),
              address: selectedAddress,
              paymentMethod: "cod",
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to create order');
          }

          // Clear the cart after successful order
          const { resetCart } = useStore.getState();
          resetCart();

          // Redirect to success page with order details
          window.location.href = `/success?orderNumber=${orderNumber}&paymentMethod=cod&orderId=${result.order._id}`;
        } catch (error: any) {
          console.error("Error creating COD order:", error);
          toast.error(error.message || "Failed to create order. Please try again.");
        } finally {
          setLoading(false);
        }
        return;
      }

      // For Stripe payments
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };
      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
            1
          </div>
          <span className="ml-2 font-medium">Address</span>
        </div>
        <div className="w-8 h-1 bg-gray-300"></div>
        <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>
    </div>
  );

  const renderAddressStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        {addresses && addresses.length > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddress?._id === address._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{address.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.address}, {address.city}, {address.state} {address.zip}
                      </p>
                      {address.phone && (
                        <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                      )}
                    </div>
                    {address.default && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setIsAddressDialogOpen(true)}
              variant="outline"
              className="w-full"
            >
              Add New Address
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
            <p className="text-gray-600 mb-4">Add your first delivery address to continue</p>
            <Button onClick={() => setIsAddressDialogOpen(true)}>
              Add Address
            </Button>
          </div>
        )}
        
        {selectedAddress && (
          <div className="mt-6">
            <Button 
              onClick={handleAddressSubmit}
              className="w-full"
              disabled={!selectedAddress}
            >
              Continue to Payment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPaymentStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as "stripe" | "cod")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="w-4 h-4" />
                Pay with Card (Stripe)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                <Truck className="w-4 h-4" />
                Cash on Delivery (COD)
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "cod" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Pay when your order is delivered. No online payment required.
              </p>
            </div>
          )}

          {paymentMethod === "stripe" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Secure payment with Stripe. You'll be redirected to complete your payment.
              </p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex-1"
            >
              Back to Address
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Processing..." : paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-50 pb-20 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>{t("title")}</Title>
              </div>
              
              {renderStepIndicator()}
              
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  {currentStep === 1 && renderAddressStep()}
                  {currentStep === 2 && renderPaymentStep()}
                </div>

                {/* Order Summary - Always visible */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {groupedItems.map(({ product, quantity }) => (
                          <div key={product?._id} className="flex justify-between items-center border-b pb-4">
                            <div className="flex items-center gap-4">
                              {product?.images && (
                                <div className="border rounded-md overflow-hidden w-16 h-16">
                                  <Image
                                    src={urlFor(product?.images[0]).url()}
                                    alt={product?.name || "Product image"}
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{product?.name}</p>
                                <p className="text-sm text-gray-500">
                                  {cartT("variant")}: {product?.variant} | {cartT("quantity")}: {quantity}
                                </p>
                              </div>
                            </div>
                            <PriceFormatter amount={(product?.price as number) * quantity} />
                          </div>
                        ))}
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <PriceFormatter amount={getSubTotalPrice()} />
                          </div>
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <PriceFormatter amount={getTotalPrice()} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <AddressFormDialog
                isOpen={isAddressDialogOpen}
                onClose={() => {
                  setIsAddressDialogOpen(false);
                  setEditingAddress(null);
                }}
                onAddressAdded={() => {
                  fetchAddresses();
                  setIsAddressDialogOpen(false);
                  setEditingAddress(null);
                }}
                existingAddress={editingAddress}
              />
            </>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CheckoutPage;