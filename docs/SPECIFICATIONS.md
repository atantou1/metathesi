# PRODUCT SPECIFICATION: Public Sector Mutual Matcher

**Status:** Planning / Requirements Definition
**Scope:** Multi-profession support (Starting with Teachers)
**Goal:** Automated matching for mutual transfers (Direct & Circular)

---

- # ΤΡΕΧΟΥΣΑ ΕΣΤΙΑΣΗ ΥΛΟΠΟΙΗΣΗΣ: ΦΑΣΗ 1 (Τα Θεμέλια)

 **ΣΤΟΧΟΣ:** Δημιουργία μιας λειτουργικής CRUD εφαρμογής όπου οι χρήστες θα μπορούν να εγγράφονται, να ρυθμίζουν το επαγγελματικό τους προφίλ και να υποβάλλουν μια αίτηση μετάθεσης.

**ΕΝΤΟΣ ΣΚΟΠΟΥ ΓΙΑ ΤΗ ΦΑΣΗ 1:**

- **Αρχικοποίηση Βάσης Δεδομένων:** Δημιουργία όλων των πινάκων που ορίζονται στην Ενότητα 5.
- **Ταυτοποίηση Χρηστών:** Λειτουργίες Εγγραφής και Σύνδεσης (Login/Signup).
- **Ρύθμιση Επαγγελματικού Προφίλ:** Ροή επιλογής Τομέας -> Βαθμίδα -> Ειδικότητα.
- **Λογική Επιλογής Τοποθεσίας:** Δυναμική επιλογή Περιφέρεια -> Περιοχή Μετάθεσης.
- **Δημιουργία Αίτησης Μετάθεσης:** Καταχώρηση της Τρέχουσας Θέσης και των Θέσεων Επιθυμίας (Target Positions).
- **Μηχανή / Αλγόριθμος Matching:** ελέγχει εαν εχουμε match αναμεσα στους χρήστες.

**ΦΑΣΗ 2:**

- **Σύστημα Chat:** Επικοινωνία μεταξύ χρηστών.
- **Ειδοποιήσεις:** Email

---

## 1. Project Overview & Core Functionality

### Ο Στόχος

Δημιουργία μιας πλατφόρμας (SaaS) που λύνει το πρόβλημα της εύρεσης αμοιβαίας μετάθεσης στον Δημόσιο Τομέα. Σκοπός είναι να αντικατασταθούν οι χαοτικές, μη-αυτοματοποιημένες αναζητήσεις σε ομάδες Viber/Facebook με ένα έξυπνο σύστημα που "τρέχει" διαρκώς για λογαριασμό του χρήστη.

### Τι ακριβώς κάνει η εφαρμογή

Η εφαρμογή λειτουργεί ως ένας **automated broker (αυτόματος μεσολαβητής)**.

1.  **Input:** Ο χρήστης δηλώνει ποιος είναι (Επάγγελμα και συγκεκριμένη Ειδικότητα), πού βρίσκεται (Τρέχουσα Θέση, η οποία ειναι σχετική για το καθε επάγγελμα) και πού θέλει να πάει (Λίστα Επιθυμητών Θέσεων).
2.  **Processing:** Το σύστημα δεν είναι απλός πίνακας ανακοινώσεων. Ένας αλγόριθμος ελέγχει συνεχώς τη βάση δεδομένων για να βρει συνδυασμούς.
3.  **Matching Types:**
    - **Direct Match (Αμοιβαία):** Ο Χρήστης Α θέλει τη θέση του Β και ο Β του Α.
    - **Circular Match (Κυκλική):** Ο Α θέλει του Β, ο Β του Γ, και ο Γ του Α (Chain reaction). (αυτό το αφήνουμε για μελλοντική χρήση)
4.  **Output:** Όταν βρεθεί ταίριασμα, το σύστημα ειδοποιεί τους εμπλεκόμενους χρήστες για να προχωρήσουν σε επικοινωνία. H ειδοποιήση γίνεται μέσω μηνυμάτων εντός της εφαρμογής αλλα και εκτός εφαρμογής μέσω email. Η Επικοινωνία των εμπλακομένων γίνεται εντός της εφαρμογής με μηνύματα.

---

## 2. Tech Stack Requirements

- **Development Environment:** Google Antigravity (Vibe Coding methodology).
- **Frontend Framework:** Next.js (React) - για SEO, ταχύτητα και scalability.
- **Language:** TypeScript - απαραίτητο για την ασφάλεια του matching logic.
- **Database:** Σχεσιακή Βάση (Relational DB) - Το σχήμα θα οριστεί από εμάς (όχι αυτόματα από το AI) για να διασφαλιστεί η μελλοντική επεκτασιμότητα.
- **Styling:** Tailwind CSS / Shadcn UI.

---

## 3. Core Philosophy (Φιλοσοφία Σχεδιασμού)

Η εφαρμογή πρέπει να είναι **Profession-Agnostic** (Ανεξάρτητη Επαγγέλματος).
Αν και οι αρχικές φάσεις αφορούν αποκλειστικά Εκπαιδευτικούς, η αρχιτεκτονική πρέπει να είναι αφαιρετική:

- Στόχος είναι η εύκολη προσθήκη νέων κλάδων σε μελλοντική φάση (π.χ. Αστυνομία, Νοσηλευτές) μέσω δεδομένων (configuration) και όχι μέσω αλλαγής του κώδικα.

---

## 4. Functional Requirements (Λειτουργικές Απαιτήσεις)

### A. Professional Profile Setup (Cascading Selection)

Το σύστημα πρέπει να επιβάλλει την παρακάτω ροή επιλογών (Cascading Dropdowns):

1. **Select Sector:** (Προς το παρόν μόνο "Εκπαίδευση").
2. **Select Division:** (Επιλογές: Πρωτοβάθμια Γενικής, Πρωτοβάθμια Ειδικής, Δευτεροβάθμια Γενικής, Δευτεροβάθμια Ειδικής).
3. **Select Specialty:** - Αν το Division περιέχει τη λέξη "Πρωτοβάθμια", εμφάνισε ειδικότητες με `is_primary = true`.
   - Αν το Division περιέχει τη λέξη "Δευτεροβάθμια", εμφάνισε ειδικότητες με `is_secondary = true`.
4. **Select Current Position (Zone):**
   - Το σύστημα φιλτράρει τον πίνακα `posting_zones` βάσει του `division_type`.
   - Αν το Division περιέχει "Πρωτοβάθμια", εμφάνισε ζώνες με `division_type = 'Primary'`.
   - Αν το Division περιέχει "Δευτεροβάθμια", εμφάνισε ζώνες με `division_type = 'Secondary'.
   
     

### B. Transfer Request Logic

- Κάθε προφίλ μπορεί να έχει **μία** ενεργή αίτηση.
- Η αίτηση περιλαμβάνει τη **μία** τρέχουσα θέση και **πολλαπλές** (N) τοποθεσίες επιθυμίας (Target Zones).
- Οι τοποθεσίες επιθυμίας πρέπει να φιλτράρονται με την ίδια λογική (Primary/Secondary) όπως η τρέχουσα θέση.
- Ο χρήστης μπορεί να προσθέτει πολλαπλές περιοχές και το σύστημα καταγράφει τη σειρά επιλογής τους (priority_order).

---

## 5. Database Schema (Finalized for Phase 1)

### 5.1 Lookup Tables (Static Data)

- **sectors**: `[id, name]`
- **divisions**: `[id, sector_id, name]`
- **specialties**:
  - `id` (PK)
  - `code` (π.χ. ΠΕ04.01)
  - `name` (π.χ. ΦΥΣΙΚΟΙ)
  - `branch_code` (π.χ. ΠΕ04)
  - `branch_name` (π.χ. ΦΥΣΙΚΩΝ ΕΠΙΣΤΗΜΩΝ)
  - `educational_category` (π.χ. ΠΕ, ΤΕ, ΔΕ)
  - `is_primary` (Boolean)
  - `is_secondary` (Boolean)
- **regions**: `[id, name]`
- **posting_zones**:
  - `id` (PK)
  - `region_id` (FK -> regions)
  - `division_type` (Enum/String: 'Primary' ή 'Secondary')
  - `name` (String)

### 5.2 User & Profile Tables

- **users**: `[id, email, password_hash, full_name, created_at]`
- **profiles**:
  - `id` (PK)
  - `user_id` (FK -> users)
  - `specialty_id` (FK -> specialties)
  - `division_id` (FK -> divisions)
  - `current_zone_id` (FK -> posting_zones)
  - `full_name` (Text)
  - `hire_date` (Timestamp)
  - `service_years` (Integer)
  - `service_months` (Integer)
  - `service_days` (Integer)

### 5.3 Request Tables

- **transfer_requests**:
  - `id` (PK)
  - `profile_id` (FK -> profiles)
  - `status` (USER-DEFINED/Enum)
  - `origin_zone_id` (FK -> posting_zones)
  - `created_at` (Timestamp)
  - `completed_at` (Timestamp, Optional)
- **target_zones**:
  - `id` (PK)
  - `request_id` (FK -> transfer_requests)
  - `zone_id` (FK -> posting_zones)
  - `priority_order` (Integer)

### 5.4 Matching Tables (Discovery Logic)

- **matches**:
  - `id` (PK)
  - `type` (Text: π.χ. 'direct', 'circular')
  - `status` (Text: π.χ. 'active', 'inactive')
  - `created_at` (Timestamp)
  - `completed_at` (Timestamp, Optional)
- **match_participants**:
  - `id` (PK)
  - `match_id` (FK -> matches)
  - `request_id` (FK -> transfer_requests)

### 5.5 Chat & Communication (Match-Scoped)

- **messages**:
  - `id` (PK)
  - `match_id` (FK -> matches) - Συνδέει το μήνυμα αυστηρά με ένα συγκεκριμένο match.
  - `sender_profile_id` (FK -> profiles) - Ο χρήστης που έστειλε το μήνυμα.
  - `content` (Text) - Το κείμενο του μηνύματος.
  - `created_at` (Timestamp)

---

## 6. Matching Algorithm Specification

Δεν θα υλοποιηθεί στη Φάση 1. Η βάση δεδομένων απλώς προετοιμάζεται για να υποστηρίξει το matching στο μέλλον.



## 7. Business Rules & Constraints

**Unique Request:** Κάθε προφίλ μπορεί να έχει μόνο μία ενεργή αίτηση.

**Validation:** Ο χρήστης δεν μπορεί να επιλέξει την τρέχουσα ζώνη του ως ζώνη επιθυμίας.

**Multiple Matches:** Ένας χρήστης μπορεί να συμμετέχει σε πολλαπλά ενεργά matches ταυτόχρονα, εφόσον υπάρχουν πολλαπλοί συνδυασμοί που ικανοποιούν τα κριτήρια της αίτησής του. Το σύστημα λειτουργεί αυστηρά ενημερωτικά.

**Isolated Match Chat:** - Η πρόσβαση στα μηνύματα ενός συγκεκριμένου `match_id` επιτρέπεται αυστηρά και μόνο στα `profile_id` που καταγράφονται στον πίνακα `match_participants` για το συγκεκριμένο match.

- Αν ένα match ακυρωθεί ή ολοκληρωθεί (inactive), το αντίστοιχο chat κλειδώνει (read-only).

---

## 8. Οδηγίες Εισαγωγής Δεδομένων (Seeding Instructions)

Αυτές οι οδηγίες πρέπει να ακολουθηθούν κατά το αρχικό "τάισμα" της βάσης δεδομένων από τα παρεχόμενα αρχεία:

### 8.1 Πίνακας Specialties (από specialties.csv)

- **Mapping:**
  - `code` $\rightarrow$ στήλη `code`
  - `name` $\rightarrow$ στήλη `name`
  - `branch_code` $\rightarrow$ στήλη `branch_code`
  - `branch_name` $\rightarrow$ στήλη `branch_name`
  - `educational_category` $\rightarrow$ στήλη `educational_category`
- **Boolean Logic:**
  - Τα πεδία `is_primary` και `is_secondary` πρέπει να πάρουν τις τιμές `True/False` ακριβώς όπως ορίζονται στις αντίστοιχες στήλες του CSV.

### 8.2 Πίνακες Regions & Posting Zones (από posting_zones.csv)

- **Regions:**
  - Δημιούργησε μοναδικές εγγραφές στον πίνακα `regions` παίρνοντας όλες τις διαφορετικές τιμές από τη στήλη `Region` του CSV.
- **Posting Zones:**
  - **name** $\rightarrow$ στήλη `name`
  - **division_type** $\rightarrow$ στήλη `division_type`
  - **region_id** $\rightarrow$ Σύνδεση με το ID του αντίστοιχου region που δημιουργήθηκε στο προηγούμενο βήμα.

### 8.3 Πίνακες Sectors & Divisions (Manual Entry)

- **Sectors:** Μία εγγραφή με `name: "Εκπαίδευση"`.
- **Divisions:** Τέσσερις εγγραφές συνδεδεμένες με τον Sector "Εκπαίδευση":
  1. "Πρωτοβάθμια Γενικής"
  2. "Πρωτοβάθμια Ειδικής"
  3. "Δευτεροβάθμια Γενικής"
  4. "Δευτεροβάθμια Ειδικής"

