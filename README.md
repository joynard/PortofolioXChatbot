# DevHub.AI — Personal Chatbot & GitHub Portfolio

Sebuah website portofolio pribadi premium yang dilengkapi dengan workspace chat AI terintegrasi menggunakan Google AI Studio API (model Gemma & Gemini) dan daftar repositori GitHub yang diperbarui secara dinamis.

![Aesthetic UI](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop)

## Fitur Utama

1. **Portfolio Hub**:
   - Menampilkan profil GitHub beserta statistik (Repos, Followers, Following).
   - Menampilkan grid interaktif dari repositori publik Anda.
   - Dilengkapi fitur pencarian/filter repositori secara instan berdasarkan nama, deskripsi, atau bahasa pemrograman.
   - Tautan langsung ke masing-masing proyek GitHub dan profil utama.
   
2. **AI Workspace**:
   - Berinteraksi langsung dengan model AI terkemuka seperti **Gemma 2 27B/9B** dan **Gemini 2.5 Flash / 1.5 Pro**.
   - Dilengkapi format Markdown lengkap, rendering blok kode programming, list, tabel, dan quote.
   - Pilihan preset pertanyaan populer untuk mempercepat pemakaian.
   - Session caching: riwayat chat tetap aman saat Anda berpindah tab.

3. **Secure Settings**:
   - Penyimpanan kredensial API Key Google AI Studio langsung di dalam `localStorage` browser Anda. Kunci API Anda aman dan tidak akan pernah terunggah ke repositori GitHub.
   - Konfigurasi username GitHub dinamis.

4. **Premium Design**:
   - Tampilan Cyber Obsidian dengan visualisasi glassmorphism modern.
   - Responsif untuk semua ukuran layar (Mobile, Tablet, Desktop).
   - Animasi transisi yang halus dan ergonomis.

---

## Cara Menjalankan Secara Lokal

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/).

1. **Kloning Repositori**:
   ```bash
   git clone <url-repositori-anda>
   cd Chatbot
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser Anda.

---

## Cara Deploy ke GitHub Pages

Proyek ini telah dilengkapi dengan alur kerja GitHub Actions (`.github/workflows/deploy.yml`) untuk deploy otomatis secara gratis ke GitHub Pages.

1. **Buat Repositori Baru di GitHub** (misal namanya `my-portfolio`).
2. **Inisialisasi Git Lokal dan Hubungkan**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with DevHub.AI"
   git branch -M main
   git remote add origin https://github.com/<username-github-anda>/<nama-repo-anda>.git
   git push -u origin main
   ```
3. **Konfigurasi Izin GitHub Actions**:
   - Buka halaman repositori Anda di GitHub.
   - Buka **Settings** -> **Actions** -> **General**.
   - Gulir ke bawah ke bagian **Workflow permissions**, pilih **Read and write permissions**, lalu klik **Save**.
4. **Konfigurasi GitHub Pages**:
   - Setelah Action selesai berjalan (cek tab **Actions** di GitHub), sebuah branch baru bernama `gh-pages` akan otomatis terbentuk.
   - Buka **Settings** -> **Pages**.
   - Di bawah **Build and deployment** -> **Source**, pilih **Deploy from a branch**.
   - Di bawah **Branch**, pilih `gh-pages` dan folder `/ (root)`, lalu klik **Save**.
   - Website Anda akan langsung aktif dalam beberapa menit di alamat `https://<username-github-anda>.github.io/<nama-repo-anda>/`.
