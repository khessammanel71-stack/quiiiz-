import { DEFAULT_CONFIG, ASSET_IMAGES } from '../data/experimentData';
import { UserConfig } from '../types';

const STORAGE_KEY = 'the_birthday_experiment_config_v2';

export function loadUserConfig(): UserConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  // Check URL params first so a shareable link works instantly on his phone!
  try {
    const params = new URLSearchParams(window.location.search);
    const urlNickname = params.get('nick') || params.get('name');
    const urlSender = params.get('from') || params.get('sender');
    const urlRel = params.get('rel');
    const urlHumor = params.get('humor');
    const urlMsg = params.get('msg');

    if (urlNickname || urlSender || urlRel || urlHumor || urlMsg) {
      return {
        nickname: urlNickname || DEFAULT_CONFIG.nickname,
        senderName: urlSender || DEFAULT_CONFIG.senderName,
        relationship: (urlRel as UserConfig['relationship']) || DEFAULT_CONFIG.relationship,
        relationshipLabel: getRelationshipLabel(urlRel || DEFAULT_CONFIG.relationship),
        humorStyle: (urlHumor as UserConfig['humorStyle']) || DEFAULT_CONFIG.humorStyle,
        personalMessage: urlMsg ? decodeURIComponent(urlMsg) : DEFAULT_CONFIG.personalMessage,
        age: DEFAULT_CONFIG.age,
      };
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.nickname === 'Handsome Overthinker') {
        parsed.nickname = 'Nazim';
      }
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load user config', e);
  }

  return DEFAULT_CONFIG;
}

export function saveUserConfig(config: UserConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save user config', e);
  }
}

export function generateShareableUrl(config: UserConfig): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('nick', config.nickname);
  if (config.senderName) url.searchParams.set('from', config.senderName);
  url.searchParams.set('rel', config.relationship);
  url.searchParams.set('humor', config.humorStyle);
  if (config.personalMessage && config.personalMessage !== DEFAULT_CONFIG.personalMessage) {
    url.searchParams.set('msg', encodeURIComponent(config.personalMessage));
  }
  return url.toString();
}

export function getRelationshipLabel(rel: string): string {
  switch (rel) {
    case 'boyfriend':
      return 'My Boyfriend ❤️';
    case 'crush':
      return 'My Crush 🤭';
    case 'special':
      return 'Someone I love (unofficial) ✨';
    case 'complicated':
      return 'Something complicated 😂';
    default:
      return 'Favorite Human 💫';
  }
}

export { ASSET_IMAGES };
