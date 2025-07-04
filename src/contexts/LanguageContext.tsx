
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  uk: {
    // Common
    'common.loading': 'Завантаження...',
    'common.create': 'Створити',
    'common.cancel': 'Скасувати',
    'common.save': 'Зберегти',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.close': 'Закрити',
    'common.add': 'Додати',
    'common.remove': 'Видалити',
    'common.search': 'Пошук',
    'common.filter': 'Фільтр',
    'common.sort': 'Сортувати',
    'common.back': 'Назад',
    'common.next': 'Далі',
    'common.previous': 'Попередній',
    'common.submit': 'Надіслати',
    'common.reset': 'Скинути',
    'common.confirm': 'Підтвердити',
    'success.title': 'Успіх',
    'error.title': 'Помилка',

    // Games
    'games.selectGame': 'Обрати гру',
    'games.noGameSelected': 'Гра не обрана',
    'games.noGame': 'Без гри',
    'games.createNew': 'Створити нову гру',
    'games.name': 'Назва гри',
    'games.namePlaceholder': 'Введіть назву гри',
    'games.description': 'Опис',
    'games.descriptionPlaceholder': 'Опис гри (необов\'язково)',
    'games.theme': 'Тема',
    'games.themePlaceholder': 'Оберіть тему гри',
    'games.mode': 'Режим',
    'games.modePlaceholder': 'Оберіть режим гри',
    'games.yourGames': 'Ваші ігри',
    'games.noGames': 'У вас ще немає ігор',
    'games.gameMembers': 'Учасники гри',
    'games.noMembers': 'Немає учасників',

    // Themes
    'themes.fantasy': 'Фентезі',
    'themes.modern': 'Сучасність',
    'themes.scifi': 'Наукова фантастика',
    'themes.horror': 'Жахи',
    'themes.western': 'Вестерн',
    'themes.cyberpunk': 'Кіберпанк',
    'themes.steampunk': 'Стімпанк',
    'themes.apocalypse': 'Апокаліпсис',
    'themes.medieval': 'Середньовіччя',

    // Modes
    'modes.simple': 'Простий',
    'modes.advanced': 'Розширений',

    // Characters
    'characters.title': 'Персонажі',
    'characters.createNew': 'Створити персонажа',
    'characters.generateRandom': 'Випадковий персонаж',
    'characters.noCharacters': 'Немає персонажів',
    'characters.name': 'Ім\'я персонажа',
    'characters.namePlaceholder': 'Введіть ім\'я персонажа',
    'characters.theme': 'Тема персонажа',
    'characters.addField': 'Додати поле',
    'characters.fieldName': 'Назва поля',
    'characters.fieldValue': 'Значення поля',
    'characters.removeField': 'Видалити поле',
    'characters.editCharacter': 'Редагувати персонажа',
    'characters.deleteConfirm': 'Ви впевнені, що хочете видалити цього персонажа?',

    // Invitations
    'invitations.title': 'Запрошення',
    'invitations.inviteUser': 'Запросити користувача',
    'invitations.inviteUserToGame': 'Запросити користувача до гри',
    'invitations.inviteEmail': 'Email користувача',
    'invitations.emailPlaceholder': 'user@example.com',
    'invitations.emailDescription': 'Введіть email існуючого зареєстрованого користувача',
    'invitations.role': 'Роль у грі',
    'invitations.roleViewer': 'Глядач',
    'invitations.roleEditor': 'Редактор',
    'invitations.roleOwner': 'Власник',
    'invitations.sendInvitation': 'Надіслати запрошення',
    'invitations.sending': 'Надсилання...',
    'invitations.invitationSent': 'Запрошення надіслано',
    'invitations.invitationAccepted': 'Запрошення прийнято',
    'invitations.invitationDeclined': 'Запрошення відхилено',
    'invitations.accept': 'Прийняти',
    'invitations.decline': 'Відхилити',
    'invitations.noInvitations': 'Немає нових запрошень',
    'invitations.loadError': 'Помилка завантаження запрошень',
    'invitations.sendError': 'Помилка надсилання запрошення',
    'invitations.acceptError': 'Помилка прийняття запрошення',
    'invitations.declineError': 'Помилка відхилення запрошення',
    'invitations.userNotFoundEmail': 'Користувач з таким email не знайдений. Переконайтеся, що користувач зареєстрований.',
    'invitations.alreadyInvited': 'Користувач вже запрошений до цієї гри',
    'invitations.createInviteLink': 'Створити запрошення',
    'invitations.inviteLinks': 'Посилання для запрошень',
    'invitations.createLink': 'Створити посилання',
    'invitations.copyLink': 'Копіювати посилання',
    'invitations.deleteLink': 'Видалити посилання',
    'invitations.linkCopied': 'Посилання скопійовано',
    'invitations.expires': 'Закінчується',
    'invitations.expired': 'Закінчилось',

    // Members
    'members.you': 'Ви',
    'members.owner': 'Власник',
    'members.editor': 'Редактор',
    'members.viewer': 'Глядач',

    // Auth
    'auth.login': 'Увійти',
    'auth.register': 'Зареєструватися',
    'auth.logout': 'Вийти',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердити пароль',
    'auth.username': 'Ім\'я користувача',
    'auth.emailPlaceholder': 'Введіть ваш email',
    'auth.passwordPlaceholder': 'Введіть пароль',
    'auth.usernamePlaceholder': 'Введіть ім\'я користувача',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.create': 'Create',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.confirm': 'Confirm',
    'success.title': 'Success',
    'error.title': 'Error',

    // Games
    'games.selectGame': 'Select Game',
    'games.noGameSelected': 'No game selected',
    'games.noGame': 'No Game',
    'games.createNew': 'Create New Game',
    'games.name': 'Game Name',
    'games.namePlaceholder': 'Enter game name',
    'games.description': 'Description',
    'games.descriptionPlaceholder': 'Game description (optional)',
    'games.theme': 'Theme',
    'games.themePlaceholder': 'Select game theme',
    'games.mode': 'Mode',
    'games.modePlaceholder': 'Select game mode',
    'games.yourGames': 'Your Games',
    'games.noGames': 'You have no games yet',
    'games.gameMembers': 'Game Members',
    'games.noMembers': 'No members',

    // Themes
    'themes.fantasy': 'Fantasy',
    'themes.modern': 'Modern',
    'themes.scifi': 'Sci-Fi',
    'themes.horror': 'Horror',
    'themes.western': 'Western',
    'themes.cyberpunk': 'Cyberpunk',
    'themes.steampunk': 'Steampunk',
    'themes.apocalypse': 'Apocalypse',
    'themes.medieval': 'Medieval',

    // Modes
    'modes.simple': 'Simple',
    'modes.advanced': 'Advanced',

    // Characters
    'characters.title': 'Characters',
    'characters.createNew': 'Create Character',
    'characters.generateRandom': 'Random Character',
    'characters.noCharacters': 'No characters',
    'characters.name': 'Character Name',
    'characters.namePlaceholder': 'Enter character name',
    'characters.theme': 'Character Theme',
    'characters.addField': 'Add Field',
    'characters.fieldName': 'Field Name',
    'characters.fieldValue': 'Field Value',
    'characters.removeField': 'Remove Field',
    'characters.editCharacter': 'Edit Character',
    'characters.deleteConfirm': 'Are you sure you want to delete this character?',

    // Invitations
    'invitations.title': 'Invitations',
    'invitations.inviteUser': 'Invite User',
    'invitations.inviteUserToGame': 'Invite User to Game',
    'invitations.inviteEmail': 'User Email',
    'invitations.emailPlaceholder': 'user@example.com',
    'invitations.emailDescription': 'Enter email of existing registered user',
    'invitations.role': 'Role in Game',
    'invitations.roleViewer': 'Viewer',
    'invitations.roleEditor': 'Editor',
    'invitations.roleOwner': 'Owner',
    'invitations.sendInvitation': 'Send Invitation',
    'invitations.sending': 'Sending...',
    'invitations.invitationSent': 'Invitation sent',
    'invitations.invitationAccepted': 'Invitation accepted',
    'invitations.invitationDeclined': 'Invitation declined',
    'invitations.accept': 'Accept',
    'invitations.decline': 'Decline',
    'invitations.noInvitations': 'No new invitations',
    'invitations.loadError': 'Error loading invitations',
    'invitations.sendError': 'Error sending invitation',
    'invitations.acceptError': 'Error accepting invitation',
    'invitations.declineError': 'Error declining invitation',
    'invitations.userNotFoundEmail': 'User with this email not found. Make sure the user is registered.',
    'invitations.alreadyInvited': 'User is already invited to this game',
    'invitations.createInviteLink': 'Create Invitation',
    'invitations.inviteLinks': 'Invitation Links',
    'invitations.createLink': 'Create Link',
    'invitations.copyLink': 'Copy Link',
    'invitations.deleteLink': 'Delete Link',
    'invitations.linkCopied': 'Link copied',
    'invitations.expires': 'Expires',
    'invitations.expired': 'Expired',

    // Members
    'members.you': 'You',
    'members.owner': 'Owner',
    'members.editor': 'Editor',
    'members.viewer': 'Viewer',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.passwordPlaceholder': 'Enter password',
    'auth.usernamePlaceholder': 'Enter username',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('uk');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
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
