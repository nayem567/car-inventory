"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Car } from "@/types/supabase";
import DeleteCarButton from "@/components/delete-car-button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    async function fetchCars() {
      const { data, error } = await supabase.from("cars").select("*");
      if (error) {
        setError(error.message);
        console.error("Error fetching cars:", error);
      } else {
        setCars(data || []);
      }
      setLoading(false);
    }
    fetchCars();
  }, []);

  const handleCarDeleted = (id: string) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  if (loading) return <p className="text-center">Loading...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Car Inventory</h1>
      <Link href="/add-car">
        <Button>Add Car</Button>
      </Link>
      {cars.length === 0 ? (
        <p className="mt-4 text-center">No cars available.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {cars.map((car) => (
            <li
              key={car.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>
                {car.brand} {car.model} ({car.year}) - ${car.price} [
                {car.status}]
              </span>
              <div>
                <Link href={`/cars/edit/${car.id}`}>
                  <Button variant="outline" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <DeleteCarButton carId={car.id} onDeleted={handleCarDeleted} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
