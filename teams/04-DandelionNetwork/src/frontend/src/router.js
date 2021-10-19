/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 19:47:02
 * @LastEditors: Liyb
 * @LastEditTime: 2021-08-24 19:51:51
 */
const MenuConfig = [
  {
    title: '首页',
    key: '/home'
  },
  {
    title: '用户状态',
    key: '/user',
    children: [
      {
        title: '受捐人',
        key: '/user/a'
      },
      {
        title: '捐助人',
        key: '/user/b'
      }
    ]
  },
  {
    title: '关于我们',
    key: '/about'
  }
];
export default MenuConfig
;
