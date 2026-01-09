import React, { useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { apiClient } from '../../api/client';

interface CreateUserModalProps {
    visible: boolean;
    onClose: () => void;
    token: string;
    onSuccess: () => void;
}

export default function CreateUserModal({ visible, onClose, token, onSuccess }: CreateUserModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!username || !password || !email) {
            Alert.alert('Hata', 'Tüm alanları doldurun.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/users', {
                username,
                password,
                email,
                role
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Başarılı', 'Kullanıcı oluşturuldu.');
            onSuccess();
            onClose();
            // Reset form
            setUsername('');
            setPassword('');
            setEmail('');
            setRole('student');
        } catch (error: any) {
            Alert.alert('Hata', error.message || 'Kullanıcı oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    const roles = ['student', 'instructor', 'admin'];

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Yeni Kullanıcı Ekle 👤</Text>
                        <Pressable onPress={onClose}><Text style={styles.closeText}>✕</Text></Pressable>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Kullanıcı Adı</Text>
                        <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />

                        <Text style={styles.label}>E-posta</Text>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

                        <Text style={styles.label}>Şifre</Text>
                        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

                        <Text style={styles.label}>Rol</Text>
                        <View style={styles.roleContainer}>
                            {roles.map((r) => (
                                <TouchableOpacity
                                    key={r}
                                    style={[styles.roleBadge, role === r && styles.roleBadgeActive]}
                                    onPress={() => setRole(r)}
                                >
                                    <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                                        {r === 'student' ? 'Öğrenci' : r === 'instructor' ? 'Öğretmen' : 'Yönetici'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Pressable style={styles.createButton} onPress={handleCreate} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Oluştur</Text>}
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
    roleContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10
    },
    roleBadge: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    roleBadgeActive: {
        backgroundColor: '#f0fdf4',
        borderColor: '#16a34a'
    },
    roleText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500'
    },
    roleTextActive: {
        color: '#15803d',
        fontWeight: '700'
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
