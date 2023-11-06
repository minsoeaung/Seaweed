import {Box, BoxProps} from '@chakra-ui/react'
import Placeholder from './Placeholder'

export const Footer = (props: BoxProps) => {
    return (
        <Box as="footer" role="contentinfo" bg="bg.accent.default" {...props}>
            <Placeholder minH="10">Footer</Placeholder>
        </Box>
    )
}