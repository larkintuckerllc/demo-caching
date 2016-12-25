import { get, getFile } from '../util/rest';

const OFFLINE_PLAYABLE_URL = 'offline_playable_url';
const OFFLINE_PLAYABLE_FILE = 'offline_playable_file';
const delay = (ms) => new Promise(resolve => window.setTimeout(resolve, ms));
const getUrl = () => get('offline_playable.json')
  .then((response) => (response.url === '' ? null : response.url));
export const getOfflinePlayable = () =>
  delay(2000)
    .then(getUrl)
    .then(url => {
      const urlStorage = window.localStorage.getItem(OFFLINE_PLAYABLE_URL);
      const fileStorage = window.localStorage.getItem(OFFLINE_PLAYABLE_FILE);
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
        window.localStorage.removeItem(OFFLINE_PLAYABLE_URL);
        window.localStorage.removeItem(OFFLINE_PLAYABLE_FILE);
        return url;
      }
      window.localStorage.setItem(OFFLINE_PLAYABLE_URL, url);
      window.localStorage.setItem(OFFLINE_PLAYABLE_FILE, file);
      return url;
    });
export const getOfflinePlayableFile = () =>
  window.localStorage.getItem(OFFLINE_PLAYABLE_FILE);
