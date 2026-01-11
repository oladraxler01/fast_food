import {Text, TouchableOpacity, Image, Platform} from 'react-native'
import {MenuItem} from "@/type";

const MenuCard = ({ item: { $id, image_url, name, price }}: { item: MenuItem}) => {
    // Keeping it simple so the images stay visible
    const imageUrl = image_url;

    return (
        <TouchableOpacity
            // 'menu-card' needs to be in your global.css for the tutorial look
            // I added 'mt-10' and 'pt-12' manually here just in case your CSS is missing them
            className="menu-card bg-white rounded-3xl p-4 pt-12 mt-10 items-center relative"
            style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}
        >
            {/* This lifts the food up */}
            <Image
                source={{ uri: imageUrl }}
                className="size-32 absolute -top-10"
                resizeMode="contain"
            />

            {/* Match the tutorial typography */}
            <Text className="text-center base-bold text-dark-100 mb-2 mt-5" numberOfLines={1}>
                {name}
            </Text>

            <Text className="body-regular text-gray-200 mb-4">
                From ${price}
            </Text>

            <TouchableOpacity>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default MenuCard;