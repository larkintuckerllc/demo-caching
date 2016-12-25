import { getFile } from '../util/rest';

let fallbackPlayableFile = null;
export const getFallbackPlayable = () =>
    getFile('fallback.pdf')
    .then(({ url, file }) => {
      fallbackPlayableFile = file;
      return url;
    });
export const getFallbackPlayableFile = () => fallbackPlayableFile;
