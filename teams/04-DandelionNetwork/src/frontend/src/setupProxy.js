/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-09-21 19:45:49
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-21 20:49:28
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://217.197.161.88:5001',
      pathRewrite: {
        '^/api': ''
      },
      changeOrigin: true
    })
  );
}
;
