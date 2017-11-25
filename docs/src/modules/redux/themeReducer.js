// @flow

import actionTypes from 'docs/src/modules/redux/actionTypes';

const initialState = {
  paletteType: 'light',
};

type State = {
  paletteType: string,
};

const mapping = {
  [actionTypes.THEME_CHANGE_PALETTE_TYPE]: (state: State, action) => ({
    ...state,
    paletteType: action.payload.paletteType,
  }),
};

function themeReducer(state: State = initialState, action: Object) {
  let newState = state;

  if (mapping[action.type]) {
    newState = mapping[action.type](state, action);
  }

  return newState;
}

export default themeReducer;
