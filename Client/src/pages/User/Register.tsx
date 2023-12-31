import {
    Box,
    Button,
    Center,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { RegisterDto } from '../../types/registerDto.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { ErrorDisplay } from '../../components/ErrorDisplay.tsx';
import { ApiError } from '../../types/apiError.ts';
import { AppLogo } from '../../components/AppLogo.tsx';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState<RegisterDto>({
        userName: '',
        email: '',
        password: '',
    });

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await registerMutation.mutateAsync(formValues);
    };

    const handleFormValueChange = (formName: keyof RegisterDto) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormValues((prevState) => ({
            ...prevState,
            [formName]: e.target.value,
        }));
    };

    const registerMutation = useMutation(
        async (body: RegisterDto) => {
            await register(body);
        },
        {
            onSuccess: () => {
                navigate('/catalog');
            },
        }
    );

    return (
        <Box maxW="xl" mx="auto">
            <Stack spacing={8} py={{ base: 6, md: 12 }} px={{ base: 2, md: 6 }}>
                <Box display={{ base: 'block', md: 'none' }}>
                    <Center>
                        <AppLogo />
                    </Center>
                </Box>
                <Heading fontSize={'2xl'} textAlign={'center'}>
                    Create your account
                </Heading>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="userName" isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    type="text"
                                    name="userName"
                                    value={formValues.userName}
                                    onChange={handleFormValueChange('userName')}
                                    minLength={4}
                                />
                                <FormHelperText>4-50 characters, A-Z, a-z, 0-9 only.</FormHelperText>
                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" name="email" onChange={handleFormValueChange('email')} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        onChange={handleFormValueChange('password')}
                                        minLength={6}
                                    />
                                    <InputRightElement h={'full'}>
                                        <IconButton
                                            variant="ghost"
                                            aria-label="Show password"
                                            icon={showPassword ? <ViewIcon color="blue.500" /> : <ViewOffIcon />}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormHelperText>Minimum 6 characters.</FormHelperText>
                            </FormControl>
                            <Stack pt={2}>
                                <Button
                                    type="submit"
                                    loadingText="Signing up..."
                                    isLoading={registerMutation.isLoading}
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.600',
                                    }}
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            {!!registerMutation.error && (
                                <>
                                    <br />
                                    <Box>
                                        <ErrorDisplay error={registerMutation.error as ApiError} />
                                    </Box>
                                </>
                            )}
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Already have an account?{' '}
                                    <Link
                                        as={ReactRouterLink}
                                        to="/login"
                                        color={useColorModeValue('blue.600', 'blue.400')}
                                    >
                                        Login
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Box>
    );
};

export default Register;
