import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
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
    useColorModeValue,
} from '@chakra-ui/react'
import {MoonIcon, SearchIcon, SunIcon} from '@chakra-ui/icons'
import {LuHeart} from "react-icons/lu";
import {FiShoppingCart} from "react-icons/fi";
import {RxPerson} from "react-icons/rx";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import Placeholder from './Placeholder'
import {useAuth} from "../context/AuthContext.tsx";
import {AppLogo} from "./AppLogo.tsx";
import React, {useState} from "react";

const Header = () => {
    const {colorMode, toggleColorMode} = useColorMode();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInputValue, setSearchInputValue] = useState(searchParams.get("searchTerm") || "");
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchParams.set("searchTerm", searchInputValue);
            setSearchParams(searchParams);
            navigate({
                pathname: '/catalog',
                search: searchParams.toString()
            })
        }
    }

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
            <Placeholder minH="12">
                <Flex h={12} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                        <Link to="/">
                            <AppLogo/>
                        </Link>
                    </Box>

                    <InputGroup maxWidth={800}>
                        <InputLeftElement pointerEvents='none'>
                            <SearchIcon color={useColorModeValue('red.500', 'red.300')}/>
                        </InputLeftElement>
                        <Input
                            type='search'
                            placeholder='What are you looking for?'
                            autoComplete='off'
                            name='search'
                            value={searchInputValue}
                            onChange={e => setSearchInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </InputGroup>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={2}>
                            <IconButton
                                aria-label="Color mode"
                                variant="ghost"
                                icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                                onClick={toggleColorMode}
                            />

                            {user && (
                                <Button as={Link} to="/user/wishlist" rightIcon={<Icon as={LuHeart}/>} variant='ghost'>
                                    Wishlist
                                </Button>
                            )}

                            {!user && (
                                <Button as={Link} to="user/login" rightIcon={<Icon as={RxPerson}/>} variant='solid'
                                        colorScheme="blue">
                                    Login
                                </Button>
                            )}


                            {user && (
                                <>
                                    <Button as={Link} to="user/cart" rightIcon={<Icon as={FiShoppingCart}/>}
                                            variant='ghost'>
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
                                                <p>{user.userName}</p>
                                            </Center>
                                            <br/>
                                            <MenuDivider/>
                                            <MenuItem>Account Settings</MenuItem>
                                            <MenuItem onClick={logout}>Logout</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
            </Placeholder>
        </Box>
    )
}

export default Header;