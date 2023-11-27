import { AddressDetails } from './addressDetails.ts';

export type CreateAddressDto = {
    countryId: number;
} & Omit<AddressDetails, 'id' | 'country' | 'isDefault'>;
