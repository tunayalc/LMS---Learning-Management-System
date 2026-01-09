import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { apiClient } from '../../api/client';

interface CreateCourseModalProps {
    visible: boolean;
    onClose: () => void;
    token: string;
    onSuccess: (course: any) => void;
}

export default function CreateCourseModal({ visible, onClose, token, onSuccess }: CreateCourseModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert('Hata', 'Ders başlığı gereklidir.');
            return;
        }

        setLoading(true);
        try {
            // Assuming existing backend structure: POST /courses
            const response = await apiClient.post<any>('/courses', {
                title,
                description: description || undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // API might return { course: ... } or just the course object
            const newCourse = response.course || response;

            Alert.alert('Başarılı', 'Ders oluşturuldu.');
            onSuccess(newCourse);
            onClose();
            setTitle('');
            setDescription('');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Hata', 'Ders oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Yeni Ders Oluştur 📚</Text>
                        <Pressable onPress={onClose}><Text style={styles.closeText}>✕</Text></Pressable>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Ders Adı</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Örn: Matematik 101"
                        />

                        <Text style={styles.label}>Açıklama (İsteğe Bağlı)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            placeholder="Ders içeriği hakkında kısa bilgi..."
                        />

                        <Pressable style={styles.createButton} onPress={handleCreate} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Ders Oluştur</Text>}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b'
    },
    closeText: {
        fontSize: 24,
        color: '#94a3b8'
    },
    form: {
        gap: 12
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 4
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#334155'
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top'
    },
    createButton: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});
