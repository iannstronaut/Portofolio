# Al Byan Agung Shafiqri — Personal Branding Website

Personal branding website dengan **React + Vite + Tailwind CSS**. Halaman dirender
_di dalam_ jendela Safari ala macOS, lengkap dengan animasi boot (kursor membuka
Safari dari dock, jendela terbuka dengan efek genie), gaya **liquid glass**, dan
desain editorial yang rapi.

## Menjalankan

```bash
npm install
npm run dev      # mode development
npm run build    # build produksi -> folder dist/
npm run preview  # preview hasil build
```

Butuh Node.js 18+.

## ✏️ Mengedit konten TANPA re-deploy

Semua teks situs disimpan di **satu file JSON eksternal**:

```
public/content.json
```

Saat aplikasi berjalan, data ini **di-fetch saat runtime** (`fetch("content.json")`).
Artinya:

- Tidak ada teks yang di-hardcode di dalam komponen React.
- Setelah `npm run build`, file berada di `dist/content.json`. Anda bisa
  **mengedit `dist/content.json` langsung di server produksi** lalu refresh
  browser — **tanpa build ulang dan tanpa deploy ulang**.

Struktur `content.json`: `meta`, `hero`, `summary`, `experience`, `education`,
`skills`, `projects`, `contact`. Ubah nilainya sesuai data diri Anda.

## Struktur halaman

1. Hero — `hero`
2. Professional Summary — `summary`
3. Experience — `experience`
4. Education — `education`
5. Skills — `skills`
6. Projects — `projects`
7. Contact — `contact`

## Detail interaksi

- **Intro**: kursor bergerak ke dock → klik Safari (bounce) → jendela terbuka.
  Tekan **Esc** atau tombol **Skip intro** untuk melewati.
- **Dock**: setelah intro selesai, dock **turun ke bawah** (auto-hide ala macOS).
  Arahkan kursor ke tepi bawah layar untuk memunculkannya kembali.
- **Navigasi**: navbar di dalam browser punya **scrollspy** (menyorot section
  aktif) + scroll progress bar tipis.

## Preview cepat (tanpa npm)

`preview.html` adalah versi satu-file (React + Tailwind via CDN) untuk melihat
tampilan dengan cepat — cukup buka di browser. Pada versi ini data JSON
di-_inline_ (karena `file://` tidak bisa `fetch`). Untuk alur edit-tanpa-deploy
yang sebenarnya, gunakan proyek Vite di atas dengan `public/content.json`.

Regenerasi preview setelah mengubah source/JSON:

```bash
node build-preview.mjs
```

## Stack

- React 18 · Vite 5 · Tailwind CSS 3
- Font: Inter + JetBrains Mono (Google Fonts)
- Aksen tunggal Action Blue `#0066cc` — tanpa warna ungu.
