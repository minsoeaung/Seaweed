import {Outlet} from "react-router-dom";
import Header from "../../components/Header.tsx";
import {Flex} from "@chakra-ui/react";
import {Footer} from "../../components/Footer.tsx";
import Placeholder from "../../components/Placeholder.tsx";
import {Suspense} from "react";
import PageLoading from "../../components/PageLoading.tsx";

const Root = () => {
    return (
        <Flex direction="column" flex="1">
            <Header/>
            <Flex as="main" role="main" direction="column" flex="1">
                <Placeholder minH="lg" bg="bg.accent.default">
                    <Suspense fallback={<PageLoading/>}>
                        <Outlet/>
                    </Suspense>
                </Placeholder>
            </Flex>
            <Footer/>
        </Flex>
    )
}

export default Root;