import {Button, ButtonProps} from "@chakra-ui/react";
import {useAddToCart} from "../hooks/mutations/useAddToCart.ts";

type Props = {
    isInCart: boolean;
    productId: number;
    buttonProps?: ButtonProps;
};

export const AddToCartButton = ({isInCart, productId, buttonProps}: Props) => {
    const mutation = useAddToCart();

    return (
        <Button
            colorScheme="blue"
            width="full"
            variant="outline"
            {...buttonProps}
            onClick={async (e) => {
                e.preventDefault();
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