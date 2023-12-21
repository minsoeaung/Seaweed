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
    InputRightElement,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Stack,
    Text,
    useBreakpointValue,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { ArrowRightIcon, MoonIcon, SearchIcon, SettingsIcon, SunIcon } from '@chakra-ui/icons';
import { LuHeart } from 'react-icons/lu';
import { FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppLogo, AppLogoSlim } from './AppLogo.tsx';
import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/queries/useCart.ts';
import { MdOutlineInventory2 } from 'react-icons/md';
import { useAuth } from '../context/AuthContext.tsx';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useWishList } from '../hooks/queries/useWishList.ts';
import { useMyAccount } from '../hooks/queries/useMyAccount.ts';

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInputValue, setSearchInputValue] = useState(searchParams.get('searchTerm') || '');

    const { isOpen, onClose, onOpen } = useDisclosure();

    const isMobile = useBreakpointValue({
        base: true,
        sm: true,
        xs: true,
        md: false,
    });

    const { user, setUser, logout } = useAuth();

    const navigate = useNavigate();

    const { data: wishList } = useWishList();
    const { data: cart } = useCart();
    const { data: myAccount } = useMyAccount();

    useEffect(() => {
        if (myAccount) {
            setUser(myAccount);
        }
    }, [myAccount]);

    const search = () => {
        searchParams.set('searchTerm', searchInputValue);
        setSearchParams(searchParams);
        navigate({
            pathname: '/catalog',
            search: searchParams.toString(),
        });
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            search();
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
                <Link to="/catalog">
                    {isMobile ? (
                        <Box pr={5}>
                            <AppLogoSlim />
                        </Box>
                    ) : (
                        <AppLogo />
                    )}
                </Link>
                <Flex alignItems="center">
                    <Stack direction="row" spacing={{ base: 1, md: 2 }} alignItems="center">
                        <IconButton
                            aria-label="Toggle search box visibility"
                            variant="ghost"
                            icon={<SearchIcon color={useColorModeValue('red.500', 'red.300')} />}
                            onClick={onOpen}
                            size={{ base: 'sm', md: 'md' }}
                        />
                        <IconButton
                            aria-label="Color mode"
                            variant="ghost"
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            size={{ base: 'sm', md: 'md' }}
                        />

                        {user && !isMobile && (
                            <Button
                                as={Link}
                                to="/user/wishlist"
                                variant="ghost"
                                rightIcon={
                                    <>
                                        <Icon as={LuHeart} />
                                        {!!wishList?.length && (
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
                                                {wishList.length}
                                            </Box>
                                        )}
                                    </>
                                }
                            >
                                Wishlist
                            </Button>
                        )}

                        {!user && (
                            <>
                                <Button
                                    as={Link}
                                    to="/login"
                                    variant="outline"
                                    colorScheme="blue"
                                    size={{ base: 'sm', md: 'md' }}
                                >
                                    Login
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="solid"
                                    colorScheme="blue"
                                    size={{ base: 'sm', md: 'md' }}
                                >
                                    Sign up
                                </Button>
                            </>
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
                                                        {cart.cartItems.length}
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
                                        <Avatar size={'sm'} src={user?.profilePicture} />
                                    </MenuButton>
                                    <MenuList alignItems={'center'} zIndex={3} maxW="3xs">
                                        <br />
                                        <Center>
                                            <Avatar size={'2xl'} src={user?.profilePicture} />
                                        </Center>
                                        <br />
                                        <Text textAlign="center" fontWeight="bold">
                                            {user.userName}
                                        </Text>
                                        <br />
                                        <MenuDivider />
                                        <MenuItem
                                            as={Link}
                                            to="/user/my-orders"
                                            icon={<Icon as={IoDocumentTextOutline} />}
                                        >
                                            My Orders
                                        </MenuItem>
                                        <MenuItem as={Link} to="/user/wishlist" icon={<Icon as={LuHeart} />}>
                                            Wish List {!!wishList?.length && `(${wishList.length})`}
                                        </MenuItem>
                                        <MenuItem as={Link} to="/user/cart" icon={<Icon as={FiShoppingCart} />}>
                                            Cart {!!cart?.cartItems.length && `(${cart.cartItems.length})`}
                                        </MenuItem>
                                        <MenuItem as={Link} to="/user/my-account" icon={<SettingsIcon />}>
                                            My Account
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mx={3}>
                    <ModalBody p={0}>
                        <InputGroup maxWidth={700} size="lg">
                            <Input
                                placeholder="What are you looking for?"
                                autoComplete="off"
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                fontSize="xl"
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Search"
                                    icon={<ArrowRightIcon />}
                                    size="lg"
                                    variant="link"
                                    colorScheme="blue"
                                    onClick={search}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Header;
