import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
      },

      // categories
      {
        path: 'categories',
        name: 'categories.index',
        component: () => import('@/views/categories/CategoryListView.vue'),
      },
      {
        path: 'categories/create',
        name: 'categories.create',
        component: () => import('@/views/categories/CategoryCreateView.vue'),
      },
      {
        path: 'categories/:id/edit',
        name: 'categories.edit',
        component: () => import('@/views/categories/CategoryEditView.vue'),
        props: true,
      },

      // products
      {
        path: 'products',
        name: 'products.index',
        component: () => import('@/views/products/ProductListView.vue'),
      },
      {
        path: 'products/create',
        name: 'products.create',
        component: () => import('@/views/products/ProductCreateView.vue'),
      },
      {
        path: 'products/:id/edit',
        name: 'products.edit',
        component: () => import('@/views/products/ProductEditView.vue'),
        props: true,
      },

      // orders
      {
        path: 'orders',
        name: 'orders.index',
        component: () => import('@/views/orders/OrderListView.vue'),
      },
      {
        path: 'orders/:id',
        name: 'orders.show',
        component: () => import('@/views/orders/OrderDetailsView.vue'),
        props: true,
      },

      // banners
      {
        path: 'banners',
        name: 'banners.index',
        component: () => import('@/views/banners/BannerListView.vue'),
      },
      {
        path: 'banners/create',
        name: 'banners.create',
        component: () => import('@/views/banners/BannerCreateView.vue'),
      },
      {
        path: 'banners/:id/edit',
        name: 'banners.edit',
        component: () => import('@/views/banners/BannerEditView.vue'),
        props: true,
      },

      // content blocks
      {
        path: 'content-blocks',
        name: 'contentBlocks.index',
        component: () =>
          import('@/views/content-blocks/ContentBlockListView.vue'),
      },
      {
        path: 'content-blocks/create',
        name: 'contentBlocks.create',
        component: () =>
          import('@/views/content-blocks/ContentBlockCreateView.vue'),
      },
      {
        path: 'content-blocks/:id/edit',
        name: 'contentBlocks.edit',
        component: () =>
          import('@/views/content-blocks/ContentBlockEditView.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    try {
      await authStore.initializeAuth();
    } catch (error) {
      return '/login';
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login';
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return '/dashboard';
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/login';
  }
});

export default router;
