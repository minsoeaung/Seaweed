import {Outlet} from "react-router-dom";
import Header from "../../components/Header.tsx";
import {Box, Flex, useColorModeValue} from "@chakra-ui/react";
import {Footer} from "../../components/Footer.tsx";
import {Suspense} from "react";
import {Fallback} from "../../components/Fallback";
import {AuthContextProvider} from "../../context/AuthContext.tsx";

const Root = () => {
    return (
        <AuthContextProvider>
            <Flex minH="100vh" direction="column" flex="1">
                <Header/>
                <Flex
                    as="main"
                    role="main"
                    direction="column"
                    flex="1"
                    bgColor={useColorModeValue("gray.100", "gray.900")}
                >
                    <Box
                        role="presentation"
                        py={3}
                        px={3}
                        minH="lg"
                        bg="bg.accent.default"
                    >
                        <Suspense fallback={<Fallback/>}>
                            <Outlet/>
                        </Suspense>
                    </Box>
                </Flex>
                <Footer justifySelf="end"/>
            </Flex>
        </AuthContextProvider>
    )
}

export default Root;