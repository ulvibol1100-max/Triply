import { AccountGate } from "@/components/account-gate";

export const metadata = { title: "Sign in — Triply" };

export default function LoginPage() {
  return <AccountGate mode="login" />;
}
