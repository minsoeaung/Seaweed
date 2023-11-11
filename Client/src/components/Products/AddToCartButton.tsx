import {Button, ButtonProps} from "@chakra-ui/react";
import {useAddToCart} from "../../hooks/mutations/useAddToCart.ts";

type Props = {
    isInCart: boolean;
    productId: number;
} & ButtonProps;

export const AddToCartButton = (props: Props) => {
    const mutation = useAddToCart();
    const {isInCart, productId} = props;

    return (
        <Button
            colorScheme="blue"
            width="full"
            variant="outline"
            {...props}
            onClick={async () => {
                await mutation.mutateAsync({
                    productId,
                    quantity: isInCart ? 0 : 1
                })
            }}
            isLoading={mutation.isLoading}
            isDisabled={isInCart}
        >
            {isInCart ? "In cart" : "Add to cart"}
        </Button>
    )
}