import { AddressForm } from './AddressForm.tsx';
import { Box, Card, CardBody, CardHeader, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NewAddress = () => {
    const navigate = useNavigate();

    const goToMyAccountPage = () => navigate('/user/my-account');

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            <Card>
                <CardHeader>
                    <Heading fontSize="lg">Shipping address</Heading>
                </CardHeader>
                <CardBody>
                    <AddressForm onActionSuccess={goToMyAccountPage} />
                </CardBody>
            </Card>
        </Box>
    );
};

export default NewAddress;
