import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {useSearchParams} from "react-router-dom";

const sortMenus = {
    name: "Name",
    nameDesc: "Name [Z-A]",
    price: "Price",
    priceDesc: "Price [Z-A]",
    "_": ""
}

export const ProductSortBy =() => {
    const [params, setParams] = useSearchParams();

    const handleSortMenuClick = (value: string) => () => {
        const newParams = new URLSearchParams(params);
        newParams.set("orderBy", value);
        setParams(newParams);
    }
    
    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} px={4} variant="outline">
                Sort
                by: {sortMenus[(params.get("orderBy") || "_") as keyof typeof sortMenus] || ""}
            </MenuButton>
            <MenuList>
                <MenuItem onClick={handleSortMenuClick("name")}>Name</MenuItem>
                <MenuItem onClick={handleSortMenuClick("nameDesc")}>Name [Z-A]</MenuItem>
                <MenuItem onClick={handleSortMenuClick("price")}>Price</MenuItem>
                <MenuItem onClick={handleSortMenuClick("priceDesc")}>Price [Z-A]</MenuItem>
            </MenuList>
        </Menu>
    )
}