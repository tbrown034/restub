import Header from "../components/Header";
import Footer from "../components/Footer";
import { getExperiences } from './actions';
import ExperienceCard from './ExperienceCard';
import AddExperienceForm from './AddExperienceForm';

const CatalogPage = async () => {
  const experiences = await getExperiences();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1">
        <AddExperienceForm />

        {/* Experiences List */}
        {experiences.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 border-t-4 border-orange-600">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-extrabold mb-6 text-slate-800 dark:text-slate-100">
                  Your Performance Log
                </h2>
                <p className="text-2xl text-slate-600 dark:text-slate-300 font-medium">
                  You&apos;ve tracked <span className="font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-lg">{experiences.length}</span> {experiences.length === 1 ? 'experience' : 'experiences'}!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {experiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {experiences.length === 0 && (
          <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-white dark:bg-slate-800 border-t-4 border-orange-600">
            <div className="max-w-3xl mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-orange-100 dark:bg-orange-900/30 border-4 border-orange-300 dark:border-orange-600 rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-slate-700 dark:text-slate-200 mb-6">
                Ready to Track Your Games?
              </h3>
              <p className="text-2xl text-slate-600 dark:text-slate-300 font-medium">
                Add your first experience above and start building your sports memory collection!
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CatalogPage;