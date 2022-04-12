import Home from "../components/Home";
import Details from "../components/Details";
import Library from "../components/Library";
import Search from "../components/Search";
import About from "../components/About";
import NotFound from "../components/NotFound";

import {createRouter, createWebHistory} from "vue-router";
import AppTestActions from "../components/AppTestActions";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/details/:id',
        name: 'Details',
        props: true,
        component: Details
    },
    {
        path: '/library',
        name: 'Library',
        component: Library
    },
    {
        path: '/search',
        name: 'Search',
        component: Search
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/actions',
        name: 'Actions',
        component: AppTestActions
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound
    }
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
