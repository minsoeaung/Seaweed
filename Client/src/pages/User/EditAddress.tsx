import { AddressForm } from './AddressForm.tsx';
import { Box, Card, CardBody, CardHeader, Center, Heading, Text } from '@chakra-ui/react';
import { useAddresses } from '../../hooks/queries/useAddresses.ts';
import AntdSpin from '../../components/AntdSpin';

const EditAddress = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const { data, isLoading } = useAddresses();

    const address = data?.find((a) => a.id === Number(id));

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            <Card>
                <CardHeader>
                    <Heading fontSize="lg">Shipping address</Heading>
                </CardHeader>
                <CardBody>
                    {isLoading ? (
                        <Center>
                            <AntdSpin />
                        </Center>
                    ) : address ? (
                        <AddressForm address={address} />
                    ) : (
                        <Center>
                            <Text>Address not found.</Text>
                        </Center>
                    )}
                </CardBody>
            </Card>
        </Box>
    );
};

export default EditAddress;
