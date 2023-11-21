import { Box, BoxProps, IconButton, Stack, useColorModeValue } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { AppLogo } from './AppLogo.tsx';
import { Link } from 'react-router-dom';

export const Footer = (props: BoxProps) => {
    return (
        <Box
            as="footer"
            role="contentinfo"
            {...props}
            bg="bg.accent.default"
            color={useColorModeValue('gray.700', 'gray.200')}
        >
            <Box
                as={Stack}
                py={4}
                px={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}
            >
                <AppLogo />
                <p>© {new Date().getFullYear()} Name. All rights reserved.</p>
                <Stack direction={'row'} spacing={6}>
                    <IconButton
                        as={Link}
                        to="https://github.com/minsoeaung/Seaweed"
                        target="_blank"
                        isRound
                        variant="solid"
                        colorScheme="linkedin"
                        aria-label="Github link"
                        icon={<FaGithub />}
                    />
                </Stack>
            </Box>
        </Box>
    );
};
