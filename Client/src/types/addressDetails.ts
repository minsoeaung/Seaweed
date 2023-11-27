export type AddressDetails = {
    id: number;
    unitNumber: string;
    streetNumber: string;
    addressLine1: string;
    addressLine2: string;
    postalCodes: string;
    city: string;
    region: string;
    country: Country;
    isDefault: boolean;
};

type Country = {
    id: number;
    name: string;
    alpha2Code: string;
};
