import { TripBudget } from "@/components/trip-budget";

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main className="page-shell min-h-[70vh]"><TripBudget tripId={id} /></main>;
}
