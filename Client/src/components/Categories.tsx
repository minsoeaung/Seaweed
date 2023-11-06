import useCategories from "../hooks/useCategories.ts";
import {List, ListItem} from "@chakra-ui/react";
import AntdSpin from "./AntdSpin";
import {Link} from "react-router-dom";

const Categories = () => {
    const {data, isLoading} = useCategories();

    if (isLoading) {
        return <AntdSpin/>
    }

    return (
        <List spacing={2}>
            {data?.categories.map(cat => (
                <ListItem key={cat.id}>
                    <Link to={`catalog?categories=${cat.name}`}>
                        {cat.name}
                    </Link>
                </ListItem>
            ))}
        </List>
    )
}

export default Categories;