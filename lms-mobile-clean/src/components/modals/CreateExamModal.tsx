import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, Pressable, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { apiClient } from '../../api/client';

interface CreateExamModalProps {
    visible: boolean;
    onClose: () => void;
    token: string;
    onSuccess: (exam: any) => void;
}

export default function CreateExamModal({ visible, onClose, token, onSuccess }: CreateExamModalProps) {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('30');
    const [passThreshold, setPassThreshold] = useState('50');
    const [loading, setLoading] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchCourses();
        }
    }, [visible]);

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            // Assuming instructor can only see their courses or all courses
            const response = await apiClient.get<any[]>('/courses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle response structure (array or { courses: [] })
            const courseList = Array.isArray(response) ? response : (response as any).courses || [];
            setCourses(courseList);
        } catch (error) {
            console.error('Failed to fetch courses', error);
            Alert.alert('Hata', 'Dersler yüklenemedi.');
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleCreate = async () => {
        if (!selectedCourseId) {
            Alert.alert('Hata', 'Lütfen bir ders seçin.');
            return;
        }
        if (!title.trim()) {
            Alert.alert('Hata', 'Sınav başlığı gereklidir.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post<any>('/exams', {
                courseId: selectedCourseId,
                title,
                durationMinutes: parseInt(duration) || 30,
                passThreshold: parseInt(passThreshold) || 50
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newExam = response.exam || response;
            Alert.alert('Başarılı', 'Sınav oluşturuldu.');
            onSuccess(newExam);
            onClose();
            // Reset form
            setTitle('');
            setDuration('30');
            setSelectedCourseId(null);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Hata', 'Sınav oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Yeni Sınav Oluştur 📝</Text>
                        <Pressable onPress={onClose}><Text style={styles.closeText}>✕</Text></Pressable>
                    </View>

                    <ScrollView style={styles.form}>
                        <Text style={styles.label}>Ders Seçiniz</Text>
                        {loadingCourses ? (
                            <ActivityIndicator />
                        ) : (
                            <ScrollView horizontal style={styles.courseScroll} showsHorizontalScrollIndicator={false}>
                                {courses.map(course => (
                                    <Pressable
                                        key={course.id}
                                        style={[styles.courseChip, selectedCourseId === course.id && styles.courseChipActive]}
                                        onPress={() => setSelectedCourseId(course.id)}
                                    >
                                        <Text style={[styles.courseChipText, selectedCourseId === course.id && styles.courseChipTextActive]}>
                                            {course.title}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}

                        <Text style={styles.label}>Sınav Başlığı</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Örn: Vize Sınavı"
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Süre (Dk)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={duration}
                                    onChangeText={setDuration}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Geçme Notu</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passThreshold}
                                    onChangeText={setPassThreshold}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <Pressable style={styles.createButton} onPress={handleCreate} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Sınav Oluştur</Text>}
                        </Pressable>
                    </ScrollView>
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
        elevation: 5,
        maxHeight: '80%'
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
        marginBottom: 4,
        marginTop: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#334155'
    },
    row: {
        flexDirection: 'row',
        gap: 12
    },
    createButton: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 20
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    courseScroll: {
        flexDirection: 'row',
        marginBottom: 8,
        height: 50
    },
    courseChip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginRight: 8,
        height: 42
    },
    courseChipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6'
    },
    courseChipText: {
        color: '#64748b',
        fontWeight: '500'
    },
    courseChipTextActive: {
        color: '#1d4ed8',
        fontWeight: '700'
    }
});
