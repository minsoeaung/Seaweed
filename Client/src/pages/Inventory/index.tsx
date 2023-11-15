import {Button, Container, Flex, HStack, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {Link, useSearchParams} from "react-router-dom";
import {lazy} from "react";

const Products = lazy(() => import("./Products"));
const Categories = lazy(() => import("./Categories"));
const Brands = lazy(() => import("./Brands"));

const tabToCategory = {
    "0": "product",
    "1": "brand",
    "2": "category"
} as const;

const Admin = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const tab = searchParams.get("tab") as keyof typeof tabToCategory;

    const handleTabsChange = (index: number) => {
        searchParams.set("tab", String(index));
        setSearchParams(searchParams);
    }

    return (
        <Container maxW="7xl">
            <Tabs index={isNaN(Number(tab)) ? 0 : Number(tab)} onChange={handleTabsChange} isLazy>
                <TabList>
                    <Flex justify='space-between' w='full'>
                        <HStack>
                            <Tab>Products</Tab>
                            <Tab>Brands</Tab>
                            <Tab>Categories</Tab>
                        </HStack>
                        <Button
                            as={Link}
                            to={`0?type=${tabToCategory[tab]}`}
                            variant='solid'
                            colorScheme='blue'
                            size='sm'
                        >
                            Add
                        </Button>
                    </Flex>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Products/>
                    </TabPanel>
                    <TabPanel>
                        <Brands/>
                    </TabPanel>
                    <TabPanel>
                        <Categories/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    )
}

export default Admin;