import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uk: {
    'app.title': 'DnD Менеджер',
    'app.subtitle': 'Повний набір інструментів для керування вашою грою в DnD',
    'app.currentGame': 'Поточна гра',
    'app.active': 'Активна',
    'app.notSelected': 'Не вибрана',
    'app.theme': 'Тема',
    'app.language': 'Мова',

    // Common
    'common.loading': 'Завантаження...',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.create': 'Створити',
    'common.close': 'Закрити',
    'common.back': 'Назад',
    'common.next': 'Далі',
    'common.previous': 'Попередній',
    'common.search': 'Пошук',
    'common.filter': 'Фільтр',
    'common.sort': 'Сортувати',
    'common.add': 'Додати',
    'common.remove': 'Видалити',
    'common.update': 'Оновити',
    'common.confirm': 'Підтвердити',

    // Auth
    'auth.login': 'Увійти',
    'auth.register': 'Зареєструватися',
    'auth.logout': 'Вийти',
    'auth.email': 'Електронна пошта',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердити пароль',
    'auth.username': 'Ім\'я користувача',
    'auth.emailPlaceholder': 'Введіть вашу пошту',
    'auth.passwordPlaceholder': 'Введіть ваш пароль',
    'auth.confirmPasswordPlaceholder': 'Підтвердіть ваш пароль',
    'auth.usernamePlaceholder': 'Введіть ім\'я користувача',
    'auth.loginTitle': 'Вхід в акаунт',
    'auth.registerTitle': 'Створення акаунту',
    'auth.switchToRegister': 'Немає акаунту? Зареєструйтеся',
    'auth.switchToLogin': 'Вже є акаунт? Увійдіть',
    'auth.forgotPassword': 'Забули пароль?',

    // Account Management
    'account.title': 'Керування акаунтом',
    'account.changePassword': 'Зміна пароля',
    'account.deleteAccount': 'Видалити акаунт',
    'account.oldPassword': 'Старий пароль',
    'account.newPassword': 'Новий пароль',
    'account.confirmNewPassword': 'Підтвердити новий пароль',
    'account.oldPasswordPlaceholder': 'Введіть старий пароль',
    'account.newPasswordPlaceholder': 'Введіть новий пароль',
    'account.confirmNewPasswordPlaceholder': 'Підтвердіть новий пароль',
    'account.updatePassword': 'Оновити пароль',
    'account.deleteAccountWarning': 'Ця дія незворотна. Ваш акаунт та всі дані будуть видалені назавжди.',
    'account.confirmDelete': 'Підтвердити видалення',

    // Games
    'games.myGames': 'Мої ігри',
    'games.newGame': 'Нова гра',
    'games.createNewGame': 'Створити нову гру',
    'games.gameName': 'Назва гри',
    'games.gameNamePlaceholder': 'Введіть назву гри',
    'games.description': 'Опис',
    'games.descriptionPlaceholder': 'Опишіть вашу гру...',
    'games.mode': 'Режим',
    'games.modeSimple': 'Простий',
    'games.modeAdvanced': 'Розширений',
    'games.theme': 'Тема',
    'games.createGame': 'Створити гру',
    'games.loadingGames': 'Завантаження ігор...',
    'games.gameMembers': 'Учасники гри',
    'games.invitePlayer': 'Запросити гравця',
    'games.manageInvitations': 'Керувати запрошеннями',
    'games.selectGameFirst': 'Спочатку виберіть гру',
    'games.noMembers': 'Поки що немає учасників',

    // Members
    'members.you': 'Ви',
    'members.owner': 'Власник',
    'members.editor': 'Редактор',
    'members.viewer': 'Глядач',

    // Invitations
    'invitations.title': 'Запросити гравця',
    'invitations.inviteEmail': 'Електронна пошта',
    'invitations.emailPlaceholder': 'Введіть email гравця',
    'invitations.role': 'Роль',
    'invitations.roleViewer': 'Глядач',
    'invitations.roleEditor': 'Редактор',
    'invitations.roleOwner': 'Власник',
    'invitations.sendInvitation': 'Надіслати запрошення',
    'invitations.pendingInvitations': 'Очікуючі запрошення',
    'invitations.expires': 'Закінчується',
    'invitations.expired': 'Прострочено',
    'invitations.linkCopied': 'Посилання скопійовано!',

    // Tabs
    'tabs.characters': 'Персонажі',
    'tabs.dice': 'Кубики',
    'tabs.combat': 'Бій',
    'tabs.themes': 'Теми',

    // Characters
    'characters.noGameSelected': 'Гра не вибрана',
    'characters.selectGame': 'Виберіть гру в боковому меню',

    // Themes
    'themes.fantasy': 'Фентезі',
    'themes.cyberpunk': 'Кіберпанк',
    'themes.classic': 'Класика',
    'themes.stalker': 'Сталкер',
    'themes.minimalist': 'Мінімалізм',
    'themes.retro': 'Ретро',
    'themes.space': 'Космос',
    'themes.western': 'Вестерн',
    'themes.apocalypse': 'Апокаліпсис',

    // Success messages
    'success.title': 'Успіх',
    'success.loginSuccess': 'Успішний вхід в систему',
    'success.registerSuccess': 'Реєстрація пройшла успішно! Перевірте вашу пошту.',
    'success.logoutSuccess': 'Ви успішно вийшли',
    'success.passwordUpdated': 'Пароль успішно оновлено',
    'success.accountDeleted': 'Акаунт успішно видалено',
    'success.gameCreated': 'Гру створено успішно',
    'success.gameUpdated': 'Гру оновлено успішно',
    'success.gameDeleted': 'Гру видалено успішно',
    'success.invitationSent': 'Запрошення надіслано успішно',
    'success.invitationDeleted': 'Запрошення видалено',
    'success.memberRemoved': 'Учасника видалено',
    'success.roleUpdated': 'Роль оновлено',

    // Error messages
    'error.title': 'Помилка',
    'error.loginFailed': 'Помилка входу',
    'error.registerFailed': 'Помилка реєстрації',
    'error.fillAllFields': 'Заповніть всі поля',
    'error.passwordsNotMatch': 'Паролі не збігаються',
    'error.passwordTooShort': 'Пароль повинен містити принаймні 6 символів',
    'error.wrongOldPassword': 'Неправильний старий пароль',
    'error.passwordUpdateFailed': 'Не вдалося оновити пароль',
    'error.accountDeleteFailed': 'Не вдалося видалити акаунт',
    'error.gameCreateFailed': 'Не вдалося створити гру',
    'error.gameUpdateFailed': 'Не вдалося оновити гру',
    'error.gameDeleteFailed': 'Не вдалося видалити гру',
    'error.invitationFailed': 'Не вдалося надіслати запрошення',
  },
  en: {
    'app.title': 'DnD Manager',
    'app.subtitle': 'Complete toolkit for managing your DnD game',
    'app.currentGame': 'Current Game',
    'app.active': 'Active',
    'app.notSelected': 'Not Selected',
    'app.theme': 'Theme',
    'app.language': 'Language',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.update': 'Update',
    'common.confirm': 'Confirm',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.usernamePlaceholder': 'Enter username',
    'auth.loginTitle': 'Login to Account',
    'auth.registerTitle': 'Create Account',
    'auth.switchToRegister': 'Don\'t have an account? Register',
    'auth.switchToLogin': 'Already have an account? Login',
    'auth.forgotPassword': 'Forgot password?',

    // Account Management
    'account.title': 'Account Management',
    'account.changePassword': 'Change Password',
    'account.deleteAccount': 'Delete Account',
    'account.oldPassword': 'Old Password',
    'account.newPassword': 'New Password',
    'account.confirmNewPassword': 'Confirm New Password',
    'account.oldPasswordPlaceholder': 'Enter old password',
    'account.newPasswordPlaceholder': 'Enter new password',
    'account.confirmNewPasswordPlaceholder': 'Confirm new password',
    'account.updatePassword': 'Update Password',
    'account.deleteAccountWarning': 'This action is irreversible. Your account and all data will be permanently deleted.',
    'account.confirmDelete': 'Confirm Deletion',

    // Games
    'games.myGames': 'My Games',
    'games.newGame': 'New Game',
    'games.createNewGame': 'Create New Game',
    'games.gameName': 'Game Name',
    'games.gameNamePlaceholder': 'Enter game name',
    'games.description': 'Description',
    'games.descriptionPlaceholder': 'Describe your game...',
    'games.mode': 'Mode',
    'games.modeSimple': 'Simple',
    'games.modeAdvanced': 'Advanced',
    'games.theme': 'Theme',
    'games.createGame': 'Create Game',
    'games.loadingGames': 'Loading games...',
    'games.gameMembers': 'Game Members',
    'games.invitePlayer': 'Invite Player',
    'games.manageInvitations': 'Manage Invitations',
    'games.selectGameFirst': 'Please select a game first',
    'games.noMembers': 'No members yet',

    // Members
    'members.you': 'You',
    'members.owner': 'Owner',
    'members.editor': 'Editor',
    'members.viewer': 'Viewer',

    // Invitations
    'invitations.title': 'Invite Player',
    'invitations.inviteEmail': 'Email Address',
    'invitations.emailPlaceholder': 'Enter player email',
    'invitations.role': 'Role',
    'invitations.roleViewer': 'Viewer',
    'invitations.roleEditor': 'Editor',
    'invitations.roleOwner': 'Owner',
    'invitations.sendInvitation': 'Send Invitation',
    'invitations.pendingInvitations': 'Pending Invitations',
    'invitations.expires': 'Expires',
    'invitations.expired': 'Expired',
    'invitations.linkCopied': 'Link copied!',

    // Tabs
    'tabs.characters': 'Characters',
    'tabs.dice': 'Dice',
    'tabs.combat': 'Combat',
    'tabs.themes': 'Themes',

    // Characters
    'characters.noGameSelected': 'No Game Selected',
    'characters.selectGame': 'Select a game from the sidebar',

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

    // Success messages
    'success.title': 'Success',
    'success.loginSuccess': 'Successfully logged in',
    'success.registerSuccess': 'Registration successful! Please check your email.',
    'success.logoutSuccess': 'Successfully logged out',
    'success.passwordUpdated': 'Password updated successfully',
    'success.accountDeleted': 'Account deleted successfully',
    'success.gameCreated': 'Game created successfully',
    'success.gameUpdated': 'Game updated successfully',
    'success.gameDeleted': 'Game deleted successfully',
    'success.invitationSent': 'Invitation sent successfully',
    'success.invitationDeleted': 'Invitation deleted',
    'success.memberRemoved': 'Member removed',
    'success.roleUpdated': 'Role updated',

    // Error messages
    'error.title': 'Error',
    'error.loginFailed': 'Login failed',
    'error.registerFailed': 'Registration failed',
    'error.fillAllFields': 'Please fill all fields',
    'error.passwordsNotMatch': 'Passwords do not match',
    'error.passwordTooShort': 'Password must be at least 6 characters',
    'error.wrongOldPassword': 'Wrong old password',
    'error.passwordUpdateFailed': 'Failed to update password',
    'error.accountDeleteFailed': 'Failed to delete account',
    'error.gameCreateFailed': 'Failed to create game',
    'error.gameUpdateFailed': 'Failed to update game',
    'error.gameDeleteFailed': 'Failed to delete game',
    'error.invitationFailed': 'Failed to send invitation',
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
