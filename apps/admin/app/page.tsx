import { redirect } from "next/navigation";

/** Admin entry point: always start at sign-in (it forwards to /dashboard/ecommerce). */
export default function Home() {
  redirect("/login");
}
