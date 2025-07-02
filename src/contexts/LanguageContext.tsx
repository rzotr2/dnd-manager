
import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.games': 'Games',
    'nav.characters': 'Characters',
    'nav.settings': 'Settings',
    
    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signUp': 'Sign Up',
    'auth.signIn': 'Sign In',
    'auth.signingIn': 'Signing in...',
    'auth.signingUp': 'Signing up...',
    'auth.welcome': 'Welcome!',
    'auth.pleaseSignIn': 'Please sign in to continue',
    'auth.createAccount': 'Create your account',
    
    // Games
    'games.title': 'Games',
    'games.createGame': 'Create Game',
    'games.currentGame': 'Current Game',
    'games.selectGame': 'Select a Game',
    'games.noGameSelected': 'Choose a game from the sidebar to get started',
    'games.noGames': 'No games yet',
    'games.createFirst': 'Create your first game to get started',
    'games.gameName': 'Game Name',
    'games.gameDescription': 'Game Description',
    'games.gameTheme': 'Game Theme',
    'games.create': 'Create',
    'games.cancel': 'Cancel',
    'games.edit': 'Edit',
    'games.delete': 'Delete',
    'games.save': 'Save',
    'games.enterName': 'Enter game name',
    'games.enterDescription': 'Enter game description (optional)',
    'games.members': 'Members',
    'games.invitePlayer': 'Invite Player',
    'games.manageMembers': 'Manage Members',
    'games.gameSettings': 'Game Settings',
    'games.deleteConfirm': 'Are you sure you want to delete this game?',
    'games.deleteWarning': 'This action cannot be undone.',
    'games.success': 'Success',
    'games.error': 'Error',
    'games.created': 'Game created successfully',
    'games.updated': 'Game updated successfully',
    'games.deleted': 'Game deleted successfully',
    'games.createError': 'Failed to create game',
    'games.updateError': 'Failed to update game',
    'games.deleteError': 'Failed to delete game',
    
    // Characters
    'character.title': 'Characters',
    'character.characters': 'Characters',
    'character.create': 'Create Character',
    'character.edit': 'Edit',
    'character.save': 'Save',
    'character.delete': 'Delete',
    'character.name': 'Character Name',
    'character.enterName': 'Enter character name',
    'character.newCharacter': 'New Character',
    'character.selectCharacter': 'Select a Character',
    'character.selectCharacterDescription': 'Choose a character from the list to view and edit their details',
    'character.noCharacters': 'No characters yet',
    'character.basic': 'Basic',
    'character.stats': 'Stats',
    'character.skills': 'Skills',
    'character.equipment': 'Equipment',
    'character.notes': 'Notes',
    'character.success': 'Success',
    'character.error': 'Error',
    'character.nameRequired': 'Character name is required',
    'character.created': 'Character created successfully',
    'character.updated': 'Character updated successfully',
    'character.deleted': 'Character deleted successfully',
    'character.createError': 'Failed to create character',
    'character.updateError': 'Failed to update character',
    'character.deleteError': 'Failed to delete character',
    
    // Character Fields
    'character.fields.name': 'Name',
    'character.fields.class': 'Class',
    'character.fields.level': 'Level',
    'character.fields.race': 'Race',
    'character.fields.background': 'Background',
    'character.fields.alignment': 'Alignment',
    'character.fields.health': 'Health',
    'character.fields.armor': 'Armor Class',
    'character.fields.speed': 'Speed',
    'character.fields.strength': 'Strength',
    'character.fields.dexterity': 'Dexterity',
    'character.fields.constitution': 'Constitution',
    'character.fields.intelligence': 'Intelligence',
    'character.fields.wisdom': 'Wisdom',
    'character.fields.charisma': 'Charisma',
    'character.fields.acrobatics': 'Acrobatics',
    'character.fields.athletics': 'Athletics',
    'character.fields.stealth': 'Stealth',
    'character.fields.investigation': 'Investigation',
    'character.fields.perception': 'Perception',
    'character.fields.survival': 'Survival',
    'character.fields.weapons': 'Weapons',
    'character.fields.armor_equipment': 'Armor',
    'character.fields.items': 'Items',
    'character.fields.money': 'Money',
    'character.fields.backstory': 'Backstory',
    'character.fields.personality': 'Personality',
    'character.fields.ideals': 'Ideals',
    'character.fields.bonds': 'Bonds',
    'character.fields.flaws': 'Flaws',
    'character.fields.notes_field': 'Notes',
    
    // Stalker specific fields
    'character.fields.faction': 'Faction',
    'character.fields.reputation': 'Reputation',
    'character.fields.equipment_condition': 'Equipment Condition',
    'character.fields.artifacts': 'Artifacts',
    'character.fields.anomalous_effects': 'Anomalous Effects',
    'character.fields.contacts': 'Contacts',
    'character.fields.debts': 'Debts',
    'character.fields.hideout': 'Hideout',
    'character.fields.mental_state': 'Mental State',
    'character.fields.radiation_level': 'Radiation Level',
    
    // Themes
    'themes.fantasy': 'Fantasy',
    'themes.cyberpunk': 'Cyberpunk',
    'themes.stalker': 'Stalker',
    'themes.scifi': 'Sci-Fi',
    
    // Members
    'members.owner': 'Owner',
    'members.editor': 'Editor',
    'members.viewer': 'Viewer',
    'members.invite': 'Invite Member',
    'members.email': 'Email Address',
    'members.role': 'Role',
    'members.send': 'Send Invitation',
    'members.cancel': 'Cancel',
    'members.remove': 'Remove',
    'members.changeRole': 'Change Role',
    'members.pending': 'Pending',
    'members.active': 'Active',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.noNotifications': 'No notifications',
    'notifications.invitedBy': 'Invited by',
    'notifications.accept': 'Accept',
    'notifications.reject': 'Reject',
    'notifications.gameInvitation': 'Game Invitation',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view': 'View',
    'common.hide': 'Hide',
    'common.show': 'Show',
  },
  uk: {
    // Navigation
    'nav.home': 'Головна',
    'nav.games': 'Ігри',
    'nav.characters': 'Персонажі',
    'nav.settings': 'Налаштування',
    
    // Authentication
    'auth.login': 'Увійти',
    'auth.logout': 'Вийти',
    'auth.register': 'Реєстрація',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердити пароль',
    'auth.username': 'Ім\'я користувача',
    'auth.forgotPassword': 'Забули пароль?',
    'auth.noAccount': 'Немає акаунта?',
    'auth.hasAccount': 'Вже є акаунт?',
    'auth.signUp': 'Зареєструватися',
    'auth.signIn': 'Увійти',
    'auth.signingIn': 'Вхід...',
    'auth.signingUp': 'Реєстрація...',
    'auth.welcome': 'Ласкаво просимо!',
    'auth.pleaseSignIn': 'Будь ласка, увійдіть для продовження',
    'auth.createAccount': 'Створіть ваш акаунт',
    
    // Games
    'games.title': 'Ігри',
    'games.createGame': 'Створити гру',
    'games.currentGame': 'Поточна гра',
    'games.selectGame': 'Оберіть гру',
    'games.noGameSelected': 'Оберіть гру з бокової панелі для початку',
    'games.noGames': 'Поки що немає ігор',
    'games.createFirst': 'Створіть вашу першу гру для початку',
    'games.gameName': 'Назва гри',
    'games.gameDescription': 'Опис гри',
    'games.gameTheme': 'Тема гри',
    'games.create': 'Створити',
    'games.cancel': 'Скасувати',
    'games.edit': 'Редагувати',
    'games.delete': 'Видалити',
    'games.save': 'Зберегти',
    'games.enterName': 'Введіть назву гри',
    'games.enterDescription': 'Введіть опис гри (не обов\'язково)',
    'games.members': 'Учасники',
    'games.invitePlayer': 'Запросити гравця',
    'games.manageMembers': 'Керувати учасниками',
    'games.gameSettings': 'Налаштування гри',
    'games.deleteConfirm': 'Ви впевнені, що хочете видалити цю гру?',
    'games.deleteWarning': 'Цю дію неможливо скасувати.',
    'games.success': 'Успіх',
    'games.error': 'Помилка',
    'games.created': 'Гру успішно створено',
    'games.updated': 'Гру успішно оновлено',
    'games.deleted': 'Гру успішно видалено',
    'games.createError': 'Не вдалося створити гру',
    'games.updateError': 'Не вдалося оновити гру',
    'games.deleteError': 'Не вдалося видалити гру',
    
    // Characters
    'character.title': 'Персонажі',
    'character.characters': 'Персонажі',
    'character.create': 'Створити персонажа',
    'character.edit': 'Редагувати',
    'character.save': 'Зберегти',
    'character.delete': 'Видалити',
    'character.name': 'Ім\'я персонажа',
    'character.enterName': 'Введіть ім\'я персонажа',
    'character.newCharacter': 'Новий персонаж',
    'character.selectCharacter': 'Оберіть персонажа',
    'character.selectCharacterDescription': 'Оберіть персонажа зі списку для перегляду та редагування деталей',
    'character.noCharacters': 'Поки що немає персонажів',
    'character.basic': 'Основне',
    'character.stats': 'Характеристики',
    'character.skills': 'Навички',
    'character.equipment': 'Спорядження',
    'character.notes': 'Нотатки',
    'character.success': 'Успіх',
    'character.error': 'Помилка',
    'character.nameRequired': 'Ім\'я персонажа обов\'язкове',
    'character.created': 'Персонажа успішно створено',
    'character.updated': 'Персонажа успішно оновлено',
    'character.deleted': 'Персонажа успішно видалено',
    'character.createError': 'Не вдалося створити персонажа',
    'character.updateError': 'Не вдалося оновити персонажа',
    'character.deleteError': 'Не вдалося видалити персонажа',
    
    // Character Fields
    'character.fields.name': 'Ім\'я',
    'character.fields.class': 'Клас',
    'character.fields.level': 'Рівень',
    'character.fields.race': 'Раса',
    'character.fields.background': 'Передісторія',
    'character.fields.alignment': 'Світогляд',
    'character.fields.health': 'Здоров\'я',
    'character.fields.armor': 'Клас броні',
    'character.fields.speed': 'Швидкість',
    'character.fields.strength': 'Сила',
    'character.fields.dexterity': 'Спритність',
    'character.fields.constitution': 'Витривалість',
    'character.fields.intelligence': 'Інтелект',
    'character.fields.wisdom': 'Мудрість',
    'character.fields.charisma': 'Харизма',
    'character.fields.acrobatics': 'Акробатика',
    'character.fields.athletics': 'Атлетика',
    'character.fields.stealth': 'Непомітність',
    'character.fields.investigation': 'Розслідування',
    'character.fields.perception': 'Сприйняття',
    'character.fields.survival': 'Виживання',
    'character.fields.weapons': 'Зброя',
    'character.fields.armor_equipment': 'Броня',
    'character.fields.items': 'Предмети',
    'character.fields.money': 'Гроші',
    'character.fields.backstory': 'Передісторія',
    'character.fields.personality': 'Особистість',
    'character.fields.ideals': 'Ідеали',
    'character.fields.bonds': 'Зв\'язки',
    'character.fields.flaws': 'Недоліки',
    'character.fields.notes_field': 'Нотатки',
    
    // Stalker specific fields
    'character.fields.faction': 'Угруповання',
    'character.fields.reputation': 'Репутація',
    'character.fields.equipment_condition': 'Стан спорядження',
    'character.fields.artifacts': 'Артефакти',
    'character.fields.anomalous_effects': 'Аномальні ефекти',
    'character.fields.contacts': 'Контакти',
    'character.fields.debts': 'Борги',
    'character.fields.hideout': 'Схованка',
    'character.fields.mental_state': 'Психічний стан',
    'character.fields.radiation_level': 'Рівень радіації',
    
    // Themes
    'themes.fantasy': 'Фентезі',
    'themes.cyberpunk': 'Кіберпанк',
    'themes.stalker': 'Сталкер',
    'themes.scifi': 'Наукова фантастика',
    
    // Members
    'members.owner': 'Власник',
    'members.editor': 'Редактор',
    'members.viewer': 'Глядач',
    'members.invite': 'Запросити учасника',
    'members.email': 'Email адреса',
    'members.role': 'Роль',
    'members.send': 'Надіслати запрошення',
    'members.cancel': 'Скасувати',
    'members.remove': 'Видалити',
    'members.changeRole': 'Змінити роль',
    'members.pending': 'Очікує',
    'members.active': 'Активний',
    
    // Notifications
    'notifications.title': 'Сповіщення',
    'notifications.noNotifications': 'Немає сповіщень',
    'notifications.invitedBy': 'Запрошено',
    'notifications.accept': 'Прийняти',
    'notifications.reject': 'Відхилити',
    'notifications.gameInvitation': 'Запрошення до гри',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.error': 'Помилка',
    'common.success': 'Успіх',
    'common.confirm': 'Підтвердити',
    'common.cancel': 'Скасувати',
    'common.save': 'Зберегти',
    'common.edit': 'Редагувати',
    'common.delete': 'Видалити',
    'common.create': 'Створити',
    'common.close': 'Закрити',
    'common.back': 'Назад',
    'common.next': 'Далі',
    'common.previous': 'Попередній',
    'common.search': 'Пошук',
    'common.filter': 'Фільтр',
    'common.sort': 'Сортування',
    'common.view': 'Переглянути',
    'common.hide': 'Сховати',
    'common.show': 'Показати',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations];
    return langTranslations?.[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
