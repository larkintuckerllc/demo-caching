import { combineReducers } from 'redux';
import { ServerException } from '../util/exceptions';
import * as fromFallbackPlayableApi from '../apis/fallbackPlayable';
import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'fallbackPlayable';
// ACTIONS
export const FETCH_FALLBACK_PLAYABLE_REQUEST = `${ACTION_PREFIX}FETCH_FALLBACK_PLAYABLE_REQUEST`;
export const FETCH_FALLBACK_PLAYABLE_SUCCESS = `${ACTION_PREFIX}FETCH_FALLBACK_PLAYABLE_SUCCESS`;
export const FETCH_FALLBACK_PLAYABLE_ERROR = `${ACTION_PREFIX}FETCH_FALLBACK_PLAYABLE_ERROR`;
export const RESET_FETCH_FALLBACK_PLAYABLE_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_FALLBACK_PLAYABLE_ERROR`;
// SCHEMA
// REDUCERS
const value = (state = null, action) => {
  switch (action.type) {
    case FETCH_FALLBACK_PLAYABLE_SUCCESS:
      return action.value;
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_FALLBACK_PLAYABLE_REQUEST:
      return true;
    case FETCH_FALLBACK_PLAYABLE_SUCCESS:
    case FETCH_FALLBACK_PLAYABLE_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_FALLBACK_PLAYABLE_ERROR:
      return action.message;
    case FETCH_FALLBACK_PLAYABLE_REQUEST:
    case FETCH_FALLBACK_PLAYABLE_SUCCESS:
    case RESET_FETCH_FALLBACK_PLAYABLE_ERROR:
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
export const getFallbackPlayable = (state) => state[reducerMountPoint].value;
export const getIsFetchingFallbackPlayable = (state) => state[reducerMountPoint].isAsync;
export const getFetchFallbackPlayableErrorMessage
  = (state) => state[reducerMountPoint].asyncErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchFallbackPlayable = () => (dispatch, getState) => {
  if (getIsFetchingFallbackPlayable(getState())) throw new Error();
  dispatch({
    type: FETCH_FALLBACK_PLAYABLE_REQUEST,
  });
  return fromFallbackPlayableApi.getFallbackPlayable()
    .then(
      response => dispatch({
        type: FETCH_FALLBACK_PLAYABLE_SUCCESS,
        value: response,
      }),
      error => {
        dispatch({
          type: FETCH_FALLBACK_PLAYABLE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
// MISC
export const getFallbackPlayableFile = () => fromFallbackPlayableApi.getFallbackPlayableFile();
