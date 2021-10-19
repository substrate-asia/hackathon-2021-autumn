/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-09-19 22:40:48
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-19 23:03:25
 */
export const ADD = 'ADD';
export function addTodo (text) {
  return { type: ADD, text };
}
