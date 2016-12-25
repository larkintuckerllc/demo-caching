import { ACTION_PREFIX } from '../strings';

// API
// REDUCER MOUNT POINT
const reducerMountPoint = 'currentPage';
// ACTIONS
export const SET_CURRENT_PAGE = `${ACTION_PREFIX}SET_CURRENT_PAGE`;
// SCHEMA
// REDUCERS
export default (state = 1, action) => {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return action.value;
    default:
      return state;
  }
};
// ACCESSORS AKA SELECTORS
export const getCurrentPage = (state) => state[reducerMountPoint];
// ACTION CREATOR VALIDATORS
const validCurrentPage = value =>
  !(value === undefined || typeof value !== 'number');
// ACTION CREATORS
export const setCurrentPage = (value) => {
  if (!validCurrentPage(value)) throw new Error();
  return ({
    type: SET_CURRENT_PAGE,
    value,
  });
};
