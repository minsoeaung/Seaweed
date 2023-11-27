import { useMyAccount } from '../../hooks/queries/useMyAccount.ts';
import {
    Avatar,
    AvatarBadge,
    Box,
    Button,
    Card,
    Center,
    Heading,
    HStack,
    IconButton,
    Input,
    Tag,
    Text,
    VStack,
    Wrap,
} from '@chakra-ui/react';
import { CheckIcon, EditIcon } from '@chakra-ui/icons';
import AntdSpin from '../../components/AntdSpin';
import { useUpdateProfilePicture } from '../../hooks/mutations/useUpdateProfilePicture.ts';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAddresses } from '../../hooks/queries/useAddresses.ts';

const MyAccount = () => {
    const { data, isLoading, isError } = useMyAccount();
    const inputRef = useRef<HTMLInputElement>(null);
    const mutation = useUpdateProfilePicture();

    const {} = useAddresses();

    const updateProfilePicture = async (pic: FileList | null) => {
        !!pic && (await mutation.mutateAsync(pic));
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
                    <HStack spacing={{ base: 2, md: 6 }}>
                        <Avatar size="2xl" src={data.profilePicture}>
                            <AvatarBadge
                                as={IconButton}
                                size="md"
                                rounded="full"
                                top="-10px"
                                colorScheme="facebook"
                                aria-label="Update profile picture"
                                isLoading={mutation.isLoading}
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
                        <VStack alignItems="start">
                            <Input
                                defaultValue={data.userName}
                                placeholder="UserName"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                                isDisabled
                            />
                            {!(data.roles.length === 1 && data.roles.includes('User')) && (
                                <HStack>
                                    <Text fontSize="sm">Account type: </Text>
                                    <Wrap>
                                        {data.roles.map((role) => (
                                            <Tag colorScheme="blue" key={role}>
                                                {role}
                                            </Tag>
                                        ))}
                                    </Wrap>
                                </HStack>
                            )}
                        </VStack>
                    </HStack>
                    <VStack align="start">
                        <HStack>
                            <Text>Email</Text>
                            {data.emailConfirmed ? (
                                <Button
                                    leftIcon={<CheckIcon />}
                                    size="xs"
                                    variant="ghost"
                                    colorScheme="green"
                                    isDisabled
                                >
                                    Verified
                                </Button>
                            ) : (
                                <Button size="xs" variant="outline" isDisabled>
                                    Verify
                                </Button>
                            )}
                        </HStack>
                        <HStack>
                            <Text color={'gray.500'}>{data.email}</Text>
                            <IconButton size="xs" variant="ghost" aria-label="Change email" icon={<EditIcon />} />
                        </HStack>
                    </VStack>
                    <VStack align="start">
                        <HStack>
                            <Text>Phone</Text>
                            {!!data.phoneNumber &&
                                (data.phoneNumber ? (
                                    <Button
                                        leftIcon={<CheckIcon />}
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="green"
                                        isDisabled
                                    >
                                        Verified
                                    </Button>
                                ) : (
                                    <Button size="xs" variant="outline" isDisabled>
                                        Verify
                                    </Button>
                                ))}
                        </HStack>
                        <HStack>
                            {data.phoneNumber ? (
                                <>
                                    <Text color={'gray.500'}>{data.phoneNumber}</Text>
                                    <IconButton
                                        size="xs"
                                        variant="ghost"
                                        aria-label="Change email"
                                        icon={<EditIcon />}
                                    />
                                </>
                            ) : (
                                <Button size="xs" variant="outline" isDisabled>
                                    Add phone
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </VStack>
            </Card>
        </Box>
    );
};

export default MyAccount;
