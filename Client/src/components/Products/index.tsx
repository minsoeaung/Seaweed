import {Box, Center, Flex, IconButton, Progress} from "@chakra-ui/react";
import {ProductGrid} from "./ProductGrid.tsx";
import {ProductCard} from "./ProductCard.tsx";
import {usePaginatedProducts} from "../../hooks/queries/usePaginatedProducts.ts";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import {ArrowUpIcon} from "@chakra-ui/icons";
import {useSearchParams} from "react-router-dom";
import AntdSpin from "../AntdSpin";
import {useWishList} from "../../hooks/queries/useWishList.ts";
import {Fallback} from "../Fallback";
import {useCart} from "../../hooks/queries/useCart.ts";
import {ProductSortBy} from "../ProductSortBy.tsx";
import {ProductFilters} from "../ProductFilters.tsx";

export const Products = () => {
    const [params, setParams] = useSearchParams();

    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = usePaginatedProducts(params.toString());

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(params);
        newParams.set("pageNumber", String(page));
        setParams(newParams);
    }

    useWishList();
    useCart();

    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{base: '2', md: '8', lg: '12'}}
        >
            {isFetching && (
                <Fallback/>
            )}
            {isLoading ? (
                <AntdSpin/>
            ) : isError ? (
                <p>Something went wrong.</p>
            ) : data && (
                <>
                    <Flex justifyContent="space-between" mb={4}>
                        <ProductFilters/>
                        <ProductSortBy/>
                    </Flex>
                    <ProductGrid>
                        {data.results.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                        {data.results.length === 0 && (
                            <Center>
                                <p>No product found!</p>
                            </Center>
                        )}
                    </ProductGrid>
                    <br/>
                    <Progress size='xs' isIndeterminate colorScheme="blue"
                              visibility={isFetching ? "visible" : "hidden"}/>
                    <br/>
                    <ResponsivePagination
                        current={data.pagination.currentPage}
                        total={data.pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                    <br/>
                    {data.results.length > 10 && (
                        <Center>
                            <IconButton
                                isRound
                                variant='outline'
                                colorScheme="blue"
                                aria-label='Back to top'
                                icon={<ArrowUpIcon/>}
                                onClick={() => {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    })
                                }}
                            />
                        </Center>
                    )}
                </>
            )}
        </Box>
    )
}