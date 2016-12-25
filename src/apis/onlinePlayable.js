import { get, getFile } from '../util/rest';

let onlinePlayableFile = null;
const delay = (ms) => new Promise(resolve => window.setTimeout(resolve, ms));
const getUrl = () => get('online_playable.json')
  .then((response) => (response.url === '' ? null : response.url));
// eslint-disable-next-line
export const getOnlinePlayable = () =>
  delay(2000)
    .then(getUrl)
    .then(url => {
      if (url === null) {
        return {
          url,
          file: null,
        };
      }
      return getFile(url);
    })
    .then(({ url, file }) => {
      if (url === null) {
        onlinePlayableFile = null;
        return url;
      }
      onlinePlayableFile = file;
      return url;
    });
export const getOnlinePlayableFile = () => onlinePlayableFile;
