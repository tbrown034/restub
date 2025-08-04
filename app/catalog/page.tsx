'use client';

import { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Experience {
  id: string;
  category: string;
  sport?: string;
  who: string;
  what: string;
  when: string;
  where: string;
  notes: string;
  createdAt: Date;
}

const ExperienceCard = ({ experience, onEdit, onDelete }: { 
  experience: Experience; 
  onEdit: (experience: Experience) => void; 
  onDelete: (id: string) => void; 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      sports: 'from-green-500 to-emerald-600',
      concert: 'from-purple-500 to-violet-600',
      movie: 'from-red-500 to-rose-600',
      theater: 'from-yellow-500 to-amber-600',
      festival: 'from-pink-500 to-fuchsia-600',
      travel: 'from-blue-500 to-cyan-600',
      dining: 'from-orange-500 to-red-500',
      other: 'from-gray-500 to-slate-600'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(experience.category)}`}>
          {experience.category.charAt(0).toUpperCase() + experience.category.slice(1)}
          {experience.sport && ` • ${experience.sport}`}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(experience)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(experience.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.what}</h3>
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {experience.who}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(experience.when)}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {experience.where}
        </div>
      </div>
      
      {experience.notes && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">{experience.notes}</p>
        </div>
      )}
    </div>
  );
};

const CatalogPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    sport: '',
    who: '',
    what: '',
    when: '',
    where: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (formData: FormData) => {
    const newExperience: Experience = {
      id: editingExperience?.id || Date.now().toString(),
      category: formData.get('category') as string,
      sport: formData.get('sport') as string || undefined,
      who: formData.get('who') as string,
      what: formData.get('what') as string,
      when: formData.get('when') as string,
      where: formData.get('where') as string,
      notes: formData.get('notes') as string,
      createdAt: editingExperience?.createdAt || new Date()
    };

    if (editingExperience) {
      setExperiences(prev => prev.map(exp => exp.id === editingExperience.id ? newExperience : exp));
    } else {
      setExperiences(prev => [newExperience, ...prev]);
    }

    // Reset form
    setShowForm(false);
    setEditingExperience(null);
    setFormData({
      category: '',
      sport: '',
      who: '',
      what: '',
      when: '',
      where: '',
      notes: ''
    });
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      category: experience.category,
      sport: experience.sport || '',
      who: experience.who,
      what: experience.what,
      when: experience.when,
      where: experience.where,
      notes: experience.notes
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const handleManualAdd = () => {
    setEditingExperience(null);
    setFormData({
      category: '',
      sport: '',
      who: '',
      what: '',
      when: '',
      where: '',
      notes: ''
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section with matching design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/50 py-16 px-4 sm:px-6 lg:px-8">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            {/* Header */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
                Start Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Experience Journey
              </span>
            </h1>
            
            {/* Experience Message */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Capture and catalog your most memorable experiences. From concerts to sports events, 
              movies to special moments - never forget the details that matter.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                className="group relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-10 rounded-2xl text-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                onClick={() => alert('Automatic cataloging coming soon!')}
              >
                <span className="relative z-10 flex items-center justify-center">
                  ✨ Click to Automatically Add
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button 
                className="group relative bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 font-semibold py-4 px-10 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white"
                onClick={handleManualAdd}
              >
                <span className="flex items-center justify-center">
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Manually Add Experience
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Form Section */}
        {showForm && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-3xl p-8 shadow-xl border border-purple-100/50">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {editingExperience ? 'Edit Experience' : 'Add Your Experience'}
                </h2>
                
                <form action={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="sports">Sports Event</option>
                        <option value="concert">Concert</option>
                        <option value="movie">Movie</option>
                        <option value="theater">Theater</option>
                        <option value="festival">Festival</option>
                        <option value="travel">Travel</option>
                        <option value="dining">Dining Experience</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {formData.category === 'sports' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sport Type
                        </label>
                        <select 
                          name="sport"
                          value={formData.sport}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select sport</option>
                          <option value="football">Football</option>
                          <option value="basketball">Basketball</option>
                          <option value="baseball">Baseball</option>
                          <option value="hockey">Hockey</option>
                          <option value="soccer">Soccer</option>
                          <option value="tennis">Tennis</option>
                          <option value="golf">Golf</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Experience Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Who *
                      </label>
                      <input 
                        type="text"
                        name="who"
                        value={formData.who}
                        onChange={handleInputChange}
                        placeholder="Artist, team, people involved..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What *
                      </label>
                      <input 
                        type="text"
                        name="what"
                        value={formData.what}
                        onChange={handleInputChange}
                        placeholder="Event name, title, description..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        When *
                      </label>
                      <input 
                        type="date"
                        name="when"
                        value={formData.when}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Where *
                      </label>
                      <input 
                        type="text"
                        name="where"
                        value={formData.where}
                        onChange={handleInputChange}
                        placeholder="Venue, location, city..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes & Memories
                    </label>
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Share your thoughts, memories, and details about this experience..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center gap-4 pt-4">
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-12 rounded-2xl text-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                    >
                      {editingExperience ? 'Update Experience' : 'Save Experience'}
                    </button>
                    {editingExperience && (
                      <button 
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingExperience(null);
                        }}
                        className="bg-gray-500 text-white font-semibold py-4 px-12 rounded-2xl text-lg transition-all duration-300 hover:bg-gray-600 hover:scale-105"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

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
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CatalogPage;