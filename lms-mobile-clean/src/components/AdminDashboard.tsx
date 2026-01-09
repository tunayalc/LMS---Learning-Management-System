import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
// Import Modals
import CreateCourseModal from './modals/CreateCourseModal';
import CreateExamModal from './modals/CreateExamModal';
import CreateUserModal from './modals/CreateUserModal';

interface AdminDashboardProps {
    user: any;
    token: string;
    onRefresh: () => void;
}

export default function AdminDashboard({ user, token, onRefresh }: AdminDashboardProps) {
    const { colors } = useTheme();

    // Modal States
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [showCreateExam, setShowCreateExam] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);

    const role = user?.role?.toLowerCase() || 'student';

    const isSuperAdmin = role === 'superadmin';
    const isAdmin = ['admin', 'superadmin'].includes(role);
    const isInstructor = ['instructor', 'teacher', 'admin', 'superadmin'].includes(role);

    // Stats Card Component
    const StatsCard = ({ title, value, icon, color }: any) => (
        <View style={[styles.statsCard, { borderLeftColor: color }]}>
            <Text style={styles.statsIcon}>{icon}</Text>
            <View>
                <Text style={styles.statsValue}>{value}</Text>
                <Text style={styles.statsTitle}>{title}</Text>
            </View>
        </View>
    );

    // Action Button Component
    const ActionButton = ({ title, icon, onPress, primary = false }: any) => (
        <Pressable
            style={[styles.actionButton, primary ? styles.primaryBtn : styles.secondaryBtn]}
            onPress={onPress}
        >
            <Text style={styles.actionIcon}>{icon}</Text>
            <Text style={[styles.actionText, primary && { color: 'white' }]}>{title}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Yönetim Paneli 🛠️</Text>

            {/* 1. STATS SECTION */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
                {isAdmin && <StatsCard title="Kullanıcılar" value="-" icon="👥" color="#3b82f6" />}
                {isInstructor && <StatsCard title="Aktif Dersler" value="-" icon="📚" color="#10b981" />}
                {isInstructor && <StatsCard title="Sınavlar" value="-" icon="📝" color="#f59e0b" />}
            </ScrollView>

            {/* 2. ADMIN ACTIONS (User & System) */}
            {isAdmin && (
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Sistem Yönetimi</Text>
                    <View style={styles.grid}>
                        <ActionButton
                            title="Kullanıcı Ekle"
                            icon="👤"
                            primary
                            onPress={() => setShowCreateUser(true)}
                        />
                        <ActionButton
                            title="Sistem Ayarları"
                            icon="⚙️"
                            onPress={() => Alert.alert('Bilgi', 'Sistem ayarları web panelinden yapılmalıdır.')}
                        />
                    </View>
                </View>
            )}

            {/* 3. INSTRUCTOR ACTIONS (Content) */}
            {isInstructor && (
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Eğitim Yönetimi</Text>
                    <View style={styles.grid}>
                        <ActionButton
                            title="Ders Oluştur"
                            icon="➕"
                            primary
                            onPress={() => setShowCreateCourse(true)}
                        />
                        <ActionButton
                            title="Sınav Oluştur"
                            icon="📝"
                            primary
                            onPress={() => setShowCreateExam(true)}
                        />
                        <ActionButton
                            title="İçerik Yükle"
                            icon="📂"
                            onPress={() => Alert.alert('Bilgi', 'İçerik yükleme özelliği yakında aktif olacak.')}
                        />
                    </View>
                </View>
            )}

            {/* MODALS */}
            <CreateUserModal
                visible={showCreateUser}
                onClose={() => setShowCreateUser(false)}
                token={token}
                onSuccess={() => { onRefresh(); }}
            />

            <CreateCourseModal
                visible={showCreateCourse}
                onClose={() => setShowCreateCourse(false)}
                token={token}
                onSuccess={() => { onRefresh(); }}
            />

            <CreateExamModal
                visible={showCreateExam}
                onClose={() => setShowCreateExam(false)}
                token={token}
                onSuccess={() => { onRefresh(); }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
        marginLeft: 4
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 24
    },
    statsCard: {
        backgroundColor: 'white',
        width: 140,
        padding: 16,
        borderRadius: 16,
        marginRight: 12,
        borderLeftWidth: 4,
        shadowColor: "#64748b",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    statsIcon: {
        fontSize: 24
    },
    statsValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a'
    },
    statsTitle: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600'
    },
    section: {
        marginBottom: 24
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    actionButton: {
        width: '48%', // 2 columns
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1
    },
    primaryBtn: {
        backgroundColor: '#0f172a',
        borderColor: '#0f172a'
    },
    secondaryBtn: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0'
    },
    actionIcon: {
        fontSize: 28
    },
    actionText: {
        fontWeight: '600',
        color: '#334155',
        fontSize: 14
    }
});
