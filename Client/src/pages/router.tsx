import {createBrowserRouter, Navigate, Outlet} from "react-router-dom";
import Root from "./Root";
import {lazy} from "react";
import HomePage from "./Home";
import NotFoundPage from "./NotFound";
import {useAuth} from "../context/AuthContext.tsx";

const About = lazy(() => import('./About'));
const Register = lazy(() => import('./User/Register'));
const Login = lazy(() => import('./User/Login'));
const CatalogPage = lazy(() => import('./Catalog'));
const ProductDetailPage = lazy(() => import('./Catalog/ProductDetail'));
const WishListPage = lazy(() => import('./User/WishList'));
const CartPage = lazy(() => import('./User/Cart/index.tsx'));
const MyAccountPage = lazy(() => import('./User/MyAccount'));
const InventoryPage = lazy(() => import("./Inventory"));

const ProtectedRoute = ({onlyFor}: { onlyFor: string[] }) => {
    const {user} = useAuth();

    if (!user || !user.roles.some(role => onlyFor.includes(role))) {
        return <Navigate to="/catalog" replace/>
    }

    return (
        <Outlet/>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Root/>
        ),
        children: [
            {path: "", element: <HomePage/>},
            {path: "about", element: <About/>},
            {path: "register", element: <Register/>},
            {path: "login", element: <Login/>},
            {path: "catalog", element: <CatalogPage/>},
            {path: "catalog/:id", element: <ProductDetailPage/>},
            {
                path: "user",
                element: <ProtectedRoute onlyFor={["User"]}/>,
                children: [
                    {
                        path: "wishlist",
                        element: <WishListPage/>
                    },
                    {
                        path: "cart",
                        element: <CartPage/>
                    },
                    {
                        path: "my-account",
                        element: <MyAccountPage/>
                    }
                ]
            },
            {
                path: "inventory",
                element: <ProtectedRoute onlyFor={["Super", "Admin"]}/>,
                children: [
                    {
                        path: "",
                        element: <InventoryPage/>
                    }
                ]
            },
            {path: "*", element: <NotFoundPage/>},
        ],
    },
]);

export default router;