/*
 * @Description:
 * @Version: 2.0
 * @Autor: Liyb
 * @Date: 2021-08-24 17:38:31
 * @LastEditors: Liyb
 * @LastEditTime: 2021-09-09 14:33:17
 */
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Layout from './views/layout';
import Home from './views/Home';
import Index from './views/index';

import Page from './views/page';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

function App () {
  return (
    <HashRouter>
      <Switch>
        <Redirect exact from='/' to='/Index'></Redirect>
          <Route exact path='/Index' component={Index}></Route>
          <Route exact path='/Page' component={Layout}></Route>
          <Route exact path='/Page/home' component={Home}></Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
