import Home from "../components/Home";
import Details from "../components/Details";
import Library from "../components/Library";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/details',
        name: 'Details',
        component: Details
    },
    {
        path: '/library',
        name: 'Library',
        component: Library
    }
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router