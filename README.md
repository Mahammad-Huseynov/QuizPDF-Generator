# QuizPDF-Generator

Bu layihə PDF formatında olan sualları avtomatik oxuyub, onları strukturlaşdırılmış JSON formatına çevirən və bu məlumatlar əsasında interaktiv sınaq (quiz) imtahanları yaradan bir sistemdir.

## 🚀 Layihənin Xüsusiyyətləri
- **PDF Parser:** PDF fayllarındakı sualları, variantları və cavabları avtomatik çıxarır.
- **JSON Emalı:** Çıxarılan sualları asan idarə olunan və genişlənə bilən JSON formatında saxlayır.
- **Təkrar Sualların Aşkarlanması:** Eyni sualların təkrar düşməsinin qarşısını alan funksionallıq (`tekrar_varsa_tapan.js` vasitəsilə).
- **İnteraktiv Sınaq:** Veb interfeysi vasitəsilə sualları cavablandırmaq imkanı.

## 🛠 Texnologiyalar
- **Backend:** Python (PDF-in işlənməsi və məlumatın çıxarılması üçün).
- **Frontend:** HTML, CSS, JavaScript (İstifadəçi interfeysi və sınaq ekranı üçün).

## 📦 Necə İstifadə Etməli?

1. **Layihəni klonlayın:**
```bash
   git clone https://github.com/Mahammad-Huseynov/QuizPDF-Generator.git
```
2. **Python mühitinizdə lazım olan kitabxanaları quraşdırın:**
```bash
pip install -r requirements.txt
```
3. **İşə salın. Əvvəlcə PDF faylını sistemə daxil edin və Python skriptini işə salaraq sualları JSON formatına çevirin:**
```bash
python pdf_sual_oxuyucu.py
```
   - Sonra `index.html` faylını brauzerdə açaraq sınaq sistemini istifadə edə bilərsiniz.

## 📂 Fayl Strukturu
- `pdf_sual_oxuyucu.py` / `pdf_sual_oxuyucu2.py`: PDF-i oxumaq və sualları çıxarmaq üçün əsas skriptlər.
- `index.html`: Sınaq imtahanının əsas interfeysi.
- `script.js`: Sınaq məntiqini idarə edən fayl.
- `tekrar_varsa_tapan.js`: Təkrar sualları yoxlayan köməkçi skript.
- `style.css`: İntefeys üçün üslublar.
- `pdf-yarat.html`: Suallardan PDF sənədi yaratmaq üçün istifadə olunan interfeys.

## 📝 Qeydlər
Layihə tələbə və müəllimlərin imtahanlara hazırlıq prosesini avtomatlaşdırmaq üçün hazırlanıb. Hər hansı bir təklif və ya çatışmazlıq gördükdə "Issue" bölməsindən bildirə bilərsiniz.
