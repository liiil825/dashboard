import _ from 'lodash';
import { compile } from 'path-to-regexp';

import user from 'providers/user';
import { roleToPortal } from 'config/roles';
import routeNames, { portals } from './names';

const noHeaderPaths = ['/login', '/user/provider/apply'];

const noFooterPaths = ['/login', '/user/provider/apply'];

const commonRoutes = ['', 'apps', 'login', 'logout'];

export const getRouteByName = name => {
  const route = _.get(routeNames, name);
  if (!route) {
    throw Error(`invalid route: ${name}`);
  }
  return route;
};

export const toRoute = (route = '', params = {}) => {
  if (typeof params === 'string') {
    params = {
      portal: params
    };
  }
  const guessPortal = getPortalFromPath();
  const portal = params.portal || guessPortal;

  if (route.indexOf('.') > 0) {
    route = getRouteByName(route);
  }
  if (portal && guessPortal && portal !== guessPortal) {
    const portalInPath = portals.includes(getPortalFromPath(route));
    if (portalInPath) {
      // replace current portal
      route = route.replace(/\w+/i, portal);
    } else {
      route = withPrefix(route, portal);
    }
  }
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }
  // map params keys
  params = _.mapValues(
    Object.assign(params, { portal: portal || 'user' }),
    val => `${val}`
  );

  return compile(route)(params);
};

export const getPortalFromPath = (path = location.pathname) => {
  const p = path.split('/')[1];
  if (commonRoutes.includes(p)) {
    return '';
  }
  if (path.startsWith('/profile')) {
    // to fix
    const role = user.isISV ? 'isv' : user.role;
    return roleToPortal[role];
  }
  if (portals.includes(p)) {
    return p;
  }
  return '';
};

export const needAuth = (path, portal) => portals.includes(portal) || path === '/profile';

export const pathWithoutHeader = path => {
  const portal = getPortalFromPath();
  return noHeaderPaths.includes(path) || (portal && portal !== 'user');
};

export const pathWithoutFooter = path => noFooterPaths.includes(path);

export const withPrefix = (url, prefix = '') => {
  if (prefix) {
    return url.replace(':protal', prefix);
  }

  return url;
};

export UserRoutes from './portals/user';
export DevRoutes from './portals/dev';
export IsvRoutes from './portals/isv';
export AdminRoutes from './portals/admin';

export default routeNames;
