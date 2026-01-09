import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Linking
} from 'react-native';
import { Exam, Question } from '../shared';

interface ExamTakingScreenProps {
    exam: Exam;
    questions: Question[];
    token: string;
    apiBase: string;
    onComplete: (score: number, total: number) => void;
    onCancel: () => void;
}

export default function ExamTakingScreen({
    onCancel,
}: ExamTakingScreenProps) {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>🛡️</Text>
                <Text style={styles.title}>Erişim Engellendi</Text>
                <Text style={styles.message}>
                    Sınav güvenliği kuralları gereği, bu sınava mobil cihaz üzerinden giriş yapamazsınız.
                </Text>
                <View style={styles.warningBox}>
                    <Text style={styles.warningText}>
                        Lütfen bilgisayarınızdan <Text style={{ fontWeight: 'bold' }}>Safe Exam Browser (SEB)</Text> kullanarak giriş yapınız.
                    </Text>
                </View>

                <Pressable style={styles.button} onPress={onCancel}>
                    <Text style={styles.buttonText}>Geri Dön</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        padding: 20
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
    },
    icon: {
        fontSize: 60,
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16
    },
    message: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24
    },
    warningBox: {
        backgroundColor: '#fee2e2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 30,
        width: '100%'
    },
    warningText: {
        color: '#991b1b',
        textAlign: 'center',
        fontSize: 15
    },
    button: {
        backgroundColor: '#0f172a',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    }
});
