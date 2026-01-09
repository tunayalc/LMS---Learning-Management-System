import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Animated, Easing, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.8;

export default function OpticReaderScreen({ navigation, route, token, apiBaseUrl }: any) {
    const { colors } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [photo, setPhoto] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    // Animation for scanning line
    const scanAnim = useRef(new Animated.Value(0)).current;

    const examId = route.params?.examId; // Passed from Exam Detail

    useEffect(() => {
        const startAnimation = () => {
            scanAnim.setValue(0);
            Animated.loop(
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        };

        if (!photo) {
            startAnimation();
        } else {
            scanAnim.stopAnimation();
        }
    }, [photo]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Kamerayı kullanmak için izne ihtiyacımız var.</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>İzin Ver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photoData = await cameraRef.current.takePictureAsync({
                    base64: false, // We upload via URI
                    quality: 0.8,
                });
                if (photoData?.uri) {
                    setPhoto(photoData.uri);
                }
            } catch (error) {
                Alert.alert("Hata", "Fotoğraf çekilemedi.");
            }
        }
    };

    const handleUpload = async () => {
        if (!examId) {
            Alert.alert("Hata", "Sınav ID bulunamadı. Lütfen sınav detayından girin.");
            return;
        }

        setProcessing(true);
        try {
            const uploadUrl = `${apiBaseUrl}/exams/${examId}/omr/scan`;

            const response = await FileSystem.uploadAsync(uploadUrl, photo!, {
                fieldName: 'paper',
                httpMethod: 'POST',
                uploadType: 1 as any,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const result = JSON.parse(response.body);
                // Result contains { result: { score, details... } }
                const score = result.result?.score ?? 0;

                Alert.alert(
                    "Başarılı",
                    `Kağıt Okundu!\nPuan: ${score} / 30`,
                    [
                        {
                            text: "Bitir",
                            onPress: () => {
                                setPhoto(null);
                                navigation.goBack();
                            },
                            style: 'cancel'
                        },
                        {
                            text: "Sıradaki Kağıt (Batch)",
                            onPress: () => {
                                setPhoto(null);
                            }
                        }
                    ]
                );
            } else {
                console.error("Upload failed", response.body);
                Alert.alert("Hata", "Tarama başarısız oldu. Lütfen tekrar deneyin.");
            }
        } catch (error: any) {
            console.error("OMR Error", error);
            Alert.alert("Hata", "Sunucu hatası: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const translateY = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCAN_AREA_SIZE],
    });

    if (photo) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: photo }} style={styles.preview} />
                <View style={styles.previewControls}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelBtn]}
                        onPress={() => setPhoto(null)}
                        disabled={processing}
                    >
                        <Text style={styles.buttonText}>Tekrar Çek</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.uploadBtn]}
                        onPress={handleUpload}
                        disabled={processing}
                    >
                        {processing ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Puanla ve Gönder</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.overlay}>
                    {/* Darkened Backgrounds around the scan area */}
                    <View style={styles.maskTop} />
                    <View style={styles.maskRow}>
                        <View style={styles.maskSide} />
                        <View style={styles.scanFrame}>
                            {/* Corner Markers */}
                            <View style={[styles.corner, styles.tl]} />
                            <View style={[styles.corner, styles.tr]} />
                            <View style={[styles.corner, styles.bl]} />
                            <View style={[styles.corner, styles.br]} />

                            {/* Scanning Line */}
                            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
                        </View>
                        <View style={styles.maskSide} />
                    </View>
                    <View style={styles.maskBottom}>
                        <Text style={styles.guideText}>Kağıdın 4 köşesini çerçeveye hizalayın.</Text>
                        <Text style={styles.subGuideText}>Otomatik perspektif düzeltme aktiftir.</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: '#fff',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
    },
    maskTop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    maskRow: {
        flexDirection: 'row',
        height: SCAN_AREA_SIZE,
    },
    maskSide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    maskBottom: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        paddingTop: 20,
    },
    scanFrame: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        overflow: 'hidden', // Clip the scan line
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#22c55e',
        borderWidth: 4,
    },
    tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: '#ef4444',
        shadowColor: '#ef4444',
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    guideText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subGuideText: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 4,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    button: {
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
    },
    cancelBtn: {
        backgroundColor: '#ef4444',
    },
    uploadBtn: {
        backgroundColor: '#22c55e',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    preview: {
        flex: 1,
        resizeMode: 'contain',
    },
    previewControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#000',
    }
});
