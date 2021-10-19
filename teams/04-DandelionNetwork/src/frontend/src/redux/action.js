/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-09-19 22:41:08
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-21 16:51:43
 */
function connectInit (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'CONNECT_INIT', data });
  };
}

function connnected (data) {
  console.log('全', data);
  return (dispatch, getState) => {
    dispatch({ type: 'CONNECT', data });
  };
}
function connnectSucces (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'CONNECT_SUCCESS', data });
  };
}
function connnectErr (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'CONNECT_ERROR', data });
  };
}
function loadKey (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'LOAD_KEYRING', data });
  };
}
function setKey (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_KEYRING', data });
  };
}
function keyErr (data) {
  return (dispatch, getState) => {
    dispatch({ type: 'KEYRING_ERROR', data });
  };
}

module.exports = {
  connectInit,
  connnected,
  connnectSucces,
  connnectErr,
  loadKey,
  setKey,
  keyErr
};
