import { TripPlanner } from "@/components/trip-planner";

export default async function PlannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main className="page-shell min-h-[70vh]"><TripPlanner tripId={id} /></main>;
}
