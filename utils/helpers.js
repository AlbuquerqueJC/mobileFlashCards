import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

const NOTIFICATION_KEY = "MobileFlashCards:notifications"

const titleText = "👋 It's Time To Test Yourself!"
const message = "Remember to quiz yourself today!"

export function timeToString(time = Date.now()) {
    const date = new Date(time)
    const todayUTC = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    return todayUTC.toISOString().split("T")[0]
}

export const getDailyReminderValue = () => {
    return { today: message }
}

export function setLocalNotification() {
    AsyncStorage.getItem(NOTIFICATION_KEY)
        .then(JSON.parse)
        .then((data) => {
            if (data === null) {
                Notifications.requestPermissionsAsync().then(({ granted }) => {
                    if (granted) {
                        Notifications.cancelAllScheduledNotificationsAsync().then(() => {
                            Notifications.scheduleNotificationAsync({
                                content: {
                                    title: titleText,
                                    body: message,
                                    ios: {
                                        sound: true,
                                        priority: "high",
                                        sticky: true,
                                        vibrate: true,
                                    },
                                    android: {
                                        sound: true,
                                        priority: "high",
                                        sticky: true,
                                        vibrate: true,
                                    },
                                },
                                trigger: {
                                    seconds: 24 * 60 * 60,
                                },
                            }).then((res) => {
                                AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
                            })
                        })
                    }
                })
            }
        })
}

export function clearLocalNotification() {
    return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
        Notifications.cancelAllScheduledNotificationsAsync
    )
}