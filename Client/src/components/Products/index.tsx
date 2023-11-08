import {Box, Center, IconButton, Progress} from "@chakra-ui/react";
import {ProductGrid} from "./ProductGrid.tsx";
import {ProductCard} from "./ProductCard.tsx";
import {usePaginatedProducts} from "../../hooks/query/usePaginatedProducts.ts";
import {useSearchParams} from "react-router-dom";
import AntdSpin from "../AntdSpin";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import {useEffect} from "react";
import {ArrowUpIcon} from "@chakra-ui/icons";

export const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {setPageNumber, data, isLoading, isFetching} = usePaginatedProducts(Number(searchParams.get("page")));

    useEffect(() => {
        const p = Number(searchParams.get("page"));
        setPageNumber((!isNaN(p) && p > 0) ? p : 1);
    }, [searchParams.get("page")])


    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{base: '4', md: '8', lg: '12'}}
            py={{base: '6', md: '8', lg: '12'}}
        >
            {isLoading ? (
                <AntdSpin/>
            ) : data && (
                <>
                    <ProductGrid>
                        {data.results.map((product) => (
                            <ProductCard key={product.id} product={product}/>
                        ))}
                    </ProductGrid>
                    <br/>
                    <Progress size='xs' isIndeterminate hidden={!isFetching} colorScheme="blue"/>
                    <br/>
                    <ResponsivePagination
                        current={data.pagination.currentPage}
                        total={data.pagination.totalPages}
                        onPageChange={(page) => {
                            setPageNumber(page);
                            searchParams.set("page", String(page));
                            setSearchParams(searchParams);
                        }}
                    />
                    <br/>
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
                </>
            )}
        </Box>
    )
}