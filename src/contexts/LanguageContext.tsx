
import React, { createContext, useContext, useState } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uk: {
    // App general
    'app.title': 'DnD Менеджер',
    'app.subtitle': 'Повний набір інструментів для майстрів гри та гравців D&D',
    'app.language': 'Мова',
    'app.theme': 'Тема',
    'app.currentGame': 'Поточна гра',
    'app.active': 'Активна',
    'app.notSelected': 'Не обрано',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.create': 'Створити',
    'common.roll': 'Кинути',
    'common.reset': 'Скинути',
    'common.close': 'Закрити',
    'common.confirm': 'Підтвердити',
    
    // Authentication
    'auth.login': 'Вхід',
    'auth.register': 'Реєстрація',
    'auth.logout': 'Вихід',
    'auth.loginButton': 'Увійти',
    'auth.registerButton': 'Зареєструватися',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Підтвердіть пароль',
    'auth.username': 'Ім\'я користувача',
    'auth.fullName': 'Повне ім\'я',
    'auth.emailPlaceholder': 'Введіть ваш email',
    'auth.passwordPlaceholder': 'Введіть пароль',
    'auth.usernamePlaceholder': 'Введіть ім\'я користувача',
    'auth.fullNamePlaceholder': 'Введіть повне ім\'я',
    'auth.welcome': 'Ласкаво просимо',
    'auth.signInWith': 'Увійти через',
    'auth.dontHaveAccount': 'Немає акаунту?',
    'auth.haveAccount': 'Вже є акаунт?',
    
    // Tabs
    'tabs.characters': 'Персонажі',
    'tabs.dice': 'Кубики',
    'tabs.combat': 'Бій',
    'tabs.themes': 'Теми',
    'tabs.games': 'Ігри',
    
    // Characters
    'characters.title': 'Персонажі',
    'characters.noGameSelected': 'Гру не обрано',
    'characters.selectGame': 'Оберіть гру в лівому меню',
    'characters.createNew': 'Створити персонажа',
    'characters.name': 'Ім\'я',
    'characters.class': 'Клас',
    'characters.level': 'Рівень',
    'characters.race': 'Раса',
    
    // Dice
    'dice.title': 'Кубики',
    'dice.rollResult': 'Результат кидка',
    'dice.total': 'Всього',
    'dice.modifier': 'Модифікатор',
    'dice.addModifier': 'Додати модифікатор',
    'dice.history': 'Історія кидків',
    'dice.clearHistory': 'Очистити історію',
    'dice.rollMultiple': 'Кинути декілька',
    'dice.amount': 'Кількість',
    
    // Combat
    'combat.title': 'Система бою',
    'combat.initiative': 'Ініціатива',
    'combat.addCombatant': 'Додати учасника',
    'combat.startCombat': 'Почати бій',
    'combat.endCombat': 'Закінчити бій',
    'combat.nextTurn': 'Наступний хід',
    'combat.hp': 'HP',
    'combat.ac': 'AC',
    'combat.name': 'Ім\'я',
    'combat.rollInitiative': 'Кинути ініціативу',
    'combat.damage': 'Шкода',
    'combat.heal': 'Лікування',
    
    // Themes
    'themes.title': 'Теми оформлення',
    'themes.current': 'Поточна тема',
    'themes.fantasy': 'Фентезі',
    'themes.dark': 'Темна',
    'themes.cyberpunk': 'Кіберпанк',
    'themes.steampunk': 'Стімпанк',
    'themes.horror': 'Жахи',
    'themes.space': 'Космос',
    'themes.preview': 'Попередній перегляд',
    'themes.apply': 'Застосувати',
    
    // Games
    'games.title': 'Ігри',
    'games.create': 'Створити гру',
    'games.join': 'Приєднатися',
    'games.select': 'Обрати гру',
    'games.noGames': 'Немає ігор',
    'games.createFirst': 'Створіть свою першу гру',
    
    // Errors
    'error.title': 'Помилка',
    'error.fillAllFields': 'Заповніть всі поля',
    'error.passwordMismatch': 'Паролі не співпадають',
    'error.loginFailed': 'Помилка входу',
    'error.registerFailed': 'Помилка реєстрації',
    'error.generic': 'Сталася помилка',
    
    // Success
    'success.title': 'Успіх',
    'success.loginSuccess': 'Успішний вхід',
    'success.registerSuccess': 'Успішна реєстрація',
    'success.saved': 'Збережено',
  },
  en: {
    // App general
    'app.title': 'DnD Manager',
    'app.subtitle': 'Complete toolkit for D&D dungeon masters and players',
    'app.language': 'Language',
    'app.theme': 'Theme',
    'app.currentGame': 'Current game',
    'app.active': 'Active',
    'app.notSelected': 'Not selected',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.roll': 'Roll',
    'common.reset': 'Reset',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.username': 'Username',
    'auth.fullName': 'Full Name',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.passwordPlaceholder': 'Enter password',
    'auth.usernamePlaceholder': 'Enter username',
    'auth.fullNamePlaceholder': 'Enter full name',
    'auth.welcome': 'Welcome',
    'auth.signInWith': 'Sign in with',
    'auth.dontHaveAccount': 'Don\'t have an account?',
    'auth.haveAccount': 'Already have an account?',
    
    // Tabs
    'tabs.characters': 'Characters',
    'tabs.dice': 'Dice',
    'tabs.combat': 'Combat',
    'tabs.themes': 'Themes',
    'tabs.games': 'Games',
    
    // Characters
    'characters.title': 'Characters',
    'characters.noGameSelected': 'No game selected',
    'characters.selectGame': 'Select a game from the left menu',
    'characters.createNew': 'Create Character',
    'characters.name': 'Name',
    'characters.class': 'Class',
    'characters.level': 'Level',
    'characters.race': 'Race',
    
    // Dice
    'dice.title': 'Dice Roller',
    'dice.rollResult': 'Roll Result',
    'dice.total': 'Total',
    'dice.modifier': 'Modifier',
    'dice.addModifier': 'Add Modifier',
    'dice.history': 'Roll History',
    'dice.clearHistory': 'Clear History',
    'dice.rollMultiple': 'Roll Multiple',
    'dice.amount': 'Amount',
    
    // Combat
    'combat.title': 'Combat System',
    'combat.initiative': 'Initiative',
    'combat.addCombatant': 'Add Combatant',
    'combat.startCombat': 'Start Combat',
    'combat.endCombat': 'End Combat',
    'combat.nextTurn': 'Next Turn',
    'combat.hp': 'HP',
    'combat.ac': 'AC',
    'combat.name': 'Name',
    'combat.rollInitiative': 'Roll Initiative',
    'combat.damage': 'Damage',
    'combat.heal': 'Heal',
    
    // Themes
    'themes.title': 'Theme Selector',
    'themes.current': 'Current Theme',
    'themes.fantasy': 'Fantasy',
    'themes.dark': 'Dark',
    'themes.cyberpunk': 'Cyberpunk',
    'themes.steampunk': 'Steampunk',
    'themes.horror': 'Horror',
    'themes.space': 'Space',
    'themes.preview': 'Preview',
    'themes.apply': 'Apply',
    
    // Games
    'games.title': 'Games',
    'games.create': 'Create Game',
    'games.join': 'Join Game',
    'games.select': 'Select Game',
    'games.noGames': 'No games',
    'games.createFirst': 'Create your first game',
    
    // Errors
    'error.title': 'Error',
    'error.fillAllFields': 'Please fill all fields',
    'error.passwordMismatch': 'Passwords do not match',
    'error.loginFailed': 'Login failed',
    'error.registerFailed': 'Registration failed',
    'error.generic': 'An error occurred',
    
    // Success
    'success.title': 'Success',
    'success.loginSuccess': 'Successfully logged in',
    'success.registerSuccess': 'Successfully registered',
    'success.saved': 'Saved',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
