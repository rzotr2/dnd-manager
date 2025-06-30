
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uk: {
    // Загальне
    'common.loading': 'Завантаження...',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.close': 'Закрити',
    'common.confirm': 'Підтвердити',
    'common.back': 'Назад',
    'common.next': 'Далі',
    'common.yes': 'Так',
    'common.no': 'Ні',

    // Аутентифікація
    'auth.signIn': 'Увійти',
    'auth.signUp': 'Зареєструватися',
    'auth.signOut': 'Вийти',
    'auth.login': 'Вхід',
    'auth.register': 'Реєстрація',
    'auth.loginButton': 'Увійти',
    'auth.registerButton': 'Зареєструватися',
    'auth.logout': 'Вийти',
    'auth.email': 'Електронна пошта',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердити пароль',
    'auth.username': 'Ім\'я користувача',
    'auth.fullName': 'Повне ім\'я',
    'auth.verificationCode': 'Код підтвердження',
    'auth.emailPlaceholder': 'Введіть вашу електронну пошту',
    'auth.passwordPlaceholder': 'Введіть ваш пароль',
    'auth.fullNamePlaceholder': 'Введіть ваше повне ім\'я',
    'auth.usernamePlaceholder': 'Введіть ім\'я користувача',
    'auth.codePlaceholder': 'Введіть 6-значний код',
    'auth.alreadyHaveAccount': 'Вже маєте акаунт?',
    'auth.dontHaveAccount': 'Немає акаунта?',
    'auth.signInHere': 'Увійдіть тут',
    'auth.signUpHere': 'Зареєструйтеся тут',
    'auth.welcome': 'Ласкаво просимо',
    'auth.createAccount': 'Створити акаунт',
    'auth.sendCode': 'Надіслати код',
    'auth.verifyAndRegister': 'Підтвердити і зареєструватися',
    'auth.codeStep': 'Крок 2: Підтвердження',
    'auth.codeSent': 'Код надіслано на вашу пошту',
    'auth.enterCode': 'Введіть код, який ми надіслали на',

    // Додаток
    'app.title': 'D&D Менеджер',
    'app.subtitle': 'Ваш персональний помічник для керування іграми в Dungeons & Dragons',
    'app.language': 'Мова',
    'app.currentGame': 'Поточна гра',
    'app.active': 'Активна',
    'app.notSelected': 'Не вибрано',
    'app.theme': 'Тема',

    // Вкладки
    'tabs.characters': 'Персонажі',
    'tabs.dice': 'Кубики',
    'tabs.combat': 'Бій',
    'tabs.themes': 'Теми',

    // Ігри
    'games.myGames': 'Мої ігри',
    'games.newGame': 'Нова гра',
    'games.createNewGame': 'Створити нову гру',
    'games.createGame': 'Створити гру',
    'games.gameName': 'Назва гри',
    'games.gameNamePlaceholder': 'Введіть назву гри',
    'games.description': 'Опис',
    'games.descriptionPlaceholder': 'Опишіть вашу гру',
    'games.theme': 'Тема',
    'games.mode': 'Режим',
    'games.modeSimple': 'Простий',
    'games.modeAdvanced': 'Розширений',
    'games.loadingGames': 'Завантаження ігор...',
    'games.noGames': 'У вас ще немає ігор',
    'games.gameMembers': 'Учасники гри',
    'games.invitePlayer': 'Запросити гравця',
    'games.manageInvitations': 'Керувати запрошеннями',
    'games.noMembers': 'Ще немає учасників',

    // Учасники
    'members.owner': 'Власник',
    'members.editor': 'Редактор',
    'members.viewer': 'Глядач',
    'members.you': '(ви)',

    // Запрошення
    'invitations.title': 'Запросити у гру',
    'invitations.inviteEmail': 'Електронна пошта',
    'invitations.emailPlaceholder': 'example@email.com',
    'invitations.role': 'Роль',
    'invitations.roleOwner': 'Власник',
    'invitations.roleEditor': 'Редактор',
    'invitations.roleViewer': 'Глядач',
    'invitations.sendInvitation': 'Надіслати запрошення',
    'invitations.pendingInvitations': 'Очікуючі запрошення',
    'invitations.expires': 'Закінчується',
    'invitations.expired': 'Прострочено',
    'invitations.linkCopied': 'Посилання скопійовано!',

    // Теми
    'themes.fantasy': 'Фентезі',
    'themes.cyberpunk': 'Кіберпанк',
    'themes.classic': 'Класична',
    'themes.stalker': 'Сталкер',
    'themes.minimalist': 'Мінімалістична',
    'themes.retro': 'Ретро',
    'themes.space': 'Космос',
    'themes.western': 'Вестерн',
    'themes.apocalypse': 'Апокаліпсис',

    // Персонажі
    'characters.title': 'Персонажі',
    'characters.selectGame': 'Оберіть гру для роботи з персонажами',
    'characters.noGameSelected': 'Оберіть гру для роботи з персонажами',

    // Повідомлення про успіх
    'success.title': 'Успішно!',
    'success.gameCreated': 'Гру створено успішно',
    'success.gameUpdated': 'Гру оновлено успішно',
    'success.gameDeleted': 'Гру видалено успішно',
    'success.invitationSent': 'Запрошення надіслано',
    'success.invitationDeleted': 'Запрошення видалено',
    'success.memberRemoved': 'Учасника видалено',
    'success.roleUpdated': 'Роль оновлено',
    'success.loginSuccess': 'Ви успішно увійшли в систему',
    'success.registerSuccess': 'Реєстрація пройшла успішно',
    'success.codeSent': 'Код підтвердження надіслано',

    // Повідомлення про помилки
    'error.title': 'Помилка',
    'error.gameCreateFailed': 'Не вдалося створити гру',
    'error.gameUpdateFailed': 'Не вдалося оновити гру',
    'error.gameDeleteFailed': 'Не вдалося видалити гру',
    'error.invitationFailed': 'Не вдалося надіслати запрошення',
    'error.loginFailed': 'Не вдалося увійти в систему',
    'error.registerFailed': 'Не вдалося зареєструватися',
    'error.codeSendFailed': 'Не вдалося надіслати код',
    'error.codeVerifyFailed': 'Не вдалося підтвердити код',
    'error.invalidCode': 'Невірний або прострочений код',
    'error.passwordMismatch': 'Паролі не співпадають',
    'error.fillAllFields': 'Заповніть всі поля',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.yes': 'Yes',
    'common.no': 'No',

    // Authentication
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.fullName': 'Full Name',
    'auth.verificationCode': 'Verification Code',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.fullNamePlaceholder': 'Enter your full name',
    'auth.usernamePlaceholder': 'Enter username',
    'auth.codePlaceholder': 'Enter 6-digit code',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.signInHere': 'Sign in here',
    'auth.signUpHere': 'Sign up here',
    'auth.welcome': 'Welcome',
    'auth.createAccount': 'Create Account',
    'auth.sendCode': 'Send Code',
    'auth.verifyAndRegister': 'Verify & Register',
    'auth.codeStep': 'Step 2: Verification',
    'auth.codeSent': 'Code sent to your email',
    'auth.enterCode': 'Enter the code we sent to',

    // App
    'app.title': 'D&D Manager',
    'app.subtitle': 'Your personal assistant for managing Dungeons & Dragons games',
    'app.language': 'Language',
    'app.currentGame': 'Current Game',
    'app.active': 'Active',
    'app.notSelected': 'Not Selected',
    'app.theme': 'Theme',

    // Tabs
    'tabs.characters': 'Characters',
    'tabs.dice': 'Dice',
    'tabs.combat': 'Combat',
    'tabs.themes': 'Themes',

    // Games
    'games.myGames': 'My Games',
    'games.newGame': 'New Game',
    'games.createNewGame': 'Create New Game',
    'games.createGame': 'Create Game',
    'games.gameName': 'Game Name',
    'games.gameNamePlaceholder': 'Enter game name',
    'games.description': 'Description',
    'games.descriptionPlaceholder': 'Describe your game',
    'games.theme': 'Theme',
    'games.mode': 'Mode',
    'games.modeSimple': 'Simple',
    'games.modeAdvanced': 'Advanced',
    'games.loadingGames': 'Loading games...',
    'games.noGames': "You don't have any games yet",
    'games.gameMembers': 'Game Members',
    'games.invitePlayer': 'Invite Player',
    'games.manageInvitations': 'Manage Invitations',
    'games.noMembers': 'No members yet',

    // Members
    'members.owner': 'Owner',
    'members.editor': 'Editor',
    'members.viewer': 'Viewer',
    'members.you': '(you)',

    // Invitations
    'invitations.title': 'Invite to Game',
    'invitations.inviteEmail': 'Email',
    'invitations.emailPlaceholder': 'example@email.com',
    'invitations.role': 'Role',
    'invitations.roleOwner': 'Owner',
    'invitations.roleEditor': 'Editor',
    'invitations.roleViewer': 'Viewer',
    'invitations.sendInvitation': 'Send Invitation',
    'invitations.pendingInvitations': 'Pending Invitations',
    'invitations.expires': 'Expires',
    'invitations.expired': 'Expired',
    'invitations.linkCopied': 'Link copied!',

    // Themes
    'themes.fantasy': 'Fantasy',
    'themes.cyberpunk': 'Cyberpunk',
    'themes.classic': 'Classic',
    'themes.stalker': 'Stalker',
    'themes.minimalist': 'Minimalist',
    'themes.retro': 'Retro',
    'themes.space': 'Space',
    'themes.western': 'Western',
    'themes.apocalypse': 'Apocalypse',

    // Characters
    'characters.title': 'Characters',
    'characters.selectGame': 'Select a game to work with characters',
    'characters.noGameSelected': 'Select a game to work with characters',

    // Success messages
    'success.title': 'Success!',
    'success.gameCreated': 'Game created successfully',
    'success.gameUpdated': 'Game updated successfully',
    'success.gameDeleted': 'Game deleted successfully',
    'success.invitationSent': 'Invitation sent',
    'success.invitationDeleted': 'Invitation deleted',
    'success.memberRemoved': 'Member removed',
    'success.roleUpdated': 'Role updated',
    'success.loginSuccess': 'Successfully logged in',
    'success.registerSuccess': 'Registration successful',
    'success.codeSent': 'Verification code sent',

    // Error messages
    'error.title': 'Error',
    'error.gameCreateFailed': 'Failed to create game',
    'error.gameUpdateFailed': 'Failed to update game',
    'error.gameDeleteFailed': 'Failed to delete game',
    'error.invitationFailed': 'Failed to send invitation',
    'error.loginFailed': 'Failed to log in',
    'error.registerFailed': 'Failed to register',
    'error.codeSendFailed': 'Failed to send code',
    'error.codeVerifyFailed': 'Failed to verify code',
    'error.invalidCode': 'Invalid or expired code',
    'error.passwordMismatch': 'Passwords do not match',
    'error.fillAllFields': 'Please fill in all fields',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'uk';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
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
