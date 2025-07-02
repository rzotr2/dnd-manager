import { CharacterField, CharacterFieldsData, GeneratedCharacter } from '@/types/character';

export interface GameMode {
  id: 'simple' | 'standard';
  name: string;
  description: string;
}

export const gameModes: GameMode[] = [
  {
    id: 'simple',
    name: 'Спрощений режим',
    description: 'Основні характеристики та кілька навичок для швидкої гри'
  },
  {
    id: 'standard',
    name: 'Стандартний режим',
    description: 'Повний набір характеристик відповідно до теми'
  }
];

const FANTASY_NAMES = [
  'Аедріан', 'Беренік', 'Селестія', 'Дрегон', 'Елара', 'Фінрод', 'Гвіневра', 'Халдір',
  'Ізольда', 'Йорвет', 'Кассандра', 'Леголас', 'Мелісанда', 'Ністор', 'Оферія', 'Персіваль'
];

const STALKER_NAMES = [
  'Стрілок', 'Призрак', 'Майор', 'Сокіл', 'Вовк', 'Ворон', 'Снайпер', 'Охотник',
  'Тінь', 'Вітер', 'Блискавка', 'Туман', 'Крук', 'Беркут', 'Рись', 'Барс'
];

const CYBERPUNK_NAMES = [
  'Неон', 'Кібер', 'Матрикс', 'Вайрус', 'Хакер', 'Даркнет', 'Піксель', 'Коде',
  'Схема', 'Чіп', 'Байт', 'Декс', 'Джек', 'Реза', 'Зеро', 'Трейс'
];

// Поля для різних тем
const FANTASY_FIELDS = {
  simple: [
    { name: 'Сила', category: 'stats', min: 8, max: 18 },
    { name: 'Спритність', category: 'stats', min: 8, max: 18 },
    { name: 'Витривалість', category: 'stats', min: 8, max: 18 },
    { name: 'Інтелект', category: 'stats', min: 8, max: 18 },
    { name: 'Мудрість', category: 'stats', min: 8, max: 18 },
    { name: 'Харизма', category: 'stats', min: 8, max: 18 },
    { name: 'Бій', category: 'skills', min: 0, max: 5 },
    { name: 'Магія', category: 'skills', min: 0, max: 5 },
    { name: 'Скритність', category: 'skills', min: 0, max: 5 },
    { name: 'Переконування', category: 'skills', min: 0, max: 5 },
  ],
  standard: [
    { name: 'Сила', category: 'stats', min: 8, max: 15 },
    { name: 'Спритність', category: 'stats', min: 8, max: 15 },
    { name: 'Витривалість', category: 'stats', min: 8, max: 15 },
    { name: 'Інтелект', category: 'stats', min: 8, max: 15 },
    { name: 'Мудрість', category: 'stats', min: 8, max: 15 },
    { name: 'Харизма', category: 'stats', min: 8, max: 15 },
    { name: 'Акробатика', category: 'skills', min: -1, max: 5 },
    { name: 'Атлетика', category: 'skills', min: -1, max: 5 },
    { name: 'Скритність', category: 'skills', min: -1, max: 5 },
    { name: 'Обман', category: 'skills', min: -1, max: 5 },
    { name: 'Історія', category: 'skills', min: -1, max: 5 },
    { name: 'Інсайт', category: 'skills', min: -1, max: 5 },
    { name: 'Залякування', category: 'skills', min: -1, max: 5 },
    { name: 'Медицина', category: 'skills', min: -1, max: 5 },
    { name: 'Природа', category: 'skills', min: -1, max: 5 },
    { name: 'Сприйняття', category: 'skills', min: -1, max: 5 },
    { name: 'Переконування', category: 'skills', min: -1, max: 5 },
    { name: 'Релігія', category: 'skills', min: -1, max: 5 },
    { name: 'Рукоділля', category: 'skills', min: -1, max: 5 },
    { name: 'Виживання', category: 'skills', min: -1, max: 5 },
  ]
};

const STALKER_FIELDS = {
  simple: [
    { name: 'БХ (Бойові характеристики)', category: 'stats', min: 5, max: 10 },
    { name: 'Сила (СИЛ)', category: 'stats', min: 5, max: 10 },
    { name: 'Спритність (СПР)', category: 'stats', min: 5, max: 10 },
    { name: 'Сприйняття (СПРН)', category: 'stats', min: 5, max: 10 },
    { name: 'Харизма (ХАР)', category: 'stats', min: 5, max: 10 },
    { name: 'Інтелект (ІНТ)', category: 'stats', min: 5, max: 10 },
    { name: 'Ближній бій', category: 'skills', min: 0, max: 5 },
    { name: 'Вогнепальна зброя', category: 'skills', min: 0, max: 5 },
    { name: 'Непомітність', category: 'skills', min: 0, max: 5 },
    { name: 'Виживання', category: 'skills', min: 0, max: 5 },
  ],
  standard: [
    { name: 'БХ (Бойові характеристики)', category: 'stats', min: 5, max: 10 },
    { name: 'Сила (СИЛ)', category: 'stats', min: 5, max: 10 },
    { name: 'Спритність (СПР)', category: 'stats', min: 5, max: 10 },
    { name: 'Сприйняття (СПРН)', category: 'stats', min: 5, max: 10 },
    { name: 'Харизма (ХАР)', category: 'stats', min: 5, max: 10 },
    { name: 'Інтелект (ІНТ)', category: 'stats', min: 5, max: 10 },
    { name: 'ОЗ (Очки здоров\'я)', category: 'stats', min: 50, max: 100 },
    { name: 'РБ (Ранг броні)', category: 'stats', min: 0, max: 10 },
    // Навички на основі Сили
    { name: 'Атлетизм', category: 'skills', min: 0, max: 5 },
    { name: 'Ближній бій', category: 'skills', min: 0, max: 5 },
    { name: 'Витривалість', category: 'skills', min: 0, max: 5 },
    // Навички на основі Спритності
    { name: 'Непомітність', category: 'skills', min: 0, max: 5 },
    { name: 'Акробатика', category: 'skills', min: 0, max: 5 },
    { name: 'Спритність рук', category: 'skills', min: 0, max: 5 },
    // Навички на основі Інтелекту
    { name: 'Розслідування', category: 'skills', min: 0, max: 5 },
    { name: 'Знання', category: 'skills', min: 0, max: 5 },
    { name: 'Майстрування', category: 'skills', min: 0, max: 5 },
    // Навички на основі Сприйняття
    { name: 'Пошук прихованого', category: 'skills', min: 0, max: 5 },
    { name: 'Володіння вогнепальною зброєю', category: 'skills', min: 0, max: 5 },
    { name: 'Виживання', category: 'skills', min: 0, max: 5 },
    { name: 'Психологія', category: 'skills', min: 0, max: 5 },
    // Навички на основі Харизми
    { name: 'Переконання', category: 'skills', min: 0, max: 5 },
    { name: 'Обман', category: 'skills', min: 0, max: 5 },
    { name: 'Залякування', category: 'skills', min: 0, max: 5 },
    { name: 'Виступ', category: 'skills', min: 0, max: 5 },
  ]
};

const CYBERPUNK_FIELDS = {
  simple: [
    { name: 'Тіло', category: 'stats', min: 2, max: 10 },
    { name: 'Інтелект', category: 'stats', min: 2, max: 10 },
    { name: 'Рефлекси', category: 'stats', min: 2, max: 10 },
    { name: 'Технологія', category: 'stats', min: 2, max: 10 },
    { name: 'Круті', category: 'stats', min: 2, max: 10 },
    { name: 'Привабливість', category: 'stats', min: 2, max: 10 },
    { name: 'Хакінг', category: 'skills', min: 0, max: 10 },
    { name: 'Вогнепальна зброя', category: 'skills', min: 0, max: 10 },
    { name: 'Водіння', category: 'skills', min: 0, max: 10 },
    { name: 'Переконування', category: 'skills', min: 0, max: 10 },
  ],
  standard: [
    { name: 'Тіло', category: 'stats', min: 2, max: 10 },
    { name: 'Інтелект', category: 'stats', min: 2, max: 10 },
    { name: 'Рефлекси', category: 'stats', min: 2, max: 10 },
    { name: 'Технологія', category: 'stats', min: 2, max: 10 },
    { name: 'Круті', category: 'stats', min: 2, max: 10 },
    { name: 'Привабливість', category: 'stats', min: 2, max: 10 },
    { name: 'Рукопашний бій', category: 'skills', min: 0, max: 10 },
    { name: 'Атлетика', category: 'skills', min: 0, max: 10 },
    { name: 'Хакінг', category: 'skills', min: 0, max: 10 },
    { name: 'Кібертехнології', category: 'skills', min: 0, max: 10 },
    { name: 'Вогнепальна зброя', category: 'skills', min: 0, max: 10 },
    { name: 'Скритність', category: 'skills', min: 0, max: 10 },
    { name: 'Водіння', category: 'skills', min: 0, max: 10 },
    { name: 'Переконування', category: 'skills', min: 0, max: 10 },
    { name: 'Обман', category: 'skills', min: 0, max: 10 },
    { name: 'Медицина', category: 'skills', min: 0, max: 10 },
  ]
};

const ABILITIES_BY_THEME = {
  'theme-fantasy': [
    'Вогняна Куля', 'Лікування', 'Невидимість', 'Телепортація', 'Броня Магії',
    'Зачарування Зброї', 'Розмова з Тваринами', 'Польот', 'Щит Світла', 'Темне Бачення'
  ],
  'theme-stalker': [
    'Артефакт Детектор', 'Швидке Лікування', 'Стійкість до Радіації', 'Анти-рад',
    'Посилена Витривалість', 'Нічне Бачення', 'Тихий Хід', 'Меткість', 'Виживання в Зоні'
  ],
  'theme-cyberpunk': [
    'Кібер-очі', 'Підсилені Рефлекси', 'Нейро-інтерфейс', 'Кібер-руки',
    'Субдермальна Броня', 'Хакерський Імплант', 'Посилена Пам\'ять', 'Стелс-система'
  ],
  'theme-scifi': [
    'Енергетичний Щит', 'Телепатія', 'Фазовий Зсув', 'Гравітаційний Контроль',
    'Квантове Переміщення', 'Біо-регенерація', 'Псі-атака', 'Часовий Стоп'
  ]
};

const EQUIPMENT_BY_THEME = {
  'theme-fantasy': [
    'Довгий меч', 'Лук та стріли', 'Кинджал', 'Щит', 'Шкіряна броня',
    'Зілля лікування', 'Мотузка', 'Факел', 'Ранець', 'Золоті монети'
  ],
  'theme-stalker': [
    'АК-74', 'ПМ Пістолет', 'Детектор аномалій', 'Респіратор', 'Бронежилет',
    'Аптечка', 'Консерви', 'Ліхтар', 'Рюкзак', 'Радіометр'
  ],
  'theme-cyberpunk': [
    'Смарт-пістолет', 'Монофільный клинок', 'Кібер-дека', 'Біо-маска', 'Броне-куртка',
    'Стимпаки', 'Енергетичні батарейки', 'Голографічний дисплей', 'Нейро-чіп', 'Кредстік'
  ],
  'theme-scifi': [
    'Плазмова гвинтівка', 'Енергетичний меч', 'Сканер', 'Екзо-костюм', 'Силовий щит',
    'Нано-ліки', 'Гравітаційний генератор', 'Голо-проектор', 'Квантовий комп\'ютер', 'Кредити'
  ]
};

const getFieldsByTheme = (theme: string, mode: 'simple' | 'standard') => {
  switch (theme) {
    case 'theme-stalker':
      return STALKER_FIELDS[mode];
    case 'theme-cyberpunk':
      return CYBERPUNK_FIELDS[mode];
    case 'theme-scifi':
      return CYBERPUNK_FIELDS[mode]; // Використовуємо cyberpunk як основу
    default:
      return FANTASY_FIELDS[mode];
  }
};

const getNamesByTheme = (theme: string) => {
  switch (theme) {
    case 'theme-stalker':
      return STALKER_NAMES;
    case 'theme-cyberpunk':
    case 'theme-scifi':
      return CYBERPUNK_NAMES;
    default:
      return FANTASY_NAMES;
  }
};

// New function that returns properly structured CharacterField array
export const getCharacterFieldsTemplate = (theme: string = 'theme-fantasy', mode: 'simple' | 'standard' = 'simple'): CharacterField[] => {
  const fields = getFieldsByTheme(theme, mode);
  
  return fields.map(field => ({
    name: field.name,
    value: '',
    type: field.category === 'stats' ? 'number' as const : 'text' as const,
    category: field.category as 'basic' | 'stats' | 'skills' | 'equipment' | 'notes'
  }));
};

export const generateRandomCharacter = (theme: string = 'theme-fantasy', empty: boolean = false): GeneratedCharacter => {
  const mode: 'simple' | 'standard' = 'simple'; // Default to simple mode
  const fields = getFieldsByTheme(theme, mode);
  const names = getNamesByTheme(theme);
  const name = names[Math.floor(Math.random() * names.length)];
  
  if (empty) {
    // Return empty character with just field structure
    const emptyFields: CharacterFieldsData = {};
    fields.forEach((field) => {
      emptyFields[field.name] = '';
    });
    
    // Add description fields
    emptyFields['Візуальний опис'] = '';
    emptyFields['Особлива прикмета'] = '';
    emptyFields['Минуле та характер'] = '';
    emptyFields['Звички та захоплення'] = '';
    
    return {
      name: '',
      fields: emptyFields
    };
  }
  
  const generatedFields: CharacterFieldsData = {};
  
  // Generate random values for each field
  fields.forEach((field) => {
    generatedFields[field.name] = (Math.floor(Math.random() * (field.max - field.min + 1)) + field.min).toString();
  });

  // Add bonus abilities
  const abilities = ABILITIES_BY_THEME[theme] || ABILITIES_BY_THEME['theme-fantasy'];
  const bonusAbilities = abilities
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);
    
  bonusAbilities.forEach((ability) => {
    generatedFields[`${ability}`] = 'Опис здібності тут...';
  });

  // Add equipment
  const equipment = EQUIPMENT_BY_THEME[theme] || EQUIPMENT_BY_THEME['theme-fantasy'];
  const selectedEquipment = equipment
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 2);
    
  selectedEquipment.forEach((item) => {
    generatedFields[`Спорядження: ${item}`] = '1';
  });

  // Add description fields
  generatedFields['Візуальний опис'] = '';
  generatedFields['Особлива прикмета'] = '';
  generatedFields['Минуле та характер'] = '';
  generatedFields['Звички та захоплення'] = '';

  return {
    name,
    fields: generatedFields
  };
};

// Keep the old function for backward compatibility but mark as deprecated
export const generateBlankCharacter = (gameId: string, theme: string = 'theme-fantasy', mode: 'simple' | 'standard' = 'simple') => {
  console.warn('generateBlankCharacter is deprecated, use generateRandomCharacter with empty=true');
  const result = generateRandomCharacter(theme, true);
  return {
    game_id: gameId,
    name: result.name,
    theme,
    fields: result.fields,
  };
};
