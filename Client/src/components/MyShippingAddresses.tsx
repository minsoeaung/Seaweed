import { Button, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { FaRegAddressCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AddressCard } from './AddressCard.tsx';
import { useAddresses } from '../hooks/queries/useAddresses.ts';

export const MyShippingAddresses = () => {
    const { data: addresses } = useAddresses();

    return (
        <VStack align="start">
            <HStack alignItems="center">
                <FaRegAddressCard />
                <Text fontWeight="bold">Shipping addresses</Text>
            </HStack>
            <Wrap>
                {Array.isArray(addresses) &&
                    addresses.map((address) => (
                        <WrapItem key={address.id}>
                            <AddressCard data={address} />
                        </WrapItem>
                    ))}
            </Wrap>
            <Button variant="solid" colorScheme="blue" size="sm" as={Link} to="/user/my-account/new-address">
                Add a new address
            </Button>
        </VStack>
    );
};
