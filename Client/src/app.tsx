import {ChakraProvider} from "@chakra-ui/react";
import {QueryClient, QueryClientProvider} from "react-query";
import {RouterProvider} from "react-router-dom";
import router from "./pages/router.tsx";
import {AuthContextProvider} from "./context/AuthContext.tsx";
import {ReactQueryDevtools} from "react-query/devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000 * 5, // 5 minutes
            retry: 0,
        },
        mutations: {
            retry: 0
        },
    }
})

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider>
                <AuthContextProvider>
                    <RouterProvider router={router}/>
                    <ReactQueryDevtools initialIsOpen={false}/>
                </AuthContextProvider>
            </ChakraProvider>
        </QueryClientProvider>
    )
}

export default App;