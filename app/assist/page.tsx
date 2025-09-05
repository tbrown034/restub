'use client';

import Header from "../components/Header";
import Footer from "../components/Footer";
import AddExperienceForm from './AddExperienceForm';

const AssistPage = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        <AddExperienceForm />
      </main>
      <Footer />
    </div>
  );
};

export default AssistPage;