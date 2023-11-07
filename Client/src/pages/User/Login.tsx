import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {Link as ReactRouterLink} from "react-router-dom";
import {ChangeEvent, FormEvent, useState} from "react";
import {useMutation} from "react-query";
import {LoginDto} from "../../types/loginDto.ts";
import {useAuth} from "../../context/AuthContext.tsx";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formValues, setFormValues] = useState<LoginDto>({
        userName: "",
        password: ""
    });

    const {login} = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await registerMutation.mutateAsync(formValues);
    }

    const handleFormValueChange = (formName: keyof LoginDto) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormValues(prevState => ({
            ...prevState,
            [formName]: e.target.value
        }))
    }

    const registerMutation = useMutation(
        async (body: LoginDto) => {
            await login(body.userName, body.password);
        }, {
            onSuccess: () => {
                console.log("all fine");
            },
        })

    return (
        <Container>
            <Stack spacing={8} py={12} px={6}>
                <Heading fontSize={'3xl'} textAlign={'center'}>
                    Welcome to Shop! Please login.
                </Heading>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="userName" isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input type="text" name="userName" onChange={handleFormValueChange("userName")}/>
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input type={showPassword ? 'text' : 'password'} name="password"
                                           onChange={handleFormValueChange("password")}/>
                                    <InputRightElement h={'full'}>
                                        <IconButton
                                            variant="ghost"
                                            aria-label="Show password"
                                            icon={showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack pt={2}>
                                <Button
                                    type="submit"
                                    loadingText="Submitting"
                                    isLoading={registerMutation.isLoading}
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.600',
                                    }}>
                                    Login
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    New member? <Link as={ReactRouterLink} to="/user/register" replace
                                                      color={'blue.400'}>Register</Link> here.
                                </Text>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Container>
    )
}

export default Login;