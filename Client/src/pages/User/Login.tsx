import {
    Box,
    Button,
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
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { LoginDto } from '../../types/loginDto.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { ErrorDisplay } from '../../components/ErrorDisplay.tsx';
import { ApiError } from '../../types/apiError.ts';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState<LoginDto>({
        userName: '',
        password: '',
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await loginMutation.mutateAsync(formValues);
    };

    const handleFormValueChange = (formName: keyof LoginDto) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormValues((prevState) => ({
            ...prevState,
            [formName]: e.target.value,
        }));
    };

    const loginMutation = useMutation(
        async (body: LoginDto) => {
            await login(body.userName, body.password);
        },
        {
            onSuccess: () => {
                queryClient.clear();
                navigate('/catalog');
            },
        }
    );

    return (
        <Box maxW="xl" mx="auto">
            <Stack spacing={8} py={{ base: 6, md: 12 }} px={{ base: 2, md: 6 }}>
                <Heading fontSize={'3xl'} textAlign={'center'}>
                    Log in to your account
                </Heading>
                <Text align={'center'}>
                    Don't have an account?{' '}
                    <Link as={ReactRouterLink} to="/register" replace color={useColorModeValue('blue.600', 'blue.400')}>
                        Register
                    </Link>{' '}
                    here.
                </Text>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="userName" isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input type="text" name="userName" onChange={handleFormValueChange('userName')} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        onChange={handleFormValueChange('password')}
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
                                <FormHelperText textAlign="right" mt={6}>
                                    <Button
                                        as={ReactRouterLink}
                                        to="/forgot-password"
                                        variant="link"
                                        colorScheme="blue"
                                        size="md"
                                    >
                                        Forgot password?
                                    </Button>
                                </FormHelperText>
                            </FormControl>
                            <Stack pt={2}>
                                <Button
                                    type="submit"
                                    loadingText="Logging in..."
                                    isLoading={loginMutation.isLoading}
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.600',
                                    }}
                                >
                                    Login
                                </Button>
                            </Stack>
                            {!!loginMutation.error && (
                                <>
                                    <br />
                                    <Box>
                                        <ErrorDisplay error={loginMutation.error as ApiError} />
                                    </Box>
                                </>
                            )}
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Box>
    );
};

export default Login;
