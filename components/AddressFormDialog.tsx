"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Address } from "@/sanity.types";
import { backendClient } from "@/sanity/lib/backendClient";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface AddressFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
  existingAddress?: Address | null;
}

const AddressFormDialog: React.FC<AddressFormDialogProps> = ({
  isOpen,
  onClose,
  onAddressAdded,
  existingAddress,
}) => {
  const t = useTranslations("checkout");
  const cartT = useTranslations("cart");
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Address>>({
    name: existingAddress?.name || "",
    email: existingAddress?.email || "",
    phone: existingAddress?.phone || "",
    address: existingAddress?.address || "",
    city: existingAddress?.city || "",
    state: existingAddress?.state || "",
    zip: existingAddress?.zip || "",
    default: existingAddress?.default || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }
      
      // Validate phone number format if provided
      if (formData.phone && !/^\+?[0-9\s\-\(\)]{7,20}$/.test(formData.phone)) {
        toast.error("Please enter a valid phone number");
        setLoading(false);
        return;
      }

      // Validate state format (2 uppercase letters)
      if (!/^[A-Z]{2}$/.test(formData.state)) {
        toast.error("State must be 2 uppercase letters (e.g., NY, CA)");
        setLoading(false);
        return;
      }

      // Validate ZIP code format
      if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
        toast.error("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
        setLoading(false);
        return;
      }

      // Create or update the address using server-side API
      if (existingAddress?._id) {
        // Update existing address - for now, we'll create a new one
        // TODO: Add update endpoint
        toast.error("Address updates not implemented yet");
        setLoading(false);
        return;
      } else {
        // Create new address using server-side API
        const response = await fetch('/api/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            default: formData.default,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to save address');
        }

        toast.success("Address added successfully");
      }

      // Refresh the addresses list
      onAddressAdded();
      onClose();
    } catch (error: any) {
      console.error("Error saving address:", error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingAddress ? "Edit Address" : cartT("addNewAddress")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("addressName")}</Label>
            <Input
              id="name"
              name="name"
              placeholder="Home, Work, etc."
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="address">{t("address")}</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main St, Apt 4B"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Input
                id="city"
                name="city"
                placeholder="New York"
                value={formData.city || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="state">{t("state")}</Label>
              <Input
                id="state"
                name="state"
                placeholder="NY"
                maxLength={2}
                value={formData.state || ""}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setFormData({ ...formData, state: value });
                }}
                required
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="zip">{t("zipCode")}</Label>
            <Input
              id="zip"
              name="zip"
              placeholder="12345"
              value={formData.zip || ""}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="default"
              name="default"
              checked={formData.default || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-shop_dark_green focus:ring-shop_dark_green"
            />
            <Label htmlFor="default" className="font-normal">
              Set as default address
            </Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : existingAddress ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormDialog;