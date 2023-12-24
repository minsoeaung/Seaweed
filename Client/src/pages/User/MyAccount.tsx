import { useMyAccount } from '../../hooks/queries/useMyAccount.ts';
import {
    Avatar,
    AvatarBadge,
    Box,
    Button,
    Card,
    Center,
    Heading,
    IconButton,
    Input,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import AntdSpin from '../../components/AntdSpin';
import { useUpdateProfilePicture } from '../../hooks/mutations/useUpdateProfilePicture.ts';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MyEmail } from '../../components/MyEmail.tsx';
import { MyShippingAddresses } from '../../components/MyShippingAddresses.tsx';
import { MyUsername } from '../../components/MyUsername.tsx';
import { MyDeleteAccount } from '../../components/MyDeleteAccount.tsx';

const MyAccount = () => {
    const { data, isLoading, isError } = useMyAccount();
    const inputRef = useRef<HTMLInputElement>(null);
    const updateProfileMutation = useUpdateProfilePicture();
    const toast = useToast();

    const updateProfilePicture = async (files: FileList | null) => {
        const maxSize = 1024 * 1024 * 5; // 5MB

        if (files?.length) {
            const file = files[0];
            if (file.size > maxSize) {
                toast({
                    title: 'Picture Size Cannot Be More Than 5MB',
                    status: 'warning',
                    isClosable: true,
                    duration: 5000,
                    position: 'top',
                });
            } else {
                await updateProfileMutation.mutateAsync(file);
            }
        }
    };

    if (isLoading) {
        return <AntdSpin />;
    }

    if (isError) {
        return (
            <Center>
                <VStack mt={8}>
                    <p>Session expired. Please login again.</p>
                    <Button as={Link} to="/login" variant="solid" colorScheme="blue">
                        Login
                    </Button>
                </VStack>
            </Center>
        );
    }

    if (!data) return null;

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            <Card variant="outline">
                <VStack p={{ base: 6, lg: 10 }} alignItems="start" spacing={{ base: 6, lg: 10 }}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        My Account
                    </Heading>
                    <Avatar size="2xl" src={data.profilePicture}>
                        <AvatarBadge
                            as={IconButton}
                            size={{ base: 'sm', md: 'md' }}
                            rounded="full"
                            top="-10px"
                            colorScheme="facebook"
                            aria-label="Update profile picture"
                            isLoading={updateProfileMutation.isLoading}
                            icon={<EditIcon />}
                            onClick={() => {
                                inputRef.current?.click();
                            }}
                        />
                        <Input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            name="profile-picture"
                            onChange={(e) => updateProfilePicture(e.target.files)}
                            hidden
                        />
                    </Avatar>
                    <MyUsername />
                    <MyEmail />
                    <MyShippingAddresses />
                    <MyDeleteAccount />
                </VStack>
            </Card>
        </Box>
    );
};

export default MyAccount;
