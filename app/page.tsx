import { WOODCRAFT_SIGNIN } from "@/lib/constants/routes";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    redirect(WOODCRAFT_SIGNIN)
  );
}
