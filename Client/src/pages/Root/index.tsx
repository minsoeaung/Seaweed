import {Outlet} from "react-router-dom";
import Header from "../../components/Header.tsx";
import {Flex, useColorModeValue} from "@chakra-ui/react";
import {Footer} from "../../components/Footer.tsx";
import Placeholder from "../../components/Placeholder.tsx";
import {Suspense} from "react";
import PageLoading from "../../components/PageLoading.tsx";

const Root = () => {
    return (
        <Flex minH="100vh" direction="column" flex="1">
            <Header/>
            <Flex as="main" role="main" direction="column" flex="1" bgColor={useColorModeValue("gray.100", "gray.900")}>
                <Placeholder minH="lg" bg="bg.accent.default">
                    <Suspense fallback={<PageLoading/>}>
                        <Outlet/>
                    </Suspense>
                </Placeholder>
            </Flex>
            <Footer justifySelf="end"/>
        </Flex>
    )
}

export default Root;