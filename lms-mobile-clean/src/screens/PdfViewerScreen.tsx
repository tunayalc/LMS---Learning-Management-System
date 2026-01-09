import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Dimensions, ActivityIndicator, Alert, Modal } from 'react-native';
import Pdf from 'react-native-pdf';
import { OfflineManager } from '../utils/offline';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EnhancedPdfViewerProps {
    navigation?: { goBack: () => void };
    route?: { params: { uri: string; title?: string; contentId?: string } };
    source?: { uri: string };
    title?: string;
    contentId?: string;
    onClose?: () => void;
    // Local bookmarks integration
    bookmarks?: { page: number; title: string }[];
    onBookmarkAdd?: (page: number) => void;
}

export default function PdfViewerScreen(props: EnhancedPdfViewerProps) {
    const {
        navigation,
        route,
        bookmarks = [],
        onBookmarkAdd,
    } = props;

    // Handle source priority: Direct prop > Route params > Empty
    const uri = props.source?.uri || route?.params?.uri || '';
    const title = props.title || route?.params?.title || 'Belge Görüntüleyici';
    const contentId = props.contentId || route?.params?.contentId || '';
    const onClose = props.onClose || (() => navigation?.goBack());

    const pdfRef = useRef<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // UI States
    const [showControls, setShowControls] = useState(true);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const [searchPage, setSearchPage] = useState('');

    const source = { uri, cache: true };

    // Load saved progress on mount
    useEffect(() => {
        if (contentId) {
            AsyncStorage.getItem(`progress_${contentId}`).then(saved => {
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data.page > 1) {
                        setTimeout(() => handlePageChange(data.page), 500);
                    }
                }
            }).catch(console.error);
        }
    }, [contentId]);

    // Save progress on page change
    const saveProgress = async (page: number, total: number) => {
        if (contentId && total > 0) {
            const percent = Math.round((page / total) * 100);
            await AsyncStorage.setItem(`progress_${contentId}`, JSON.stringify({
                page,
                total,
                percent,
                updatedAt: new Date().toISOString()
            }));
        }
    };

    const handlePageChange = (page: number) => {
        if (pdfRef.current) {
            pdfRef.current.setPage(page);
        }
        setCurrentPage(page);
        saveProgress(page, totalPages);
    };

    const handleDownload = async () => {
        try {
            const res = await OfflineManager.downloadContent(
                // Use uri hash or title as ID replacement for now
                String(uri.split('/').pop() || Date.now()),
                uri,
                title,
                'pdf'
            );
            if (res) {
                Alert.alert("Başarılı", "PDF başarıyla indirildi. Çevrimdışı erişebilirsiniz.");
            } else {
                Alert.alert("Hata", "İndirme başarısız.");
            }
        } catch (e: any) {
            Alert.alert("Hata", "İndirme sırasında bir sorun oluştu: " + e.message);
        }
    };

    const jumpToPage = () => {
        const p = parseInt(searchPage);
        if (p > 0 && p <= totalPages) {
            handlePageChange(p);
            setSearchPage('');
        } else {
            Alert.alert("Hata", "Geçersiz sayfa numarası");
        }
    };

    if (!uri) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>PDF Kaynağı belirtilmedi.</Text>
                <Pressable onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Kapat</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            {showControls && (
                <View style={styles.header}>
                    <Pressable onPress={onClose} style={styles.iconBtn}>
                        <Text style={styles.iconText}>✕</Text>
                    </Pressable>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <View style={styles.headerActions}>
                        <Pressable style={styles.iconBtn} onPress={handleDownload}>
                            <Text style={styles.iconText}>📥</Text>
                        </Pressable>
                        <Pressable style={styles.iconBtn} onPress={() => setShowBookmarks(!showBookmarks)}>
                            <Text style={styles.iconText}>📑</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* Main PDF View */}
            <View style={styles.pdfContainer}>
                <Pdf
                    ref={pdfRef}
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                        setTotalPages(numberOfPages);
                        setIsLoaded(true);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        setCurrentPage(page);
                    }}
                    onError={(error) => {
                        console.log(error);
                        Alert.alert("PDF Hatası", "Dosya yüklenemedi. Lütfen internet bağlantınızı kontrol ediniz.");
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                    trustAllCerts={false}
                    enablePaging={true}
                    onPageSingleTap={() => setShowControls(!showControls)}
                    spacing={10}
                />
                {!isLoaded && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#2563eb" />
                        <Text style={{ marginTop: 10, color: '#64748b' }}>Belge indiriliyor...</Text>
                    </View>
                )}
            </View>

            {/* Bookmarks & Jump Sidebar */}
            {showControls && showBookmarks && (
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Hızlı Erişim</Text>

                    {/* Jump to Page */}
                    <View style={styles.jumpRow}>
                        <TextInput
                            style={styles.jumpInput}
                            placeholder="Sayfa No"
                            keyboardType="numeric"
                            value={searchPage}
                            onChangeText={setSearchPage}
                        />
                        <Pressable style={styles.jumpBtn} onPress={jumpToPage}>
                            <Text style={styles.jumpBtnText}>Git</Text>
                        </Pressable>
                    </View>

                    <Text style={[styles.sidebarTitle, { marginTop: 20 }]}>Yer İmleri</Text>
                    {onBookmarkAdd && (
                        <Pressable style={styles.addBookmarkBtn} onPress={() => onBookmarkAdd(currentPage)}>
                            <Text style={styles.addBookmarkText}>+ Şu anki sayfayı ekle ({currentPage})</Text>
                        </Pressable>
                    )}

                    {bookmarks.length === 0 ? (
                        <Text style={styles.emptyText}>Yer imi yok.</Text>
                    ) : (
                        bookmarks.map((bm, index) => (
                            <Pressable
                                key={index}
                                style={styles.bookmarkItem}
                                onPress={() => { handlePageChange(bm.page); setShowBookmarks(false); }}
                            >
                                <Text style={styles.bookmarkText} numberOfLines={1}>📌 {bm.title || `Sayfa ${bm.page}`}</Text>
                            </Pressable>
                        ))
                    )}
                </View>
            )}

            {/* Footer Controls */}
            {showControls && (
                <View style={styles.footer}>
                    <Pressable style={styles.navBtn} onPress={() => handlePageChange(Math.max(1, currentPage - 1))}>
                        <Text style={styles.navBtnText}>◀</Text>
                    </Pressable>
                    <Text style={styles.pageIndicator}>{currentPage} / {totalPages}</Text>
                    <Pressable style={styles.navBtn} onPress={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>
                        <Text style={styles.navBtnText}>▶</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        elevation: 2,
        zIndex: 10
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        textAlign: 'center',
    },
    iconBtn: {
        padding: 8,
    },
    iconText: {
        fontSize: 20,
        color: '#334155'
    },
    headerActions: {
        flexDirection: 'row',
    },
    pdfContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#f1f5f9'
    },
    loadingOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        gap: 20
    },
    navBtn: {
        padding: 10,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    navBtnText: {
        fontSize: 18,
        color: '#334155'
    },
    pageIndicator: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a'
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: '#334155',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600'
    },
    sidebar: {
        position: 'absolute',
        top: 60,
        right: 0,
        bottom: 70,
        width: 250,
        backgroundColor: '#fff',
        opacity: 0.98,
        borderLeftWidth: 1,
        borderLeftColor: '#cbd5e1',
        padding: 16,
        elevation: 5,
        zIndex: 20
    },
    sidebarTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 10,
        textTransform: 'uppercase'
    },
    jumpRow: {
        flexDirection: 'row',
        gap: 8
    },
    jumpInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 6,
        paddingHorizontal: 8,
        height: 36
    },
    jumpBtn: {
        backgroundColor: '#2563eb',
        borderRadius: 6,
        paddingHorizontal: 12,
        justifyContent: 'center',
        height: 36
    },
    jumpBtnText: {
        color: '#fff',
        fontWeight: '600'
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
        marginTop: 10
    },
    bookmarkItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    bookmarkText: {
        color: '#334155',
        fontSize: 14
    },
    addBookmarkBtn: {
        backgroundColor: '#10b981',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 10
    },
    addBookmarkText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    }
});
