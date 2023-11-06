import {Box} from "@chakra-ui/react";
import {ProductGrid} from "./ProductGrid.tsx";
import {products} from "./_data.ts";
import {ProductCard} from "./ProductCard.tsx";

export const Products = () => {
    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{base: '4', md: '8', lg: '12'}}
            py={{base: '6', md: '8', lg: '12'}}
        >
            <ProductGrid>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </ProductGrid>
        </Box>
    )
}