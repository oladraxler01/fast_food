import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Location from 'expo-location'; // 🔴 Import Location

const OrderTracking = () => {
    const { items, total } = useLocalSearchParams();
    const orderItems = items ? JSON.parse(items as string) : [];
    const orderTotal = total ? parseFloat(total as string).toFixed(2) : "0.00";

    // State for real user location
    const [userLocation, setUserLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Static Restaurant & Driver (For Demo)
    const [restaurantCoords] = useState({ latitude: 6.5244, longitude: 3.3792 });
    const [driverCoords] = useState({ latitude: 6.5280, longitude: 3.3810 });

    // 🔴 1. Get Live Location
    useEffect(() => {
        (async () => {
            // Ask for permission
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert("Permission Denied", "Allow location access to track your delivery.");
                return;
            }

            // Get current location immediately
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // 🔴 2. Watch for movement (Updates as you move)
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000, // Update every 5 seconds
                    distanceInterval: 10, // Or every 10 meters
                },
                (newLocation) => {
                    setUserLocation({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            );
        })();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header & Map Section */}
                <View className="p-5">
                    <View className="flex-row items-center mb-4">
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="black"
                            onPress={() => router.replace("/(tabs)")}
                        />
                        <Text className="text-xl font-bold flex-1 text-center mr-6">Live Order Tracking</Text>
                    </View>

                    <View className="h-80 rounded-3xl overflow-hidden bg-gray-200 border border-gray-300 relative">
                        {/* 🔴 Show Map only when we have the location */}
                        {userLocation ? (
                            <MapView
                                style={{ width: '100%', height: '100%' }}
                                // 🔴 Use standard provider on iOS (Apple Maps) to avoid blank screen if no API Key
                                // provider={PROVIDER_GOOGLE}
                                region={userLocation} // Centers map on YOU
                                showsUserLocation={true} // Shows the Blue Dot
                                followsUserLocation={true} // Moves map as you move
                            >
                                {/* Restaurant Marker */}
                                <Marker coordinate={restaurantCoords} title="Restaurant">
                                    <View className="bg-white p-2 rounded-full shadow-lg">
                                        <MaterialCommunityIcons name="food" size={20} color="#000" />
                                    </View>
                                </Marker>

                                {/* Driver Marker */}
                                <Marker coordinate={driverCoords} title="Driver">
                                    <View className="bg-white p-2 rounded-full shadow-lg">
                                        <MaterialCommunityIcons name="truck-delivery" size={24} color="#FF8C00" />
                                    </View>
                                </Marker>
                            </MapView>
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator size="large" color="#FF8C00" />
                                <Text className="text-gray-500 mt-2">Locating you...</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Driver Info */}
                <View className="mx-5 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm flex-row items-center">
                    <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                        <Text className="text-white font-bold text-lg">JO</Text>
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="font-bold text-lg">John Okafor</Text>
                        <Text className="text-gray-400">Your delivery driver</Text>
                    </View>
                    <View className="bg-orange-500 px-4 py-2 rounded-xl">
                        <Text className="text-white font-bold">Call</Text>
                    </View>
                </View>

                {/* Order Details */}
                <View className="mx-5 mt-6 mb-6 bg-gray-50 p-5 rounded-3xl">
                    <Text className="text-xl font-bold mb-4">Order Details</Text>
                    {orderItems.map((item: any, index: number) => (
                        <View key={index} className="flex-row justify-between mb-2">
                            <Text className="text-gray-500 text-base">{item.quantity}x {item.name}</Text>
                            <Text className="font-bold text-base">${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View className="h-[1px] bg-gray-200 my-3" />
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-bold text-black">Total</Text>
                        <Text className="text-lg font-bold text-orange-500">${orderTotal}</Text>
                    </View>
                </View>

                {/* Timeline */}
                <View className="px-5 mt-2 mb-10">
                    <Text className="text-xl font-bold mb-4">Order Timeline</Text>
                    <TimelineItem time="2:15 PM" title="Order Confirmed" desc="Restaurant received your order" active />
                    <TimelineItem time="2:18 PM" title="Food Being Prepared" desc="Chef is preparing your meal" active />
                    <TimelineItem time="2:42 PM" title="Picked up" desc="Driver picked up your order" active />
                    <TimelineItem time="ETA 2:55 PM" title="On The Way" desc="5 mins away" active highlighted />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Helper Component
const TimelineItem = ({ time, title, desc, active, highlighted }: any) => (
    <View className="flex-row">
        <View className="items-center">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${active ? 'bg-orange-500' : 'bg-gray-200'}`}>
                <MaterialCommunityIcons name="clock" size={16} color="white" />
            </View>
            <View className={`w-0.5 h-12 ${active ? 'bg-orange-500' : 'bg-gray-200'}`} />
        </View>
        <View className="ml-4 flex-1 pb-6">
            <View className="flex-row justify-between">
                <Text className={`font-bold text-lg ${highlighted ? 'text-orange-500' : 'text-black'}`}>{title}</Text>
                <Text className={`font-medium ${highlighted ? 'text-orange-500' : 'text-gray-400'}`}>{time}</Text>
            </View>
            <Text className="text-gray-400">{desc}</Text>
        </View>
    </View>
);

export default OrderTracking;