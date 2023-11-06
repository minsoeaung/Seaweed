import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react'
import {MoonIcon, SearchIcon, SunIcon} from '@chakra-ui/icons'
import {LuHeart} from "react-icons/lu";
import {FiShoppingCart} from "react-icons/fi";
import {RxPerson} from "react-icons/rx";
import {Link} from "react-router-dom";

const Header = () => {
    const {colorMode, toggleColorMode} = useColorMode()

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} mb={3}
             style={{position: "sticky", top: 0, zIndex: 10}}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Box>
                    <Link to="/">
                        <Heading>
                            Logo
                        </Heading>
                    </Link>
                </Box>

                <InputGroup maxWidth={1000}>
                    <InputLeftElement pointerEvents='none'>
                        <SearchIcon color='gray.300'/>
                    </InputLeftElement>
                    <Input type='tel' placeholder='What are you looking for?' autoComplete='off'/>
                </InputGroup>

                <Flex alignItems={'center'}>
                    <Stack direction={'row'} spacing={1}>
                        <Button onClick={toggleColorMode}>
                            {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                        </Button>

                        <Button rightIcon={<Icon as={LuHeart}/>} variant='ghost'>
                            Wishlist
                        </Button>

                        <Link to="user/register">
                            <Button rightIcon={<Icon as={RxPerson}/>} variant='ghost'>
                                Sign up
                            </Button>
                        </Link>

                        <Button rightIcon={<Icon as={FiShoppingCart}/>} variant='ghost'>
                            Cart
                        </Button>

                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={'sm'}
                                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                                />
                            </MenuButton>
                            <MenuList alignItems={'center'}>
                                <br/>
                                <Center>
                                    <Avatar
                                        size={'2xl'}
                                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                                    />
                                </Center>
                                <br/>
                                <Center>
                                    <p>Username</p>
                                </Center>
                                <br/>
                                <MenuDivider/>
                                <MenuItem>Your Servers</MenuItem>
                                <MenuItem>Account Settings</MenuItem>
                                <MenuItem>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header;