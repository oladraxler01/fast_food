import { Redirect, Tabs } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { TabBarIconProps } from "@/type";
import { Image, Text, View } from "react-native";
import { images } from "@/constants";
import cn from "clsx";
import { useEffect } from "react";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    // Added flex-1 and justify-center to keep icons and text perfectly aligned
    <View className="flex-1 flex-col items-center justify-center mt-2">
        <Image
            source={icon}
            className="size-6"
            resizeMode="contain"
            tintColor={focused ? '#FE8C00' : '#5D5F6D'}
        />
        <Text
            className={cn('text-[10px] font-bold mt-1', focused ? 'text-[#FE8C00]' : 'text-gray-400')}
            numberOfLines={1}
        >
            {title}
        </Text>
    </View>
)

export default function TabLayout() {
    const { isAuthenticated, fetchAuthenticatedUser } = useAuthStore();

    useEffect(() => {
        fetchAuthenticatedUser();
    }, []);

    // Fixed path to include (auth) based on your file tree
    if(!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                marginHorizontal: 15,
                height: 80, // Keeping your height
                position: 'absolute',
                bottom: 40, // Keeping your position
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
                borderTopWidth: 0, // Removes the ugly top line
            }
        }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Home" icon={images.home} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='search'
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Search" icon={images.search} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Cart" icon={images.bag} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Profile" icon={images.person} focused={focused} />
                }}
            />
        </Tabs>
    );
}