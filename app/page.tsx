import { WOODCRAFT_SIGNIN } from "@/routes/Route";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    redirect(WOODCRAFT_SIGNIN)
  );
}
