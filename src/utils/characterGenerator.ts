
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

export const generateRandomCharacter = (mode: 'simple' | 'standard', gameId: string, theme: string = 'theme-fantasy') => {
  const fields = getFieldsByTheme(theme, mode);
  const names = getNamesByTheme(theme);
  const name = names[Math.floor(Math.random() * names.length)];
  
  const generatedFields = fields.map((field, index) => ({
    id: `${field.category}_${index}`,
    name: field.name,
    value: (Math.floor(Math.random() * (field.max - field.min + 1)) + field.min).toString(),
    type: 'number' as const,
    category: field.category as 'stats' | 'skills',
  }));

  // Додати бонусні здібності (тепер textarea)
  const abilities = ABILITIES_BY_THEME[theme] || ABILITIES_BY_THEME['theme-fantasy'];
  const bonusAbilities = abilities
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map((ability, index) => ({
      id: `ability_${index}`,
      name: ability,
      value: 'Опис здібності тут...',
      type: 'textarea' as const,
      category: 'abilities' as const,
      isBonus: true,
    }));

  // Додати спорядження
  const equipment = EQUIPMENT_BY_THEME[theme] || EQUIPMENT_BY_THEME['theme-fantasy'];
  const selectedEquipment = equipment
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 2)
    .map((item, index) => ({
      id: `equipment_${index}`,
      name: item,
      value: '1',
      type: 'text' as const,
      category: 'equipment' as const,
    }));

  // Додати додаткові поля опису (textarea)
  const descriptionFields = [
    { id: 'visual_description', name: 'Візуальний опис', value: '', type: 'textarea' as const, category: 'other' as const },
    { id: 'special_feature', name: 'Особлива прикмета', value: '', type: 'textarea' as const, category: 'other' as const },
    { id: 'background', name: 'Минуле та характер', value: '', type: 'textarea' as const, category: 'other' as const },
    { id: 'habits', name: 'Звички та захоплення', value: '', type: 'textarea' as const, category: 'other' as const },
  ];

  return {
    game_id: gameId,
    name,
    theme,
    fields: [...generatedFields, ...bonusAbilities, ...selectedEquipment, ...descriptionFields],
  };
};

export const generateBlankCharacter = (gameId: string, theme: string = 'theme-fantasy', mode: 'simple' | 'standard' = 'simple') => {
  const fields = getFieldsByTheme(theme, mode);
  
  const blankFields = fields.map((field, index) => ({
    id: `${field.category}_${index}`,
    name: field.name,
    value: '',
    type: 'number' as const,
    category: field.category as 'stats' | 'skills',
  }));

  // Додати порожні поля здібностей (textarea)
  const abilityFields = [
    { id: 'ability_1', name: 'Здібність 1', value: '', type: 'textarea' as const, category: 'abilities' as const },
    { id: 'ability_2', name: 'Здібність 2', value: '', type: 'textarea' as const, category: 'abilities' as const },
  ];

  // Додати порожні поля спорядження
  const equipmentFields = [
    { id: 'equipment_1', name: 'Зброя', value: '', type: 'text' as const, category: 'equipment' as const },
    { id: 'equipment_2', name: 'Броня', value: '', type: 'text' as const, category: 'equipment' as const },
    { id: 'equipment_3', name: 'Інше спорядження', value: '', type: 'text' as const, category: 'equipment' as const },
  ];

  // Додати поля опису (textarea)
  const descriptionFields = [
    { id: 'visual_description', name: 'Візуальний опис', value: '', type: 'textarea' as const, category: 'other' as const },
    { id: 'special_feature', name: 'Особлива прикмета', value: '', type: 'textarea' as const, category: 'other' as const },
    { id: 'background', name: 'Минуле та характер', value: '', type: 'textarea' as const, category: 'other' as const },
    { id: 'habits', name: 'Звички та захоплення', value: '', type: 'textarea' as const, category: 'other' as const },
  ];

  return {
    game_id: gameId,
    name: 'Новий персонаж',
    theme,
    fields: [...blankFields, ...abilityFields, ...equipmentFields, ...descriptionFields],
  };
};
