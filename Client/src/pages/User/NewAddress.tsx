import { AddressForm } from './AddressForm.tsx';
import { Box, Card, CardBody, CardHeader, Heading } from '@chakra-ui/react';

const NewAddress = () => {
    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            <Card>
                <CardHeader>
                    <Heading fontSize="lg">Shipping address</Heading>
                </CardHeader>
                <CardBody>
                    <AddressForm />
                </CardBody>
            </Card>
        </Box>
    );
};

export default NewAddress;
