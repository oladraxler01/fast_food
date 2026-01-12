import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, offers } from "@/constants";
import { useState } from 'react';

const Details = () => {
    const { id } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);

    // 🔴 MATCH IDs AS STRINGS TO PREVENT "NOT FOUND"
    const foodItem = offers.find((item) => String(item.id) === String(id));

    if (!foodItem) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <Text className="text-xl font-bold">Food item not found</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-5 bg-orange-500 px-8 py-3 rounded-full"
                >
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header Section */}
                <View className="flex-row justify-between items-center px-5 mt-4">
                    <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 p-3 rounded-full">
                        <Image source={images.arrowLeft} className="size-6" tintColor="black" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
                        <Image source={images.search} className="size-6" tintColor="black" />
                    </TouchableOpacity>
                </View>

                {/* Dynamic Content Section */}
                <View className="px-5 mt-6">
                    <Text className="text-3xl font-bold text-dark-100">{foodItem.title}</Text>
                    <Text className="text-gray-400 text-lg">Fast Food</Text>

                    <View className="flex-row items-center mt-2 gap-x-2">
                        <Text className="text-orange-500 font-bold text-lg">⭐⭐⭐⭐⭐</Text>
                        <Text className="text-gray-400 font-bold">4.9/5</Text>
                    </View>

                    <View className="flex-row justify-between items-center mt-2">
                        <View>
                            <Text className="text-4xl font-bold text-orange-500">$10.02</Text>
                            <View className="mt-4 gap-y-2">
                                <View>
                                    <Text className="text-gray-400">Calories</Text>
                                    <Text className="font-bold">365 Cal</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-400">Protein</Text>
                                    <Text className="font-bold">35g</Text>
                                </View>
                            </View>
                        </View>
                        {/* 🔴 SHOWS THE REAL IMAGE (Burger, Pizza, or Burrito) */}
                        <Image source={foodItem.image} className="w-60 h-60" resizeMode="contain" />
                    </View>
                </View>

                {/* Toppings Horizontal List */}
                <View className="mt-8">
                    <Text className="text-xl font-bold px-5 mb-4">Toppings</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                        {['Tomato', 'Onions', 'Cheese', 'Bacons'].map((topping, index) => (
                            <View key={index} className="mr-4 items-center bg-white shadow-sm border border-gray-100 p-4 rounded-3xl">
                                <View className="bg-gray-50 p-2 rounded-2xl mb-2">
                                    <Image source={foodItem.image} className="size-10" />
                                </View>
                                <Text className="font-bold">{topping}</Text>
                                <TouchableOpacity className="bg-red-500 rounded-full size-5 items-center justify-center mt-2">
                                    <Text className="text-white font-bold">+</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View className="absolute bottom-0 w-full bg-white px-5 py-8 border-t border-gray-100 flex-row items-center justify-between">
                <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-2 gap-x-6">
                    <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Text className="text-3xl text-orange-500 font-bold">-</Text>
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold">{quantity}</Text>
                    <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                        <Text className="text-3xl text-orange-500 font-bold">+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="bg-orange-500 flex-1 ml-5 rounded-3xl py-4 items-center flex-row justify-center gap-x-2">
                    <Text className="text-white font-bold text-lg">Add to cart (${(10.02 * quantity).toFixed(2)})</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Details;