import {
    Box,
    Button,
    Card,
    Center,
    Checkbox,
    Flex,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Select,
    Skeleton,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useAddresses } from '../../../hooks/queries/useAddresses';
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { AddressDetails } from '../../../types/addressDetails.ts';
import { formatPrice } from '../../../utilities/formatPrice.ts';
import { useCart } from '../../../hooks/queries/useCart.ts';
import { CreateAddressDto } from '../../../types/createAddressDto.ts';
import { useCountries } from '../../../hooks/queries/useCountries.ts';
import AntdSpin from '../../../components/AntdSpin';
import { useCreateOrder } from '../../../hooks/mutations/useCreateOrder.ts';

const REQUIRED_ADDRESS_FIELDS = [
    'unitNumber',
    'streetNumber',
    'addressLine1',
    'city',
    'region',
    'postalCodes',
    'countryId',
];

const CheckoutPage = () => {
    const [formValues, setFormValues] = useState<CreateAddressDto>({
        unitNumber: '',
        streetNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        region: '',
        postalCodes: '',
        countryId: 0,
    });
    const [isDefault, setIsDefault] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState<AddressDetails>();
    const [radioInputValue, setRadioInputValue] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: addresses, isLoading: addressesLoading } = useAddresses();
    const { data: cart, isLoading: isCartLoading } = useCart();
    const [useNewAddress, setUseNewAddress] = useState(false);
    const toast = useToast();
    const orderMutation = useCreateOrder();

    const handleFormValueChange =
        (formName: keyof CreateAddressDto) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setFormValues((prevState) => ({
                ...prevState,
                [formName]: e.target.value,
            }));
        };

    useEffect(() => {
        if (addresses) {
            const defaultAddress = addresses?.find((ad) => ad.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress);
                setRadioInputValue(String(defaultAddress.id));
            }
        }
    }, [addresses]);

    const handleSave = () => {
        setUseNewAddress(false);
        setSelectedAddress(addresses?.find((a) => a.id === Number(radioInputValue)));
        onClose();
    };

    const handleOrder = async () => {
        if (useNewAddress || addresses?.length === 0) {
            for (const key in formValues) {
                const value = formValues[key as keyof CreateAddressDto];
                if (REQUIRED_ADDRESS_FIELDS.includes(key) && !value) {
                    toast({
                        title: 'Insufficient Address Information',
                        status: 'warning',
                        isClosable: true,
                    });
                    return;
                }
            }

            await orderMutation.mutateAsync({
                address: formValues,
                isDefault: isDefault,
                addressId: null,
            });
        } else {
            if (!selectedAddress) {
                toast({
                    title: 'Insufficient Address Information',
                    status: 'warning',
                    isClosable: true,
                });
                return;
            }

            await orderMutation.mutateAsync({
                addressId: selectedAddress.id,
                address: null,
            });
        }
    };

    return (
        <Box maxW={{ base: '3xl', lg: '7xl' }} mx="auto">
            <Card variant="outline" px={{ base: '4', md: '8', lg: '12' }} py={{ base: '6', md: '8', lg: '10' }}>
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    align={{ lg: 'flex-start' }}
                    spacing={{ base: '8', md: '16' }}
                >
                    <Stack spacing={{ base: '8', md: '10' }} flex="2">
                        <Heading size="md">Shipping address</Heading>
                        {addressesLoading ? (
                            <Center>
                                <AntdSpin />
                            </Center>
                        ) : useNewAddress ? (
                            <>
                                <CheckoutAddressForm
                                    values={formValues}
                                    onValuesChange={handleFormValueChange}
                                    isDefault={isDefault}
                                    setIsDefault={setIsDefault}
                                />
                                {addresses && addresses.length > 0 && (
                                    <Button
                                        variant="link"
                                        colorScheme="blue"
                                        alignSelf="start"
                                        onClick={() => {
                                            onOpen();
                                        }}
                                    >
                                        Select from saved addresses
                                    </Button>
                                )}
                            </>
                        ) : selectedAddress ? (
                            <Card variant="outline" p={4} w="full" position="relative">
                                <Address address={selectedAddress} />
                                <Box position="absolute" right={4} bottom={4}>
                                    <Button variant="link" colorScheme="blue" onClick={onOpen}>
                                        Change
                                    </Button>
                                </Box>
                            </Card>
                        ) : (
                            <>
                                <CheckoutAddressForm
                                    values={formValues}
                                    onValuesChange={handleFormValueChange}
                                    isDefault={isDefault}
                                    setIsDefault={setIsDefault}
                                />
                                {addresses && addresses.length > 0 && (
                                    <Button
                                        variant="link"
                                        colorScheme="blue"
                                        alignSelf="start"
                                        onClick={() => {
                                            onOpen();
                                        }}
                                    >
                                        Select from saved addresses
                                    </Button>
                                )}
                            </>
                        )}
                    </Stack>
                    <Flex direction="column" align="center" flex="1" position="sticky" top={4}>
                        <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
                            <Heading size="md">Order Summary</Heading>
                            <Stack spacing="6">
                                {isCartLoading ? (
                                    <>
                                        <Skeleton height="25px" />
                                        <Skeleton height="25px" />
                                        <Skeleton height="25px" />
                                        <Skeleton height="25px" />
                                        <Skeleton height="45px" />
                                    </>
                                ) : (
                                    cart &&
                                    cart.cartItems.map((item) => (
                                        <OrderSummaryItem
                                            key={item.id}
                                            label={`${item.quantity} x ${item.product.name}`}
                                        >
                                            <Text pl={2}>{formatPrice(item.total)}</Text>
                                        </OrderSummaryItem>
                                    ))
                                )}
                                <Flex justify="space-between">
                                    <Text fontSize="lg" fontWeight="semibold">
                                        Total
                                    </Text>
                                    <Text fontSize="xl" fontWeight="extrabold">
                                        {formatPrice(cart?.total || 0)}
                                    </Text>
                                </Flex>
                            </Stack>
                        </Stack>
                        <Button
                            w="full"
                            mt={6}
                            colorScheme="blue"
                            size="lg"
                            onClick={handleOrder}
                            isLoading={orderMutation.isLoading}
                        >
                            Place order
                        </Button>
                    </Flex>
                </Stack>
            </Card>
            <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'sm', md: 'xl' }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Your addresses</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RadioGroup onChange={setRadioInputValue} value={radioInputValue}>
                            <Stack direction="column" gap={8}>
                                {addresses?.map((add) => (
                                    <Radio key={add.id} value={String(add.id)}>
                                        <Box pl={4}>
                                            <Address address={add} />
                                        </Box>
                                    </Radio>
                                ))}
                            </Stack>
                        </RadioGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            onClick={() => {
                                setUseNewAddress(true);
                                onClose();
                            }}
                        >
                            Use a new address
                        </Button>
                        <Button colorScheme="blue" mr={3} onClick={handleSave}>
                            Select
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

type OrderSummaryItemProps = {
    label: string;
    value?: string;
    children?: ReactNode;
};

const OrderSummaryItem = (props: OrderSummaryItemProps) => {
    const { label, value, children } = props;
    return (
        <Flex justify="space-between" fontSize="sm">
            <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
                {label}
            </Text>
            {value ? <Text fontWeight="medium">{value}</Text> : children}
        </Flex>
    );
};

const Address = ({ address }: { address: AddressDetails }) => (
    <Box>
        <Text color="orange.500" position="absolute" right={2} top={1}>
            {address.isDefault && 'Default address'}
        </Text>
        <Text>{`${address.unitNumber}, ${address.streetNumber}`}</Text>
        <Text>{address.addressLine1}</Text>
        <Text>{address.addressLine2}</Text>
        <Text>{`${address.city}, ${address.region}`}</Text>
        <Text>{address.postalCodes}</Text>
        <Text>{address.country.name}</Text>
    </Box>
);

type CheckoutAddressFormProps = {
    values: CreateAddressDto;
    onValuesChange: (
        formName: keyof CreateAddressDto
    ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    isDefault: boolean;
    setIsDefault: Dispatch<SetStateAction<boolean>>;
};

const CheckoutAddressForm = ({ values, onValuesChange, isDefault, setIsDefault }: CheckoutAddressFormProps) => {
    const { data: countries } = useCountries();

    return (
        <Box>
            <VStack spacing={6} align="start">
                <VStack align="start">
                    <Text>Country</Text>
                    <Select
                        placeholder="Select country"
                        name="countryId"
                        disabled={!countries}
                        required
                        value={values.countryId}
                        onChange={onValuesChange('countryId')}
                        maxW="sm"
                    >
                        {Array.isArray(countries) &&
                            countries.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                    </Select>
                </VStack>
                <Flex gap={6}>
                    <VStack align="start">
                        <Text>Unit number</Text>
                        <Input
                            required
                            placeholder="Unit number"
                            name="unitNumber"
                            value={values.unitNumber}
                            onChange={onValuesChange('unitNumber')}
                        />
                    </VStack>
                    <VStack align="start">
                        <Text>Street number</Text>
                        <Input
                            required
                            placeholder="Street number"
                            name="streetNumber"
                            value={values.streetNumber}
                            onChange={onValuesChange('streetNumber')}
                        />
                    </VStack>
                </Flex>
                <VStack align="start">
                    <Text>Address line 1</Text>
                    <Input
                        required
                        placeholder="Address line 1"
                        w={{ base: 'xs', md: 'lg' }}
                        name="addressLine1"
                        value={values.addressLine1}
                        onChange={onValuesChange('addressLine1')}
                    />
                </VStack>
                <VStack align="start">
                    <Text>Address line 2</Text>
                    <Input
                        placeholder="Address line 2 (optional)"
                        w={{ base: 'xs', md: 'lg' }}
                        name="addressLine2"
                        value={values.addressLine2}
                        onChange={onValuesChange('addressLine2')}
                    />
                </VStack>
                <VStack align="start">
                    <Text>Postal code</Text>
                    <Input
                        required
                        placeholder="Postal code"
                        w={{ base: 'xs', md: 'lg' }}
                        name="postalCodes"
                        value={values.postalCodes}
                        onChange={onValuesChange('postalCodes')}
                    />
                </VStack>
                <Flex gap={6}>
                    <VStack align="start">
                        <Text>City</Text>
                        <Input
                            required
                            placeholder="City"
                            name="city"
                            value={values.city}
                            onChange={onValuesChange('city')}
                        />
                    </VStack>
                    <VStack align="start">
                        <Text>Region</Text>
                        <Input
                            required
                            placeholder="Region"
                            name="region"
                            value={values.region}
                            onChange={onValuesChange('region')}
                        />
                    </VStack>
                </Flex>
                <Checkbox isChecked={isDefault} onChange={(e) => setIsDefault(e.target.checked)}>
                    Use this address as the default for subsequent orders
                </Checkbox>
            </VStack>
        </Box>
    );
};

export default CheckoutPage;
