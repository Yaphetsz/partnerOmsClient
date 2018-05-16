import Vue from 'vue';
import Router from 'vue-router';

import Index from '../components/page/Index.vue';
import Home from '../components/page/Home.vue';
import OrgList from '../components/page/OrgList.vue';
import OrgAdd from '../components/page/OrgAdd.vue';
import PartnerList from '../components/page/PartnerList.vue';
import PartnerAdd from '../components/page/PartnerAdd.vue';
import UserList from '../components/page/UserList.vue';
import UserAdd from '../components/page/UserAdd.vue';
import LookInfo from '../components/page/LookInfo.vue';
import NotFound from '../components/common/404.vue';
import ServerError from '../components/common/500.vue';
import Invalid from '../components/common/Invalid.vue';

Vue.use(Router);

const router =  new Router({
    linkActiveClass: 'active',
    routes: [
        {
            name: 'index',
            path: '/',
            component: Index,
            children: [
                {
                  path: '/',
                  component: Home,
                  meta: {requiresAuth: true}
                },
                {
                  path: '/invalid',
                  component: Invalid,
                  meta: {requiresAuth: true}
                },
                {
                    name: 'OrgList',
                    path: '/org/list',
                    component: OrgList,
                    meta: {requiresAuth: true}
                },
                {
                    name: 'OrgAdd',
                    path: '/OrgAdd',
                    component: OrgAdd,
                    meta: {requiresAuth: true}
                },
                {
                    name: 'PartnerList',
                    path: '/partner/list',
                    component: PartnerList,
                    meta: {requiresAuth: true}
                },
                {
                    name: 'PartnerAdd',
                    path: '/partner/add',
                    component: PartnerAdd,
                    meta: {requiresAuth: true}
                },
                {
                    name: 'UserList',
                    path: '/user/list',
                    component: UserList,
                    meta: {requiresAuth: true}
                },
                {
                    name: 'UserAdd',
                    path: '/user/add',
                    component: UserAdd,
                    meta: {requiresAuth: true}
                },
                {
                    name: 'LookInfo',
                    path: '/data',
                    component: LookInfo,
                    meta: {requiresAuth: true}
                },
            ]
        },
        {
            path: '/404',
            component: NotFound,
            meta: {requiresAuth: true}
        },
        {
            path: '/500',
            component: ServerError,
            meta: {requiresAuth: true}
        }
    ]
})

export default router;
