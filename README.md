# Yakıtım — React + Firebase Yakıt Takip

Telefon ve bilgisayarda çalışan, kişisel girişli yakıt kayıt ve raporlama paneli.

## Özellikler

- Firebase Email/Password ile hesap oluşturma, giriş, çıkış
- Firebase Firestore üzerinde kullanıcıya özel kayıtlar
- 5 istasyon markası: Opet, Shell, Petrol Ofisi, BP, Total (yüklediğiniz gerçek logolar)
- Tarih, kilometre, yakıt türü (benzin / motorin / LPG), litre, litre fiyatı, toplam tutar, tam depo, not
- Kayıt ekleme, düzenleme, silme ve filtreleme
- Aylık gider grafiği, marka dağılımı, marka harcama grafiği, 100 km tüketim grafiği
- CSV dosyası dışa aktarımı (Excel'de açılır; noktalı virgül ayraçlı ve UTF-8 BOM)
- Rapor ekranını yazdırma / PDF olarak kaydetme
- Araç ismini ayarlama, mobil uyumlu koyu tasarım

## Kurulum

**Gereksinimler:** Node.js 20.19+ veya 22.12+ ve npm.

1. Projeyi açıp terminalde `npm install` çalıştırın.
2. https://console.firebase.google.com/ üzerinden yeni bir Firebase projesi oluşturun.
3. **Build → Authentication → Sign-in method → Email/Password** sağlayıcısını etkinleştirin.
4. **Build → Firestore Database** açın. Üretim modunu seçebilir, ardından aşağıdaki güvenlik kurallarını yayınlayabilirsiniz.
5. Firebase **Project settings → Your apps → Web app** bölümünden web uygulaması ekleyin, yapılandırma alanlarını alın.
6. `.env.example` dosyasını `.env` adıyla kopyalayın. Tüm `VITE_FIREBASE_*` değerlerini Firebase uygulamanızın config değerleriyle doldurun.
7. Firestore Console → Rules sekmesinde proje kökündeki `firestore.rules` içeriğini kopyalayıp **Publish** ile yayınlayın.
8. `npm run dev` çalıştırıp terminalde yazan adresi tarayıcıdan açın.
9. İlk açılışta **Ücretsiz kayıt ol** ile kullanıcı hesabınızı oluşturun.

## Vercel'e yayınlama

1. Bu klasörü bir GitHub deposuna aktarın.
2. Vercel'de **Add New → Project** ile içe aktarın. Vite otomatik algılanır (`npm run build`, `dist`).
3. Vercel **Project → Settings → Environment Variables** alanına `.env` dosyanızdaki tüm `VITE_FIREBASE_*` anahtarlarını girin; yeniden deploy edin.
4. Firebase **Authentication → Settings → Authorized domains** bölümüne Vercel alan adınızı ekleyin.

**Önemli:** Firebase web config değerleri frontend'de görünür; bu normaldir. Güvenliği sağlayan Firestore kurallarıdır. `firestore.rules` kurallarını mutlaka yayınlayın. `.env` dosyasını GitHub'a göndermeyin.

## Tüketim hesabı

Tüketim yalnızca **tam depo → tam depo** yöntemiyle hesaplanır:

`100 km tüketimi = (önceki tam dolumdan sonraki tüm yakıt litreleri / aradaki km) × 100`

İlk tam dolum başlangıç referansıdır ve tek başına tüketim oluşturmaz. Ara dolumlar `Depoyu tamamen doldurdum` işaretlenmeden eklenebilir; litreleri bir sonraki tam doluma dahil edilir. Arada kaydedilmemiş bir dolum, kilometre sayacı hatası veya farklı araçların karışması hesabı bozar.

## Veri modeli

- `users/{uid}`: `{ carName }`
- `users/{uid}/fills/{fillId}`: `{ date, brand, fuelType, odometer, liters, pricePerLiter, total, fullTank, note, createdAt }`

Bir hesapta tek araç profili bulunur. Birden fazla araç için koleksiyon düzeyinde araç kimliği desteği ayrıca eklenebilir.

## Marka görselleri

Kullanıcının sağladığı marka logoları `public/logos/` klasörüne yerleştirilmiştir. Logolar olduğu gibi korunur.
