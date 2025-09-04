import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function TicketUploadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
              Upload Your Ticket
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Upload a photo, screenshot, or PDF of your ticket. We’ll detect the teams, date, venue and match the game automatically.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Drag & drop your ticket</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">PNG, JPG, HEIC, or PDF up to 10MB</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button disabled className="bg-blue-600/70 text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed">
                  Choose File (Coming Soon)
                </button>
                <Link href="/assist" className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  Try Manual + AI Assist
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">We Extract</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Teams, date, venue, section/row/seat</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">You Review</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Confirm and add memories</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">We Save</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Game added to your collection</div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Ticket upload parsing is in development. Thanks for your patience!
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

