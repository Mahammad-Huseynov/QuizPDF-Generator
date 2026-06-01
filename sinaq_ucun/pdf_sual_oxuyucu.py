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
    next_expected_id = 1 # Növbəti gözlənilən sual nömrəsi
    
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            full_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"

        lines = full_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line: continue

            # Yeni Sualı yoxla: Sətir rəqəmlə başlamalıdır
            match_q = re.match(r'^(\d{1,4})\.\s+(.*)', line)
            
            is_new_question = False
            if match_q:
                found_id = int(match_q.group(1))
                # Əgər tapılan rəqəm gözlənilən nömrəyə yaxındırsa (məsələn 1 vahid artıqdırsa)
                # Bu, daxili "1. Moda" kimi halların qarşısını alır
                if found_id == next_expected_id or (current_question is None and found_id == 1):
                    is_new_question = True
                    next_expected_id = found_id + 1

            if is_new_question:
                if current_question:
                    questions.append(current_question)
                
                current_question = {
                    "question_number": str(match_q.group(1)),
                    "question": match_q.group(2).strip(),
                    "correct_answer": None,
                    "other_answers": []
                }
            elif current_question is not None:
                # Seçimlər (• və ya √ markerləri)
                if line.startswith('•') or line.startswith('√'):
                    is_correct = line.startswith('√')
                    clean_text = line.lstrip('•√').strip()
                    
                    if is_correct:
                        current_question["correct_answer"] = clean_text
                    else:
                        current_question["other_answers"].append(clean_text)
                else:
                    # Əgər seçim deyilsə, deməli sualın mətni aşağı sətirdən davam edir
                    if not current_question["other_answers"] and current_question["correct_answer"] is None:
                        current_question["question"] += " " + line
                    else:
                        # Variantın davamı
                        if current_question["correct_answer"] and not current_question["other_answers"]:
                            current_question["correct_answer"] += " " + line
                        elif current_question["other_answers"]:
                            current_question["other_answers"][-1] += " " + line

        if current_question:
            questions.append(current_question)

        js_output = f"const questionsData = {json.dumps(questions, ensure_ascii=False, indent=2)};"
        with open(os.path.join(base_path, 'questions.js'), 'w', encoding='utf-8') as f:
            f.write(js_output)
            
        print(f"✅ Uğurlu! {len(questions)} sual emal edildi.")

    except Exception as e:
        print(f"❌ Xəta: {e}")

if __name__ == "__main__":
    extract_questions_final("Komputer_Qrafikasi.pdf")  # bura pdfin adi yazilmalidir