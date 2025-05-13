import Home from "./home/page";
// import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <Home />
      </main>
      {/* <footer className="sticky bottom-0 row-start-4">
        <Footer />
      </footer> */}
    </div>
  );
}
