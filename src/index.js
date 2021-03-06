import 'promise-polyfill/src/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import App from './App';
import RootStore from './stores/RootStore';
import renderRoute from './routes/renderRoute';
import SockClient from './utils/sock-client';
import i18n from './i18n';

const store = new RootStore(window.__INITIAL_STATE__);
store.registerStores();

if (typeof window !== 'undefined') {
  const AppWithRouter = withRouter(App);

  import('./routes').then(({ default: routes }) => {
    let sc = null;
    const sockEndpoint = SockClient.composeEndpoint(store.socketUrl);
    try {
      sc = new SockClient(sockEndpoint);
      sc.setUp();
    } catch (err) {
      console.warn(err);
    }

    ReactDOM.render(
      <I18nextProvider i18n={i18n}>
        <Provider rootStore={store} sessInfo={null} sock={sc}>
          <BrowserRouter>
            <AppWithRouter>
              <Switch>
                {routes.map((route, i) => (
                  <Route
                    key={i}
                    exact={route.exact}
                    path={route.path}
                    render={({ match }) => renderRoute(match, route, store)}
                  />
                ))}
              </Switch>
            </AppWithRouter>
          </BrowserRouter>
        </Provider>
      </I18nextProvider>,
      document.getElementById('root')
    );
  });
}

// attach hmr, deprecate react-hot-loader
// module.hot && module.hot.accept();
