
// Define proper TypeScript interfaces for character fields
export interface CharacterField {
  name: string;
  value: string | number;
  type: 'text' | 'number' | 'textarea';
  category: 'basic' | 'stats' | 'skills' | 'equipment' | 'notes';
}

export interface CharacterFieldsData {
  [fieldName: string]: string | number;
}

export interface GeneratedCharacter {
  name: string;
  fields: CharacterFieldsData;
}
