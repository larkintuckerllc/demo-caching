import { combineReducers } from 'redux';
import appBlocking from '../ducks/appBlocking';
import defaultPlayable from '../ducks/defaultPlayable';
import playable from '../ducks/playable';
import fallbackPlayable from '../ducks/fallbackPlayable';
import currentFile from '../ducks/currentFile';
import currentPage from '../ducks/currentPage';

export default combineReducers({
  appBlocking,
  defaultPlayable,
  playable,
  fallbackPlayable,
  currentFile,
  currentPage,
});
