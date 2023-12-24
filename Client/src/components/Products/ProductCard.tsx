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
} from '@chakra-ui/react';
import { FavouriteButton } from './FavouriteButton';
import { PriceTag } from '../PriceTag';
import { Product } from '../../types/product';
import { useNavigate } from 'react-router-dom';
import { Rating } from '../Rating.tsx';
import { AddToCartButton } from '../AddToCartButton.tsx';
import { PRODUCT_IMAGES } from '../../constants/fileUrls.ts';
import placeholderImage from '../../assets/placeholderImage.webp';
import { memo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';

interface Props {
    product: Product;
    isInWishList: boolean;
    isInCart: boolean;
    rootProps?: StackProps;
}

export const ProductCard = memo((props: Props) => {
    const { product, rootProps, isInWishList, isInCart } = props;
    const { name, price, averageRating, numOfRatings } = product;
    const [imageSrc, setImageSrc] = useState(PRODUCT_IMAGES + product.id);

    const { user } = useAuth();

    const navigate = useNavigate();

    const goToDetailPage = () => navigate(`/catalog/${product.id}`);

    return (
        <Stack spacing={{ base: '4', md: '5' }} {...rootProps} cursor="pointer" onClick={goToDetailPage}>
            <Box position="relative">
                <AspectRatio ratio={4 / 3}>
                    <Image
                        src={imageSrc}
                        alt={name}
                        draggable="false"
                        fallback={<Skeleton borderRadius={{ base: 'md', md: 'xl' }} />}
                        onError={() => {
                            setImageSrc(placeholderImage);
                        }}
                        borderRadius={{ base: 'md', md: 'xl' }}
                    />
                </AspectRatio>
                {user && (
                    <FavouriteButton
                        iconButtonProps={{
                            position: 'absolute',
                            top: '4',
                            right: '4',
                            'aria-label': `Add ${name} to your favourites`,
                        }}
                        productId={product.id}
                        isChecked={isInWishList}
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
                    <PriceTag price={price} currency="USD" />
                </Stack>
                <HStack>
                    <Rating max={5} defaultValue={averageRating} size="sm" />
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                        ({numOfRatings})
                    </Text>
                </HStack>
            </Stack>
            <Stack align="center">
                {product.quantityInStock === 0 ? (
                    <Text fontStyle="italic" fontSize="sm">
                        Out of stock
                    </Text>
                ) : (
                    <AddToCartButton productId={product.id} isInCart={isInCart} />
                )}
            </Stack>
        </Stack>
    );
});
