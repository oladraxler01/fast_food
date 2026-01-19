import {View, Text, FlatList, Alert} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {useCartStore} from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import cn from "clsx";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
import { useStripe } from '@stripe/stripe-react-native';
import { functions } from "@/lib/appwrite";
import { ExecutionMethod } from "react-native-appwrite";
import { router } from "expo-router";

interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const Cart = () => {
    const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const finalAmount = (totalPrice + 5 - 0.5).toFixed(2);

    const handleOrderNow = async () => {
        try {
            // 1. Call Appwrite Function to get the Stripe Client Secret
            const response = await functions.createExecution(
                '6964ed6200314a9c3649',
                JSON.stringify({ amount: parseFloat(finalAmount) }),
                false,
                '/',
                ExecutionMethod.POST
            );
            // 2. Parse the response from your Node.js function
            const data = JSON.parse(response.responseBody);

            if (!data.clientSecret) {
                throw new Error("Failed to get payment secret from server");
            }

            // 3. Initialize the real Stripe Payment Sheet
            const { error: initError } = await initPaymentSheet({
                merchantDisplayName: "Fast Food App",
                paymentIntentClientSecret: data.clientSecret,
                defaultBillingDetails: { name: 'Customer' }
            });

            if (initError) {
                Alert.alert("Init Error", initError.message);
                return;
            }

            // 4. Present the Payment Sheet to the user
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                Alert.alert("Payment Cancelled", presentError.message);
            } else {
                // 🔴 SUCCESS!
                Alert.alert("Success", "Payment confirmed!");

                // 1. Prepare data BEFORE clearing cart
                const orderData = JSON.stringify(items);
                const orderTotal = finalAmount;

                // 2. Empty the cart
                clearCart();

                // 3. Navigate to Tracking Page and PASS THE DATA
                router.push({
                    pathname: "/tracking",
                    params: {
                        items: orderData,
                        total: orderTotal
                    }
                });
            }
        } catch (err: any) {
            console.error(err);
            Alert.alert("Error", err.message || "An unexpected error occurred");
        }
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-28 px-5 pt-5"
                ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
                ListEmptyComponent={() => (
                    <View className="items-center mt-20">
                        <Text className="paragraph-medium text-gray-200">Cart Empty</Text>
                    </View>
                )}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">
                                Payment Summary
                            </Text>

                            <PaymentInfoStripe
                                label={`Total Items (${totalItems})`}
                                value={`$${totalPrice.toFixed(2)}`}
                            />
                            <PaymentInfoStripe
                                label={`Delivery Fee`}
                                value={`$5.00`}
                            />
                            <PaymentInfoStripe
                                label={`Discount`}
                                value={`- $0.50`}
                                valueStyle="!text-success"
                            />
                            <View className="border-t border-gray-300 my-2" />
                            <PaymentInfoStripe
                                label={`Total`}
                                value={`$${finalAmount}`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-dark-100 !text-right"
                            />
                        </View>

                        <CustomButton
                            title="Order Now"
                            onPress={handleOrderNow}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Cart