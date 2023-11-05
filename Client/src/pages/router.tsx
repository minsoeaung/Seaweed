import {createBrowserRouter} from "react-router-dom";
import Root from "./Root";
import {lazy} from "react";
import HomePage from "./Home";

const About = lazy(() => import('./About'));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Root/>
        ),
        children: [
            {path: "", element: <HomePage/>},
            {path: "about", element: <About/>},
        ]
    },
]);

export default router;