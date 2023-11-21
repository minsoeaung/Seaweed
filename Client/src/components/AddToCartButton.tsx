import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    ButtonProps,
    useDisclosure
} from "@chakra-ui/react";
import {useAddToCart} from "../hooks/mutations/useAddToCart.ts";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

type Props = {
    isInCart: boolean;
    productId: number;
    buttonProps?: ButtonProps;
};

export const AddToCartButton = ({isInCart, productId, buttonProps}: Props) => {
    const mutation = useAddToCart();
    const cancelRef = useRef(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const navigate = useNavigate();
    const {user} = useAuth();

    const goToLoginPage = () => navigate("/login");

    return (
        <>
            <Button
                colorScheme={isInCart ? 'red' : 'blue'}
                width="full"
                variant="outline"
                {...buttonProps}
                onClick={async (e) => {
                    e.preventDefault();

                    if (user) {
                        await mutation.mutateAsync({
                            productId,
                            quantity: isInCart ? 0 : 1
                        })
                    } else {
                        onOpen();
                    }
                }}
                isLoading={mutation.isLoading}
            >
                {isInCart ? "Remove from cart" : "Add to cart"}
            </Button>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Please login first
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' variant='solid' onClick={goToLoginPage} ml={3}>
                                Login
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}