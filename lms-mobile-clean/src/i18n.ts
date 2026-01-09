import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const resources = {
    en: {
        translation: {
            // General
            "welcome": "Welcome",
            "login": "Login",
            "logout": "Logout",
            "loading": "Loading...",
            "error": "Error",
            "success": "Success",
            "cancel": "Cancel",
            "save": "Save",
            "delete": "Delete",
            "edit": "Edit",
            "create": "Create",
            "update": "Update",
            "refresh": "Refresh",
            "back": "Back",
            "next": "Next",
            "submit": "Submit",
            "confirm": "Confirm",
            // Auth
            "username": "Username",
            "password": "Password",
            "biometric_login": "Biometric Login",
            "guest_login": "Guest Login",
            // Courses
            "course_list": "Course List",
            "course_detail": "Course Detail",
            "enroll": "Enroll",
            "enrolled": "Enrolled",
            "browse_courses": "Browse Courses",
            "no_courses": "No courses yet.",
            // Content
            "content": "Content",
            "video": "Video",
            "pdf": "PDF",
            "live_class": "Live Class",
            "download": "Download",
            "open_pdf": "Open PDF",
            "join_class": "Join Class",
            // Exams
            "exams": "Exams",
            "exam_detail": "Exam Detail",
            "start_exam": "Start Exam",
            "submit_exam": "Submit Exam",
            "time_remaining": "Time Remaining",
            "score": "Score",
            "passed": "Passed",
            "failed": "Failed",
            "omr_scan": "OMR Scan",
            // Questions
            "questions": "Questions",
            "question": "Question",
            "answer": "Answer",
            "options": "Options",
            "correct": "Correct",
            "incorrect": "Incorrect",
            // Settings
            "settings": "Settings",
            "language": "Language",
            "theme": "Theme",
            "dark_mode": "Dark Mode",
            "light_mode": "Light Mode",
            // Offline
            "offline_mode": "Offline Mode",
            "no_internet": "No Internet Connection",
            // Misc
            "users": "Users",
            "role": "Role",
            "admin_panel": "Admin Panel"
        }
    },
    tr: {
        translation: {
            // General
            "welcome": "Hoş Geldiniz",
            "login": "Giriş Yap",
            "logout": "Çıkış Yap",
            "loading": "Yükleniyor...",
            "error": "Hata",
            "success": "Başarılı",
            "cancel": "İptal",
            "save": "Kaydet",
            "delete": "Sil",
            "edit": "Düzenle",
            "create": "Oluştur",
            "update": "Güncelle",
            "refresh": "Yenile",
            "back": "Geri",
            "next": "İleri",
            "submit": "Gönder",
            "confirm": "Onayla",
            // Auth
            "username": "Kullanıcı Adı",
            "password": "Şifre",
            "biometric_login": "Biyometrik Giriş",
            "guest_login": "Misafir Girişi",
            // Courses
            "course_list": "Kurs Listesi",
            "course_detail": "Kurs Detayı",
            "enroll": "Kayıt Ol",
            "enrolled": "Kayıtlı",
            "browse_courses": "Kurs Keşfet",
            "no_courses": "Henüz kurs yok.",
            // Content
            "content": "İçerik",
            "video": "Video",
            "pdf": "PDF",
            "live_class": "Canlı Ders",
            "download": "İndir",
            "open_pdf": "PDF Aç",
            "join_class": "Derse Katıl",
            // Exams
            "exams": "Sınavlar",
            "exam_detail": "Sınav Detayı",
            "start_exam": "Sınavı Başlat",
            "submit_exam": "Sınavı Gönder",
            "time_remaining": "Kalan Süre",
            "score": "Puan",
            "passed": "Geçti",
            "failed": "Kaldı",
            "omr_scan": "Optik Okuma",
            // Questions
            "questions": "Sorular",
            "question": "Soru",
            "answer": "Cevap",
            "options": "Seçenekler",
            "correct": "Doğru",
            "incorrect": "Yanlış",
            // Settings
            "settings": "Ayarlar",
            "language": "Dil",
            "theme": "Tema",
            "dark_mode": "Karanlık Mod",
            "light_mode": "Aydınlık Mod",
            // Offline
            "offline_mode": "Çevrimdışı Mod",
            "no_internet": "İnternet Bağlantısı Yok",
            // Misc
            "users": "Kullanıcılar",
            "role": "Rol",
            "admin_panel": "Yönetici Paneli"
        }
    },
    de: {
        translation: {
            // General
            "welcome": "Willkommen",
            "login": "Anmelden",
            "logout": "Abmelden",
            "loading": "Lädt...",
            "error": "Fehler",
            "success": "Erfolg",
            "cancel": "Abbrechen",
            "save": "Speichern",
            "delete": "Löschen",
            "edit": "Bearbeiten",
            "create": "Erstellen",
            "update": "Aktualisieren",
            "refresh": "Aktualisieren",
            "back": "Zurück",
            "next": "Weiter",
            "submit": "Absenden",
            "confirm": "Bestätigen",
            // Auth
            "username": "Benutzername",
            "password": "Passwort",
            "biometric_login": "Biometrische Anmeldung",
            "guest_login": "Gast-Anmeldung",
            // Courses
            "course_list": "Kursliste",
            "course_detail": "Kursdetails",
            "enroll": "Einschreiben",
            "enrolled": "Eingeschrieben",
            "browse_courses": "Kurse durchsuchen",
            "no_courses": "Noch keine Kurse.",
            // Content
            "content": "Inhalt",
            "video": "Video",
            "pdf": "PDF",
            "live_class": "Live-Unterricht",
            "download": "Herunterladen",
            "open_pdf": "PDF öffnen",
            "join_class": "Unterricht beitreten",
            // Exams
            "exams": "Prüfungen",
            "exam_detail": "Prüfungsdetails",
            "start_exam": "Prüfung starten",
            "submit_exam": "Prüfung abgeben",
            "time_remaining": "Verbleibende Zeit",
            "score": "Punktzahl",
            "passed": "Bestanden",
            "failed": "Nicht bestanden",
            "omr_scan": "OMR-Scan",
            // Questions
            "questions": "Fragen",
            "question": "Frage",
            "answer": "Antwort",
            "options": "Optionen",
            "correct": "Richtig",
            "incorrect": "Falsch",
            // Settings
            "settings": "Einstellungen",
            "language": "Sprache",
            "theme": "Thema",
            "dark_mode": "Dunkelmodus",
            "light_mode": "Hellmodus",
            // Offline
            "offline_mode": "Offline-Modus",
            "no_internet": "Keine Internetverbindung",
            // Misc
            "users": "Benutzer",
            "role": "Rolle",
            "admin_panel": "Admin-Panel"
        }
    },
    fr: {
        translation: {
            // General
            "welcome": "Bienvenue",
            "login": "Connexion",
            "logout": "Déconnexion",
            "loading": "Chargement...",
            "error": "Erreur",
            "success": "Succès",
            "cancel": "Annuler",
            "save": "Enregistrer",
            "delete": "Supprimer",
            "edit": "Modifier",
            "create": "Créer",
            "update": "Mettre à jour",
            "refresh": "Actualiser",
            "back": "Retour",
            "next": "Suivant",
            "submit": "Soumettre",
            "confirm": "Confirmer",
            // Auth
            "username": "Nom d'utilisateur",
            "password": "Mot de passe",
            "biometric_login": "Connexion biométrique",
            "guest_login": "Connexion invité",
            // Courses
            "course_list": "Liste des cours",
            "course_detail": "Détails du cours",
            "enroll": "S'inscrire",
            "enrolled": "Inscrit",
            "browse_courses": "Parcourir les cours",
            "no_courses": "Aucun cours pour le moment.",
            // Content
            "content": "Contenu",
            "video": "Vidéo",
            "pdf": "PDF",
            "live_class": "Cours en direct",
            "download": "Télécharger",
            "open_pdf": "Ouvrir le PDF",
            "join_class": "Rejoindre le cours",
            // Exams
            "exams": "Examens",
            "exam_detail": "Détails de l'examen",
            "start_exam": "Commencer l'examen",
            "submit_exam": "Soumettre l'examen",
            "time_remaining": "Temps restant",
            "score": "Score",
            "passed": "Réussi",
            "failed": "Échoué",
            "omr_scan": "Scan OMR",
            // Questions
            "questions": "Questions",
            "question": "Question",
            "answer": "Réponse",
            "options": "Options",
            "correct": "Correct",
            "incorrect": "Incorrect",
            // Settings
            "settings": "Paramètres",
            "language": "Langue",
            "theme": "Thème",
            "dark_mode": "Mode sombre",
            "light_mode": "Mode clair",
            // Offline
            "offline_mode": "Mode hors-ligne",
            "no_internet": "Pas de connexion Internet",
            // Misc
            "users": "Utilisateurs",
            "role": "Rôle",
            "admin_panel": "Panneau d'administration"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getLocales()[0]?.languageCode ?? 'tr',
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
