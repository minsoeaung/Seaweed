import {ChakraProvider} from "@chakra-ui/react";
import {QueryClient, QueryClientProvider} from "react-query";
import {RouterProvider} from "react-router-dom";
import router from "./pages/router.tsx";
import {AuthContextProvider} from "./context/AuthContext.tsx";

const queryClient = new QueryClient()

const App = () => {
    return (
        <ChakraProvider>
            <AuthContextProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                </QueryClientProvider>
            </AuthContextProvider>
        </ChakraProvider>
    )
}

export default App;