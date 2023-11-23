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
    useMediaQuery,
} from '@chakra-ui/react';
import { MoonIcon, SearchIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import { LuHeart } from 'react-icons/lu';
import { FiShoppingCart } from 'react-icons/fi';
import { RxPerson } from 'react-icons/rx';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppLogo, AppLogoSlim } from './AppLogo.tsx';
import React, { useState } from 'react';
import { useCart } from '../hooks/queries/useCart.ts';
import { MdOutlineInventory2 } from 'react-icons/md';
import { useMyAccount } from '../hooks/queries/useMyAccount.ts';
import { useAuth } from '../context/AuthContext.tsx';

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInputValue, setSearchInputValue] = useState(searchParams.get('searchTerm') || '');
    const [isMobile] = useMediaQuery('(max-width: 400px)');
    const [searchBoxVisible, setSearchBoxVisible] = useState(window.innerWidth > 400);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const { data: cart } = useCart();
    const { data: account } = useMyAccount();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchParams.set('searchTerm', searchInputValue);
            setSearchParams(searchParams);
            navigate({
                pathname: '/catalog',
                search: searchParams.toString(),
            });
        }
    };

    return (
        <Box
            as="nav"
            role="navigation"
            bg="bg.accent.default"
            minH={12}
            py={{ base: 1, md: 3 }}
            px={{ base: 3, md: 5 }}
            style={{
                borderBottomStyle: 'solid',
                borderBottomWidth: '0.8px',
                borderBottomColor: 'gray.200',
            }}
        >
            <Flex h={12} alignItems={'center'} justifyContent={'space-between'}>
                {isMobile ? (
                    searchBoxVisible ? (
                        <Link to="/">
                            <AppLogoSlim />
                        </Link>
                    ) : (
                        <Link to="/">
                            <AppLogo />
                        </Link>
                    )
                ) : (
                    <Link to="/">
                        <AppLogo />
                    </Link>
                )}

                {(isMobile ? searchBoxVisible : true) && (
                    <InputGroup maxWidth={700}>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color={useColorModeValue('red.500', 'red.300')} />
                        </InputLeftElement>
                        <Input
                            type="search"
                            placeholder={isMobile ? 'Search' : 'What are you looking for?'}
                            autoComplete="off"
                            name="search"
                            value={searchInputValue}
                            onChange={(e) => setSearchInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </InputGroup>
                )}

                <Flex alignItems={'center'}>
                    <Stack direction={'row'} spacing={2}>
                        {(isMobile ? !searchBoxVisible : false) && (
                            <IconButton
                                aria-label="Toggle search box visibility"
                                variant="unstyled"
                                icon={<SearchIcon color={useColorModeValue('red.500', 'red.300')} />}
                                onClick={() => setSearchBoxVisible(!searchBoxVisible)}
                            />
                        )}
                        <IconButton
                            aria-label="Color mode"
                            variant="unstyled"
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                        />

                        {user && !isMobile && (
                            <Button as={Link} to="/user/wishlist" rightIcon={<Icon as={LuHeart} />} variant="ghost">
                                Wishlist
                            </Button>
                        )}

                        {!user && (
                            <Button
                                as={Link}
                                to="/login"
                                rightIcon={<Icon as={RxPerson} />}
                                variant="solid"
                                colorScheme="blue"
                            >
                                Login
                            </Button>
                        )}

                        {user && (
                            <>
                                {!isMobile && (
                                    <Button
                                        as={Link}
                                        to="user/cart"
                                        position="relative"
                                        rightIcon={
                                            <>
                                                <Icon as={FiShoppingCart} />
                                                {!!cart?.cartItems.length && (
                                                    <Box
                                                        as={'span'}
                                                        position={'absolute'}
                                                        top="-2px"
                                                        right={'4px'}
                                                        fontSize={'0.8rem'}
                                                        bgColor={'red'}
                                                        color="white"
                                                        borderRadius={'xl'}
                                                        zIndex={9999}
                                                        p={'2px'}
                                                    >
                                                        {cart?.cartItems.length}
                                                    </Box>
                                                )}
                                            </>
                                        }
                                        variant="ghost"
                                    >
                                        Cart
                                    </Button>
                                )}
                                <Menu autoSelect={false}>
                                    <MenuButton
                                        as={Button}
                                        rounded={'full'}
                                        variant={'link'}
                                        cursor={'pointer'}
                                        minW={0}
                                    >
                                        <Avatar size={'sm'} src={account?.profilePicture} />
                                    </MenuButton>
                                    <MenuList alignItems={'center'} zIndex={3}>
                                        <br />
                                        <Center>
                                            <Avatar size={'2xl'} src={account?.profilePicture} />
                                        </Center>
                                        <br />
                                        <Center>
                                            <p>{user.userName}</p>
                                        </Center>
                                        <br />
                                        <MenuDivider />
                                        <MenuItem as={Link} to="/user/my-account" icon={<SettingsIcon />}>
                                            My Account
                                        </MenuItem>
                                        <MenuItem as={Link} to="/user/wishlist" icon={<Icon as={LuHeart} />}>
                                            Wishlist
                                        </MenuItem>
                                        <MenuItem as={Link} to="/user/cart" icon={<Icon as={FiShoppingCart} />}>
                                            Cart {!!cart?.cartItems.length && `(${cart.cartItems.length})`}
                                        </MenuItem>
                                        {user.roles.some((role) => ['Admin', 'Super'].includes(role)) && (
                                            <>
                                                <MenuDivider />
                                                <MenuItem
                                                    as={Link}
                                                    to="/inventory?pageSize=10"
                                                    icon={<Icon as={MdOutlineInventory2} />}
                                                    fontWeight="bold"
                                                >
                                                    Inventory
                                                </MenuItem>
                                            </>
                                        )}
                                        <MenuDivider />
                                        <MenuItem onClick={logout} color="red.500">
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </>
                        )}
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
