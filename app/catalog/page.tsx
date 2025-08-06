import Header from "../components/Header";
import Footer from "../components/Footer";
import { getExperiences } from './actions';
import ExperienceCard from './ExperienceCard';
import AddExperienceForm from './AddExperienceForm';

const CatalogPage = async () => {
  const experiences = await getExperiences();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <AddExperienceForm />

        {/* Experiences List */}
        {experiences.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t-4 border-orange-600">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-4 text-slate-800">
                  Your Performance Log
                </h2>
                <p className="text-xl text-slate-600 font-medium">
                  You&apos;ve tracked <span className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">{experiences.length}</span> {experiences.length === 1 ? 'experience' : 'experiences'}!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-white border-t-4 border-blue-600">
            <div className="max-w-3xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 border-4 border-orange-300 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-slate-700 mb-4">
                Ready to Track Your Performance?
              </h3>
              <p className="text-xl text-slate-600 font-medium">
                Add your first experience above and start building your athletic achievement log!
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
              </div>
            </div>
          </section>
        )}

<<<<<<< HEAD
        {/* Experiences List */}
        {experiences.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Experiences ({experiences.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
=======
        {experiences.length === 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-white border-t-4 border-blue-600">
            <div className="max-w-3xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 border-4 border-orange-300 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-slate-700 mb-4">
                Ready to Track Your Performance?
              </h3>
              <p className="text-xl text-slate-600 font-medium">
                Add your first experience above and start building your athletic achievement log!
              </p>
>>>>>>> 8a9b193 (feat: major revision to ui/ux outside of home, added local storeage to store user forms now via nextjs form actions, added profile and list features but they are wip)
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CatalogPage;