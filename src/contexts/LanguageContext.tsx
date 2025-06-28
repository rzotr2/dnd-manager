
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uk: {
    // Authentication
    'auth.welcome': 'Вітаємо',
    'auth.login': 'Вхід',
    'auth.register': 'Реєстрація',
    'auth.email': 'Електронна пошта',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердьте пароль',
    'auth.loginButton': 'Увійти',
    'auth.registerButton': 'Зареєструватися',
    'auth.logout': 'Вийти',
    'auth.username': 'Ім\'я користувача',
    'auth.fullName': 'Повне ім\'я',
    
    // Main app
    'app.title': 'DnD Character Manager',
    'app.subtitle': 'Створюйте персонажів, кидайте кубики та керуйте своїми пригодами в світі D&D',
    'app.currentGame': 'Поточна гра',
    'app.active': 'Активна',
    'app.notSelected': 'Не обрано',
    'app.theme': 'Тема',
    
    // Tabs
    'tabs.characters': 'Персонажі',
    'tabs.dice': 'Кубики',
    'tabs.combat': 'Бій',
    'tabs.themes': 'Теми',
    
    // Errors
    'error.title': 'Помилка',
    'error.loginFailed': 'Не вдалося увійти в систему',
    'error.registerFailed': 'Не вдалося зареєструватися',
    'error.passwordsDontMatch': 'Паролі не співпадають',
    'error.fillAllFields': 'Заповніть всі поля',
    
    // Success
    'success.title': 'Успіх',
    'success.loginSuccess': 'Успішний вхід в систему',
    'success.registerSuccess': 'Успішна реєстрація',
  },
  en: {
    // Authentication
    'auth.welcome': 'Welcome',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.fullName': 'Full Name',
    
    // Main app
    'app.title': 'DnD Character Manager',
    'app.subtitle': 'Create characters, roll dice, and manage your D&D adventures',
    'app.currentGame': 'Current Game',
    'app.active': 'Active',
    'app.notSelected': 'Not Selected',
    'app.theme': 'Theme',
    
    // Tabs
    'tabs.characters': 'Characters',
    'tabs.dice': 'Dice',
    'tabs.combat': 'Combat',
    'tabs.themes': 'Themes',
    
    // Errors
    'error.title': 'Error',
    'error.loginFailed': 'Failed to sign in',
    'error.registerFailed': 'Failed to sign up',
    'error.passwordsDontMatch': 'Passwords do not match',
    'error.fillAllFields': 'Please fill all fields',
    
    // Success
    'success.title': 'Success',
    'success.loginSuccess': 'Successfully signed in',
    'success.registerSuccess': 'Successfully registered',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uk');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('dnd_language') as Language;
    if (savedLanguage && (savedLanguage === 'uk' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('dnd_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['uk']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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
