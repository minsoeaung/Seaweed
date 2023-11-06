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
    useColorModeValue,
} from '@chakra-ui/react'
import {ChangeEvent, FormEvent, useState} from 'react'
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons'
import {Link as ReactRouterLink} from 'react-router-dom'

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formValues, setFormValues] = useState({username: "", email: "", password: ""});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    }

    const handleFormValueChange = (formName: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormValues(prevState => ({
            ...prevState,
            [formName]: e.target.value
        }))
    }

    return (
        <Container>
            <Stack spacing={8} py={12} px={6}>
                <Heading fontSize={'3xl'} textAlign={'center'}>
                    Create your account
                </Heading>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl id="username" isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input type="text" name="username" value={formValues.username}
                                       onChange={handleFormValueChange("username")}/>
                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" name="email" onChange={handleFormValueChange("email")}/>
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
                                    size="lg"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.600',
                                    }}>
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Already a user? <Link as={ReactRouterLink} to="user/login" replace
                                                          color={'blue.400'}>Login</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Container>
    )
}

export default Register;