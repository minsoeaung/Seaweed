import Product from "../../components/Product.tsx";

const HomePage = () => {
    return (
        <div>
            {Array(10).fill("hi").map((_, i) => (
                <Product key={i}/>
            ))}
        </div>
    )
}

export default HomePage;