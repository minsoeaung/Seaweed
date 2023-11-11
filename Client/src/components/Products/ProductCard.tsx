import {
    AspectRatio,
    Box,
    HStack,
    Image,
    Skeleton,
    Stack,
    StackProps,
    Text,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react'
import {FavouriteButton} from './FavouriteButton'
import {PriceTag} from '../PriceTag'
import {Product} from '../../types/product'
import {useWishList} from "../../hooks/queries/useWishList.ts";
import {useCart} from "../../hooks/queries/useCart.ts";
import {Link} from "react-router-dom";
import {Rating} from "../Rating.tsx";
import {AddToCartButton} from "../AddToCartButton.tsx";

interface Props {
    product: Product
    rootProps?: StackProps
}

export const ProductCard = (props: Props) => {
    const {product, rootProps} = props
    const {name, price} = product

    const {data: wishList} = useWishList();
    const {data: cart} = useCart();

    return (
        <Link to={`/catalog/${product.id}`}>
            <Stack spacing={{base: '4', md: '5'}} {...rootProps}>
                <Box position="relative">
                    <AspectRatio ratio={4 / 3}>
                        <Image
                            src='https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=680&q=80'
                            alt={name}
                            draggable="false"
                            fallback={<Skeleton borderRadius={{base: 'md', md: 'xl'}}/>}
                            borderRadius={{base: 'md', md: 'xl'}}
                        />
                    </AspectRatio>
                    {wishList && (
                        <FavouriteButton
                            iconButtonProps={{
                                position: "absolute",
                                top: "4",
                                right: "4",
                                "aria-label": `Add ${name} to your favourites`
                            }}
                            productId={product.id}
                            isChecked={wishList.findIndex(w => w.productId === product.id) >= 0}
                        />
                    )}
                </Box>
                <Stack>
                    <Stack spacing="1">
                        <Tooltip label={name}>
                            <Text fontWeight="medium" color={useColorModeValue('gray.700', 'gray.400')} noOfLines={1}>
                                {name}
                            </Text>
                        </Tooltip>
                        <PriceTag price={price} salePrice={0} currency="USD"/>
                    </Stack>
                    <HStack>
                        <Rating defaultValue={4} size="sm"/>
                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                            (12)
                        </Text>
                    </HStack>
                </Stack>
                <Stack align="center">
                    <AddToCartButton
                        buttonProps={{isDisabled: !!cart}}
                        productId={product.id}
                        isInCart={cart ? cart.cartItems.findIndex(c => c.product.id === product.id) >= 0 : false}
                    />
                </Stack>
            </Stack>
        </Link>
    )
}