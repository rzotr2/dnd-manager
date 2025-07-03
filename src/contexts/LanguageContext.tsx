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
    'auth.welcome': 'Вітаємо',
    'auth.login': 'Увійти',
    'auth.register': 'Зареєструватися',
    'auth.logout': 'Вийти',
    'auth.email': 'Електронна пошта',
    'auth.password': 'Пароль',
    'auth.username': 'Ім\'я користувача',
    'auth.confirmPassword': 'Підтвердіть пароль',
    'auth.alreadyHaveAccount': 'Вже маєте акаунт?',
    'auth.noAccount': 'Немає акаунта?',
    'auth.signIn': 'Увійти',
    'auth.signUp': 'Зареєструватися',
    'auth.loginButton': 'Увійти',
    'auth.registerButton': 'Зареєструватися',
    'auth.forgotPassword': 'Забули пароль?',
    'auth.resetPassword': 'Скинути пароль',
    'auth.emailPlaceholder': 'Введіть електронну пошту',
    'auth.passwordPlaceholder': 'Введіть пароль',
    'auth.usernamePlaceholder': 'Введіть ім\'я користувача',
    
    // Games
    'games.create': 'Створити гру',
    'games.join': 'Приєднатися до гри',
    'games.manage': 'Керувати грою',
    'games.noGames': 'У вас ще немає ігор',
    'games.createFirst': 'Створіть свою першу гру',
    'games.selectGame': 'Оберіть гру',
    'games.noGameSelected': 'Гру не вибрано',
    'games.noGame': 'Без гри',
    'games.createNew': 'Створити нову гру',
    'games.name': 'Назва гри',
    'games.namePlaceholder': 'Введіть назву гри',
    'games.description': 'Опис гри',
    'games.descriptionPlaceholder': 'Введіть опис гри',
    'games.theme': 'Тема гри',
    'games.themePlaceholder': 'Оберіть тему',
    'games.mode': 'Режим гри',
    'games.modePlaceholder': 'Оберіть режим',
    'games.yourGames': 'Ваші ігри',
    'games.gameMembers': 'Учасники гри',
    'games.noMembers': 'Немає учасників',
    
    // Themes
    'themes.fantasy': 'Фентезі',
    'themes.modern': 'Сучасний',
    'themes.scifi': 'Наукова фантастика',
    
    // Modes
    'modes.simple': 'Простий',
    'modes.advanced': 'Розширений',
    
    // Members
    'members.you': 'Ви',
    'members.owner': 'Власник',
    'members.editor': 'Редактор',
    'members.viewer': 'Глядач',
    
    // Invitations
    'invitations.createInviteLink': 'Створити запрошення',
    'invitations.inviteLinks': 'Посилання запрошень',
    'invitations.inviteEmail': 'Email для запрошення',
    'invitations.emailPlaceholder': 'Введіть email користувача',
    'invitations.role': 'Роль',
    'invitations.roleViewer': 'Глядач',
    'invitations.roleEditor': 'Редактор',
    'invitations.roleOwner': 'Власник',
    'invitations.createLink': 'Створити посилання',
    'invitations.copyLink': 'Скопіювати посилання',
    'invitations.deleteLink': 'Видалити посилання',
    'invitations.expires': 'Дійсне до',
    'invitations.expired': 'Прострочено',
    'invitations.linkCopied': 'Посилання скопійовано',
    'invitations.loadError': 'Не вдалося завантажити запрошення',
    'invitations.sendError': 'Не вдалося надіслати запрошення',
    'invitations.acceptError': 'Не вдалося прийняти запрошення',
    'invitations.declineError': 'Не вдалося відхилити запрошення',
    'invitations.userNotFoundEmail': 'Користувача з таким email не знайдено',
    'invitations.userNotFoundUsername': 'Користувача з таким іменем не знайдено',
    'invitations.alreadyInvited': 'Запрошення вже надіслано цьому користувачу',
    'invitations.invitationSent': 'Запрошення надіслано успішно',
    'invitations.invitationAccepted': 'Ви успішно приєдналися до гри',
    'invitations.invitationDeclined': 'Запрошення відхилено',
    
    // Account Management
    'account.title': 'Управління акаунтом',
    'account.changePassword': 'Зміна паролю',
    'account.oldPassword': 'Старий пароль',
    'account.newPassword': 'Новий пароль',
    'account.confirmNewPassword': 'Підтвердіть новий пароль',
    'account.updatePassword': 'Оновити пароль',
    'account.deleteAccount': 'Видалити акаунт',
    'account.confirmDelete': 'Ця дія незворотна. Ваш акаунт та всі дані будуть видалені назавжди.',
    'account.deleteConfirm': 'Так, видалити',
    'account.back': 'Назад',
    
    // Success messages
    'success.title': 'Успішно',
    'success.loginSuccess': 'Успішний вхід в систему',
    'success.registerSuccess': 'Реєстрацію завершено! Перевірте свою електронну пошту та перейдіть за посиланням для підтвердження акаунту.',
    'success.logoutSuccess': 'Успішний вихід з системи',
    'success.passwordUpdated': 'Пароль успішно оновлено',
    'success.accountDeleted': 'Акаунт успішно видалено',
    
    // Error messages
    'error.title': 'Помилка',
    'error.fillAllFields': 'Будь ласка, заповніть всі поля',
    'error.passwordMismatch': 'Паролі не співпадають',
    'error.loginFailed': 'Помилка входу в систему',
    'error.registerFailed': 'Помилка реєстрації',
    'error.wrongOldPassword': 'Неправильний старий пароль',
    'error.passwordUpdateFailed': 'Помилка оновлення пароля',
    'error.accountDeleteFailed': 'Помилка видалення акаунту',
    'error.userExists': 'Користувач з таким email та/або іменем користувача вже існує',
    'error.emailExists': 'Користувач з таким email вже існує',
    'error.usernameExists': 'Користувач з таким іменем користувача вже існує',
    'error.invalidCredentials': 'Неправильний email або пароль',
    'error.emailNotConfirmed': 'Email не підтверджено. Перевірте свою пошту',
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
    'auth.welcome': 'Welcome',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.username': 'Username',
    'auth.confirmPassword': 'Confirm password',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset password',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.usernamePlaceholder': 'Enter your username',
    
    // Games
    'games.create': 'Create game',
    'games.join': 'Join game',
    'games.manage': 'Manage game',
    'games.noGames': 'You don\'t have any games yet',
    'games.createFirst': 'Create your first game',
    'games.selectGame': 'Select game',
    'games.noGameSelected': 'No game selected',
    'games.noGame': 'No game',
    'games.createNew': 'Create new game',
    'games.name': 'Game name',
    'games.namePlaceholder': 'Enter game name',
    'games.description': 'Game description',
    'games.descriptionPlaceholder': 'Enter game description',
    'games.theme': 'Game theme',
    'games.themePlaceholder': 'Select theme',
    'games.mode': 'Game mode',
    'games.modePlaceholder': 'Select mode',
    'games.yourGames': 'Your games',
    'games.gameMembers': 'Game members',
    'games.noMembers': 'No members',
    
    // Themes
    'themes.fantasy': 'Fantasy',
    'themes.modern': 'Modern',
    'themes.scifi': 'Sci-Fi',
    
    // Modes
    'modes.simple': 'Simple',
    'modes.advanced': 'Advanced',
    
    // Members
    'members.you': 'You',
    'members.owner': 'Owner',
    'members.editor': 'Editor',
    'members.viewer': 'Viewer',
    
    // Invitations
    'invitations.createInviteLink': 'Create invitation',
    'invitations.inviteLinks': 'Invitation links',
    'invitations.inviteEmail': 'Email to invite',
    'invitations.emailPlaceholder': 'Enter user email',
    'invitations.role': 'Role',
    'invitations.roleViewer': 'Viewer',
    'invitations.roleEditor': 'Editor',
    'invitations.roleOwner': 'Owner',
    'invitations.createLink': 'Create link',
    'invitations.copyLink': 'Copy link',
    'invitations.deleteLink': 'Delete link',
    'invitations.expires': 'Expires',
    'invitations.expired': 'Expired',
    'invitations.linkCopied': 'Link copied',
    'invitations.loadError': 'Failed to load invitations',
    'invitations.sendError': 'Failed to send invitation',
    'invitations.acceptError': 'Failed to accept invitation',
    'invitations.declineError': 'Failed to decline invitation',
    'invitations.userNotFoundEmail': 'User with this email not found',
    'invitations.userNotFoundUsername': 'User with this username not found',
    'invitations.alreadyInvited': 'Invitation already sent to this user',
    'invitations.invitationSent': 'Invitation sent successfully',
    'invitations.invitationAccepted': 'You have successfully joined the game',
    'invitations.invitationDeclined': 'Invitation declined',
    
    // Account Management
    'account.title': 'Account Management',
    'account.changePassword': 'Change Password',
    'account.oldPassword': 'Old Password',
    'account.newPassword': 'New Password',
    'account.confirmNewPassword': 'Confirm New Password',
    'account.updatePassword': 'Update Password',
    'account.deleteAccount': 'Delete Account',
    'account.confirmDelete': 'This action cannot be undone. Your account and all data will be permanently deleted.',
    'account.deleteConfirm': 'Yes, delete',
    'account.back': 'Back',
    
    // Success messages
    'success.title': 'Success',
    'success.loginSuccess': 'Successfully logged in',
    'success.registerSuccess': 'Registration completed! Please check your email and click the confirmation link to activate your account.',
    'success.logoutSuccess': 'Successfully logged out',
    'success.passwordUpdated': 'Password updated successfully',
    'success.accountDeleted': 'Account deleted successfully',
    
    // Error messages
    'error.title': 'Error',
    'error.fillAllFields': 'Please fill in all fields',
    'error.passwordMismatch': 'Passwords do not match',
    'error.loginFailed': 'Login failed',
    'error.registerFailed': 'Registration failed',
    'error.wrongOldPassword': 'Wrong old password',
    'error.passwordUpdateFailed': 'Password update failed',
    'error.accountDeleteFailed': 'Account deletion failed',
    'error.userExists': 'User with this email and/or username already exists',
    'error.emailExists': 'User with this email already exists',
    'error.usernameExists': 'User with this username already exists',
    'error.invalidCredentials': 'Invalid email or password',
    'error.emailNotConfirmed': 'Email not confirmed. Please check your email',
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
