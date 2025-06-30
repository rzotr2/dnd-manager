
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value: 'uk' | 'en') => setLanguage(value)}>
      <SelectTrigger className="w-20 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="uk">🇺🇦</SelectItem>
        <SelectItem value="en">🇺🇸</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
