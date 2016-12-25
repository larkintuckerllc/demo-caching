import { get, getFile } from '../util/rest';

let playableFile = null;
const delay = (ms) => new Promise(resolve => window.setTimeout(resolve, ms));
const getUrl = () => get('playable.json')
  .then((response) => (response.url === '' ? null : response.url));
// eslint-disable-next-line
export const getPlayable = () =>
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
        playableFile = null;
        return url;
      }
      playableFile = file;
      return url;
    });
export const getPlayableFile = () => playableFile;
