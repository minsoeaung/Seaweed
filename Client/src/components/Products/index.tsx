import {Box, Button, Center, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Progress} from "@chakra-ui/react";
import {ProductGrid} from "./ProductGrid.tsx";
import {ProductCard} from "./ProductCard.tsx";
import {usePaginatedProducts} from "../../hooks/queries/usePaginatedProducts.ts";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import {ArrowUpIcon, ChevronDownIcon} from "@chakra-ui/icons";
import {useSearchParams} from "react-router-dom";
import AntdSpin from "../AntdSpin";
import {ProductFilters} from "./ProductFilters.tsx";
import {useWishList} from "../../hooks/queries/useWishList.ts";

const sortMenus = {
    name: "Name",
    nameDesc: "Name [Z-A]",
    price: "Price",
    priceDesc: "Price [Z-A]",
    "_": ""
}

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

    const handleSortMenuClick = (value: string) => () => {
        const newParams = new URLSearchParams(params);
        newParams.set("orderBy", value);
        setParams(newParams);
    }

    useWishList();

    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{base: '4', md: '8', lg: '12'}}
            py={{base: '6', md: '8', lg: '12'}}
        >
            {isLoading ? (
                <AntdSpin/>
            ) : isError ? (
                <p>Something went wrong.</p>
            ) : data && (
                <>
                    <Flex justifyContent="space-between" mb={4}>
                        <ProductFilters/>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} px={4} variant="outline">
                                Sort
                                by: {sortMenus[(params.get("orderBy") || "_") as keyof typeof sortMenus] || ""}
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={handleSortMenuClick("name")}>Name</MenuItem>
                                <MenuItem onClick={handleSortMenuClick("nameDesc")}>Name [Z-A]</MenuItem>
                                <MenuItem onClick={handleSortMenuClick("price")}>Price</MenuItem>
                                <MenuItem onClick={handleSortMenuClick("priceDesc")}>Price [Z-A]</MenuItem>
                            </MenuList>
                        </Menu>
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