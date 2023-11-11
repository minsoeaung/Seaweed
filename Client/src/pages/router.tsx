import {createBrowserRouter} from "react-router-dom";
import Root from "./Root";
import {lazy} from "react";
import HomePage from "./Home";

const About = lazy(() => import('./About'));
const Register = lazy(() => import('./User/Register'));
const Login = lazy(() => import('./User/Login'));
const CatalogPage = lazy(() => import('./Catalog'));
const WishListPage = lazy(() => import('./User/WishList'));
const CartPage = lazy(() => import('./User/Cart/index.tsx'));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Root/>
        ),
        children: [
            {path: "", element: <HomePage/>},
            {path: "about", element: <About/>},
            {path: "user/register", element: <Register/>},
            {path: "user/login", element: <Login/>},
            {path: "user/wishlist", element: <WishListPage/>},
            {path: "user/cart", element: <CartPage/>},
            {path: "catalog", element: <CatalogPage/>},
        ]
    },
]);

export default router;