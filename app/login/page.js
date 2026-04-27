import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams(params || {}).toString();
  redirect(query ? `/signin?${query}` : "/signin");
}
