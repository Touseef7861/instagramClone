import {takeEvery,put} from 'redux-saga/effects'
import { USER_LIST } from './constants';
import { Set_User_Data } from './constants';
function* userList(){
const url ='https://dummyjson.com/users';
let data = yield fetch(url);
data= yield data.json();
yield put({type:Set_User_Data,data})
}
function* SagaData(){
yield takeEvery(USER_LIST,userList)
}

export default SagaData;