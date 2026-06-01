const fs = require('fs');

/**
 * Bu funksiya suallar massivindəki təkrarları tapır
 */
function analyzeQuestions() {
    try {
        const filePath = './questions.js';
        
        if (!fs.existsSync(filePath)) {
            console.error("❌ Xəta: 'questions.js' faylı tapılmadı!");
            return;
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Regex ilə massiv hissəsini çıxarırıq
        const arrayMatch = fileContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
        
        if (!arrayMatch) {
            console.error("❌ Xəta: Faylın içində düzgün sual formatı (massiv) tapılmadı.");
            return;
        }

        const questions = JSON.parse(arrayMatch[0]);
        const totalQuestions = questions.length;
        let corruptedQuestions = [];

        questions.forEach((q) => {
            const correct = q.correct_answer.trim();
            const others = q.other_answers.map(ans => ans.trim());
            const allOptions = [correct, ...others];

            // Təkrarları yoxlayırıq (Case-insensitive: "Alma" və "alma" eyni sayılır)
            const duplicates = allOptions.filter((item, index) => {
                return allOptions.map(s => s.toLowerCase()).indexOf(item.toLowerCase()) !== index;
            });

            if (duplicates.length > 0) {
                corruptedQuestions.push({
                    number: q.question_number,
                    text: q.question,
                    duplicates: [...new Set(duplicates)], // Eyni təkrarı iki dəfə yazmasın
                    all: allOptions
                });
            }
        });

        // HESABAT ÇIXIŞI
        console.log("===========================================");
        console.log("📊 SUAL BAZASI ANALİZİ");
        console.log(`✅ Cəmi yoxlanılan sual: ${totalQuestions}`);
        console.log(`⚠️ Tapılan problemli sual: ${corruptedQuestions.length}`);
        console.log(`📈 Səhvlik dərəcəsi: %${((corruptedQuestions.length / totalQuestions) * 100).toFixed(1)}`);
        console.log("===========================================\n");

        if (corruptedQuestions.length > 0) {
            corruptedQuestions.forEach((item, i) => {
                console.log(`${i + 1}. [Sual №${item.number}]`);
                console.log(`   Sual: ${item.text.substring(0, 80)}...`);
                console.log(`   ❌ Təkrar olan variantlar: "${item.duplicates.join(', ')}"`);
                console.log("   -------------------------------------------");
            });
        } else {
            console.log("Bütün suallar məntiqi baxımdan düzgündür.");
        }

    } catch (err) {
        console.error("❌ Kod işləyərkən gözlənilməz xəta:");
        console.log(err.message);
    }
}

analyzeQuestions();