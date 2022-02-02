import Home from "../components/Home";
import Details from "../components/Details";
import Library from "../components/Library";
import Search from "../components/Search";

import {createRouter, createWebHistory} from "vue-router";

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
    }
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router