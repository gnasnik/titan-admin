import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/cache',
  name: 'cache',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.cache',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'search-table', // The midline path complies with SEO specifications
      name: 'CacheSearchTable',
      component: () => import('@/views/cache/search-table/index.vue'),
      meta: {
        locale: 'menu.cache.searchTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'cache-profile', // The midline path complies with SEO specifications
      name: 'CacheProfile',
      component: () => import('@/views/cache/profile/index.vue'),
      meta: {
        locale: 'menu.cache.profile',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default LIST;
 