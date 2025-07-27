import React from 'react';
import { User, Award, Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const skills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB',
    'Tailwind CSS', 'Next.js', 'Express.js', 'Docker', 'AWS', 'Git'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{t('about.title')}</h1>
                <p className="text-xl text-blue-100">{t('about.intro')}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* About Text */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Coffee className="w-6 h-6 mr-3 text-blue-600" />
                  About Me
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('about.description')}
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    {t('about.experience')}
                  </h3>
                  <p className="text-gray-600">{t('about.experience.years')}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t('about.skills')}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-4 py-3 rounded-lg text-center font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;