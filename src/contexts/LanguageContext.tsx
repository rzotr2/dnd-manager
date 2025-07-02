
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, any>> = {
  uk: {
    common: {
      loading: 'Завантаження...',
      create: 'Створити',
      name: "Ім'я",
      description: 'Опис',
      email: 'Електронна пошта',
      emailPlaceholder: 'Введіть email',
      password: 'Пароль',
      passwordPlaceholder: 'Введіть пароль',
      confirmPassword: 'Підтвердження пароля',
      fillAllFields: 'Будь ласка, заповніть всі поля',
      passwordMismatch: 'Паролі не співпадають',
      loginFailed: 'Не вдалося увійти',
      registerFailed: 'Не вдалося зареєструватися',
      logoutSuccess: 'Ви вийшли з системи',
      accountDeleteFailed: 'Не вдалося видалити акаунт',
      passwordUpdateFailed: 'Не вдалося оновити пароль',
      wrongOldPassword: 'Старий пароль неправильний',
      invalidCredentials: 'Неправильний логін або пароль',
      emailNotConfirmed: 'Електронна пошта не підтверджена',
      emailExists: 'Електронна пошта вже використовується',
      title: 'Помилка',
      successTitle: 'Успіх',
    },
    auth: {
      login: 'Увійти',
      register: 'Реєстрація',
      logout: 'Вийти',
      welcome: 'Ласкаво просимо',
      email: 'Електронна пошта',
      emailPlaceholder: 'Введіть email',
      password: 'Пароль',
      passwordPlaceholder: 'Введіть пароль',
      confirmPassword: 'Підтвердження пароля',
      username: "Ім'я користувача",
      usernamePlaceholder: "Введіть ім'я користувача",
      loginButton: 'Увійти',
      registerButton: 'Зареєструватися',
    },
    games: {
      noGames: 'Немає ігор',
      noGameSelected: 'Гру не вибрано',
      create: 'Створити гру',
      gameMembers: 'Учасники гри',
      noMembers: 'Немає учасників',
    },
    members: {
      you: 'Ви',
      owner: 'Власник',
      editor: 'Редактор',
      viewer: 'Спостерігач',
    },
    invitations: {
      title: 'Запрошення',
      inviteUser: 'Запросити користувача',
      userEmailOrUsername: 'Email або ім\'я користувача',
      userQueryPlaceholder: 'Введіть email або username',
      sendInvitation: 'Надіслати запрошення',
      role: 'Роль',
      roleViewer: 'Спостерігач',
      roleEditor: 'Редактор',
      roleOwner: 'Власник',
      userNotFound: 'Користувача не знайдено',
      alreadyInvited: 'Користувач вже запрошений',
      sendError: 'Помилка надсилання запрошення',
      invitationSent: 'Запрошення надіслано',
      acceptError: 'Помилка прийняття запрошення',
      invitationAccepted: 'Запрошення прийнято',
      rejectError: 'Помилка відхилення запрошення',
      invitationRejected: 'Запрошення відхилено',
      newInvitation: 'Нове запрошення',
      newInvitationDescription: 'Ви отримали нове запрошення до гри',
      createInviteLink: 'Створити посилання-запрошення',
      inviteEmail: 'Email для запрошення',
      emailPlaceholder: 'Введіть email',
      createLink: 'Створити посилання',
      expires: 'Закінчується',
      expired: 'Закінчився',
      copyLink: 'Скопіювати посилання',
      deleteLink: 'Видалити посилання',
    },
    notifications: {
      title: 'Сповіщення',
      noInvitations: 'Немає запрошень',
      invitedBy: 'Запросив:',
      accept: 'Прийняти',
      reject: 'Відхилити',
    },
    characters: {
      title: 'Персонажі',
      create: 'Створити персонажа',
      noCharacters: 'Немає персонажів',
      namePlaceholder: "Ім'я персонажа",
      photo: 'Фото',
      uploadPhoto: 'Завантажити фото',
    },
    success: {
      title: 'Успіх',
      loginSuccess: 'Ви успішно увійшли',
      registerSuccess: 'Реєстрація пройшла успішно',
      logoutSuccess: 'Ви вийшли з системи',
      passwordUpdated: 'Пароль оновлено',
      accountDeleted: 'Акаунт видалено',
      invitationSent: 'Запрошення надіслано',
      invitationAccepted: 'Запрошення прийнято',
      invitationRejected: 'Запрошення відхилено',
      linkCopied: 'Посилання скопійовано',
    },
    error: {
      title: 'Помилка',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      create: 'Create',
      name: 'Name',
      description: 'Description',
      email: 'Email',
      emailPlaceholder: 'Enter email',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      confirmPassword: 'Confirm Password',
      fillAllFields: 'Please fill all fields',
      passwordMismatch: 'Passwords do not match',
      loginFailed: 'Login failed',
      registerFailed: 'Registration failed',
      logoutSuccess: 'Logged out successfully',
      accountDeleteFailed: 'Failed to delete account',
      passwordUpdateFailed: 'Failed to update password',
      wrongOldPassword: 'Old password is incorrect',
      invalidCredentials: 'Invalid login credentials',
      emailNotConfirmed: 'Email not confirmed',
      emailExists: 'Email already exists',
      title: 'Error',
      successTitle: 'Success',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      welcome: 'Welcome',
      email: 'Email',
      emailPlaceholder: 'Enter email',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      usernamePlaceholder: 'Enter username',
      loginButton: 'Login',
      registerButton: 'Register',
    },
    games: {
      noGames: 'No games',
      noGameSelected: 'No game selected',
      create: 'Create Game',
      gameMembers: 'Game Members',
      noMembers: 'No members',
    },
    members: {
      you: 'You',
      owner: 'Owner',
      editor: 'Editor',
      viewer: 'Viewer',
    },
    invitations: {
      title: 'Invitations',
      inviteUser: 'Invite User',
      userEmailOrUsername: 'Email or Username',
      userQueryPlaceholder: 'Enter email or username',
      sendInvitation: 'Send Invitation',
      role: 'Role',
      roleViewer: 'Viewer',
      roleEditor: 'Editor',
      roleOwner: 'Owner',
      userNotFound: 'User not found',
      alreadyInvited: 'User already invited',
      sendError: 'Error sending invitation',
      invitationSent: 'Invitation sent',
      acceptError: 'Error accepting invitation',
      invitationAccepted: 'Invitation accepted',
      rejectError: 'Error rejecting invitation',
      invitationRejected: 'Invitation rejected',
      newInvitation: 'New invitation',
      newInvitationDescription: 'You have received a new game invitation',
      createInviteLink: 'Create Invite Link',
      inviteEmail: 'Invite Email',
      emailPlaceholder: 'Enter email',
      createLink: 'Create Link',
      expires: 'Expires',
      expired: 'Expired',
      copyLink: 'Copy Link',
      deleteLink: 'Delete Link',
    },
    notifications: {
      title: 'Notifications',
      noInvitations: 'No invitations',
      invitedBy: 'Invited by:',
      accept: 'Accept',
      reject: 'Reject',
    },
    characters: {
      title: 'Characters',
      create: 'Create Character',
      noCharacters: 'No characters',
      namePlaceholder: 'Character name',
      photo: 'Photo',
      uploadPhoto: 'Upload Photo',
    },
    success: {
      title: 'Success',
      loginSuccess: 'Successfully logged in',
      registerSuccess: 'Registration successful',
      logoutSuccess: 'Logged out successfully',
      passwordUpdated: 'Password updated',
      accountDeleted: 'Account deleted',
      invitationSent: 'Invitation sent',
      invitationAccepted: 'Invitation accepted',
      invitationRejected: 'Invitation rejected',
      linkCopied: 'Link copied',
    },
    error: {
      title: 'Error',
    },
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];

    for (const k of keys) {
      if (translation && k in translation) {
        translation = translation[k];
      } else {
        return key; // fallback to key if translation not found
      }
    }

    if (typeof translation === 'string') {
      return translation;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
