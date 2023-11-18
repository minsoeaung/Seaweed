import {List, ListItem} from "@chakra-ui/react";
import AntdSpin from "./AntdSpin";
import {Link} from "react-router-dom";
import { useCategories } from "../hooks/queries/useCategories";
import {NamedApiResource} from "../types/namedApiResource.ts";

const Categories = () => {
    const {data, isLoading} = useCategories();

    if (isLoading) {
        return <AntdSpin/>
    }

    return (
        <List spacing={2}>
            {data?.map((cat: NamedApiResource) => (
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