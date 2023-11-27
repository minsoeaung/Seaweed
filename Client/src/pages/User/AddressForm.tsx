import { Box, Button, ButtonGroup, Checkbox, Flex, Input, Select, Text, VStack } from '@chakra-ui/react';
import { useCountries } from '../../hooks/queries/useCountries.ts';
import { AddressDetails } from '../../types/addressDetails.ts';
import { ChangeEvent, FormEvent, useState } from 'react';
import { CreateAddressDto } from '../../types/createAddressDto.ts';
import { Link } from 'react-router-dom';
import { useAddressCUD } from '../../hooks/mutations/useAddressCUD.tsx';
import { useSetDefaultAddress } from '../../hooks/mutations/useSetDefaultAddress.ts';

type Props = {
    address?: AddressDetails;
};

export const AddressForm = ({ address }: Props) => {
    const [formValues, setFormValues] = useState<CreateAddressDto>({
        unitNumber: address?.unitNumber || '',
        streetNumber: address?.streetNumber || '',
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        city: address?.city || '',
        region: address?.region || '',
        postalCodes: address?.postalCodes || '',
        countryId: address?.country.id || 0,
    });

    const TYPE = !!address ? 'UPDATE' : 'CREATE';

    const [isDefault, setIsDefault] = useState(address?.isDefault);

    const mutation = useAddressCUD();
    const defaultAddressMutation = useSetDefaultAddress();

    const { data: countries } = useCountries();

    const handleFormValueChange =
        (formName: keyof CreateAddressDto) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setFormValues((prevState) => ({
                ...prevState,
                [formName]: e.target.value,
            }));
        };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const onSuccess = async (res: AddressDetails | undefined) => {
            if (!address?.isDefault && isDefault && res) {
                await defaultAddressMutation.mutateAsync(res.id);
            }
        };

        if (TYPE === 'CREATE') {
            await mutation
                .mutateAsync({
                    type: 'CREATE',
                    payload: formValues,
                    pushOnSuccess: '/user/my-account',
                })
                .then(onSuccess);
        } else if (TYPE === 'UPDATE') {
            await mutation
                .mutateAsync({
                    type: 'UPDATE',
                    id: address?.id!,
                    payload: formValues,
                    pushOnSuccess: '/user/my-account',
                })
                .then(onSuccess);
        }
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="start">
                    <VStack align="start">
                        <Text>Country</Text>
                        <Select
                            placeholder="Select country"
                            name="countryId"
                            disabled={!countries}
                            required
                            value={formValues.countryId}
                            onChange={handleFormValueChange('countryId')}
                            maxW="sm"
                        >
                            {Array.isArray(countries) &&
                                countries.map((country) => (
                                    <option value={country.id} key={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                        </Select>
                    </VStack>
                    <Flex gap={6}>
                        <VStack align="start">
                            <Text>Unit number</Text>
                            <Input
                                placeholder="Unit number"
                                name="unitNumber"
                                value={formValues.unitNumber}
                                onChange={handleFormValueChange('unitNumber')}
                            />
                        </VStack>
                        <VStack align="start">
                            <Text>Street number</Text>
                            <Input
                                placeholder="Street number"
                                name="streetNumber"
                                value={formValues.streetNumber}
                                onChange={handleFormValueChange('streetNumber')}
                            />
                        </VStack>
                    </Flex>
                    <VStack align="start">
                        <Text>Address line 1</Text>
                        <Input
                            placeholder="Address line 1"
                            w={{ base: 'xs', md: 'lg' }}
                            name="addressLine1"
                            value={formValues.addressLine1}
                            onChange={handleFormValueChange('addressLine1')}
                        />
                    </VStack>
                    <VStack align="start">
                        <Text>Address line 2</Text>
                        <Input
                            placeholder="Address line 2 (optional)"
                            w={{ base: 'xs', md: 'lg' }}
                            name="addressLine2"
                            value={formValues.addressLine2}
                            onChange={handleFormValueChange('addressLine2')}
                        />
                    </VStack>
                    <VStack align="start">
                        <Text>Postal code</Text>
                        <Input
                            placeholder="Postal code"
                            w={{ base: 'xs', md: 'lg' }}
                            name="postalCodes"
                            value={formValues.postalCodes}
                            onChange={handleFormValueChange('postalCodes')}
                        />
                    </VStack>
                    <Flex gap={6}>
                        <VStack align="start">
                            <Text>City</Text>
                            <Input
                                placeholder="City"
                                name="city"
                                value={formValues.city}
                                onChange={handleFormValueChange('city')}
                            />
                        </VStack>
                        <VStack align="start">
                            <Text>Region</Text>
                            <Input
                                placeholder="Region"
                                name="region"
                                value={formValues.region}
                                onChange={handleFormValueChange('region')}
                            />
                        </VStack>
                    </Flex>
                    <Checkbox isChecked={isDefault} onChange={(e) => setIsDefault(e.target.checked)}>
                        Set as default shipping address
                    </Checkbox>
                    <ButtonGroup variant="solid" spacing="6">
                        <Button colorScheme="blue" type="submit" isLoading={mutation.isLoading}>
                            {TYPE === 'CREATE' ? 'Submit' : 'Save changes'}
                        </Button>
                        <Button as={Link} to="/user/my-account">
                            Cancel
                        </Button>
                    </ButtonGroup>
                </VStack>
            </form>
        </Box>
    );
};
