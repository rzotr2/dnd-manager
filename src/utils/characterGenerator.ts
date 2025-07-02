
import { CharacterFieldsData, CharacterField } from '@/types/character';

interface FieldTemplate {
  [key: string]: {
    label: string;
    type: 'text' | 'number' | 'textarea';
    category: 'basic' | 'stats' | 'skills' | 'equipment' | 'notes';
    placeholder?: string;
  };
}

export const getCharacterFieldsTemplate = (theme: string = 'theme-fantasy'): FieldTemplate => {
  const baseTemplate: FieldTemplate = {
    // Basic Info
    class: { label: 'Class', type: 'text', category: 'basic', placeholder: 'e.g., Warrior, Mage' },
    level: { label: 'Level', type: 'number', category: 'basic', placeholder: '1' },
    race: { label: 'Race', type: 'text', category: 'basic', placeholder: 'e.g., Human, Elf' },
    background: { label: 'Background', type: 'text', category: 'basic', placeholder: 'e.g., Noble, Criminal' },
    
    // Stats
    health: { label: 'Health Points', type: 'number', category: 'stats', placeholder: '100' },
    armor: { label: 'Armor Class', type: 'number', category: 'stats', placeholder: '10' },
    speed: { label: 'Speed', type: 'number', category: 'stats', placeholder: '30' },
    strength: { label: 'Strength', type: 'number', category: 'stats', placeholder: '10' },
    dexterity: { label: 'Dexterity', type: 'number', category: 'stats', placeholder: '10' },
    constitution: { label: 'Constitution', type: 'number', category: 'stats', placeholder: '10' },
    intelligence: { label: 'Intelligence', type: 'number', category: 'stats', placeholder: '10' },
    wisdom: { label: 'Wisdom', type: 'number', category: 'stats', placeholder: '10' },
    charisma: { label: 'Charisma', type: 'number', category: 'stats', placeholder: '10' },
    
    // Skills
    acrobatics: { label: 'Acrobatics', type: 'number', category: 'skills', placeholder: '0' },
    athletics: { label: 'Athletics', type: 'number', category: 'skills', placeholder: '0' },
    stealth: { label: 'Stealth', type: 'number', category: 'skills', placeholder: '0' },
    investigation: { label: 'Investigation', type: 'number', category: 'skills', placeholder: '0' },
    perception: { label: 'Perception', type: 'number', category: 'skills', placeholder: '0' },
    survival: { label: 'Survival', type: 'number', category: 'skills', placeholder: '0' },
    
    // Equipment
    weapons: { label: 'Weapons', type: 'textarea', category: 'equipment', placeholder: 'List your weapons...' },
    armor_equipment: { label: 'Armor', type: 'textarea', category: 'equipment', placeholder: 'Describe your armor...' },
    items: { label: 'Items', type: 'textarea', category: 'equipment', placeholder: 'List your items...' },
    money: { label: 'Money', type: 'text', category: 'equipment', placeholder: 'e.g., 100 gold' },
    
    // Notes
    backstory: { label: 'Backstory', type: 'textarea', category: 'notes', placeholder: 'Tell your character\'s story...' },
    personality: { label: 'Personality', type: 'textarea', category: 'notes', placeholder: 'Describe personality traits...' },
    ideals: { label: 'Ideals', type: 'textarea', category: 'notes', placeholder: 'What drives your character...' },
    bonds: { label: 'Bonds', type: 'textarea', category: 'notes', placeholder: 'Important relationships...' },
    flaws: { label: 'Flaws', type: 'textarea', category: 'notes', placeholder: 'Character weaknesses...' },
    notes_field: { label: 'Additional Notes', type: 'textarea', category: 'notes', placeholder: 'Any other notes...' },
  };

  // Theme-specific modifications
  if (theme === 'theme-stalker') {
    return {
      ...baseTemplate,
      faction: { label: 'Faction', type: 'text', category: 'basic', placeholder: 'e.g., Loners, Duty, Freedom' },
      reputation: { label: 'Reputation', type: 'text', category: 'basic', placeholder: 'Standing with factions' },
      equipment_condition: { label: 'Equipment Condition', type: 'text', category: 'equipment', placeholder: 'Condition of gear' },
      artifacts: { label: 'Artifacts', type: 'textarea', category: 'equipment', placeholder: 'List artifacts and their effects...' },
      anomalous_effects: { label: 'Anomalous Effects', type: 'textarea', category: 'notes', placeholder: 'Any anomalous effects...' },
      contacts: { label: 'Contacts', type: 'textarea', category: 'notes', placeholder: 'Important contacts in the Zone...' },
      debts: { label: 'Debts', type: 'textarea', category: 'notes', placeholder: 'Debts and obligations...' },
      hideout: { label: 'Hideout', type: 'text', category: 'equipment', placeholder: 'Location of your hideout' },
      mental_state: { label: 'Mental State', type: 'text', category: 'stats', placeholder: 'Current mental condition' },
      radiation_level: { label: 'Radiation Level', type: 'number', category: 'stats', placeholder: '0' },
    };
  }

  if (theme === 'theme-cyberpunk') {
    return {
      ...baseTemplate,
      street_cred: { label: 'Street Cred', type: 'number', category: 'basic', placeholder: '0' },
      corp_standing: { label: 'Corp Standing', type: 'text', category: 'basic', placeholder: 'Corporate affiliations' },
      cyberware: { label: 'Cyberware', type: 'textarea', category: 'equipment', placeholder: 'List installed cyberware...' },
      netrunning: { label: 'Netrunning', type: 'number', category: 'skills', placeholder: '0' },
      hacking: { label: 'Hacking', type: 'number', category: 'skills', placeholder: '0' },
      tech_use: { label: 'Tech Use', type: 'number', category: 'skills', placeholder: '0' },
    };
  }

  if (theme === 'theme-scifi') {
    return {
      ...baseTemplate,
      species: { label: 'Species', type: 'text', category: 'basic', placeholder: 'e.g., Human, Alien' },
      planet_origin: { label: 'Planet of Origin', type: 'text', category: 'basic', placeholder: 'Home planet' },
      tech_level: { label: 'Tech Level', type: 'number', category: 'stats', placeholder: '1' },
      psi_powers: { label: 'Psi Powers', type: 'textarea', category: 'skills', placeholder: 'Psychic abilities...' },
      ship: { label: 'Ship/Vehicle', type: 'textarea', category: 'equipment', placeholder: 'Describe your ship...' },
      credits: { label: 'Credits', type: 'number', category: 'equipment', placeholder: '1000' },
    };
  }

  return baseTemplate;
};

export const generateBlankCharacter = (theme: string = 'theme-fantasy'): { name: string; fields: CharacterFieldsData } => {
  const template = getCharacterFieldsTemplate(theme);
  const fields: CharacterFieldsData = {};
  
  // Initialize all fields with empty values
  Object.keys(template).forEach(key => {
    const field = template[key];
    fields[key] = field.type === 'number' ? 0 : '';
  });

  return {
    name: '',
    fields,
  };
};
