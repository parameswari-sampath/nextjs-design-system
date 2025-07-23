#!/bin/bash

# Step 1: Login to get access token
echo "Logging in to get access token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher01@gmail.com",
    "password": "S@iram@123"
  }')

# Extract access token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to get access token. Login response:"
    echo $LOGIN_RESPONSE
    exit 1
fi

echo "Access token obtained successfully"
echo "Adding 25 questions to the database..."

# Question 1 - Geography
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the capital of France?",
    "option_a": "London",
    "option_b": "Berlin",
    "option_c": "Paris",
    "option_d": "Madrid",
    "correct_option": "C",
    "explanation_question": "France is a country in Western Europe with Paris as its capital and largest city.",
    "explanation_a": "London is the capital of the United Kingdom, not France.",
    "explanation_b": "Berlin is the capital of Germany, not France.",
    "explanation_c": "Paris is indeed the capital and largest city of France.",
    "explanation_d": "Madrid is the capital of Spain, not France.",
    "difficulty_level": "EASY",
    "subject": "Geography",
    "tags": "europe, capitals, geography, france",
    "is_active": true
  }'

# Question 2 - Mathematics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is 15 + 27?",
    "option_a": "41",
    "option_b": "42",
    "option_c": "43",
    "option_d": "44",
    "correct_option": "B",
    "explanation_question": "This is a basic addition problem requiring simple arithmetic.",
    "explanation_a": "41 is incorrect. 15 + 27 = 42, not 41.",
    "explanation_b": "42 is correct. 15 + 27 = 42.",
    "explanation_c": "43 is incorrect. 15 + 27 = 42, not 43.",
    "explanation_d": "44 is incorrect. 15 + 27 = 42, not 44.",
    "difficulty_level": "EASY",
    "subject": "Mathematics",
    "tags": "arithmetic, addition, basic math",
    "is_active": true
  }'

# Question 3 - Science
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the chemical symbol for water?",
    "option_a": "H2O",
    "option_b": "CO2",
    "option_c": "NaCl",
    "option_d": "O2",
    "correct_option": "A",
    "explanation_question": "Water is a chemical compound consisting of hydrogen and oxygen atoms.",
    "explanation_a": "H2O is correct. Water consists of 2 hydrogen atoms and 1 oxygen atom.",
    "explanation_b": "CO2 is carbon dioxide, not water.",
    "explanation_c": "NaCl is sodium chloride (salt), not water.",
    "explanation_d": "O2 is oxygen gas, not water.",
    "difficulty_level": "EASY",
    "subject": "Chemistry",
    "tags": "chemistry, water, chemical formula, basic science",
    "is_active": true
  }'

# Question 4 - History
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "In which year did World War II end?",
    "option_a": "1944",
    "option_b": "1945",
    "option_c": "1946",
    "option_d": "1947",
    "correct_option": "B",
    "explanation_question": "World War II was a global conflict that lasted from 1939 to 1945.",
    "explanation_a": "1944 is incorrect. The war continued into 1945.",
    "explanation_b": "1945 is correct. World War II ended in 1945 with the surrender of Japan.",
    "explanation_c": "1946 is incorrect. The war had already ended by then.",
    "explanation_d": "1947 is incorrect. The war ended two years earlier.",
    "difficulty_level": "MEDIUM",
    "subject": "History",
    "tags": "world war, history, 20th century, global conflict",
    "is_active": true
  }'

# Question 5 - Geography
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "Which is the largest ocean on Earth?",
    "option_a": "Atlantic Ocean",
    "option_b": "Indian Ocean",
    "option_c": "Pacific Ocean",
    "option_d": "Arctic Ocean",
    "correct_option": "C",
    "explanation_question": "Earth has five major oceans of varying sizes.",
    "explanation_a": "Atlantic Ocean is the second largest ocean, not the largest.",
    "explanation_b": "Indian Ocean is the third largest ocean.",
    "explanation_c": "Pacific Ocean is correct. It is the largest ocean covering about 1/3 of Earth.",
    "explanation_d": "Arctic Ocean is the smallest ocean.",
    "difficulty_level": "EASY",
    "subject": "Geography",
    "tags": "oceans, geography, earth, physical geography",
    "is_active": true
  }'

# Question 6 - Mathematics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the square root of 144?",
    "option_a": "11",
    "option_b": "12",
    "option_c": "13",
    "option_d": "14",
    "correct_option": "B",
    "explanation_question": "A square root is a number that when multiplied by itself gives the original number.",
    "explanation_a": "11 × 11 = 121, not 144.",
    "explanation_b": "12 is correct. 12 × 12 = 144.",
    "explanation_c": "13 × 13 = 169, not 144.",
    "explanation_d": "14 × 14 = 196, not 144.",
    "difficulty_level": "MEDIUM",
    "subject": "Mathematics",
    "tags": "square root, algebra, mathematics",
    "is_active": true
  }'

# Question 7 - Science
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "How many bones are in an adult human body?",
    "option_a": "196",
    "option_b": "206",
    "option_c": "216",
    "option_d": "226",
    "correct_option": "B",
    "explanation_question": "The human skeletal system provides structure and protection for organs.",
    "explanation_a": "196 is too few bones for an adult human.",
    "explanation_b": "206 is correct. An adult human has 206 bones.",
    "explanation_c": "216 is too many bones for an adult human.",
    "explanation_d": "226 is too many bones for an adult human.",
    "difficulty_level": "MEDIUM",
    "subject": "Biology",
    "tags": "human body, bones, anatomy, biology",
    "is_active": true
  }'

# Question 8 - Literature
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "Who wrote the novel \"Pride and Prejudice\"?",
    "option_a": "Charlotte Brontë",
    "option_b": "Emily Brontë",
    "option_c": "Jane Austen",
    "option_d": "George Eliot",
    "correct_option": "C",
    "explanation_question": "Pride and Prejudice is a classic English novel published in 1813.",
    "explanation_a": "Charlotte Brontë wrote Jane Eyre, not Pride and Prejudice.",
    "explanation_b": "Emily Brontë wrote Wuthering Heights, not Pride and Prejudice.",
    "explanation_c": "Jane Austen is correct. She wrote Pride and Prejudice in 1813.",
    "explanation_d": "George Eliot wrote Middlemarch, not Pride and Prejudice.",
    "difficulty_level": "MEDIUM",
    "subject": "Literature",
    "tags": "literature, novels, classic literature, jane austen",
    "is_active": true
  }'

# Question 9 - Physics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the speed of light in vacuum?",
    "option_a": "299,792,458 m/s",
    "option_b": "300,000,000 m/s",
    "option_c": "299,000,000 m/s",
    "option_d": "301,000,000 m/s",
    "correct_option": "A",
    "explanation_question": "The speed of light in vacuum is a fundamental physical constant.",
    "explanation_a": "299,792,458 m/s is correct. This is the exact speed of light in vacuum.",
    "explanation_b": "300,000,000 m/s is an approximation, not the exact value.",
    "explanation_c": "299,000,000 m/s is too slow.",
    "explanation_d": "301,000,000 m/s is too fast.",
    "difficulty_level": "HARD",
    "subject": "Physics",
    "tags": "physics, light, constants, electromagnetic radiation",
    "is_active": true
  }'

# Question 10 - Geography
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "Which continent has the most countries?",
    "option_a": "Asia",
    "option_b": "Africa",
    "option_c": "Europe",
    "option_d": "South America",
    "correct_option": "B",
    "explanation_question": "Continents vary in the number of sovereign nations they contain.",
    "explanation_a": "Asia has many countries but not the most.",
    "explanation_b": "Africa is correct. It has 54 recognized sovereign nations.",
    "explanation_c": "Europe has fewer countries than Africa.",
    "explanation_d": "South America has the fewest countries among major continents.",
    "difficulty_level": "MEDIUM",
    "subject": "Geography",
    "tags": "continents, countries, political geography, africa",
    "is_active": true
  }'

# Question 11 - Mathematics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is 7 × 8?",
    "option_a": "54",
    "option_b": "56",
    "option_c": "58",
    "option_d": "60",
    "correct_option": "B",
    "explanation_question": "This is a basic multiplication problem from the times table.",
    "explanation_a": "54 is incorrect. 7 × 8 = 56, not 54.",
    "explanation_b": "56 is correct. 7 × 8 = 56.",
    "explanation_c": "58 is incorrect. 7 × 8 = 56, not 58.",
    "explanation_d": "60 is incorrect. 7 × 8 = 56, not 60.",
    "difficulty_level": "EASY",
    "subject": "Mathematics",
    "tags": "multiplication, times table, basic math",
    "is_active": true
  }'

# Question 12 - Science
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the largest planet in our solar system?",
    "option_a": "Saturn",
    "option_b": "Jupiter",
    "option_c": "Neptune",
    "option_d": "Earth",
    "correct_option": "B",
    "explanation_question": "Our solar system has eight planets of varying sizes.",
    "explanation_a": "Saturn is the second largest planet, not the largest.",
    "explanation_b": "Jupiter is correct. It is the largest planet in our solar system.",
    "explanation_c": "Neptune is much smaller than Jupiter.",
    "explanation_d": "Earth is much smaller than Jupiter.",
    "difficulty_level": "EASY",
    "subject": "Astronomy",
    "tags": "solar system, planets, astronomy, jupiter",
    "is_active": true
  }'

# Question 13 - History
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "Who was the first President of the United States?",
    "option_a": "Thomas Jefferson",
    "option_b": "John Adams",
    "option_c": "George Washington",
    "option_d": "Benjamin Franklin",
    "correct_option": "C",
    "explanation_question": "The United States established the presidency as part of its new government in 1789.",
    "explanation_a": "Thomas Jefferson was the third President.",
    "explanation_b": "John Adams was the second President.",
    "explanation_c": "George Washington is correct. He was the first President (1789-1797).",
    "explanation_d": "Benjamin Franklin was never President.",
    "difficulty_level": "EASY",
    "subject": "History",
    "tags": "american history, presidents, founding fathers",
    "is_active": true
  }'

# Question 14 - Mathematics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the value of π (pi) to 2 decimal places?",
    "option_a": "3.14",
    "option_b": "3.15",
    "option_c": "3.16",
    "option_d": "3.17",
    "correct_option": "A",
    "explanation_question": "Pi is the ratio of a circle circumference to its diameter.",
    "explanation_a": "3.14 is correct. Pi equals approximately 3.14159...",
    "explanation_b": "3.15 is incorrect when rounded to 2 decimal places.",
    "explanation_c": "3.16 is incorrect when rounded to 2 decimal places.",
    "explanation_d": "3.17 is incorrect when rounded to 2 decimal places.",
    "difficulty_level": "MEDIUM",
    "subject": "Mathematics",
    "tags": "pi, geometry, mathematical constants",
    "is_active": true
  }'

# Question 15 - Science
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What gas do plants absorb during photosynthesis?",
    "option_a": "Oxygen",
    "option_b": "Nitrogen",
    "option_c": "Carbon Dioxide",
    "option_d": "Hydrogen",
    "correct_option": "C",
    "explanation_question": "Photosynthesis is the process by which plants make food using sunlight.",
    "explanation_a": "Oxygen is released by plants, not absorbed during photosynthesis.",
    "explanation_b": "Nitrogen is not the primary gas used in photosynthesis.",
    "explanation_c": "Carbon Dioxide is correct. Plants absorb CO2 and release oxygen.",
    "explanation_d": "Hydrogen is not directly absorbed as a gas during photosynthesis.",
    "difficulty_level": "EASY",
    "subject": "Biology",
    "tags": "photosynthesis, plants, biology, carbon dioxide",
    "is_active": true
  }'

# Question 16 - Geography
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the longest river in the world?",
    "option_a": "Amazon River",
    "option_b": "Nile River",
    "option_c": "Mississippi River",
    "option_d": "Yangtze River",
    "correct_option": "B",
    "explanation_question": "Rivers are measured by their total length from source to mouth.",
    "explanation_a": "Amazon River is the second longest river in the world.",
    "explanation_b": "Nile River is correct. It is approximately 6,650 km long.",
    "explanation_c": "Mississippi River is much shorter than the Nile.",
    "explanation_d": "Yangtze River is shorter than both the Nile and Amazon.",
    "difficulty_level": "MEDIUM",
    "subject": "Geography",
    "tags": "rivers, geography, nile river, physical geography",
    "is_active": true
  }'

# Question 17 - Mathematics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "If x = 5, what is the value of 2x + 3?",
    "option_a": "11",
    "option_b": "12",
    "option_c": "13",
    "option_d": "14",
    "correct_option": "C",
    "explanation_question": "This is an algebraic expression that requires substitution.",
    "explanation_a": "11 is incorrect. 2(5) + 3 = 10 + 3 = 13, not 11.",
    "explanation_b": "12 is incorrect. 2(5) + 3 = 10 + 3 = 13, not 12.",
    "explanation_c": "13 is correct. 2(5) + 3 = 10 + 3 = 13.",
    "explanation_d": "14 is incorrect. 2(5) + 3 = 10 + 3 = 13, not 14.",
    "difficulty_level": "MEDIUM",
    "subject": "Mathematics",
    "tags": "algebra, substitution, linear expressions",
    "is_active": true
  }'

# Question 18 - History
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "The Great Wall of China was built primarily to defend against which group?",
    "option_a": "Mongols",
    "option_b": "Japanese",
    "option_c": "British",
    "option_d": "Russians",
    "correct_option": "A",
    "explanation_question": "The Great Wall was built over many dynasties for defensive purposes.",
    "explanation_a": "Mongols is correct. The wall was built to defend against Mongol invasions.",
    "explanation_b": "Japanese were not the primary threat that motivated wall construction.",
    "explanation_c": "British came much later in Chinese history.",
    "explanation_d": "Russians were not a significant threat during wall construction periods.",
    "difficulty_level": "MEDIUM",
    "subject": "History",
    "tags": "china, great wall, mongols, ancient history",
    "is_active": true
  }'

# Question 19 - Science
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the hardest natural substance on Earth?",
    "option_a": "Gold",
    "option_b": "Iron",
    "option_c": "Diamond",
    "option_d": "Platinum",
    "correct_option": "C",
    "explanation_question": "Hardness is measured by resistance to scratching and deformation.",
    "explanation_a": "Gold is a soft metal, not hard.",
    "explanation_b": "Iron is hard but not the hardest natural substance.",
    "explanation_c": "Diamond is correct. It has a hardness of 10 on the Mohs scale.",
    "explanation_d": "Platinum is hard but not as hard as diamond.",
    "difficulty_level": "EASY",
    "subject": "Geology",
    "tags": "minerals, hardness, diamond, geology",
    "is_active": true
  }'

# Question 20 - Mathematics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is 25% of 200?",
    "option_a": "25",
    "option_b": "50",
    "option_c": "75",
    "option_d": "100",
    "correct_option": "B",
    "explanation_question": "Percentage calculations involve finding a fraction of a number.",
    "explanation_a": "25 is too small. 25% of 200 is 50.",
    "explanation_b": "50 is correct. 25% of 200 = 0.25 × 200 = 50.",
    "explanation_c": "75 is too large. 25% of 200 is 50.",
    "explanation_d": "100 would be 50% of 200, not 25%.",
    "difficulty_level": "MEDIUM",
    "subject": "Mathematics",
    "tags": "percentages, arithmetic, basic math",
    "is_active": true
  }'

# Question 21 - Geography
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "Which country has the most time zones?",
    "option_a": "Russia",
    "option_b": "United States",
    "option_c": "China",
    "option_d": "Canada",
    "correct_option": "A",
    "explanation_question": "Time zones are based on longitudinal divisions of the Earth.",
    "explanation_a": "Russia is correct. It spans 11 time zones from east to west.",
    "explanation_b": "United States has 6 time zones, fewer than Russia.",
    "explanation_c": "China uses only 1 time zone despite its size.",
    "explanation_d": "Canada has 6 time zones, fewer than Russia.",
    "difficulty_level": "HARD",
    "subject": "Geography",
    "tags": "time zones, russia, geography, world geography",
    "is_active": true
  }'

# Question 22 - Science
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the pH of pure water?",
    "option_a": "6",
    "option_b": "7",
    "option_c": "8",
    "option_d": "9",
    "correct_option": "B",
    "explanation_question": "pH measures the acidity or alkalinity of a solution.",
    "explanation_a": "6 is acidic, not neutral like pure water.",
    "explanation_b": "7 is correct. Pure water has a neutral pH of 7.",
    "explanation_c": "8 is basic, not neutral like pure water.",
    "explanation_d": "9 is basic, not neutral like pure water.",
    "difficulty_level": "MEDIUM",
    "subject": "Chemistry",
    "tags": "chemistry, pH, water, acids and bases",
    "is_active": true
  }'

# Question 23 - Literature
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "Who wrote the play \"Romeo and Juliet\"?",
    "option_a": "Christopher Marlowe",
    "option_b": "William Shakespeare",
    "option_c": "Ben Jonson",
    "option_d": "John Webster",
    "correct_option": "B",
    "explanation_question": "Romeo and Juliet is one of the most famous tragic plays in English literature.",
    "explanation_a": "Christopher Marlowe was a contemporary but did not write Romeo and Juliet.",
    "explanation_b": "William Shakespeare is correct. He wrote Romeo and Juliet around 1595.",
    "explanation_c": "Ben Jonson was a playwright but did not write Romeo and Juliet.",
    "explanation_d": "John Webster wrote other tragedies but not Romeo and Juliet.",
    "difficulty_level": "EASY",
    "subject": "Literature",
    "tags": "shakespeare, literature, plays, romeo and juliet",
    "is_active": true
  }'

# Question 24 - Mathematics
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "What is the area of a rectangle with length 8 and width 5?",
    "option_a": "13",
    "option_b": "26",
    "option_c": "40",
    "option_d": "80",
    "correct_option": "C",
    "explanation_question": "The area of a rectangle is calculated by multiplying length by width.",
    "explanation_a": "13 is the perimeter (8+5), not the area.",
    "explanation_b": "26 is twice the perimeter, not the area.",
    "explanation_c": "40 is correct. Area = length × width = 8 × 5 = 40.",
    "explanation_d": "80 is double the correct area.",
    "difficulty_level": "EASY",
    "subject": "Mathematics",
    "tags": "geometry, area, rectangle, basic math",
    "is_active": true
  }'

# Question 25 - Science
curl -X POST http://localhost:8000/api/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "question": "How many chambers does a human heart have?",
    "option_a": "2",
    "option_b": "3",
    "option_c": "4",
    "option_d": "5",
    "correct_option": "C",
    "explanation_question": "The human heart is a muscular organ that pumps blood throughout the body.",
    "explanation_a": "2 chambers is too few for a human heart.",
    "explanation_b": "3 chambers is found in some animals but not humans.",
    "explanation_c": "4 is correct. The human heart has 4 chambers: 2 atria and 2 ventricles.",
    "explanation_d": "5 chambers is too many for a human heart.",
    "difficulty_level": "EASY",
    "subject": "Biology",
    "tags": "human anatomy, heart, biology, circulatory system",
    "is_active": true
  }'

echo ""
echo "All 25 questions have been added to the database!"
echo "Questions cover various subjects: Geography, Mathematics, Science, History, Literature, Physics, Chemistry, Biology, Astronomy, and Geology"
echo "Difficulty levels: EASY, MEDIUM, and HARD"