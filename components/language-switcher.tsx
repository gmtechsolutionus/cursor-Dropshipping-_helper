'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
      title={language === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      <Languages className="h-5 w-5" />
      <span className="ml-2 text-sm font-medium">
        {language === 'en' ? 'CN' : 'EN'}
      </span>
    </Button>
  );
}
