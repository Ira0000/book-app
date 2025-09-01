import Dashboard from "@/components/Dashboard/Dashboard";
import NavigationBar from "@/components/Layout/NavigationBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[10px] md:gap-4">
      <NavigationBar />
      <div className="flex flex-col gap-[10px] md:gap-4 lg:flex-row">
        <Dashboard />
        <div className="bg-grey-dark rounded-[30px] p-[20px] md:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
