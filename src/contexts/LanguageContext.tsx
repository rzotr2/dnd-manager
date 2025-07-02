
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uk: {
    // App
    'app.title': 'DnD Manager',
    'app.subtitle': 'Повний набір інструментів для керування вашими D&D кампаніями',
    'app.currentGame': 'Поточна гра',
    'app.active': 'Активна',
    'app.notSelected': 'Не вибрано',
    'app.theme': 'Тема',
    'app.language': 'Мова',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.create': 'Створити',
    'common.back': 'Назад',
    'common.close': 'Закрити',
    'common.confirm': 'Підтвердити',
    'common.name': 'Назва',
    'common.description': 'Опис',
    
    // Tabs
    'tabs.characters': 'Персонажі',
    'tabs.dice': 'Кубики',
    'tabs.combat': 'Бій',
    'tabs.themes': 'Теми',
    
    // Characters
    'characters.noGameSelected': 'Гру не вибрано',
    'characters.selectGame': 'Спочатку виберіть гру в бічному меню',
    
    // Auth
    'auth.login': 'Увійти',
    'auth.register': 'Зареєструватися',
    'auth.email': 'Електронна пошта',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердіть пароль',
    'auth.alreadyHaveAccount': 'Вже маєте акаунт?',
    'auth.noAccount': 'Немає акаунта?',
    'auth.signIn': 'Увійти',
    'auth.signUp': 'Зареєструватися',
    'auth.forgotPassword': 'Забули пароль?',
    'auth.resetPassword': 'Скинути пароль',
    
    // Games
    'games.create': 'Створити гру',
    'games.join': 'Приєднатися до гри',
    'games.manage': 'Керувати грою',
    'games.noGames': 'У вас ще немає ігор',
    'games.createFirst': 'Створіть свою першу гру',
    
    // Invitations
    'invitations.manage': 'Керувати запрошеннями',
    'invitations.create': 'Створити запрошення',
    'invitations.link': 'Посилання для запрошення',
    'invitations.copy': 'Копіювати посилання',
    'invitations.copied': 'Посилання скопійовано!',
    'invitations.expire': 'Термін дії',
    'invitations.role': 'Роль',
    'invitations.viewer': 'Глядач',
    'invitations.player': 'Гравець',
    'invitations.gm': 'Ведучий',
    'invitations.noInvitations': 'Немає активних запрошень',
    'invitations.selectGame': 'Спочатку виберіть гру',
  },
  en: {
    // App
    'app.title': 'DnD Manager',
    'app.subtitle': 'Complete toolkit for managing your D&D campaigns',
    'app.currentGame': 'Current game',
    'app.active': 'Active',
    'app.notSelected': 'Not selected',
    'app.theme': 'Theme',
    'app.language': 'Language',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.name': 'Name',
    'common.description': 'Description',
    
    // Tabs
    'tabs.characters': 'Characters',
    'tabs.dice': 'Dice',
    'tabs.combat': 'Combat',
    'tabs.themes': 'Themes',
    
    // Characters
    'characters.noGameSelected': 'No game selected',
    'characters.selectGame': 'Please select a game from the sidebar first',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm password',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset password',
    
    // Games
    'games.create': 'Create game',
    'games.join': 'Join game',
    'games.manage': 'Manage game',
    'games.noGames': 'You don\'t have any games yet',
    'games.createFirst': 'Create your first game',
    
    // Invitations
    'invitations.manage': 'Manage invitations',
    'invitations.create': 'Create invitation',
    'invitations.link': 'Invitation link',
    'invitations.copy': 'Copy link',
    'invitations.copied': 'Link copied!',
    'invitations.expire': 'Expires',
    'invitations.role': 'Role',
    'invitations.viewer': 'Viewer',
    'invitations.player': 'Player',
    'invitations.gm': 'Game Master',
    'invitations.noInvitations': 'No active invitations',
    'invitations.selectGame': 'Please select a game first',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uk');

  const t = (key: string): string => {
    return translations[language][key] || key;
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
