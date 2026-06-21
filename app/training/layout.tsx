import { Nav } from "@/components/nav";

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-5">{children}</main>
    </>
  );
}
