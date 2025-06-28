
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
    description: 'Повний набір характеристик D&D 5e'
  }
];

const FANTASY_NAMES = [
  'Аедриан', 'Беренік', 'Селестія', 'Дрегон', 'Елара', 'Фінрод', 'Гвіневра', 'Халдір',
  'Ізольда', 'Йорвет', 'Кассандра', 'Леголас', 'Мелісанда', 'Ністор', 'Оферія', 'Персіваль',
  'Квендрін', 'Рагнар', 'Серафіна', 'Талліон', 'Урсула', 'Валеріан', 'Зендар', 'Араміс'
];

const SIMPLE_MODE_FIELDS = [
  // Основні характеристики (3-18)
  { name: 'Сила', category: 'stats', min: 3, max: 18 },
  { name: 'Спритність', category: 'stats', min: 3, max: 18 },
  { name: 'Витривалість', category: 'stats', min: 3, max: 18 },
  { name: 'Інтелект', category: 'stats', min: 3, max: 18 },
  { name: 'Мудрість', category: 'stats', min: 3, max: 18 },
  { name: 'Харизма', category: 'stats', min: 3, max: 18 },
  
  // Основні навички (0-5)
  { name: 'Бій', category: 'skills', min: 0, max: 5 },
  { name: 'Магія', category: 'skills', min: 0, max: 5 },
  { name: 'Скритність', category: 'skills', min: 0, max: 5 },
  { name: 'Переконування', category: 'skills', min: 0, max: 5 },
];

const STANDARD_MODE_FIELDS = [
  // Основні характеристики (8-15 + модифікатори)
  { name: 'Сила', category: 'stats', min: 8, max: 15 },
  { name: 'Спритність', category: 'stats', min: 8, max: 15 },
  { name: 'Витривалість', category: 'stats', min: 8, max: 15 },
  { name: 'Інтелект', category: 'stats', min: 8, max: 15 },
  { name: 'Мудрість', category: 'stats', min: 8, max: 15 },
  { name: 'Харизма', category: 'stats', min: 8, max: 15 },
  
  // Навички (-1 до +5)
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
];

const BONUS_ABILITIES = [
  'Вогняна Куля', 'Лікування', 'Невидимість', 'Телепортація', 'Броня Магії',
  'Зачарування Зброї', 'Розмова з Тваринами', 'Польот', 'Щит Світла', 'Темне Бачення'
];

const EQUIPMENT_ITEMS = [
  'Довгий меч', 'Лук та стріли', 'Кинджал', 'Щит', 'Шкіряна броня',
  'Зілля лікування', 'Мотузка', 'Факел', 'Ранець', 'Золоті монети'
];

export const generateRandomCharacter = (mode: 'simple' | 'standard', gameId: string) => {
  const fields = mode === 'simple' ? SIMPLE_MODE_FIELDS : STANDARD_MODE_FIELDS;
  const name = FANTASY_NAMES[Math.floor(Math.random() * FANTASY_NAMES.length)];
  
  const generatedFields = fields.map((field, index) => ({
    id: `${field.category}_${index}`,
    name: field.name,
    value: (Math.floor(Math.random() * (field.max - field.min + 1)) + field.min).toString(),
    type: 'number' as const,
    category: field.category as 'stats' | 'skills',
  }));

  // Додати бонусні здібності
  const bonusAbilities = BONUS_ABILITIES
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map((ability, index) => ({
      id: `ability_${index}`,
      name: ability,
      value: 'Активна здібність',
      type: 'text' as const,
      category: 'abilities' as const,
      isBonus: true,
    }));

  // Додати спорядження
  const equipment = EQUIPMENT_ITEMS
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 2)
    .map((item, index) => ({
      id: `equipment_${index}`,
      name: item,
      value: '1',
      type: 'text' as const,
      category: 'equipment' as const,
    }));

  return {
    game_id: gameId,
    name,
    fields: [...generatedFields, ...bonusAbilities, ...equipment],
  };
};
