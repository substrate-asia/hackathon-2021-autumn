/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-08-25 10:32:26
 */
module.exports = function override (webpackConfig) {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  },
  {
    test: /\.less$/,
    use: [{
      loader: 'style-loader'
    }, {
      loader: 'css-loader' // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
      options: {
        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
          modifyVars: {
           'primary-color': '#1DA57A',
           'link-color': '#1DA57A',
           'border-radius-base': '2px',
         },
          javascriptEnabled: true
        }
      }
    }]
  });

  return webpackConfig;
};
