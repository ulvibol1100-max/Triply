import { AccountGate } from "@/components/account-gate";

export const metadata = { title: "Create an account — Triply" };

export default function RegisterPage() {
  return <AccountGate mode="register" />;
}
