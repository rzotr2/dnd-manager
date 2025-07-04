
import { CharacterField } from '@/hooks/useCharacters';

// Оновлені теми для персонажів - всі 9 тем
export const CHARACTER_THEMES = {
  'theme-fantasy': 'Фентезі',
  'theme-modern': 'Сучасність', 
  'theme-scifi': 'Наукова фантастика',
  'theme-horror': 'Жахи',
  'theme-western': 'Вестерн',
  'theme-cyberpunk': 'Кіберпанк',
  'theme-steampunk': 'Стімпанк',
  'theme-apocalypse': 'Апокаліпсис',
  'theme-medieval': 'Середньовіччя'
} as const;

// Основні поля для всіх персонажів (тільки основні)
const BASIC_CHARACTER_FIELDS = [
  { name: 'Сила', value: '' },
  { name: 'Спритність', value: '' },
  { name: 'Інтелект', value: '' },
  { name: 'Здоров\'я', value: '' }
];

// Імена для різних тем
const NAMES_BY_THEME = {
  'theme-fantasy': [
    'Аріель', 'Гендальф', 'Леголас', 'Гімлі', 'Боромір', 'Фродо', 'Сем', 'Меррі', 'Піппін',
    'Елронд', 'Галадріель', 'Арагорн', 'Теоден', 'Еомер', 'Эовін', 'Фарамір', 'Денетор'
  ],
  'theme-modern': [
    'Джон', 'Емма', 'Майкл', 'Сара', 'Девід', 'Ліза', 'Крис', 'Анна', 'Том', 'Кейт',
    'Алекс', 'Марія', 'Роберт', 'Дженіфер', 'Джеймс', 'Ешлі', 'Метью', 'Джесіка'
  ],
  'theme-scifi': [
    'Зарон-7', 'Нова', 'Квант', 'Векс', 'Орбіт', 'Пульсар', 'Нейтрон', 'Протон',
    'Гелій', 'Космос', 'Андромеда', 'Сіріус', 'Вега', 'Альтаїр', 'Кассіопея', 'Орион'
  ],
  'theme-horror': [
    'Влад', 'Моргана', 'Равен', 'Дамієн', 'Лілітh', 'Кормак', 'Селена', 'Морбід',
    'Готик', 'Невер', 'Шадоу', 'Крим', 'Дарк', 'Блад', 'Найт', 'Деaтh'
  ],
  'theme-western': [
    'Джессі', 'Віллі', 'Док', 'Ковбой Джо', 'Енні Оклі', 'Буч Кессіді', 'Вайатт Ерп',
    'Біллі Кід', 'Каламіті Джейн', 'Дикий Біл', 'Текс', 'Монтана', 'Дакота', 'Невада'
  ],
  'theme-cyberpunk': [
    'Неон', 'Сайбер', 'Матрікс', 'Піксель', 'Глітч', 'Хакер', 'Рейзор', 'Чіп',
    'Код', 'Байт', 'Вірус', 'Файєрвол', 'Сістем', 'Даta', 'Інтерфейс', 'Термінал'
  ],
  'theme-steampunk': [
    'Профессор Когс', 'Леді Стім', 'Капітан Гіар', 'Інженер Болт', 'Механік Рім',
    'Винахідник Клок', 'Алхімік Пайп', 'Авіатор Фляй', 'Годинникар Тік', 'Ковал Форж'
  ],
  'theme-apocalypse': [
    'Змія', 'Вовк', 'Ворон', 'Сталь', 'Попіл', 'Руїна', 'Скрап', 'Пустка',
    'Виживач', 'Мародер', 'Рейдер', 'Кочовик', 'Мутант', 'Варвар', 'Дикун', 'Сталкер'
  ],
  'theme-medieval': [
    'Сер Родрік', 'Леді Ізабель', 'Лорд Едмунд', 'Дама Маргарет', 'Рицар Гаретh',
    'Принцеса Елінор', 'Король Артур', 'Королева Гінеvrа', 'Герцог Ричард', 'Баронеса Беатріс'
  ]
};

// Функція генерації випадкового персонажа
export const generateRandomCharacter = (theme: keyof typeof CHARACTER_THEMES) => {
  const names = NAMES_BY_THEME[theme] || NAMES_BY_THEME['theme-fantasy'];
  const randomName = names[Math.floor(Math.random() * names.length)];

  // Генеруємо випадкові значення для основних полів
  const fields: CharacterField[] = BASIC_CHARACTER_FIELDS.map(field => ({
    name: field.name,
    value: (Math.floor(Math.random() * 20) + 1).toString() // 1-20
  }));

  return {
    name: randomName,
    theme,
    fields
  };
};

// Функція отримання базових полів для нового персонажа
export const getBasicCharacterFields = (): CharacterField[] => {
  return BASIC_CHARACTER_FIELDS.map(field => ({ ...field }));
};

// Функція перевірки чи тема підтримується
export const isThemeSupported = (theme: string): theme is keyof typeof CHARACTER_THEMES => {
  return theme in CHARACTER_THEMES;
};

// Функція отримання назви теми
export const getThemeName = (theme: keyof typeof CHARACTER_THEMES): string => {
  return CHARACTER_THEMES[theme];
};

// Функція отримання всіх доступних тем
export const getAllThemes = (): Array<{ key: keyof typeof CHARACTER_THEMES; name: string }> => {
  return Object.entries(CHARACTER_THEMES).map(([key, name]) => ({
    key: key as keyof typeof CHARACTER_THEMES,
    name
  }));
};
