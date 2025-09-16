export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 md:p-8 items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="w-full">{children}</main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
