"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DeleteCarButtonProps {
  carId: string;
  onDeleted: (id: string) => void;
}

const DeleteCarButton = ({ carId, onDeleted }: DeleteCarButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.from("cars").delete().eq("id", carId);
    setLoading(false);
    setOpen(false);
    if (error) {
      setError(error.message);
    } else {
      onDeleted(carId);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)} disabled={loading}>
        {loading ? "Deleting..." : "Delete"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this car? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteCarButton;
