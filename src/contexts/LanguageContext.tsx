
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
    'app.language': 'Мова',
    
    // Tabs
    'tabs.characters': 'Персонажі',
    'tabs.dice': 'Кубики',
    'tabs.combat': 'Бій',
    'tabs.themes': 'Теми',
    
    // Games
    'games.myGames': 'Мої Ігри',
    'games.newGame': 'Нова гра',
    'games.createNewGame': 'Створити нову гру',
    'games.gameName': 'Назва гри',
    'games.gameNamePlaceholder': 'Введіть назву гри',
    'games.description': 'Опис',
    'games.descriptionPlaceholder': 'Опишіть вашу гру',
    'games.theme': 'Тема оформлення',
    'games.mode': 'Режим гри',
    'games.modeSimple': 'Спрощений',
    'games.modeAdvanced': 'Звичайний',
    'games.players': 'Гравці (через кому)',
    'games.playersPlaceholder': 'Іван, Марія, Олексій',
    'games.createGame': 'Створити гру',
    'games.loadingGames': 'Завантаження ігор...',
    'games.invitePlayer': 'Запросити гравця',
    'games.manageInvitations': 'Керувати запрошеннями',
    'games.gameMembers': 'Учасники гри',
    
    // Invitations
    'invitations.title': 'Запрошення гравців',
    'invitations.inviteEmail': 'Email для запрошення',
    'invitations.emailPlaceholder': 'email@example.com',
    'invitations.role': 'Роль',
    'invitations.roleViewer': 'Глядач',
    'invitations.roleEditor': 'Редактор',
    'invitations.roleOwner': 'Власник',
    'invitations.sendInvitation': 'Надіслати запрошення',
    'invitations.copyLink': 'Копіювати посилання',
    'invitations.linkCopied': 'Посилання скопійовано!',
    'invitations.pendingInvitations': 'Очікують запрошення',
    'invitations.noInvitations': 'Немає запрошень',
    'invitations.expires': 'Закінчується',
    'invitations.expired': 'Закінчився термін',
    'invitations.used': 'Використано',
    'invitations.delete': 'Видалити',
    
    // Members
    'members.owner': 'Власник',
    'members.editor': 'Редактор', 
    'members.viewer': 'Глядач',
    'members.you': '(Ви)',
    'members.removeFromGame': 'Видалити з гри',
    'members.changeRole': 'Змінити роль',
    
    // Themes
    'themes.fantasy': 'Фентезі',
    'themes.cyberpunk': 'Кіберпанк',
    'themes.classic': 'Класичний',
    'themes.stalker': 'Сталкер',
    'themes.minimalist': 'Мінімалізм',
    'themes.retro': 'Ретро',
    'themes.space': 'Космос',
    'themes.western': 'Вестерн',
    'themes.apocalypse': 'Постапокаліпсис',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.close': 'Закрити',
    'common.yes': 'Так',
    'common.no': 'Ні',
    'common.confirm': 'Підтвердити',
    
    // Errors
    'error.title': 'Помилка',
    'error.loginFailed': 'Не вдалося увійти в систему',
    'error.registerFailed': 'Не вдалося зареєструватися',
    'error.passwordsDontMatch': 'Паролі не співпадають',
    'error.fillAllFields': 'Заповніть всі поля',
    'error.gameCreateFailed': 'Не вдалося створити гру',
    'error.gameUpdateFailed': 'Не вдалося оновити гру',
    'error.gameDeleteFailed': 'Не вдалося видалити гру',
    'error.invitationFailed': 'Не вдалося надіслати запрошення',
    'error.invalidEmail': 'Невірний email',
    
    // Success
    'success.title': 'Успіх',
    'success.loginSuccess': 'Успішний вхід в систему',
    'success.registerSuccess': 'Успішна реєстрація',
    'success.gameCreated': 'Гру створено успішно',
    'success.gameUpdated': 'Гру оновлено успішно',
    'success.gameDeleted': 'Гру видалено успішно',
    'success.invitationSent': 'Запрошення надіслано',
    'success.memberRemoved': 'Учасника видалено з гри',
    'success.roleUpdated': 'Роль оновлено',
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
    'app.language': 'Language',
    
    // Tabs
    'tabs.characters': 'Characters',
    'tabs.dice': 'Dice',
    'tabs.combat': 'Combat',
    'tabs.themes': 'Themes',
    
    // Games
    'games.myGames': 'My Games',
    'games.newGame': 'New Game',
    'games.createNewGame': 'Create New Game',
    'games.gameName': 'Game Name',
    'games.gameNamePlaceholder': 'Enter game name',
    'games.description': 'Description',
    'games.descriptionPlaceholder': 'Describe your game',
    'games.theme': 'Theme',
    'games.mode': 'Game Mode',
    'games.modeSimple': 'Simple',
    'games.modeAdvanced': 'Advanced',
    'games.players': 'Players (comma separated)',
    'games.playersPlaceholder': 'John, Mary, Alex',
    'games.createGame': 'Create Game',
    'games.loadingGames': 'Loading games...',
    'games.invitePlayer': 'Invite Player',
    'games.manageInvitations': 'Manage Invitations',
    'games.gameMembers': 'Game Members',
    
    // Invitations
    'invitations.title': 'Player Invitations',
    'invitations.inviteEmail': 'Email to invite',
    'invitations.emailPlaceholder': 'email@example.com',
    'invitations.role': 'Role',
    'invitations.roleViewer': 'Viewer',
    'invitations.roleEditor': 'Editor',
    'invitations.roleOwner': 'Owner',
    'invitations.sendInvitation': 'Send Invitation',
    'invitations.copyLink': 'Copy Link',
    'invitations.linkCopied': 'Link copied!',
    'invitations.pendingInvitations': 'Pending Invitations',
    'invitations.noInvitations': 'No invitations',
    'invitations.expires': 'Expires',
    'invitations.expired': 'Expired',
    'invitations.used': 'Used',
    'invitations.delete': 'Delete',
    
    // Members
    'members.owner': 'Owner',
    'members.editor': 'Editor',
    'members.viewer': 'Viewer',
    'members.you': '(You)',
    'members.removeFromGame': 'Remove from game',
    'members.changeRole': 'Change role',
    
    // Themes
    'themes.fantasy': 'Fantasy',
    'themes.cyberpunk': 'Cyberpunk',
    'themes.classic': 'Classic',
    'themes.stalker': 'Stalker',
    'themes.minimalist': 'Minimalist',
    'themes.retro': 'Retro',
    'themes.space': 'Space',
    'themes.western': 'Western',
    'themes.apocalypse': 'Post-Apocalypse',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
    
    // Errors
    'error.title': 'Error',
    'error.loginFailed': 'Failed to sign in',
    'error.registerFailed': 'Failed to sign up',
    'error.passwordsDontMatch': 'Passwords do not match',
    'error.fillAllFields': 'Please fill all fields',
    'error.gameCreateFailed': 'Failed to create game',
    'error.gameUpdateFailed': 'Failed to update game',
    'error.gameDeleteFailed': 'Failed to delete game',
    'error.invitationFailed': 'Failed to send invitation',
    'error.invalidEmail': 'Invalid email',
    
    // Success
    'success.title': 'Success',
    'success.loginSuccess': 'Successfully signed in',
    'success.registerSuccess': 'Successfully registered',
    'success.gameCreated': 'Game created successfully',
    'success.gameUpdated': 'Game updated successfully',
    'success.gameDeleted': 'Game deleted successfully',
    'success.invitationSent': 'Invitation sent',
    'success.memberRemoved': 'Member removed from game',
    'success.roleUpdated': 'Role updated',
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
