
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      inbox: "Inbox",
      starred: "Starred",
      sent: "Sent",
      drafts: "Drafts",
      archive: "Archive",
      trash: "Trash",
      settings: "Settings",
      profile: "Profile",
      compose: "Compose",
      reply: "Reply",
      forward: "Forward",
      delete: "Delete",
      search: "Search mail",
      welcome: "Welcome to PersonaMail AI",
      logout: "Sign out"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
