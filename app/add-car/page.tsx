"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
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
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for form validation

const carSchema = z.object({
  brand: z.string().min(1, "Brand is required").max(50, "Brand is too long"),
  model: z.string().min(1, "Model is required").max(50, "Model is too long"),
  year: z
    .number()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  price: z.number().min(0, "Price must be non-negative"),
  status: z.enum(["available", "sold", "reserved"], {
    message: "Invalid status",
  }),
});

type CarForm = z.infer<typeof carSchema>;

const AddCar = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [router]);

  const form = useForm<CarForm>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      status: "available",
    },
  });
  const { register, handleSubmit, formState: { errors }, setValue } = form;

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Checking authentication...</div>;
  }

  const onSubmit = async (data: CarForm) => {
    setIsSubmitting(true);
    setError("");

    const { error } = await supabase.from("cars").insert([
      {
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        status: data.status,
      },
    ]);

    if (error) {
      setIsSubmitting(false);
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Add New Car</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register("brand")} placeholder="e.g., Toyota" />
          {errors.brand && (
            <p className="text-red-500 text-sm">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...register("model")} placeholder="e.g., Camry" />
          {errors.model && (
            <p className="text-red-500 text-sm">{errors.model.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            {...register("year", { valueAsNumber: true })}
            placeholder="e.g., 2020"
          />
          {errors.year && (
            <p className="text-red-500 text-sm">{errors.year.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="e.g., 25000"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) =>
              setValue("status", value as "sold" | "reserved" | "available")
            }
            defaultValue="available"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Car"}
        </Button>
      </form>
    </div>
  );
};

export default AddCar;
