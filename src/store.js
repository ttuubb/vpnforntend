import { createStore, combineReducers } from 'redux';

// 初始状态
const initialState = {
  auth: {
    token: null,
  },
};

// Reducer
const authReducer = (state = initialState.auth, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// 创建 Store
const store = createStore(rootReducer);

export default store;
