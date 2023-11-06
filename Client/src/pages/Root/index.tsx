import {Outlet} from "react-router-dom";
import Header from "../../components/Header.tsx";
import {Suspense} from "react";
import PageLoading from "../../components/PageLoading.tsx";

const Root = () => {
    return (
        <>
            <Header/>
            <Suspense fallback={<PageLoading/>}>
                <Outlet/>
            </Suspense>
        </>
    )
}

export default Root;