import { redirect } from "next/navigation";

// Root redirects to the training module (first module)
export default function Home() {
  redirect("/training");
}
