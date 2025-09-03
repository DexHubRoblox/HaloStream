import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getTheme, setTheme, THEME_UPDATED_EVENT, Theme } from '@/utils/theme';

const ThemeToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  useEffect(() => {
    const updateTheme = () => {
      setCurrentTheme(getTheme());
    };

    updateTheme();
    window.addEventListener(THEME_UPDATED_EVENT, updateTheme);
    
    return () => {
      window.removeEventListener(THEME_UPDATED_EVENT, updateTheme);
    };
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
  };

  const getIcon = () => {
    switch (currentTheme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      case 'system':
        return <Monitor size={18} />;
      default:
        return <Moon size={18} />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-foreground hover:bg-foreground/10"
        >
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;