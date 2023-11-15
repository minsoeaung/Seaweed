import {useSearchParams} from "react-router-dom";
import {Box, Card, CardBody, CardHeader, Container, FormLabel, Heading, Input} from "@chakra-ui/react";

const tabToType = {
    "0": "product",
    "1": "brand",
    "2": "category"
} as const;

const AddInventoryPage = () => {
    const [searchParams] = useSearchParams();

    const type = tabToType[(searchParams.get("tab") || "0") as keyof typeof tabToType]

    return (
        <Container maxW='7xl'>
            <Card>
                <CardHeader>
                    <Heading fontSize='xl'>Add {type}</Heading>
                </CardHeader>
                <CardBody>
                    {type === "category" && <AddCategory/>}
                </CardBody>
            </Card>
        </Container>
    )
};

const AddCategory = () => {
    return (
        <Box>
            <FormLabel>Name</FormLabel>
            <Input type='text' placeholder='Category name'/>
        </Box>
    )
}

export default AddInventoryPage;