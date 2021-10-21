/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-09-19 22:41:08
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-19 22:59:38
 */
import { createStore } from 'redux';
import reducers from './reducers';

const store = createStore(reducers);
export default store;
