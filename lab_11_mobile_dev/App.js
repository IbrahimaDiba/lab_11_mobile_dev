import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const [permissionStatus, setPermissionStatus] = useState('checking');
    const [scheduledTime, setScheduledTime] = useState(null);
    const [notificationId, setNotificationId] = useState(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in animation on mount
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Request permissions
        registerForPushNotificationsAsync();

        // Cleanup scheduled notification on unmount
        return () => {
            if (notificationId) {
                Notifications.cancelScheduledNotificationAsync(notificationId);
            }
        };
    }, []);

    // Pulse animation for water droplet
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    async function registerForPushNotificationsAsync() {
        let status = 'denied';

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#4FC3F7',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                finalStatus = newStatus;
            }

            status = finalStatus;
        } else {
            // Running on simulator/emulator
            status = 'granted';
        }

        setPermissionStatus(status);

        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please enable notifications in your device settings to receive water reminders.',
                [{ text: 'OK' }]
            );
        }
    }

    async function scheduleWaterReminder() {
        if (permissionStatus !== 'granted') {
            Alert.alert(
                'Permission Denied',
                'Please enable notifications to schedule reminders.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Cancel any existing notification
        if (notificationId) {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        }

        // Schedule notification for 3 minutes from now
        const scheduledDate = new Date();
        scheduledDate.setMinutes(scheduledDate.getMinutes() + 3);

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: '💧 Water Reminder',
                body: 'Time to drink some water! Stay hydrated! 🥤',
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: { type: 'water_reminder' },
            },
            trigger: {
                seconds: 180, // 3 minutes = 180 seconds
            },
        });

        setNotificationId(id);
        setScheduledTime(scheduledDate);

        // Show confirmation
        Alert.alert(
            'Reminder Scheduled! ✓',
            `You'll receive a notification at ${scheduledDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })}`,
            [{ text: 'OK' }]
        );
    }

    const getPermissionStatusText = () => {
        switch (permissionStatus) {
            case 'granted':
                return '✓ Notifications Enabled';
            case 'denied':
                return '✗ Notifications Disabled';
            case 'checking':
                return 'Checking permissions...';
            default:
                return 'Unknown status';
        }
    };

    const getPermissionStatusColor = () => {
        switch (permissionStatus) {
            case 'granted':
                return '#4CAF50';
            case 'denied':
                return '#F44336';
            default:
                return '#FFC107';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Gradient Background Effect */}
            <View style={styles.gradientTop} />
            <View style={styles.gradientBottom} />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Water Droplet Icon */}
                <Animated.Text
                    style={[
                        styles.waterIcon,
                        { transform: [{ scale: pulseAnim }] }
                    ]}
                >
                    💧
                </Animated.Text>

                {/* Title */}
                <Text style={styles.title}>Water Reminder</Text>
                <Text style={styles.subtitle}>Stay Hydrated, Stay Healthy</Text>

                {/* Permission Status Card */}
                <View style={styles.statusCard}>
                    <View
                        style={[
                            styles.statusIndicator,
                            { backgroundColor: getPermissionStatusColor() }
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {getPermissionStatusText()}
                    </Text>
                </View>

                {/* Scheduled Time Display */}
                {scheduledTime && (
                    <View style={styles.scheduledCard}>
                        <Text style={styles.scheduledLabel}>Next Reminder</Text>
                        <Text style={styles.scheduledTime}>
                            {scheduledTime.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </Text>
                        <Text style={styles.scheduledSubtext}>
                            (in 3 minutes)
                        </Text>
                    </View>
                )}

                {/* Schedule Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        permissionStatus !== 'granted' && styles.buttonDisabled
                    ]}
                    onPress={scheduleWaterReminder}
                    activeOpacity={0.8}
                    disabled={permissionStatus !== 'granted'}
                >
                    <Text style={styles.buttonText}>
                        {scheduledTime ? '🔄 Reschedule Reminder' : '⏰ Schedule Reminder'}
                    </Text>
                    <Text style={styles.buttonSubtext}>3 minutes from now</Text>
                </TouchableOpacity>

                {/* Info Text */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        💡 Tap the button above to schedule a water reminder notification that will appear in 3 minutes.
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1929',
    },
    gradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#1A237E',
        opacity: 0.3,
    },
    gradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#006064',
        opacity: 0.3,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        zIndex: 1,
    },
    waterIcon: {
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#B3E5FC',
        marginBottom: 40,
        textAlign: 'center',
        fontWeight: '400',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    statusText: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    scheduledCard: {
        backgroundColor: 'rgba(79, 195, 247, 0.15)',
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
        width: width - 48,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(79, 195, 247, 0.3)',
    },
    scheduledLabel: {
        fontSize: 14,
        color: '#81D4FA',
        marginBottom: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scheduledTime: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    scheduledSubtext: {
        fontSize: 14,
        color: '#B3E5FC',
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#4FC3F7',
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 30,
        marginBottom: 24,
        width: width - 48,
        alignItems: 'center',
        shadowColor: '#4FC3F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: '#546E7A',
        shadowOpacity: 0.2,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    buttonSubtext: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        padding: 16,
        borderRadius: 12,
        width: width - 48,
        borderLeftWidth: 4,
        borderLeftColor: '#4FC3F7',
    },
    infoText: {
        fontSize: 14,
        color: '#B3E5FC',
        lineHeight: 20,
        textAlign: 'center',
    },
});
