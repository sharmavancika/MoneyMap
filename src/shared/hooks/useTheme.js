import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useStore();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
};

export const useLocalStorage = (key, defaultValue) => {
  const getValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  };
  const setValue = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('LocalStorage write failed');
    }
  };
  return [getValue(), setValue];
};
