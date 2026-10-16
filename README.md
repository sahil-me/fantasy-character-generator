# Fantasy Character Generator

An immersive, alchemical fantasy champion creator and grimoire vault. Forge heroic champions across six archetypal classes with curated high-resolution portraits, balanced class attributes, procedural origin chronicles, and local deck storage.

---

## 🌟 Key Features

### ⚔️ Six Archetypal Fantasy Vocations
* **Paladin**: Holy defenders wielding consecrated blades and radiant solar blessings.
* **Mage**: Masters of the arcane, channeling stellar energies and primal elements.
* **Rogue**: Shadow operatives utilizing venomous daggers and elusive stealth.
* **Warrior**: Battle-hardened vanguards clad in heavy steel plate and battle scars.
* **Ranger**: Woodland snipers and beast-trackers with enchanted yew bows.
* **Necromancer**: Dark ritualists commanding spirits and soul-forged reliquaries.

### 🎨 Curated Local Portrait Engine
* **High-Resolution Artwork**: Bundled with validated local 1024×1024 WebP assets for all classes (`public/portraits/<class>/`).
* **Instant Switching & Preloading**: All 12 portrait variants are preloaded into memory upon application mount for zero-flicker transitions.
* **Deterministic Non-Consecutive Regeneration**: The *Regenerate Portrait* action strictly alternates between distinct artwork variants, guaranteeing that clicking regeneration never repeats the same variant consecutively while keeping the champion's name, class, stats, and backstory completely intact.
* **Zero Silhouette Flashing & Resilient Error Handling**: Genuine artwork renders immediately with eager decoding, backed by accessible `role="status"` offline indicators if an asset cannot be read.

### 📜 Procedural Lore Chronologies & Stat Calibration
* **Vocation-Calibrated Attributes**: Dynamic stat rolling for **Health (HP)**, **Mana (MP)**, and **Strength (STR)** tailored to each vocation's role.
* **Procedural Backstory Transmutation**: On-demand generator weaving bespoke origin tales from ancient academies, forbidden catacombs, and sunlit citadels.

### 🎴 "My Deck" Grimoire Vault
* **Local Browser Persistence**: Saved cards are safely stored in browser `localStorage` with quota overflow protection.
* **Privacy & Isolation**: Saved champions remain entirely local to your current browser profile and are not automatically synced across external servers or devices.
* **Duplicate Prevention**: Prevents duplicate inscriptions of identical champions.
* **Safe Deletion with 6-Second Undo**: Inline deletion confirmation and toast banner allowing immediate restoration.
* **Full Deck Management**: Real-time name search, class filtering, and multi-attribute sorting (A-Z, Most Recent, HP, MP, STR).
* **Champion Inspection & Read Full Chronicle**: Click *Inspect Champion* to reload any saved card onto the grand workbench, or expand the chronicle drawer to read long-form lore.
* **Accessible Long Names**: Long character titles wrap gracefully with tooltips without breaking card boundaries or mobile responsiveness.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Dev Server** | [Vite 8](https://vitejs.dev/) with fast native ESM |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with thematic alchemist parchment palette |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), Google Fonts (*Cinzel*, *Cinzel Decorative*, *MedievalSharp*, *Uncial Antiqua*) |
| **Animation & UX** | [Motion](https://motion.dev/), accessible ARIA live announcements |
| **Asset Pipeline** | Optimized 1024×1024 WebP binaries (VP8 encoding) in `public/portraits/` |

---

## 💻 Local Setup & Development

### Prerequisites
* **Node.js** (v18.0.0 or later recommended)
* **npm** (v9.0.0 or later)

### Installation
1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd fantasy-character-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Run code validation and production build:
   ```bash
   # Run TypeScript type check
   npm run lint

   # Build production bundle
   npm run build
   ```

---

## 🚀 Google Cloud Run Deployment Guide

### 1. Environment & Prerequisites
Ensure you have the [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) installed and authenticated:
```bash
# Authenticate with Google Cloud
gcloud auth login

# Set your target project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required Google Cloud APIs
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

### 2. Secret Management Setup
Store required operational credentials in Secret Manager and grant access to the Cloud Run compute service account:
```bash
# Create and populate the secret (e.g., GEMINI_API_KEY if server-side AI features are configured)
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the Cloud Run runtime service account access
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Firestore Security Configuration
If connecting Cloud Firestore for cross-session storage, enforce owner-bound isolation in `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy security rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### 4. Deploy to Google Cloud Run
Deploy the application container directly to Cloud Run:
```bash
gcloud run deploy fantasy-character-generator \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

### 5. Mandatory Campaign Verification Label
Apply the required campaign resource label to register the service for automated verification:
```bash
gcloud run services update fantasy-character-generator \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 📄 License
Distributed under the Apache 2.0 License.
