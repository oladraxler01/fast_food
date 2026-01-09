import {Text, TouchableOpacity, Image, Platform} from 'react-native'
import {MenuItem} from "@/type";
import {appwriteConfig} from "@/lib/appwrite";

// DELETE or COMMENT OUT this line below
// import {useCartStore} from "@/store/cart.store";

const MenuCard = ({ item: { $id, image_url, name, price }}: { item: MenuItem}) => {
    const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;

    return (
        <TouchableOpacity
            className="menu-card bg-white rounded-3xl p-4 pt-12 items-center relative mt-10"
            style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}
        >
            <Image source={{ uri: imageUrl }} className="size-32 absolute -top-10" resizeMode="contain" />

            <Text className="text-center font-bold text-dark-100 mb-2 mt-5" numberOfLines={1}>
                {name}
            </Text>

            <Text className="text-gray-400 mb-4">From ${price}</Text>

            <TouchableOpacity onPress={() => console.log("Added to cart:", name)}>
                <Text className="font-bold text-orange-500">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default MenuCard;