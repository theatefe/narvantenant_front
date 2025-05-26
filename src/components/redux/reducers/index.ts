// third-party
import { combineReducers } from 'redux';

// project import
import userAuth from './user';
import page from './page';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ userAuth, page });
export type RootState = ReturnType<typeof reducers>;

export default reducers;
