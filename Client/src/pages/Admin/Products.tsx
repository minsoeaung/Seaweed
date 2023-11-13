import {useSearchParams} from "react-router-dom";
import {usePaginatedProducts} from "../../hooks/queries/usePaginatedProducts.ts";
import ResponsivePagination from "react-responsive-pagination";
import {
    Box,
    Flex,
    Input,
    Skeleton,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import 'react-responsive-pagination/themes/bootstrap.css';
import {formatPrice} from "../../utilities/formatPrice.ts";
import {ProductFilters} from "../../components/ProductFilters.tsx";
import {ProductSortBy} from "../../components/ProductSortBy.tsx";
import React, {useState} from "react";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInputValue, setSearchInputValue] = useState(searchParams.get("searchTerm") || "");

    const {
        data,
        isLoading,
        isError,
    } = usePaginatedProducts(searchParams.toString());

    const handlePageChange = (page: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("pageNumber", String(page));
        setSearchParams(newParams);
    }

    if (isLoading) {
        return <Skeleton/>
    }

    if (isError) {
        return <p>Problems</p>
    }

    if (!data) return null;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchParams.set("searchTerm", searchInputValue);
            setSearchParams(searchParams);
        }
    }

    return (
        <Box>
            <Flex justifyContent="space-between" mb={4}>
                <ProductFilters/>
                <Input
                    type='search'
                    placeholder='Search product'
                    autoComplete='off'
                    name='search'
                    value={searchInputValue}
                    onChange={e => setSearchInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxW={"md"}
                />
                <ProductSortBy/>
            </Flex>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Id</Th>
                            <Th>Name</Th>
                            <Th>sku</Th>
                            <Th>Description</Th>
                            <Th>Price</Th>
                            <Th>Quantity</Th>
                            <Th>Brand</Th>
                            <Th>Category</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.results.map(product => (
                            <Tr key={product.id}>
                                <Td>{product.id}</Td>
                                <Td>{product.name}</Td>
                                <Td>{product.sku}</Td>
                                <Td maxW="200px" overflow="hidden" textOverflow="ellipsis"
                                    whiteSpace="nowrap">{product.description}</Td>
                                <Td isNumeric>{formatPrice(product.price)}</Td>
                                <Td isNumeric>{product.quantityInStock}</Td>
                                <Td>{product.brand.name}</Td>
                                <Td>{product.category.name}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                    {data.results.length === 0 && (
                        <TableCaption>Empty!</TableCaption>
                    )}
                </Table>
            </TableContainer>
            <br/>
            <ResponsivePagination
                current={data.pagination.currentPage}
                total={data.pagination.totalPages}
                onPageChange={handlePageChange}
            />
        </Box>
    )
}

export default Products;