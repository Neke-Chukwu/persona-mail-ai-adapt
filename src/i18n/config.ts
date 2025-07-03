
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to PersonaMail",
      "inbox": "Inbox",
      "starred": "Starred",
      "sent": "Sent",
      "drafts": "Drafts",
      "archive": "Archive",
      "trash": "Trash",
      "compose": "Compose",
      "reply": "Reply",
      "replyAll": "Reply All",
      "forward": "Forward",
      "summarize": "Summarize",
      "aiReply": "AI Reply",
      "settings": "Settings",
      "profile": "Profile"
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
      escapeValue: false
    }
  });

export default i18n;
