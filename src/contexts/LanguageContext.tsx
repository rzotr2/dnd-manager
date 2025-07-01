
import React, { createContext, useState, useContext, useCallback } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations = {
  uk: {
    app: {
      title: "DnD Менеджер",
      subtitle: "Керуйте своїми іграми DnD легко.",
      currentGame: "Поточна гра",
      active: "Активна",
      notSelected: "Не вибрано",
      theme: "Тема",
      language: "Мова"
    },
    auth: {
      login: "Увійти",
      register: "Зареєструватися",
      logout: "Вийти",
      email: "Електронна пошта",
      emailPlaceholder: "your@email.com",
      password: "Пароль",
      passwordPlaceholder: "Введіть пароль",
      username: "Ім'я користувача",
      usernamePlaceholder: "Введіть ім'я користувача",
      confirmPassword: "Підтвердіть пароль",
      registerButton: "Зареєструватися",
      welcome: "Вітаємо",
      haveAccount: "Вже маєте акаунт?",
      noAccount: "Немає акаунта?",
      clickLogin: "Натисніть тут для входу",
      clickRegister: "Натисніть тут для реєстрації"
    },
    account: {
      title: "Керування Акаунтом",
      changePassword: "Змінити Пароль",
      deleteAccount: "Видалити Акаунт",
      oldPassword: "Старий пароль",
      newPassword: "Новий пароль",
      confirmNewPassword: "Підтвердіть новий пароль",
      updatePassword: "Оновити пароль",
      back: "Назад",
      confirmDelete: "Ви впевнені, що хочете видалити свій акаунт? Цю дію неможливо скасувати.",
      deleteConfirm: "Так, видалити акаунт"
    },
    common: {
      loading: "Завантаження..."
    },
    tabs: {
      characters: "Персонажі",
      dice: "Кубики",
      combat: "Бій",
      themes: "Теми"
    },
    characters: {
      noGameSelected: "Гра не вибрана",
      selectGame: "Будь ласка, виберіть гру, щоб переглянути персонажів."
    },
    dice: {
      roll: "Кинути",
      reset: "Скинути",
      addDice: "Додати кубик",
      removeDice: "Видалити кубик"
    },
    combat: {
      initiative: "Ініціатива",
      health: "Здоров'я",
      armorClass: "Клас броні",
      attack: "Атака",
      damage: "Урон"
    },
    themes: {
      fantasy: "Фентезі",
      cyberpunk: "Кіберпанк",
      classic: "Класика",
      stalker: "Сталкер",
      minimalist: "Мінімалізм",
      retro: "Ретро",
      space: "Космос",
      western: "Вестерн",
      apocalypse: "Апокаліпсис"
    },
    games: {
      myGames: "Мої Ігри",
      newGame: "Нова Гра",
      createNewGame: "Створити Нову Гру",
      createGame: "Створити Гру",
      gameName: "Назва Гри",
      gameNamePlaceholder: "Введіть назву гри...",
      description: "Опис",
      descriptionPlaceholder: "Опис гри (необов'язково)...",
      mode: "Режим",
      modeSimple: "Простий",
      modeAdvanced: "Розширений",
      theme: "Тема",
      loadingGames: "Завантаження ігор...",
      gameMembers: "Учасники Гри",
      noMembers: "Учасників поки немає",
      invitePlayer: "Запросити Гравця",
      manageInvitations: "Керувати Запрошеннями"
    },
    success: {
      title: "Успіх!",
      loginSuccess: "Ви успішно увійшли!",
      registerSuccess: "Ви успішно зареєструвалися!",
      logoutSuccess: "Ви успішно вийшли!",
      invitationSent: "Запрошення надіслано!",
      invitationDeleted: "Запрошення видалено!",
      memberRemoved: "Учасника видалено!",
      roleUpdated: "Роль оновлено!",
      passwordUpdated: "Пароль успішно оновлено!",
      accountDeleted: "Акаунт успішно видалено!"
    },
    error: {
      title: "Помилка!",
      loginFailed: "Не вдалося увійти. Перевірте свої облікові дані.",
      registerFailed: "Не вдалося зареєструватися. Будь ласка, спробуйте ще раз.",
      fillAllFields: "Будь ласка, заповніть всі поля.",
      passwordMismatch: "Паролі не співпадають.",
      invitationFailed: "Не вдалося надіслати запрошення.",
      emailAlreadyExists: "Користувач з такою поштою вже існує.",
      passwordUpdateFailed: "Не вдалося оновити пароль.",
      accountDeleteFailed: "Не вдалося видалити акаунт.",
      wrongOldPassword: "Неправильний старий пароль."
    },
    invitations: {
      title: "Запросити в Гру",
      inviteEmail: "Email для запрошення",
      emailPlaceholder: "example@email.com",
      role: "Роль",
      roleViewer: "Глядач",
      roleEditor: "Редактор", 
      roleOwner: "Власник",
      sendInvitation: "Надіслати Запрошення",
      pendingInvitations: "Очікувані Запрошення",
      expires: "Закінчується",
      expired: "Прострочено",
      linkCopied: "Посилання скопійовано!"
    },
    members: {
      owner: "Власник",
      editor: "Редактор",
      viewer: "Глядач",
      you: "Ви"
    }
  },
  en: {
    app: {
      title: "DnD Manager",
      subtitle: "Manage your DnD games easily.",
      currentGame: "Current Game",
      active: "Active",
      notSelected: "Not Selected",
      theme: "Theme",
      language: "Language"
    },
    auth: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "Enter password",
      username: "Username",
      usernamePlaceholder: "Enter username",
      confirmPassword: "Confirm Password",
      registerButton: "Register",
      welcome: "Welcome",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      clickLogin: "Click here to login",
      clickRegister: "Click here to register"
    },
    account: {
      title: "Account Management",
      changePassword: "Change Password",
      deleteAccount: "Delete Account",
      oldPassword: "Old password",
      newPassword: "New password",
      confirmNewPassword: "Confirm new password",
      updatePassword: "Update password",
      back: "Back",
      confirmDelete: "Are you sure you want to delete your account? This action cannot be undone.",
      deleteConfirm: "Yes, delete account"
    },
    common: {
      loading: "Loading..."
    },
    tabs: {
      characters: "Characters",
      dice: "Dice",
      combat: "Combat",
      themes: "Themes"
    },
    characters: {
      noGameSelected: "No Game Selected",
      selectGame: "Please select a game to view characters."
    },
    dice: {
      roll: "Roll",
      reset: "Reset",
      addDice: "Add Dice",
      removeDice: "Remove Dice"
    },
    combat: {
      initiative: "Initiative",
      health: "Health",
      armorClass: "Armor Class",
      attack: "Attack",
      damage: "Damage"
    },
    themes: {
      fantasy: "Fantasy",
      cyberpunk: "Cyberpunk",
      classic: "Classic",
      stalker: "Stalker",
      minimalist: "Minimalist",
      retro: "Retro",
      space: "Space",
      western: "Western",
      apocalypse: "Apocalypse"
    },
    games: {
      myGames: "My Games",
      newGame: "New Game",
      createNewGame: "Create New Game", 
      createGame: "Create Game",
      gameName: "Game Name",
      gameNamePlaceholder: "Enter game name...",
      description: "Description",
      descriptionPlaceholder: "Game description (optional)...",
      mode: "Mode",
      modeSimple: "Simple",
      modeAdvanced: "Advanced",
      theme: "Theme",
      loadingGames: "Loading games...",
      gameMembers: "Game Members",
      noMembers: "No members yet",
      invitePlayer: "Invite Player",
      manageInvitations: "Manage Invitations"
    },
    success: {
      title: "Success!",
      loginSuccess: "Logged in successfully!",
      registerSuccess: "Registered successfully!",
      logoutSuccess: "Logged out successfully!",
      invitationSent: "Invitation sent!",
      invitationDeleted: "Invitation deleted!",
      memberRemoved: "Member removed!",
      roleUpdated: "Role updated!",
      passwordUpdated: "Password updated successfully!",
      accountDeleted: "Account deleted successfully!"
    },
    error: {
      title: "Error!",
      loginFailed: "Login failed. Check your credentials.",
      registerFailed: "Registration failed. Please try again.",
      fillAllFields: "Please fill in all fields.",
      passwordMismatch: "Passwords do not match.",
      invitationFailed: "Failed to send invitation.",
      emailAlreadyExists: "User with this email already exists.",
      passwordUpdateFailed: "Failed to update password.",
      accountDeleteFailed: "Failed to delete account.",
      wrongOldPassword: "Wrong old password."
    },
    invitations: {
      title: "Invite to Game",
      inviteEmail: "Email to invite",
      emailPlaceholder: "example@email.com",
      role: "Role",
      roleViewer: "Viewer",
      roleEditor: "Editor",
      roleOwner: "Owner", 
      sendInvitation: "Send Invitation",
      pendingInvitations: "Pending Invitations",
      expires: "Expires",
      expired: "Expired",
      linkCopied: "Link copied!"
    },
    members: {
      owner: "Owner",
      editor: "Editor", 
      viewer: "Viewer",
      you: "You"
    }
  }
};

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'uk');

  React.useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  return useContext(LanguageContext);
};

export { LanguageProvider, useLanguage };
