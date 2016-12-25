import { combineReducers } from 'redux';
import { ServerException } from '../util/exceptions';
import * as fromDefaultPlayableApi from '../apis/defaultPlayable';
import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'defaultPlayable';
// ACTIONS
export const FETCH_DEFAULT_PLAYABLE_REQUEST = `${ACTION_PREFIX}FETCH_DEFAULT_PLAYABLE_REQUEST`;
export const FETCH_DEFAULT_PLAYABLE_SUCCESS = `${ACTION_PREFIX}FETCH_DEFAULT_PLAYABLE_SUCCESS`;
export const FETCH_DEFAULT_PLAYABLE_ERROR = `${ACTION_PREFIX}FETCH_DEFAULT_PLAYABLE_ERROR`;
export const RESET_FETCH_DEFAULT_PLAYABLE_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_DEFAULT_PLAYABLE_ERROR`;
// SCHEMA
// REDUCERS
const value = (state = fromDefaultPlayableApi.getStoredDefaultPlayable(), action) => {
  switch (action.type) {
    case FETCH_DEFAULT_PLAYABLE_SUCCESS:
      return action.value;
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_DEFAULT_PLAYABLE_REQUEST:
      return true;
    case FETCH_DEFAULT_PLAYABLE_SUCCESS:
    case FETCH_DEFAULT_PLAYABLE_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_DEFAULT_PLAYABLE_ERROR:
      return action.message;
    case FETCH_DEFAULT_PLAYABLE_REQUEST:
    case FETCH_DEFAULT_PLAYABLE_SUCCESS:
    case RESET_FETCH_DEFAULT_PLAYABLE_ERROR:
      return null;
    default:
      return state;
  }
};
export default combineReducers({
  value,
  isAsync,
  asyncErrorMessage,
});
// ACCESSORS AKA SELECTORS
export const getDefaultPlayable = (state) => state[reducerMountPoint].value;
export const getIsFetchingDefaultPlayable = (state) => state[reducerMountPoint].isAsync;
export const getFetchDefaultPlayableErrorMessage
  = (state) => state[reducerMountPoint].asyncErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchDefaultPlayable = () => (dispatch, getState) => {
  if (getIsFetchingDefaultPlayable(getState())) throw new Error();
  dispatch({
    type: FETCH_DEFAULT_PLAYABLE_REQUEST,
  });
  return fromDefaultPlayableApi.getDefaultPlayable()
    .then(
      response => dispatch({
        type: FETCH_DEFAULT_PLAYABLE_SUCCESS,
        value: response,
      }),
      error => {
        dispatch({
          type: FETCH_DEFAULT_PLAYABLE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
// MISC
export const getStoredDefaultPlayableFile
  = () => fromDefaultPlayableApi.getStoredDefaultPlayableFile();
