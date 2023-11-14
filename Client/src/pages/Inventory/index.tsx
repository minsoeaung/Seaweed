import {Container, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {useSearchParams} from "react-router-dom";
import {lazy} from "react";

const Products = lazy(() => import("./Products"));
const Categories = lazy(() => import("./Categories"));
const Brands = lazy(() => import("./Brands"));

const Admin = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const tab = searchParams.get("tab");

    const handleTabsChange = (index: number) => {
        searchParams.set("tab", String(index));
        setSearchParams(searchParams);
    }

    return (
        <Container maxW="7xl">
            <Tabs index={isNaN(Number(tab)) ? 0 : Number(tab)} onChange={handleTabsChange} isLazy>
                <TabList>
                    <Tab>Products</Tab>
                    <Tab>Brands</Tab>
                    <Tab>Categories</Tab>
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