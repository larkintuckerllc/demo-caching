import { get, getFile } from '../util/rest';

const DEFAULT_PLAYABLE_URL = 'default_playable_url';
const DEFAULT_PLAYABLE_FILE = 'default_playable_file';
const delay = (ms) => new Promise(resolve => window.setTimeout(resolve, ms));
const getUrl = () => get('default_playable.json')
  .then((response) => (response.url === '' ? null : response.url));
export const getDefaultPlayable = () =>
  delay(2000)
    .then(getUrl)
    .then(url => {
      const urlStorage = window.localStorage.getItem(DEFAULT_PLAYABLE_URL);
      const fileStorage = window.localStorage.getItem(DEFAULT_PLAYABLE_FILE);
      if (url === null) {
        return {
          url,
          file: null,
        };
      }
      if (url === urlStorage) {
        return {
          url,
          file: fileStorage,
        };
      }
      return getFile(url);
    })
    .then(({ url, file }) => {
      if (url === null) {
        window.localStorage.removeItem(DEFAULT_PLAYABLE_URL);
        window.localStorage.removeItem(DEFAULT_PLAYABLE_FILE);
        return url;
      }
      window.localStorage.setItem(DEFAULT_PLAYABLE_URL, url);
      window.localStorage.setItem(DEFAULT_PLAYABLE_FILE, file);
      return url;
    });
export const getStoredDefaultPlayable = () =>
  window.localStorage.getItem(DEFAULT_PLAYABLE_URL);
export const getStoredDefaultPlayableFile = () =>
  window.localStorage.getItem(DEFAULT_PLAYABLE_FILE);
