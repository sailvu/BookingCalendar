import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '@/components/FrontPage'
import Calendar from '@/components/Calendar'
import Reservations from '@/components/Reservations'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
  issuer: 'https://dev-853892.oktapreview.com/oauth2/default',
  client_id: '0oaet5au0mgJFXKr90h7',
  redirect_uri: 'http://104.236.198.128/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'FrontPage',
      component: FrontPage
    },
    {
      path: '/kalenteri',
      name: 'Calendar',
      component: Calendar,
      meta: {
        // requiresAuth: true
      }
    },
    {
      path: '/varaukseni',
      name: 'Reservations',
      component: Reservations,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
