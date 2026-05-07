# PRODUCT SPECIFICATION: Public Sector Mutual Matcher (Updated)

**Status:** Active Development / Feature Expansion
**Scope:** Multi-profession support (Starting with Teachers)
**Goal:** Automated matching for mutual transfers (Direct & Circular), Data Analytics, and Platform Administration.

---

## 1. Project Overview & Core Functionality

### Ο Στόχος
Δημιουργία μιας πλατφόρμας (SaaS) που λύνει το πρόβλημα της εύρεσης αμοιβαίας μετάθεσης στον Δημόσιο Τομέα. Σκοπός είναι να αντικατασταθούν οι χαοτικές, μη-αυτοματοποιημένες αναζητήσεις σε ομάδες Viber/Facebook με ένα έξυπνο σύστημα που "τρέχει" διαρκώς για λογαριασμό του χρήστη.

### Τι ακριβώς κάνει η εφαρμογή
Η εφαρμογή λειτουργεί ως ένας **automated broker (αυτόματος μεσολαβητής)** και **Data Hub**.

1.  **Input:** Ο χρήστης δηλώνει ποιος είναι (Επάγγελμα και συγκεκριμένη Ειδικότητα), πού βρίσκεται (Τρέχουσα Θέση) και πού θέλει να πάει (Λίστα Επιθυμητών Θέσεων).
2.  **Processing (Matching):** Ένας αλγόριθμος ελέγχει συνεχώς τη βάση δεδομένων για να βρει συνδυασμούς.
3.  **Matching Types:**
    - **Direct Match (Αμοιβαία):** Ο Χρήστης Α θέλει τη θέση του Β και ο Β του Α.
    - **Circular Match (Κυκλική):** Ο Α θέλει του Β, ο Β του Γ, και ο Γ του Α (Chain reaction).
4.  **Output & Communication:** Όταν βρεθεί ταίριασμα, το σύστημα ειδοποιεί τους εμπλεκόμενους χρήστες εντός της εφαρμογής αλλά και μέσω email (Resend). Η επικοινωνία γίνεται σε απομονωμένα Chat Rooms εντός της πλατφόρμας, αποκλειστικά για τους συμμετέχοντες του match.
5.  **Analytics & Insights:** (ΝΕΟ) Η πλατφόρμα παρέχει αναλυτικά στατιστικά, ιστορικά δεδομένα, διαδραστικούς χάρτες (Leaflet) και γραφήματα (Recharts) για να βοηθά τους χρήστες να κατανοήσουν τον ανταγωνισμό, τις βάσεις μορίων και τη ζήτηση στις διάφορες περιοχές.

---

## 2. Tech Stack Requirements

- **Frontend Framework:** Next.js (React) (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL με Prisma ORM.
- **Authentication:** NextAuth (v5), υποστήριξη credential logins, password reset flows, email verification, και role-based access control (RBAC).
- **Styling:** Tailwind CSS, Shadcn UI (Radix), Framer Motion (για animations).
- **Analytics/Maps:** Recharts, React-Leaflet, TopoJSON.
- **Emails:** Resend.

---

## 3. Core Philosophy (Φιλοσοφία Σχεδιασμού)

Η εφαρμογή παραμένει **Profession-Agnostic** (Ανεξάρτητη Επαγγέλματος).
Η αρχιτεκτονική (Sectors -> Divisions -> Specialties -> Zones) επιτρέπει την εύκολη προσθήκη νέων κλάδων (π.χ. Αστυνομία, Νοσηλευτές) μόνο με την εισαγωγή νέων δεδομένων στη βάση, χωρίς αλλαγή κώδικα.

Επιπλέον, η πλατφόρμα εστιάζει στην **Ασφάλεια** (Security Hardening, Rate Limiting, Audit Logs) και στο **Premium User Experience** (Dark Mode, Responsive Design, Interactive Data Visualizations).

---

## 4. Functional Requirements (Λειτουργικές Απαιτήσεις)

### A. Authentication & Security (ΝΕΟ)
- **Εγγραφή/Σύνδεση:** Υποστήριξη Credentials με κρυπτογράφηση κωδικών (bcrypt).
- **Ασφάλεια:** Κλείδωμα λογαριασμού μετά από αποτυχημένες προσπάθειες (Login Attempts Tracker).
- **Ρόλοι (RBAC):** Διαχωρισμός σε USER, ADMIN, SUPERADMIN.
- **Admin Panel:** Διαχείριση χρηστών (Ban, Suspend) και πλήρες σύστημα Audit Logs για τις ενέργειες των διαχειριστών.
- **Password Management:** Υποστήριξη "Ξέχασα τον κωδικό μου" μέσω email με ασφαλή, hashed tokens.

### B. Professional Profile Setup & Transfer Request (Wizard)
Η διαδικασία έχει ενοποιηθεί σε ένα φιλικό προς τον χρήστη Wizard:
1. **Select Sector & Division:** (π.χ. Εκπαίδευση -> Πρωτοβάθμια Γενικής).
2. **Select Specialty:** Δυναμικό φιλτράρισμα βάσει Division.
3. **Select Current Position (Origin Zone):** Φιλτράρισμα ζωνών βάσει του Division Type (Primary/Secondary).
4. **Target Zones:** Επιλογή πολλαπλών περιοχών επιθυμίας με σειρά προτεραιότητας.
*Σημείωση:* Κάθε χρήστης (user) έχει ένα προφίλ και κάθε προφίλ μπορεί να έχει **μία** ενεργή αίτηση.

### C. Matching & Communication System (ΥΛΟΠΟΙΗΘΗΚΕ)
- Η βάση υποστηρίζει Active Matches και Match Participants.
- **Chat:** Ενσωματωμένο σύστημα μηνυμάτων (`messages` table). Η πρόσβαση στα μηνύματα είναι αυστηρά περιορισμένη στους συμμετέχοντες του συγκεκριμένου `match`.
- **Ειδοποιήσεις:** In-app notifications και email notifications (μέσω Resend) όταν βρεθεί νέο match ή υπάρξει νέο μήνυμα.

### D. Data Analytics & Statistics (ΝΕΟ & ΣΗΜΑΝΤΙΚΟ)
Η πλατφόρμα πλέον υποστηρίζει πολύπλοκη ανάλυση δεδομένων (Stats Dashboard, Zone Stats, Specialty Analytics):
- Διαδραστικοί χάρτες για οπτικοποίηση ζήτησης/προσφοράς.
- Υπολογισμός και απεικόνιση ιστορικών δεδομένων (βάσεις μορίων, τάσεις, δυσκολία περιοχών).
- Top 5 πίνακες για τις πιο δημοφιλείς περιοχές.

---

## 5. Database Schema (Ενημερωμένο)

Το σχήμα της βάσης έχει επεκταθεί σημαντικά.

### 5.1 Lookup Tables (Static Data)
- **sectors**, **divisions**, **specialties**, **regions**, **posting_zones** (Παραμένουν ως είχαν με προσθήκη relations στα statistics).

### 5.2 User, Profile & Auth Tables (Ενημερωμένα)
- **users:** `[id, email, passwordHash, fullName, role, status, avatarColor, banReason, bannedAt, ...]`
- **accounts / sessions:** (Standard NextAuth tables).
- **login_attempts:** Για προστασία από brute-force επιθέσεις.
- **verification_tokens / password_reset_tokens:** Για ασφαλή email flows.
- **admin_audit_logs:** `[id, adminId, targetUserId, action, details]` (Καταγραφή ενεργειών admin).
- **profiles:** `[id, userId, specialtyId, divisionId, currentZoneId, serviceYears/Months/Days, hireDate]`

### 5.3 Request & Matching Tables (Υλοποιημένα)
- **transfer_requests:** `[id, profileId, status, originZoneId, createdAt]`
- **target_zones:** `[id, requestId, zoneId, priorityOrder]`
- **matches:** `[id, type, status, createdAt]`
- **match_participants:** `[id, matchId, requestId]`

### 5.4 Chat & Notifications
- **messages:** `[id, matchId, senderProfileId, content, createdAt]`
- **notifications:** `[id, profileId, type, matchId, isRead]`

### 5.5 Analytics & Statistics (ΝΕΟ)
- **zone_statistics_cache:** Αποθήκευση pre-calculated στατιστικών ανά περιοχή.
- **transfer_statistics:** Ιστορικά δεδομένα, βάσεις, success counts.
- **specialty_analytics:** Εξειδικευμένα αναλυτικά δεδομένα ανά ειδικότητα (National points range, active regions rate, κλπ).

---

## 6. Business Rules & Constraints (Ενημερωμένα)

1. **Unique Request:** Κάθε προφίλ (και κατ' επέκταση χρήστης) μπορεί να έχει μόνο **μία** ενεργή αίτηση μετάθεσης.
2. **Validation:** Ο χρήστης δεν μπορεί να επιλέξει την τρέχουσα ζώνη του ως ζώνη επιθυμίας.
3. **Multiple Matches:** Ένας χρήστης μπορεί να συμμετέχει σε πολλαπλά ενεργά matches ταυτόχρονα.
4. **Isolated Match Chat:**
   - Πρόσβαση μόνο στους συμμετέχοντες (`match_participants`).
   - Read-only αν το match ακυρωθεί/ολοκληρωθεί.
5. **Security & Roles:**
   - Μόνο λογαριασμοί με ρόλο `ADMIN` ή `SUPERADMIN` έχουν πρόσβαση στο `/admin` dashboard.
   - Λογαριασμοί με `status = BANNED` δεν μπορούν να συνδεθούν στην πλατφόρμα.
   - Προστασία Rate-Limiting/Brute-Force στο Login.

---

## 7. Οδηγίες Εισαγωγής Δεδομένων (Seeding Instructions)

Οι βασικές οδηγίες seeding (Sectors, Divisions, Specialties, Regions, Posting Zones) παραμένουν ίδιες.

**Νέες Προσθήκες στο Seeding:**
- Ο μηχανισμός seeding (`prisma/seed.ts`) πρέπει πλέον να δημιουργεί και τους πρώτους **Admin / Superadmin** λογαριασμούς για σκοπούς δοκιμών/διαχείρισης.
- Ενδέχεται να χρειάζεται seeding dummy δεδομένων στα tables των Statistics (όπως το `transfer_statistics`) για την εμφάνιση των χαρτών και των γραφημάτων κατά το development.
