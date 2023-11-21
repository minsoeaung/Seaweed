import { NamedApiResource } from './namedApiResource.ts';

export type ProductFilterDto = {
    brands: NamedApiResource[];
    categories: NamedApiResource[];
};
