import { generateProceduralQuestions, PHASE1_QUESTIONS } from './src/data/mbtiQuizData.js';

const activeQuestions = [...PHASE1_QUESTIONS];
// Mock Phase 2 & 3 questions (each has 4 questions, making a total of 12 questions)
for (let i = 1; i <= 8; i++) {
  activeQuestions.push({
    id: `mock_phase_2_3_${i}`,
    scenario: `Mock Scenario ${i}`,
    options: [{ id: 'A', text: 'Opt' }]
  });
}

console.log("Current active questions count:", activeQuestions.length);

const generated = generateProceduralQuestions(12, 25, "Ni_vs_Si", "Ti_vs_Fi", ["Se_Inferior_or_Blind"], activeQuestions);
const allQuestions = [...activeQuestions, ...generated];

console.log("\n--- Generated Questions 13 to 25 ---");
generated.forEach((q, i) => {
  console.log(`Q${i + 13} (index ${i + 12}): ID: ${q.id}, Scenario: ${q.scenario}`);
});

console.log("\n--- Checking for duplicates in the entire 25 questions ---");
const seenScenarios = new Set();
let duplicatesFound = 0;
allQuestions.forEach((q, idx) => {
  if (seenScenarios.has(q.scenario)) {
    console.log(`DUPLICATE FOUND at Q${idx+1}: "${q.scenario}"`);
    duplicatesFound++;
  }
  seenScenarios.add(q.scenario);
});

if (duplicatesFound === 0) {
  console.log("No duplicates found in the 25-question run simulation.");
}
