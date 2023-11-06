import './AntdSpin.css';
import {Center} from "@chakra-ui/react";

const AntdSpin = () => {
    return (
        <Center>
            <div>
            <span className="ant-spin-dot ant-spin-dot-spin">
                <i></i><i></i><i></i><i></i>
            </span>
            </div>
        </Center>
    )
}

export default AntdSpin;