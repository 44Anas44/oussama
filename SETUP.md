# Setup Guide — Backend, Desktop App & Mobile App

This walks through everything from a freshly unzipped folder to: a working
hosted database, the app running in your browser, a desktop installer, and a
mobile app on your phone. Follow it in order — later sections depend on
earlier ones.

Time estimate: ~15 min for the backend + web app, ~10 min for desktop,
~30–60 min for mobile (mostly Android Studio / Xcode install time if you
don't already have them).

---

## Part 0 — Prerequisites

Install these once, if you don't have them already:

1. **Node.js 18 or newer** — https://nodejs.org (download the LTS version,
   run the installer, accept defaults). Verify it worked:
   ```bash
   node -v
   npm -v
   ```
   Both should print a version number.

2. **A code editor** (optional but helpful) — e.g. VS Code:
   https://code.visualstudio.com

3. **Unzip the project** you downloaded, and open a terminal inside that
   folder (on Windows: right-click the folder → "Open in Terminal"; on Mac:
   right-click → "New Terminal at Folder", or `cd` to it manually).

---

## Part 1 — Create the hosted database (Supabase)

### 1.1 Create your account and project

1. Go to **https://supabase.com** and click **Start your project**.
2. Sign up (GitHub login is fastest) — it's free, no credit card needed.
3. Click **New project**.
4. Fill in:
   - **Name**: anything, e.g. `oussama-center`
   - **Database Password**: click "Generate a password" and **save it 
     somewhere** (a password manager or a note) — you likely won't need it
     day-to-day, but you'll want it if you ever need direct DB access.
   - **Region**: pick the one closest to you/your business (lower latency).
5. Click **Create new project**. It takes 1–2 minutes to provision — you'll
   land on the project dashboard when it's ready.

### 1.2 Create the tables

1. In the left sidebar, click the **SQL Editor** icon (looks like `>_`).
2. Click **New query**.
3. Open `supabase/schema.sql` from the project folder you downloaded, select
   all its contents, and copy it.
4. Paste it into the Supabase SQL editor.
5. Click **Run** (bottom right, or `Ctrl/Cmd + Enter`).
6. You should see **"Success. No rows returned"**. If you see a red error
   instead, copy the error text — the most common cause is running the
   script twice on a project that already has some of these tables; that's
   harmless, or you can start a fresh project.
7. Optional check: click **Table Editor** in the sidebar — you should now
   see `services`, `products`, `sales`, `expenses`, `recurring_expenses`,
   `appointments` listed, all empty.

### 1.3 Get your API keys

1. Click the gear icon **Project Settings** in the sidebar.
2. Click **API**.
3. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`  
   - **anon public** key — a long string starting with `eyJ...` eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZic25idHZnaHJ1Z3BvdmFramV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDM2MzcsImV4cCI6MjEwMzc3OTYzN30.Welx8qnWzdRe6ZjUmrE0ShQzHGRfsWiSkHHKWkZWNLY 
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZic25idHZnaHJ1Z3BvdmFramV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODIwMzYzNywiZXhwIjoyMTAzNzc5NjM3fQ.9vKPEAMbqsDML_MfcEO0bi2Siv9Dim74XfNw5zA7lSI
4. Keep this tab open, you'll paste these next.

### 1.4 (Recommended while testing) Skip email confirmation

By default Supabase emails a confirmation link when someone signs up, and
you can't log in until you click it. To skip that while testing locally:

1. Sidebar → **Authentication** → **Providers**.
2. Click **Email**.
3. Turn **off** "Confirm email".
4. Save.

(Turn this back on before giving real customers/staff logins, so people
verify they own the email address they signed up with.)

### 1.5 Configure the app with your keys

1. In the project folder, find **`.env.example`**.
2. Make a copy of it named **`.env`** (same folder).
3. Open `.env` and paste in the two values from step 1.3:
   ```
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Save the file.

---

## Part 2 — Run the app

1. In your terminal, inside the project folder:
   ```bash
   npm install
   ```
   This downloads all dependencies — takes a minute or two.
2. Start it:
   ```bash
   npm run dev
   ```
3. Terminal will print a local address, usually `http://localhost:5173`.
   Open that in your browser.
4. You'll land on the **login screen**. Click **"Pas encore de compte ?
   S'inscrire"**, enter an email + password (6+ characters), submit.
5. If email confirmation is off (step 1.4), you're straight in. If it's on,
   check that inbox for a confirmation link first, then come back and log in.
6. Try it out: add a product or service, record a sale. Then check
   **Supabase → Table Editor → sales** (or `products`) — your new row should
   be there. That confirms the app is talking to your database.

### 2.1 Confirm live sync works

1. Open the same `localhost:5173` address in a **second browser tab**
   (or a different browser), and log in with the **same account**.
2. In one tab, add or edit something (e.g. change a product's stock).
3. Watch the other tab — it should update within about a second, with no
   refresh. That's the same mechanism that will keep your desktop app and
   phone app in sync once you build them.

---

## Part 3 — Desktop app (Windows / Mac / Linux, via Electron)

### 3.1 Try it in dev mode

```bash
npm run electron:dev
```

This starts the app inside a native window (not a browser tab), with hot
reload — edit code, see it update instantly. Close the window to stop it.

### 3.2 Build a real installer

```bash
npm run electron:build
```

- This runs the production build, then packages it.
- Output lands in the **`release/`** folder.
- **Important limitation**: `electron-builder` packages for the OS you run
  it *on*. Run this command on Windows to get a `.exe`, on a Mac to get a
  `.dmg`, on Linux to get an `.AppImage`. Cross-building all three from one
  machine needs extra setup (Wine for Windows builds on Mac/Linux, and Apple
  won't let you build a `.dmg` on non-Mac at all) — if you need that, the
  common approach is a free GitHub Actions workflow with a build matrix
  (one job per OS); ask if you'd like that set up.
- The installer will be **unsigned** (no paid Apple/Microsoft developer
  certificate attached). That means:
  - **Windows**: SmartScreen will show an "Unknown publisher" warning —
    users click "More info" → "Run anyway".
  - **Mac**: Gatekeeper will block it — users right-click the app → "Open"
    the first time, instead of double-clicking.
  - This is fine for internal/personal use. For public distribution without
    warnings, you'd eventually want a code-signing certificate (~$100/yr).

### 3.3 Where it opens data from

The desktop app talks to the same Supabase project as the web app — sign in
with the same account and you'll see the same data, live.

---

## Part 4 — Mobile app (Android & iOS, via Capacitor)

Mobile builds need the native toolchains (Android Studio / Xcode), which
only run on your own computer — I can't run these in this chat.

### 4.1 Android

**One-time setup:**

1. Install **Android Studio**: https://developer.android.com/studio
   (this bundles the Android SDK).
2. Open Android Studio once so it finishes its first-run setup (SDK
   download etc.).
3. Back in your terminal, in the project folder:
   ```bash
   npx cap add android
   ```
   This generates a native `android/` project folder (Capacitor wires it up
   to load your web app inside it).

**Every time you want to build/test:**

```bash
npm run cap:android
```

This builds the web app, copies it into the native project, and opens
Android Studio. From there:

1. Wait for Gradle to sync (progress bar at the bottom — first time can take
   a few minutes).
2. Plug in an Android phone via USB with **Developer options → USB
   debugging** enabled, or start an emulator from **Device Manager**.
3. Click the green **Run ▶** button. The app installs and opens.

**To get an installable APK to share (without a store):**
In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
The APK appears under `android/app/build/outputs/apk/debug/`.

**To publish to the Play Store**, you'll need a signed **release** build and
a $25 one-time Google Play developer account — a distinct, later step; say
the word when you're ready and I'll walk through generating a signing key
and a release build.

### 4.2 iOS (requires a Mac)

**One-time setup:**

1. Install **Xcode** from the Mac App Store (free, but large — a few GB).
2. Open Xcode once, accept the license, let it install additional
   components if prompted.
3. In the project folder:
   ```bash
   npx cap add ios
   ```

**Every time you want to build/test:**

```bash
npm run cap:ios
```

This opens Xcode. From there:

1. Select your device or a simulator from the device dropdown (top bar).
2. Click **Run ▶**.
3. To run on your **physical iPhone**, you'll need a free Apple ID signed
   into Xcode (**Xcode → Settings → Accounts**) and to select your name
   under **Signing & Capabilities** in the project settings — Xcode handles
   the certificate automatically for personal testing.
4. Publishing to the **App Store** needs a paid Apple Developer account
   ($99/yr) — again, a later step, ask when you're ready.

---

## Troubleshooting

- **"Missing Supabase env vars" error / blank screen**: `.env` wasn't
  created, is misnamed, or has the wrong values. Re-check step 1.5, then
  restart `npm run dev` (env changes need a restart).
- **Login says invalid credentials but you just signed up**: email
  confirmation is likely still on — check your inbox, or turn it off
  (step 1.4).
- **Data doesn't appear on another device**: confirm both are signed into
  the exact same email/account, and that you ran the SQL script in the same
  Supabase project both apps are pointed at.
- **`npm install` fails**: make sure Node is 18+ (`node -v`), and that
  you're inside the project folder (the one containing `package.json`).
- **Electron window is blank**: usually means the Vite dev server wasn't
  ready yet — `npm run electron:dev` already waits for it, but if you're
  running them separately, start `npm run dev` first.

---

## What changed in the code (for reference)

- `src/lib/supabase.ts` — Supabase client.
- `src/contexts/AuthContext.tsx` + `src/pages/Login.tsx` — email/password
  sign-in gating the app.
- `src/contexts/StoreContext.tsx` — same public API as before (no page
  needed to change), now backed by Supabase with a realtime subscription per
  table for live multi-device sync.
- `src/lib/mappers.ts` — converts between the database's snake_case columns
  and the app's existing camelCase types.
- `supabase/schema.sql` — the full database schema, run once in Supabase.
- `electron/` + `capacitor.config.ts` — desktop and mobile shells.

## Worth deciding soon

- **Shared vs. per-person accounts**: right now every signup gets its own
  private, empty database. If staff should share one business's data, that
  needs a small schema change (a shared `workspace_id`) — tell me if that's
  your situation and I'll make the change.
- **Offline use**: mobile/desktop currently require an internet connection.
  Offline-first sync is possible to add later as a separate piece of work.


---

## Mise à jour : utilisateurs, rôles et PDF

1. **Base de données** : dans Supabase → SQL Editor, exécutez une fois
   `supabase/migration_roles_receipts.sql` (après `schema.sql`).
   Les comptes existants deviennent administrateurs de leur centre : aucune donnée n'est perdue.
2. **Coordonnées du centre** : exécutez aussi `supabase/migration_settings.sql`, puis, connecté en administrateur, renseignez le menu **Paramètres** (adresse, téléphone, matricule fiscal…). Plus besoin de recompiler.
   matricule fiscal, message de bas de page). Les lignes vides ne sont pas imprimées.
3. **Ajouter un employé** : connecté en administrateur → menu **Équipe** → Inviter (nom, e-mail, rôle).
   L'employé ouvre l'application → « Première connexion ? Créer mon compte » avec cet e-mail.
4. `npm install` puis `npm run build` comme avant. **Plusieurs clients** : voir `BRANDING.md`.

Rôles : **Administrateur** (tout + équipe), **Gestionnaire** (tout sauf équipe),
**Réception** (ventes et rendez-vous ; pas de dépenses, profits, prix d'achat ni rapports).

PDF : reçu de vente (A5) depuis la fenêtre de vente ou le menu **Ventes**, bon de rendez-vous (A5)
depuis **Agenda** / **Aujourd'hui**, rapport d'activité (A4) depuis **Rapports**.


---

## Mise à jour : ventes à plusieurs articles, recherche, logo

1. **Base de données** : Supabase → SQL Editor → exécutez `supabase/migration_multi_items.sql`
   (après les migrations précédentes). Vos anciens reçus sont conservés avec leur numéro.
2. **Application** : reconstruisez et réinstallez sur **tous** les ordinateurs
   (`npm run build` / `npm run electron:build`). Après la migration, l'ancienne version ne peut
   plus enregistrer de vente : faites les deux étapes à la suite.
3. **Nouveautés** : un seul reçu pour plusieurs produits et services (panier avec « Ajouter un produit »
   / « Ajouter un service », modification, retrait, annulation), recherche dans les produits et les
   services, et **Paramètres → Logo** (importé, utilisé dans le menu et sur tous les PDF).
4. Sauvegardes : mettez à jour `scripts/backup.mjs` dans le dépôt GitHub (la table `receipts` y est ajoutée).


---

## Mise à jour : TVA sur les produits, ventes par lot, acheteurs

1. **Base de données** : Supabase → SQL Editor → exécutez `supabase/migration_vat_bulk.sql`
   (après `migration_multi_items.sql`). Aucun ancien prix ni reçu ne change.
2. **Application** : reconstruisez et réinstallez sur **tous** les ordinateurs.
3. **TVA** : fiche produit → interrupteur « TVA 19 % ». Activée, le prix saisi est HT et le client
   paie HT × 1,19. La TVA collectée est exclue du profit ; le reçu détaille Total HT / TVA / TTC.
4. **Vente par lot** : « Déclarer une vente » → onglet **Vente par lot** (acheteur obligatoire,
   produits uniquement, remise par ligne ou sur tous les produits). Les remises sont réservées aux
   rôles Administrateur et Gestionnaire (`src/lib/permissions.ts` : `sales.discount`).
5. **Acheteurs** : nouveau menu pour gérer les acheteurs (nom et/ou société, téléphone).
6. **Sauvegardes** : mettez à jour `scripts/backup.mjs` (la table `buyers` est ajoutée).


---

## Application de bureau et mobile
Voir `PACKAGING.md` (installateur Windows, APK Android, compilation automatique sur GitHub).
