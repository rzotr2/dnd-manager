
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  uk: {
    // Common
    'common.loading': 'Завантаження...',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.close': 'Закрити',
    'common.confirm': 'Підтвердити',
    'common.back': 'Назад',
    
    // App
    'app.title': 'D&D Manager',
    'app.subtitle': 'Управляйте своїми пригодами, персонажами та кампаніями в одному місці',
    'app.currentGame': 'Поточна гра',
    'app.theme': 'Тема',
    'app.language': 'Мова',
    'app.active': 'Активна',
    'app.notSelected': 'Не вибрано',
    
    // Tabs
    'tabs.characters': 'Персонажі',
    'tabs.dice': 'Кубики',
    'tabs.combat': 'Бій',
    'tabs.themes': 'Теми',
    
    // Auth
    'auth.login': 'Увійти',
    'auth.signup': 'Зареєструватися',
    'auth.signout': 'Вийти',
    'auth.email': 'Електронна пошта',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердіть пароль',
    'auth.username': 'Ім\'я користувача',
    'auth.switchToLogin': 'Вже маєте акаунт? Увійдіть',
    'auth.switchToSignup': 'Немає акаунта? Зареєструйтеся',
    'auth.signInButton': 'Увійти',
    'auth.signUpButton': 'Зареєструватися',
    'auth.loggingIn': 'Вхід...',
    'auth.signingUp': 'Реєстрація...',
    
    // Games
    'games.myGames': 'Мої ігри',
    'games.newGame': 'Нова гра',
    'games.createNewGame': 'Створити нову гру',
    'games.gameName': 'Назва гри',
    'games.gameNamePlaceholder': 'Введіть назву гри',
    'games.description': 'Опис',
    'games.descriptionPlaceholder': 'Опис гри (необов\'язково)',
    'games.mode': 'Режим',
    'games.modeSimple': 'Простий',
    'games.modeAdvanced': 'Розширений',
    'games.theme': 'Тема',
    'games.createGame': 'Створити гру',
    'games.loadingGames': 'Завантаження ігор...',
    'games.manageInvitations': 'Керувати запрошеннями',
    'games.selectGameFirst': 'Спочатку виберіть гру',
    'games.gameMembers': 'Учасники гри',
    'games.noMembers': 'Поки що немає учасників',
    'games.invitePlayer': 'Запросити гравця',
    
    // Invitations
    'invitations.title': 'Запросити гравця',
    'invitations.inviteEmail': 'Email гравця',
    'invitations.emailPlaceholder': 'player@example.com',
    'invitations.role': 'Роль',
    'invitations.roleViewer': 'Глядач',
    'invitations.roleEditor': 'Редактор',
    'invitations.roleOwner': 'Власник',
    'invitations.sendInvitation': 'Надіслати запрошення',
    'invitations.pendingInvitations': 'Очікують запрошення',
    'invitations.expires': 'Закінчується',
    'invitations.expired': 'Прострочено',
    'invitations.linkCopied': 'Посилання скопійовано в буфер обміну',
    'invitations.createInviteLink': 'Створити посилання',
    'invitations.createLink': 'Створити посилання',
    'invitations.inviteLinks': 'Посилання для запрошень',
    'invitations.copyLink': 'Скопіювати посилання',
    'invitations.deleteLink': 'Видалити посилання',
    
    // Members
    'members.you': 'Ви',
    'members.owner': 'Власник',
    'members.editor': 'Редактор',
    'members.viewer': 'Глядач',
    
    // Characters
    'characters.noGameSelected': 'Гру не вибрано',
    'characters.selectGame': 'Виберіть гру в бічному меню, щоб переглянути персонажів',
    
    // Themes
    'themes.fantasy': 'Фентезі',
    'themes.cyberpunk': 'Кіберпанк',
    'themes.classic': 'Класична',
    'themes.stalker': 'Сталкер',
    'themes.minimalist': 'Мінімалістична',
    'themes.retro': 'Ретро',
    'themes.space': 'Космос',
    'themes.western': 'Вестерн',
    'themes.apocalypse': 'Апокаліпсис',
    
    // Success/Error
    'success.title': 'Успішно',
    'success.invitationSent': 'Запрошення надіслано',
    'success.invitationDeleted': 'Запрошення видалено',
    'success.memberRemoved': 'Учасника видалено',
    'success.roleUpdated': 'Роль оновлено',
    'success.passwordChanged': 'Пароль успішно змінено',
    'success.accountDeleted': 'Акаунт видалено',
    'error.title': 'Помилка',
    'error.invitationFailed': 'Не вдалося надіслати запрошення',
    'error.invalidCurrentPassword': 'Неправильний поточний пароль',
    'error.passwordMismatch': 'Паролі не збігаються',
    'error.passwordTooShort': 'Пароль повинен містити принаймні 6 символів',
    'error.accountDeletionFailed': 'Не вдалося видалити акаунт',
    
    // Account Management
    'account.title': 'Керування акаунтом',
    'account.changePassword': 'Змінити пароль',
    'account.currentPassword': 'Поточний пароль',
    'account.newPassword': 'Новий пароль',
    'account.confirmNewPassword': 'Підтвердьте новий пароль',
    'account.updatePassword': 'Оновити пароль',
    'account.deleteAccount': 'Видалити акаунт',
    'account.deleteConfirmation': 'Ця дія незворотна. Всі ваші дані будуть втрачені.',
    'account.typeDeleteToConfirm': 'Введіть "DELETE" для підтвердження',
    'account.confirmDelete': 'Підтвердити видалення',
    'account.changingPassword': 'Зміна пароля...',
    'account.deletingAccount': 'Видалення акаунту...',
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
    
    // App
    'app.title': 'D&D Manager',
    'app.subtitle': 'Manage your adventures, characters, and campaigns in one place',
    'app.currentGame': 'Current Game',
    'app.theme': 'Theme',
    'app.language': 'Language',
    'app.active': 'Active',
    'app.notSelected': 'Not Selected',
    
    // Tabs
    'tabs.characters': 'Characters',
    'tabs.dice': 'Dice',
    'tabs.combat': 'Combat',
    'tabs.themes': 'Themes',
    
    // Auth
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.signout': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.switchToLogin': 'Already have an account? Sign in',
    'auth.switchToSignup': 'Don\'t have an account? Sign up',
    'auth.signInButton': 'Sign In',
    'auth.signUpButton': 'Sign Up',
    'auth.loggingIn': 'Signing in...',
    'auth.signingUp': 'Signing up...',
    
    // Games
    'games.myGames': 'My Games',
    'games.newGame': 'New Game',
    'games.createNewGame': 'Create New Game',
    'games.gameName': 'Game Name',
    'games.gameNamePlaceholder': 'Enter game name',
    'games.description': 'Description',
    'games.descriptionPlaceholder': 'Game description (optional)',
    'games.mode': 'Mode',
    'games.modeSimple': 'Simple',
    'games.modeAdvanced': 'Advanced',
    'games.theme': 'Theme',
    'games.createGame': 'Create Game',
    'games.loadingGames': 'Loading games...',
    'games.manageInvitations': 'Manage Invitations',
    'games.selectGameFirst': 'Select a game first',
    'games.gameMembers': 'Game Members',
    'games.noMembers': 'No members yet',
    'games.invitePlayer': 'Invite Player',
    
    // Invitations
    'invitations.title': 'Invite Player',
    'invitations.inviteEmail': 'Player Email',
    'invitations.emailPlaceholder': 'player@example.com',
    'invitations.role': 'Role',
    'invitations.roleViewer': 'Viewer',
    'invitations.roleEditor': 'Editor',
    'invitations.roleOwner': 'Owner',
    'invitations.sendInvitation': 'Send Invitation',
    'invitations.pendingInvitations': 'Pending Invitations',
    'invitations.expires': 'Expires',
    'invitations.expired': 'Expired',
    'invitations.linkCopied': 'Link copied to clipboard',
    'invitations.createInviteLink': 'Create Invite Link',
    'invitations.createLink': 'Create Link',
    'invitations.inviteLinks': 'Invitation Links',
    'invitations.copyLink': 'Copy Link',
    'invitations.deleteLink': 'Delete Link',
    
    // Members
    'members.you': 'You',
    'members.owner': 'Owner',
    'members.editor': 'Editor',
    'members.viewer': 'Viewer',
    
    // Characters
    'characters.noGameSelected': 'No Game Selected',
    'characters.selectGame': 'Select a game from the sidebar to view characters',
    
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
    
    // Success/Error
    'success.title': 'Success',
    'success.invitationSent': 'Invitation sent',
    'success.invitationDeleted': 'Invitation deleted',
    'success.memberRemoved': 'Member removed',
    'success.roleUpdated': 'Role updated',
    'success.passwordChanged': 'Password successfully changed',
    'success.accountDeleted': 'Account deleted',
    'error.title': 'Error',
    'error.invitationFailed': 'Failed to send invitation',
    'error.invalidCurrentPassword': 'Invalid current password',
    'error.passwordMismatch': 'Passwords do not match',
    'error.passwordTooShort': 'Password must be at least 6 characters',
    'error.accountDeletionFailed': 'Failed to delete account',
    
    // Account Management
    'account.title': 'Account Management',
    'account.changePassword': 'Change Password',
    'account.currentPassword': 'Current Password',
    'account.newPassword': 'New Password',
    'account.confirmNewPassword': 'Confirm New Password',
    'account.updatePassword': 'Update Password',
    'account.deleteAccount': 'Delete Account',
    'account.deleteConfirmation': 'This action is irreversible. All your data will be lost.',
    'account.typeDeleteToConfirm': 'Type "DELETE" to confirm',
    'account.confirmDelete': 'Confirm Deletion',
    'account.changingPassword': 'Changing password...',
    'account.deletingAccount': 'Deleting account...',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uk');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['uk']] || key;
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
