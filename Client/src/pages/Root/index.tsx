import {Container} from "@chakra-ui/react";
import {Outlet} from "react-router-dom";
import Header from "../../components/Header.tsx";

const Root = () => {
    return (
        <>
            <Header/>
            <Container>
                <Outlet/>
            </Container>
        </>
    )
}

export default Root;