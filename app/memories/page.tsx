import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MemoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">Your Stadium Memories</h1>
          <p className="text-xl text-slate-600">
            Coming soon - Visualize and relive your favorite sports moments
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}