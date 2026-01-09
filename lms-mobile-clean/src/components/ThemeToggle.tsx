import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

const modes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Açık', icon: '☀️' },
    { value: 'dark', label: 'Koyu', icon: '🌙' },
    { value: 'system', label: 'Sistem', icon: '⚙️' },
];

export default function ThemeToggle() {
    const { mode, setMode, colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Tema</Text>
            <View style={styles.buttonRow}>
                {modes.map((m) => (
                    <Pressable
                        key={m.value}
                        style={[
                            styles.button,
                            { borderColor: colors.border },
                            mode === m.value && { backgroundColor: colors.primary, borderColor: colors.primary },
                        ]}
                        onPress={() => setMode(m.value)}
                    >
                        <Text style={styles.icon}>{m.icon}</Text>
                        <Text
                            style={[
                                styles.buttonText,
                                { color: mode === m.value ? colors.primaryText : colors.text },
                            ]}
                        >
                            {m.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1.5,
    },
    icon: {
        fontSize: 16,
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
