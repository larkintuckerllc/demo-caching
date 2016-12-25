import { combineReducers } from 'redux';
import appBlocking from '../ducks/appBlocking';
import offlinePlayable from '../ducks/offlinePlayable';
import onlinePlayable from '../ducks/onlinePlayable';
import fallbackPlayable from '../ducks/fallbackPlayable';
import currentFile from '../ducks/currentFile';
import currentPage from '../ducks/currentPage';

export default combineReducers({
  appBlocking,
  offlinePlayable,
  onlinePlayable,
  fallbackPlayable,
  currentFile,
  currentPage,
});
