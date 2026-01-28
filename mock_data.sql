
-- 1. Create the Pre-test Quiz (if not exists)
INSERT INTO quizzes (title, type)
VALUES ('Comprehensive English Placement Test', 'PRE_TEST')
ON CONFLICT DO NOTHING;

-- Variable to hold the quiz id (for manual running, we might need to look it up, but for script we can use a subquery)

-- 2. Mock Questions (5 per category)

-- Category: Listening
INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Listening Q1: Which word did you hear? "She ____ to the store."', '["walked", "walk", "walking", "works"]'::jsonb, 'walked', 'listening' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Listening Q2: Choose the detailed response to: "How are you?"', '["I am fine.", "Yes.", "Please.", "Red."]'::jsonb, 'I am fine.', 'listening' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Listening Q3: Listen to the audio (mock). What time is the meeting?', '["4 PM", "5 PM", "6 PM", "7 PM"]'::jsonb, '5 PM', 'listening' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Listening Q4: Who is the speaker talking to?', '["A friend", "A doctor", "A teacher", "A police officer"]'::jsonb, 'A doctor', 'listening' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Listening Q5: What is the main topic?', '["Travel", "Food", "Sports", "Music"]'::jsonb, 'Travel', 'listening' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;


-- Category: Reading
INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Reading Q1: Read the sign "No Entry". What does it mean?', '["Do not go in", "Come in", "Exit only", "Open"]'::jsonb, 'Do not go in', 'reading' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Reading Q2: Read the passage. What did Alice buy?', '["Apples", "Bananas", "Oranges", "Grapes"]'::jsonb, 'Apples', 'reading' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Reading Q3: What is the main idea of paragraph 2?', '["History of dogs", "Types of cats", "Bird migrations", "Fish food"]'::jsonb, 'Types of cats', 'reading' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Reading Q4: Choose the best title for the text.', '["My Summer", "Winter Cold", "Spring Flowers", "Fall Leaves"]'::jsonb, 'My Summer', 'reading' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Reading Q5: What does "ancient" mean in the context?', '["Old", "New", "Fast", "Slow"]'::jsonb, 'Old', 'reading' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;


-- Category: Vocaburary
INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Vocab Q1: Synonym for "Happy"?', '["Joyful", "Sad", "Angry", "Tired"]'::jsonb, 'Joyful', 'vocaburary' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Vocab Q2: Antonym for "Big"?', '["Small", "Huge", "Large", "Giant"]'::jsonb, 'Small', 'vocaburary' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Vocab Q3: Complete: A ___ of keys.', '["Bunch", "Herd", "Pack", "School"]'::jsonb, 'Bunch', 'vocaburary' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Vocab Q4: Meaning of "Benevolent"?', '["Kind", "Cruel", "Rich", "Poor"]'::jsonb, 'Kind', 'vocaburary' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Vocab Q5: Choose the correct spelling.', '["Necessary", "Neccessary", "Necesary", "Necessary"]'::jsonb, 'Necessary', 'vocaburary' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;


-- Category: Grammar
INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Grammar Q1: She ___ a doctor.', '["is", "are", "am", "be"]'::jsonb, 'is', 'grammar' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Grammar Q2: They ___ to the park yesterday.', '["went", "go", "gone", "going"]'::jsonb, 'went', 'grammar' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Grammar Q3: He has ___ money than me.', '["less", "fewer", "least", "few"]'::jsonb, 'less', 'grammar' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Grammar Q4: I look forward to ___ you.', '["seeing", "see", "saw", "seen"]'::jsonb, 'seeing', 'grammar' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Grammar Q5: If I were you, I ___ go.', '["would", "will", "can", "shall"]'::jsonb, 'would', 'grammar' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;


-- Category: Tense
INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Tense Q1: Present Perfect of "eat"?', '["Have eaten", "Ate", "Eat", "Eating"]'::jsonb, 'Have eaten', 'tense' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Tense Q2: By next year, we ___ finished.', '["will have", "will", "had", "have"]'::jsonb, 'will have', 'tense' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Tense Q3: She ___ reading when I called.', '["was", "is", "were", "are"]'::jsonb, 'was', 'tense' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Tense Q4: Identiy the tense: "I walk."', '["Present Simple", "Past Simple", "Future", "Continuous"]'::jsonb, 'Present Simple', 'tense' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Tense Q5: Identity the tense: "I had eaten."', '["Past Perfect", "Present Perfect", "Past Simple", "Future Perfect"]'::jsonb, 'Past Perfect', 'tense' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;


-- Category: Test
INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Test Q1: What is a test?', '["Assessment", "Food", "Game", "Toy"]'::jsonb, 'Assessment', 'test' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Test Q2: Why do we test?', '["Measure skill", "For fun", "To sleep", "To eat"]'::jsonb, 'Measure skill', 'test' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Test Q3: Test Type: Multiple Choice?', '["Yes", "No", "Maybe", "Blue"]'::jsonb, 'Yes', 'test' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Test Q4: Final ___', '["Exam", "Game", "Show", "Walk"]'::jsonb, 'Exam', 'test' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;

INSERT INTO questions (quiz_id, text, options, correct_answer, category)
SELECT id, 'Test Q5: Grade A means?', '["Excellent", "Bad", "Average", "Fail"]'::jsonb, 'Excellent', 'test' FROM quizzes WHERE type = 'PRE_TEST' LIMIT 1;
