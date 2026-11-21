# Al Byan Agung Shafiqri — Personal Branding Website

Portofolio React dan Vite dengan tampilan desktop bergaya MacBook. Kursor bergerak ke dock dan mengeklik Safari saat halaman dimuat, termasuk saat membuka tautan langsung ke suatu bagian. Tekan `Esc` atau klik ikon Safari untuk melewati animasi. Preferensi sistem untuk mengurangi gerakan juga melewati animasi. Tersedia dalam bahasa Indonesia, Inggris, dan Jawa.

## Menjalankan

```bash
npm install
npm run dev      # mode development
npm run build    # build produksi -> folder dist/
npm run preview  # preview hasil build
```

Butuh Node.js 18+.

## Mengedit konten tanpa deploy ulang

Semua teks situs disimpan di **satu file JSON eksternal**:

```
public/content.json
```

Saat aplikasi berjalan, data ini **di-fetch saat runtime** (`fetch("content.json")`).
Artinya:

- Setelah `npm run build`, file berada di `dist/content.json`. Anda bisa
  **mengedit `dist/content.json` langsung di server produksi** lalu refresh
  browser — **tanpa build ulang dan tanpa deploy ulang**.

`meta` berisi pengaturan situs, `languages` mendefinisikan pilihan bahasa,
dan `ui` berisi label navigasi serta tombol. Konten tiap bahasa berada di
`content.id`, `content.en`, dan `content.jw`. Jika memperbarui pengalaman atau
sertifikat, ubah entri di ketiga bahasa.

## Struktur halaman

1. Profil dan unduhan CV (`hero`)
2. Ringkasan profesional (`summary`)
3. Pengalaman (`experience`)
4. Proyek profesional (`proProjects`)
5. Proyek terbuka (`openProjects`)
6. Pendidikan (`education`)
7. Keahlian (`skills`)
8. Sertifikat (`certificates`)
9. Kontak (`contact`)

Tombol merah menutup jendela, tombol kuning meminimalkan jendela sambil menyimpan posisi baca, dan tombol hijau mengubah ukuran jendela. Ikon Safari di dock membuka kembali portofolio. Topbar di dalam Safari tetap terlihat saat halaman digulir. Geser deretan tautan ke samping pada layar sempit.

## Preview cepat (tanpa npm)

Buka `preview.html` di browser. Pratinjau ini memuat React dan Babel via CDN,
menyertakan salinan data JSON, dan menggunakan aset dari `public/`. Gunakan
aplikasi Vite untuk mengambil `public/content.json` saat halaman dibuka.

Regenerasi preview setelah mengubah source/JSON:

```bash
node build-preview.mjs
```

## Stack

- React 18 dan Vite 5
- CSS di `src/custom.css`
- Font Inter dan JetBrains Mono
