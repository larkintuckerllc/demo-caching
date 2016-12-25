import { combineReducers } from 'redux';
import { ServerException } from '../util/exceptions';
import * as fromOnlinePlayableApi from '../apis/onlinePlayable';
import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'onlinePlayable';
// ACTIONS
export const FETCH_ONLINE_PLAYABLE_REQUEST = `${ACTION_PREFIX}FETCH_ONLINE_PLAYABLE_REQUEST`;
export const FETCH_ONLINE_PLAYABLE_SUCCESS = `${ACTION_PREFIX}FETCH_ONLINE_PLAYABLE_SUCCESS`;
export const FETCH_ONLINE_PLAYABLE_ERROR = `${ACTION_PREFIX}FETCH_ONLINE_PLAYABLE_ERROR`;
export const RESET_FETCH_ONLINE_PLAYABLE_ERROR
  = `${ACTION_PREFIX}RESET_FETCH_ONLINE_PLAYABLE_ERROR`;
// SCHEMA
// REDUCERS
const value = (state = null, action) => {
  switch (action.type) {
    case FETCH_ONLINE_PLAYABLE_SUCCESS:
      return action.value;
    default:
      return state;
  }
};
const isAsync = (state = false, action) => {
  switch (action.type) {
    case FETCH_ONLINE_PLAYABLE_REQUEST:
      return true;
    case FETCH_ONLINE_PLAYABLE_SUCCESS:
    case FETCH_ONLINE_PLAYABLE_ERROR:
      return false;
    default:
      return state;
  }
};
const asyncErrorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_ONLINE_PLAYABLE_ERROR:
      return action.message;
    case FETCH_ONLINE_PLAYABLE_REQUEST:
    case FETCH_ONLINE_PLAYABLE_SUCCESS:
    case RESET_FETCH_ONLINE_PLAYABLE_ERROR:
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
export const getOnlinePlayable = (state) => state[reducerMountPoint].value;
export const getIsFetchingOnlinePlayable = (state) => state[reducerMountPoint].isAsync;
export const getFetchOnlinePlayableErrorMessage
  = (state) => state[reducerMountPoint].asyncErrorMessage;
// ACTION CREATOR VALIDATORS
// ACTION CREATORS
export const fetchOnlinePlayable = () => (dispatch, getState) => {
  if (getIsFetchingOnlinePlayable(getState())) throw new Error();
  dispatch({
    type: FETCH_ONLINE_PLAYABLE_REQUEST,
  });
  return fromOnlinePlayableApi.getOnlinePlayable()
    .then(
      response => dispatch({
        type: FETCH_ONLINE_PLAYABLE_SUCCESS,
        value: response,
      }),
      error => {
        dispatch({
          type: FETCH_ONLINE_PLAYABLE_ERROR,
          message: error.message,
        });
        throw new ServerException(error.message);
      }
    );
};
// MISC
export const getOnlinePlayableFile = () => fromOnlinePlayableApi.getOnlinePlayableFile();
