import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    
    // Home page
    'home.title': 'Welcome to My Portfolio',
    'home.subtitle': 'Full Stack Developer & Designer',
    'home.description': 'I create beautiful and functional web applications with modern technologies.',
    'home.cta': 'View My Work',
    
    // About page
    'about.title': 'About Me',
    'about.intro': 'Hello! I\'m a passionate developer',
    'about.description': 'I have over 5 years of experience in web development, specializing in React, Node.js, and modern web technologies. I love creating user-friendly applications that solve real-world problems.',
    'about.skills': 'Skills',
    'about.experience': 'Experience',
    'about.experience.years': '5+ years in web development',
    
    // Projects page
    'projects.title': 'My Projects',
    'projects.description': 'Here are some of the projects I\'ve worked on',
    'projects.viewCode': 'View Code',
    'projects.viewLive': 'View Live',
    
    // Contact page
    'contact.title': 'Get In Touch',
    'contact.description': 'I\'d love to hear from you. Send me a message!',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.info': 'Contact Information',
    
    // Footer
    'footer.rights': 'All rights reserved',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    
    // Home page
    'home.title': 'Bienvenido a Mi Portafolio',
    'home.subtitle': 'Desarrollador Full Stack y Diseñador',
    'home.description': 'Creo aplicaciones web hermosas y funcionales con tecnologías modernas.',
    'home.cta': 'Ver Mi Trabajo',
    
    // About page
    'about.title': 'Acerca de Mí',
    'about.intro': '¡Hola! Soy un desarrollador apasionado',
    'about.description': 'Tengo más de 5 años de experiencia en desarrollo web, especializándome en React, Node.js y tecnologías web modernas. Me encanta crear aplicaciones fáciles de usar que resuelven problemas del mundo real.',
    'about.skills': 'Habilidades',
    'about.experience': 'Experiencia',
    'about.experience.years': '5+ años en desarrollo web',
    
    // Projects page
    'projects.title': 'Mis Proyectos',
    'projects.description': 'Aquí están algunos de los proyectos en los que he trabajado',
    'projects.viewCode': 'Ver Código',
    'projects.viewLive': 'Ver En Vivo',
    
    // Contact page
    'contact.title': 'Ponte en Contacto',
    'contact.description': 'Me encantaría saber de ti. ¡Envíame un mensaje!',
    'contact.name': 'Nombre',
    'contact.email': 'Correo Electrónico',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar Mensaje',
    'contact.info': 'Información de Contacto',
    
    // Footer
    'footer.rights': 'Todos los derechos reservados',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    
    // Home page
    'home.title': 'Bienvenue dans Mon Portfolio',
    'home.subtitle': 'Développeur Full Stack et Designer',
    'home.description': 'Je crée des applications web belles et fonctionnelles avec des technologies modernes.',
    'home.cta': 'Voir Mon Travail',
    
    // About page
    'about.title': 'À Propos de Moi',
    'about.intro': 'Salut! Je suis un développeur passionné',
    'about.description': 'J\'ai plus de 5 ans d\'expérience en développement web, spécialisé en React, Node.js et technologies web modernes. J\'adore créer des applications conviviales qui résolvent des problèmes du monde réel.',
    'about.skills': 'Compétences',
    'about.experience': 'Expérience',
    'about.experience.years': '5+ ans en développement web',
    
    // Projects page
    'projects.title': 'Mes Projets',
    'projects.description': 'Voici quelques-uns des projets sur lesquels j\'ai travaillé',
    'projects.viewCode': 'Voir le Code',
    'projects.viewLive': 'Voir en Direct',
    
    // Contact page
    'contact.title': 'Entrer en Contact',
    'contact.description': 'J\'aimerais avoir de vos nouvelles. Envoyez-moi un message!',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le Message',
    'contact.info': 'Informations de Contact',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};