import {AbsoluteCenter, Box} from "@chakra-ui/react";
import AntdSpin from "./AntdSpin";

const PageLoading = () => {
    return (
        <Box position='relative' h='300px'>
            <AbsoluteCenter p='4' axis='both'>
                <AntdSpin/>
            </AbsoluteCenter>
        </Box>
    )
}

export default PageLoading;