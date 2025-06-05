import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type AddressFormProps = {
  mode: "add" | "edit";
  id: string | null;
  initialData?: {
    addressType: string;
    fullAddress: string;
  };
  handleSubmit: (params: {
    id: string | null;
    type: string;
    address: string;
  }) => Promise<void>;
};

export function AddressForm({
  mode,
  id = null,
  initialData,
  handleSubmit,
}: AddressFormProps) {
  const [addressType, setAddressType] = useState(
    initialData?.addressType || ""
  );
  const [fullAddress, setFullAddress] = useState(
    initialData?.fullAddress || ""
  );
  const [formLoading, setFormLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    setFormLoading(true);
    e.preventDefault();
    if (!addressType) {
      alert("Please select an address type.");
      setFormLoading(false);
      return;
    }
    try {
      await handleSubmit({ id, type: addressType, address: fullAddress });
      setOpen(false);
      setAddressType("");
      setFullAddress("");
    } catch (error) {
      console.error("Error on submit", error);
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <span>{mode === "add" ? "Add Address" : "edit"}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add" : "Edit"} Address</DialogTitle>
            <DialogDescription>
              Make changes to your address here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Select
                name="type"
                value={addressType}
                onValueChange={(value) => setAddressType(value)}
                required
              >
                <Label htmlFor="type">Address Type</Label>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup id="type">
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Default">Default</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                name="fullAddress"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={formLoading}
              className={formLoading ? "cursor-wait" : "cursor-pointer"}
            >
              {formLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
