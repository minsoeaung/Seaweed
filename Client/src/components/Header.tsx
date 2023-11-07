import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Icon,
    IconButton,
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
} from '@chakra-ui/react'
import {MoonIcon, SearchIcon, SunIcon} from '@chakra-ui/icons'
import {LuHeart} from "react-icons/lu";
import {FiShoppingCart} from "react-icons/fi";
import {RxPerson} from "react-icons/rx";
import {Link} from "react-router-dom";
import Placeholder from './Placeholder'
import {useAuth} from "../context/AuthContext.tsx";

const Header = () => {
    const {colorMode, toggleColorMode} = useColorMode();
    const {user, logout} = useAuth();

    return (
        <Box
            as="nav"
            role="navigation"
            bg="bg.accent.default"
            style={{
                borderBottomStyle: "solid",
                borderBottomWidth: "0.8px",
                borderBottomColor: "gray.200"
            }}
        >
            <Placeholder minH="20">
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                        <Link to="/">
                            <Heading>
                                Logo
                            </Heading>
                        </Link>
                    </Box>

                    <InputGroup maxWidth={800}>
                        <InputLeftElement pointerEvents='none'>
                            <SearchIcon color='gray.300'/>
                        </InputLeftElement>
                        <Input type='search' placeholder='What are you looking for?' autoComplete='off'/>
                    </InputGroup>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={1}>
                            <IconButton
                                aria-label="Color mode"
                                variant="ghost"
                                icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                                onClick={toggleColorMode}
                            />

                            <Button rightIcon={<Icon as={LuHeart}/>} variant='ghost'>
                                Wishlist
                            </Button>

                            {!user && (
                                <Link to="user/login">
                                    <Button rightIcon={<Icon as={RxPerson}/>} variant='ghost'>
                                        Login
                                    </Button>
                                </Link>
                            )}

                            <Button rightIcon={<Icon as={FiShoppingCart}/>} variant='ghost'>
                                Cart
                            </Button>

                            {user && (
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
                                            <p>{user.userName}</p>
                                        </Center>
                                        <br/>
                                        <MenuDivider/>
                                        <MenuItem>Account Settings</MenuItem>
                                        <MenuItem onClick={logout}>Logout</MenuItem>
                                    </MenuList>
                                </Menu>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
            </Placeholder>
        </Box>
    )
}

export default Header;