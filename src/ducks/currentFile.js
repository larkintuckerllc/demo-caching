import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'currentFile';
// ACTIONS
export const SET_CURRENT_FILE = `${ACTION_PREFIX}SET_CURRENT_FILE`;
// SCHEMA
// REDUCERS
export default (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_FILE:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getCurrentFile = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCurrentFile = value =>
  !(value === undefined || typeof value !== 'string');
// ACTION CREATORS
export const setCurrentFile = (value) => {
  if (!validCurrentFile(value)) throw new Error();
  return ({
    type: SET_CURRENT_FILE,
    value,
  });
};
