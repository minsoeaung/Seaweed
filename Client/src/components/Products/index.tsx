import { Box, Center, Flex, IconButton } from '@chakra-ui/react';
import { ProductGrid } from './ProductGrid.tsx';
import { ProductCard } from './ProductCard.tsx';
import { usePaginatedProducts } from '../../hooks/queries/usePaginatedProducts.ts';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { useSearchParams } from 'react-router-dom';
import AntdSpin from '../AntdSpin';
import { useWishList } from '../../hooks/queries/useWishList.ts';
import { Fallback } from '../Fallback';
import { useCart } from '../../hooks/queries/useCart.ts';
import { ProductSortBy } from '../ProductSortBy.tsx';
import { ProductFilters } from '../ProductFilters.tsx';
import { ErrorDisplay } from '../ErrorDisplay.tsx';
import { ApiError } from '../../types/apiError.ts';

export const Products = () => {
    const [params, setParams] = useSearchParams();

    const { data, isLoading, isFetching, isError, error } = usePaginatedProducts(params.toString());

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(params);
        newParams.set('pageNumber', String(page));
        setParams(newParams);
    };

    const { data: wishList } = useWishList();
    const { data: cart } = useCart();

    return (
        <Box maxW="7xl" mx="auto" px={{ base: '2', md: '8', lg: '12' }}>
            {isFetching && !isLoading && <Fallback />}
            {isLoading ? (
                <Box mt={10}>
                    <AntdSpin />
                </Box>
            ) : isError ? (
                <ErrorDisplay error={error as ApiError} />
            ) : (
                data && (
                    <>
                        <Flex justifyContent="space-between" mb={4}>
                            <ProductFilters />
                            <ProductSortBy />
                        </Flex>
                        <ProductGrid>
                            {data.results.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isInWishList={
                                        Array.isArray(wishList)
                                            ? wishList.findIndex((w) => w.productId === product.id) >= 0
                                            : false
                                    }
                                    isInCart={
                                        Array.isArray(cart?.cartItems)
                                            ? cart!.cartItems.findIndex((c) => c.product.id === product.id) >= 0
                                            : false
                                    }
                                />
                            ))}
                            {data.results.length === 0 && (
                                <Center>
                                    <p>No product found!</p>
                                </Center>
                            )}
                        </ProductGrid>
                        <br />
                        <ResponsivePagination
                            current={data.pagination.currentPage}
                            total={data.pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                        <br />
                        {data.results.length > 10 && (
                            <Center>
                                <IconButton
                                    isRound
                                    variant="outline"
                                    colorScheme="blue"
                                    aria-label="Back to top"
                                    icon={<ArrowUpIcon />}
                                    onClick={() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth',
                                        });
                                    }}
                                />
                            </Center>
                        )}
                    </>
                )
            )}
        </Box>
    );
};
