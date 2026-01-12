import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '@/lib/appwrite';
import { router } from 'expo-router';
import useAuthStore from "@/store/auth.store";

const Profile = () => {
    // 🔴 ADD 'user' here to get real data
    const { setIsAuthenticated, setUser, user } = useAuthStore();

    const handleLogout = async () => {
        const result = await logout();
        if (result) {
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/(auth)/sign-in');
        } else {
            Alert.alert("Error", "Failed to log out");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="flex-row items-center justify-between px-5 py-4">
                    <Text className="text-xl font-bold">Profile</Text>
                </View>

                <View className="items-center mt-4">
                    <View className="relative">
                        <View className="w-32 h-32 rounded-full bg-orange-100 items-center justify-center overflow-hidden">
                            {/* 🔴 SHOW REAL AVATAR */}
                            {user?.avatar ? (
                                <Image source={{ uri: user.avatar }} className="w-full h-full" />
                            ) : (
                                <Text className="text-orange-400 text-lg">
                                    {user?.name?.charAt(0) || "U"}
                                </Text>
                            )}
                        </View>
                        <View className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full">
                            <Text className="text-white text-xs">✎</Text>
                        </View>
                    </View>

                    {/* 🔴 SHOW REAL NAME */}
                    <Text className="text-xl font-semibold mt-3">{user?.name || "User Name"}</Text>
                </View>

                <View className="mt-8 px-5 gap-y-4">
                    {[
                        { label: 'Full Name', value: user?.name },
                        { label: 'Email', value: user?.email },
                        { label: 'Phone number', value: '+1 555 123 4567' }, // Add to DB later
                        { label: 'Address', value: 'Add your address' },     // Add to DB later
                    ].map((item, index) => (
                        <View key={index} className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                            <Text className="text-xs text-gray-400">{item.label}</Text>
                            <Text className="text-base font-medium text-gray-800 mt-1">
                                {item.value || "N/A"}
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="px-5 mt-10 gap-y-4">
                    <TouchableOpacity
                        className="w-full border border-orange-400 rounded-full py-4 items-center"
                        onPress={() => router.push('/(tabs)/edit-profile')} // Point to real edit screen
                    >
                        <Text className="text-orange-500 font-semibold">Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="w-full border border-red-400 rounded-full py-4 items-center" onPress={handleLogout}>
                        <Text className="text-red-500 font-semibold">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;