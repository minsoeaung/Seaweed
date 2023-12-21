import { HStack, Image } from '@chakra-ui/react';
import logo from '../assets/logo.png';
import logoSlim from '../assets/logo_small.png';

type Props = {
    size?: 'small' | 'large';
};

export const AppLogo = ({ size = 'large' }: Props) => {
    return (
        <HStack spacing={0} width={size === 'small' ? '160px' : '200px'} justifyContent="center" alignItems="center">
            <Image src={logo} />
        </HStack>
    );
};

export const AppLogoSlim = () => {
    return (
        <HStack spacing={0} maxW="32px" justifyContent="center" alignItems="center">
            <Image src={logoSlim} />
        </HStack>
    );
};
