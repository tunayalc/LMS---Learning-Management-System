import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, Pressable, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { getApiBaseUrl, setApiBaseUrl } from '../api/client';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const { isDark, setMode, colors } = useTheme();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (visible) {
            setUrl(getApiBaseUrl());
        }
    }, [visible]);

    const handleSaveUrl = async () => {
        setLoading(true);
        await setApiBaseUrl(url);
        setLoading(false);
        onClose();
        // Force reload might be needed or handled by loadData
        alert("Ayarlar kaydedildi. Uygulama yenilenecek.");
    };

    const toggleTheme = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        AsyncStorage.setItem('user-language', lang);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.title, { color: colors.text }]}>Ayarlar ⚙️</Text>

                    {/* SERVER URL */}
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Sunucu Adresi (Gelişmiş)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                        value={url}
                        onChangeText={setUrl}
                        placeholder="http://..."
                        placeholderTextColor={colors.textSecondary}
                        autoCapitalize="none"
                    />

                    {/* APPEARANCE */}
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>Görünüm</Text>
                    <View style={styles.row}>
                        <Text style={{ color: colors.text }}>Karanlık Mod 🌙</Text>
                        <Switch value={isDark} onValueChange={toggleTheme} />
                    </View>

                    {/* LANGUAGE */}
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>Dil / Language</Text>
                    <View style={[styles.row, { justifyContent: 'flex-start', gap: 10 }]}>
                        <Pressable
                            style={[styles.langBtn, i18n.language === 'tr' && styles.activeLang]}
                            onPress={() => changeLanguage('tr')}
                        >
                            <Text style={{ color: i18n.language === 'tr' ? 'white' : colors.text }}>Türkçe</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.langBtn, i18n.language === 'en' && styles.activeLang]}
                            onPress={() => changeLanguage('en')}
                        >
                            <Text style={{ color: i18n.language === 'en' ? 'white' : colors.text }}>English</Text>
                        </Pressable>
                    </View>

                    {/* ACTIONS */}
                    <View style={[styles.row, { marginTop: 24, justifyContent: 'space-between' }]}>
                        <Pressable style={[styles.button, styles.cancelBtn]} onPress={onClose}>
                            <Text style={styles.textBtn}>Kapat</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.saveBtn]} onPress={handleSaveUrl}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textBtn}>Kaydet</Text>}
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
        justifyContent: 'center',
        padding: 20
    },
    card: {
        borderRadius: 16,
        padding: 24,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8
    },
    cancelBtn: {
        backgroundColor: '#94a3b8'
    },
    saveBtn: {
        backgroundColor: '#0f172a'
    },
    textBtn: {
        color: 'white',
        fontWeight: 'bold'
    },
    langBtn: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 6
    },
    activeLang: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6'
    }
});
