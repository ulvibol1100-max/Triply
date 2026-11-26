"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TripActivity = {
  id: string;
  title: string;
  time: string;
  category: string;
  cost: number;
};

export type TripExpense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
};

export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  status: "Draft" | "Upcoming" | "Ongoing" | "Completed";
  activities: TripActivity[];
  expenses: TripExpense[];
};

type TripContextValue = {
  trips: Trip[];
  ready: boolean;
  createTrip: (input: Omit<Trip, "id" | "status" | "activities" | "expenses">) => string;
  deleteTrip: (id: string) => void;
  addActivity: (tripId: string, activity: Omit<TripActivity, "id">) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  addExpense: (tripId: string, expense: Omit<TripExpense, "id">) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
};

const STORAGE_KEY = "triply-planner-preview";
const TripContext = createContext<TripContextValue | null>(null);

function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== "object") return false;
  const trip = value as Record<string, unknown>;
  return typeof trip.id === "string"
    && typeof trip.title === "string"
    && typeof trip.destination === "string"
    && typeof trip.startDate === "string"
    && typeof trip.endDate === "string"
    && typeof trip.travelers === "number"
    && typeof trip.budget === "number"
    && ["Draft", "Upcoming", "Ongoing", "Completed"].includes(String(trip.status))
    && Array.isArray(trip.activities)
    && trip.activities.every((item) => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.time === "string" && typeof item.category === "string" && typeof item.cost === "number")
    && Array.isArray(trip.expenses)
    && trip.expenses.every((item) => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.category === "string" && typeof item.amount === "number" && typeof item.date === "string");
}

function persistTrips(trips: Trip[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error("Could not save trips to local storage.", error);
  }
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(isTrip)) setTrips(parsed);
        else throw new Error("Saved trip data has an unexpected format.");
      }
    } catch (error) {
      console.error("Could not read saved trips from local storage.", error);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) persistTrips(trips);
  }, [trips, ready]);

  const createTrip = useCallback((input: Omit<Trip, "id" | "status" | "activities" | "expenses">) => {
    const id = crypto.randomUUID();
    setTrips((current) => {
      return [...current, { ...input, id, status: "Upcoming" as const, activities: [], expenses: [] }];
    });
    return id;
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setTrips((current) => {
      return current.filter((trip) => trip.id !== id);
    });
  }, []);

  const addActivity = useCallback((tripId: string, activity: Omit<TripActivity, "id">) => {
    const id = crypto.randomUUID();
    setTrips((current) => {
      return current.map((trip) => trip.id === tripId ? { ...trip, activities: [...trip.activities, { ...activity, id }] } : trip);
    });
  }, []);

  const deleteActivity = useCallback((tripId: string, activityId: string) => {
    setTrips((current) => {
      return current.map((trip) => trip.id === tripId ? { ...trip, activities: trip.activities.filter((item) => item.id !== activityId) } : trip);
    });
  }, []);

  const addExpense = useCallback((tripId: string, expense: Omit<TripExpense, "id">) => {
    const id = crypto.randomUUID();
    setTrips((current) => {
      return current.map((trip) => trip.id === tripId ? { ...trip, expenses: [...trip.expenses, { ...expense, id }] } : trip);
    });
  }, []);

  const deleteExpense = useCallback((tripId: string, expenseId: string) => {
    setTrips((current) => {
      return current.map((trip) => trip.id === tripId ? { ...trip, expenses: trip.expenses.filter((item) => item.id !== expenseId) } : trip);
    });
  }, []);

  const value = useMemo(() => ({ trips, ready, createTrip, deleteTrip, addActivity, deleteActivity, addExpense, deleteExpense }), [trips, ready, createTrip, deleteTrip, addActivity, deleteActivity, addExpense, deleteExpense]);
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrips must be used inside TripProvider");
  return context;
}
