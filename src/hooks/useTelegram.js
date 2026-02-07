import { useEffect, useState } from 'react';

export const useTelegram = () => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      setTg(tg);
      setUser(tg.initDataUnsafe?.user);
      
      // Expand the app
      tg.expand();
      
      // Set theme
      document.documentElement.setAttribute('data-theme', tg.colorScheme);
      
      // Handle theme changes
      tg.onEvent('themeChanged', () => {
        document.documentElement.setAttribute('data-theme', tg.colorScheme);
      });
    }
  }, []);

  return {
    tg,
    user,
    isTelegram: !!window.Telegram?.WebApp,
    sendData: (data) => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify(data));
      }
    },
    closeApp: () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      }
    }
  };
};