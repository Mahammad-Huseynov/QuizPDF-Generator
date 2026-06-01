import PyPDF2
import json
import os
import re

def extract_questions_final(pdf_filename):
    base_path = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(base_path, pdf_filename)
    
    if not os.path.exists(pdf_path):
        print(f"❌ Xəta: '{pdf_filename}' tapılmadı!")
        return []

    questions = []
    current_question = None
    
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            full_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"

        # Regex: Sətrin əvvəlində və ya boşluqdan sonra gələn "Nömrə. Sual" formatı
        # Bu pattern sualları daha yaxşı tutur
        lines = full_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line: continue

            # Sual nömrəsini axtarırıq (Məsələn: "40. ")
            match_q = re.match(r'^(\d{1,3})\.\s+(.*)', line)
            
            if match_q:
                # Əgər yeni sual tapıldısa, köhnəni siyahıya at
                if current_question:
                    questions.append(current_question)
                
                current_question = {
                    "question_number": match_q.group(1),
                    "question": match_q.group(2).strip(),
                    "correct_answer": None,
                    "other_answers": []
                }
            elif current_question is not None:
                # Variantları yoxlayırıq
                if line.startswith('•') or line.startswith('√'):
                    is_correct = line.startswith('√')
                    clean_text = line.lstrip('•√').strip()
                    
                    if is_correct:
                        current_question["correct_answer"] = clean_text
                    else:
                        current_question["other_answers"].append(clean_text)
                else:
                    # Əgər sətir nə sualdır, nə variant, deməli əvvəlki mətinin davamıdır
                    if not current_question["other_answers"] and current_question["correct_answer"] is None:
                        current_question["question"] += " " + line
                    elif current_question["other_answers"]:
                        current_question["other_answers"][-1] += " " + line
                    elif current_question["correct_answer"]:
                        current_question["correct_answer"] += " " + line

        if current_question:
            questions.append(current_question)

        # JSON faylına yazmaq
        output_data = json.dumps(questions, ensure_ascii=False, indent=2)
        js_output = f"const questionsData = {output_data};"
        
        with open(os.path.join(base_path, 'questions.js'), 'w', encoding='utf-8') as f:
            f.write(js_output)
            
        print(f"✅ Uğurlu! {len(questions)} sual tapıldı.")

    except Exception as e:
        print(f"❌ Xəta: {e}")

if __name__ == "__main__":
    extract_questions_final("00868azkol.pdf")