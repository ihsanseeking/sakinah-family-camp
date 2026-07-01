# PRD — Project Requirements Document

## 1. Overview
Setiap tahun, panitia acara *Family Camp* menghadapi masalah besar dalam penentuan denah tenda. Proses yang dilakukan saat ini sangat berantakan: panitia harus membuat peta dari nol secara manual menggunakan aplikasi seperti Canva, data peserta sering tidak sinkron dengan tenda yang ada, dan proses pemilihan tenda oleh peserta dilakukan dengan sistem "rebutan" via *list* di grup WhatsApp. Hal ini sering mengakibatkan kesalahan penempatan, tenda ganda, dan ketidaksesuaian spesifikasi tenda.

Untuk menyelesaikan masalah ini, kita akan membangun **Aplikasi Pemetaan Denah Tenda Dinamis**. Aplikasi ini berbentuk *minimap* interaktif yang beroperasi di atas peta dunia nyata (skala real). Aplikasi akan memiliki fitur pelihatan keseluruhan (*helicopter view*) hingga *zoom-in* ke detail area kemah. Panitia (Admin) dapat menggambar area dan dengan bebas memindahkan posisi tenda. Tenda-tenda ini memiliki ID berurutan, spesifikasi jelas, dan bisa diisi dengan data peserta. Peserta dapat melihat peta secara transparan dan *real-time*, sehingga mencegah konflik pemilihan tenda dan mempermudah orientasi saat acara berlangsung.

## 2. Requirements
*   **Akurasi Skala Real:** Denah tidak hanya gambar bebas, melainkan menempel pada peta dunia nyata (seperti Google Maps/Mapbox) dengan skala yang akurat untuk memastikan tenda benar-benar muat di lokasi.
*   **Fleksibilitas Event:** Sistem harus bisa digunakan berulang kali untuk event di lokasi berbeda tanpa harus menghapus data event sebelumnya.
*   **Manajemen Visual (Drag-and-Drop):** Admin harus bisa memindahkan titik atau kotak tenda di atas peta dengan mudah, layaknya menggeser ikon.
*   **Transparansi Publik:** Tautan peta harus bisa diakses publik secara *read-only* (hanya lihat) agar dari jauh-jauh hari seluruh peserta tahu di mana letak tenda dan siapa pemiliknya.
*   **Manajemen Data Terintegrasi:** Data pengguna (peserta) harus bisa ditautkan langsung ke nomor ID tenda untuk menghindari kesalahan penempatan (satu tenda, satu pemilik/keluarga).
*   **Sistem QR Code / Barcode Kavling Tenda:** Setiap kavling tenda memiliki QR Code unik yang dicetak dan dilaminasi. QR Code ini bersifat permanen dan *reusable*. Saat dipindai, menampilkan detail penghuni, spesifikasi tenda, dan fitur pelaporan darurat.
*   **Pemetaan Area & Fasilitas Komprehensif (Admin):** Admin dapat menggambar poligon batas area (Area Camp, Parkir, dll) dan menambahkan ikon fasilitas (toilet, dapur, dll) dengan ukuran skala asli serta jalur setapak.
*   **Dukungan Data Acuan Pemetaan (Multi-Layer):** Admin dapat mengimpor **beberapa** file GPX dan **beberapa** gambar peta lokasi sebagai *overlay*. Setiap lapisan dapat diatur posisi, rotasi, ukuran, dan *opacity*-nya.
*   **Coordination & Layer Lock:** Fitur untuk mengunci (*lock*) lapisan GPX atau gambar acuan agar tidak bergeser secara tidak sengaja saat admin melakukan penempatan kavling di atasnya.
*   **Collision Detection:** Sistem validasi otomatis yang mencegah admin menempatkan dua kavling tenda secara bertumpukan (*overlapping*) untuk menjaga akurasi kapasitas lahan.
*   **Offline Resilience (PWA):** Aplikasi menggunakan teknologi *Progressive Web App* dengan *service workers* agar peserta tetap dapat memindai QR Code dan melihat data tenda meski sinyal internet di lokasi perkemahan sedang lemah/drop.
*   **Switch/Swap Mechanism:** Admin memiliki otoritas untuk memindahkan peserta antar kavling, meriset status kavling, atau menukar penghuni secara cepat melalui dashboard jika terjadi kesalahan input atau permintaan khusus.

## 3. Core Features
*   **Interactive Minimap Viewer:** Peta interaktif dengan fitur *smart-zoom* (otomatis fokus ke area tenda saat dibuka oleh peserta).
*   **Event & Location Manager (Admin):** Inisialisasi event dengan input Logo, Nama Acara, dan Tagline sebagai personalisasi tampilan.
*   **Dynamic Tent Builder (Admin):** Mode edit visual yang aktif saat *zoom-in*, mendukung rotasi, spesifikasi dimensi (m2), dan kapasitas tenda.
*   **Tent Allocation System:** Sistem pemilihan "siapa cepat dia dapat" bagi peserta dan penempatan langsung oleh admin untuk panitia/tamu khusus.
*   **Live Public Dashboard:** Tampilan real-time ketersediaan tenda (hijau: tersedia, merah: terisi).
*   **QR Code Identification & Incident Reporting:** Akses detail kavling dan tombol bantuan/lapor masalah yang memberikan notifikasi real-time ke admin (jenis laporan: tenda bocor, seleting rusak, gangguan hewan, dll).
*   **Resume & Report Generator:** Fitur sekali klik untuk menghasilkan dokumen PDF ringkasan seluruh alokasi tenda yang siap cetak.

## 4. User Flow

### A. Perjalanan Admin (Panitia)
1.  **Setup Event:** Login dan membuat event baru dengan mengisi Nama Acara, Logo, Tagline, dan menentukan titik koordinat pusat lokasi.
2.  **Data Ingestion:** Mengunggah file (CSV/Excel) data peserta hasil pendaftaran awal ke dalam sistem.
3.  **Environmental Mapping (Editor Peta):**
    *   Mengunggah satu atau lebih file GPX dan gambar denah lokasi sebagai acuan.
    *   Menyesuaikan posisi, skala, dan rotasi acuan, lalu menekan tombol **"Kunci Layer"** agar tidak bergeser.
    *   Menggambar poligon batas area dan menempatkan ikon fasilitas umum.
4.  **Kavling Design (Mode Zoom):** Admin melakukan *zoom-in* ke area camp untuk mengaktifkan fitur penempatan tenda. Admin menempatkan kavling dengan *drag-and-drop* (sistem akan menolak jika terjadi *collision/overlap*).
5.  **Distribution:** Admin membagikan ID unik akses kepada peserta dan mencetak kartu QR Code fisik untuk dipasang di lapangan.
6.  **Monitoring & Reset:** Selama pemilihan, admin memantau progres. Jika ada kesalahan, admin dapat melakukan *swap* peserta atau meriset status kavling.
7.  **Generate Resume:** Admin mengunduh PDF ringkasan alokasi untuk dokumentasi cetak.
8.  **Management Insiden:** Menerima notifikasi laporan dari peserta di dashboard dan mengubah status laporan menjadi "Ditindaklanjuti/Selesai".

### B. Perjalanan Peserta (Pemilihan & Informasi)
1.  **Login:** Masuk ke aplikasi menggunakan ID unik yang diberikan panitia. Data profil otomatis termuat tanpa perlu isi ulang.
2.  **Fastest-Finger Selection:** Peserta membuka peta, sistem otomatis *zoom* ke area camp. Peserta memilih kavling yang berstatus "Tersedia". Setelah diklik, status berubah permanen menjadi milik peserta tersebut.
3.  **On-site Orientation:** Tiba di lokasi, peserta melihat peta jalur akses dan fasilitas umum untuk menuju tendanya.
4.  **Scan QR & Lapor:** Di depan tenda, peserta memindai QR fisik. Jika ada masalah (misal: tenda bocor), peserta menekan tombol "Lapor" di halaman tersebut, memilih kategori masalah, dan mengirimkannya.

### C. Perjalanan User (Publik)
1.  **Akses Tautan:** Membuka tautan publik, peta langsung diarahkan (*zoomed*) ke susunan tenda.
2.  **Pengecekan:** Melihat ketersediaan atau siapa penghuni tenda (informasi pribadi disensor sesuai privasi).

## 5. UI Mockup Description

*   **Main Map View (Peserta/Publik):** Tampilan peta *full-screen* dengan UI minimalis. Di bagian atas terdapat Nama Acara & Logo. Di bagian bawah terdapat tombol "Center my Location" dan legenda warna (Tersedia/Terisi). Kavling tenda tampak sebagai kotak-kotak kecil berpola sesuai rotasi aslinya.
*   **Admin Editor Sidebar:** Saat mode edit aktif, muncul panel di sebelah kiri untuk manajemen Layer (Daftar GPX/Overlay Gambar dengan ikon mata untuk *visibility* dan ikon gembok untuk *lock*). Panel kanan muncul ketika sebuah kavling diklik untuk mengatur Nomor, Kapasitas, dan Dimensi.
*   **Participant Selection Sheet:** Saat peserta mengeklik kavling kosong di ponsel, akan muncul *bottom sheet* (geser atas) yang menampilkan spesifikasi tenda (misal: 4P, 3x3m, Fasilitas: Matras) dan tombol besar "Pilih Tenda Ini".
*   **Scan Result Page (Mobile Optimized):** Header menampilkan nomor kavling. Body menampilkan Nama Keluarga penghuni dan status. Di bagian paling bawah terdapat Floating Action Button (FAB) berwarna merah menyala dengan teks "Minta Bantuan / Lapor Kendala".

## 6. Database Schema
*(Hanya tambahan dari versi sebelumnya)*
*   **Events:** ... `is_locked` (Boolean)
*   **Kavling:** ... `is_collision_checked` (Boolean)
*   **Reports:** ... `priority_level` (Enum: LOW, MEDIUM, HIGH)

## 7. Tech Stack (Ultra-Budget & Optimal)
*   **Frontend & Backend:** Next.js (Hobby Plan di Vercel - **Free**).
*   **Database & Real-time:** Supabase (Free Tier - Mendukung database PostgreSQL, Auth, dan real-time update untuk status tenda - **Free**).
*   **Map Engine:** Mapbox GL JS (Free Tier hingga 50.000 *loads* per bulan - **Free**).
*   **Storage:** Cloudflare R2 atau Supabase Storage (Free Tier untuk GPX dan Overlay Gambar - **Free**).
*   **PWA Support:** `next-pwa` untuk dukungan *offline* dan instalasi di homescreen.
*   **Skill AI (Claude) Requirement:** Kemampuan memberikan perintah (*prompting*) teknis untuk GeoJSON (koordinat peta), CSS grid untuk layout admin, dan manipulasi *state* real-time. Tidak memerlukan library berbayar.

## 8. Implementation Roadmap
1.  **Fase 1 (Core Mapping):** Integrasi Mapbox, fitur gambar poligon area, dan manajemen multi-layer (GPX/Overlay) dengan fitur kunci posisi.
2.  **Fase 2 (Tent & Data Logic):** Pengembangan fitur *drag-and-drop* kavling dengan validasi *collision*, impor data CSV peserta, dan skema database.
3.  **Fase 3 (Portal Peserta):** Sistem login ID unik, fitur pemilihan *real-time* (Supabase), dan optimasi PWA untuk akses *offline*.
4.  **Fase 4 (QR & Reporting):** Implementasi generator QR Code, halaman detail hasil scan, dan sistem notifikasi laporan insiden ke admin.
5.  **Fase 5 (Refinement):** Fitur cetak resume PDF, pengujian beban (*load testing* untuk pemilihan rebutan), dan final UI polishing.