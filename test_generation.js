import { generateProceduralQuestions, PHASE1_QUESTIONS } from './src/data/mbtiQuizData.js';

const activeQuestions = [...PHASE1_QUESTIONS];
// Mock Phase 2 & 3 questions (Phase 2 has 5, Phase 3 has 4, making a total of 13 questions including Phase 1)
for (let i = 1; i <= 9; i++) {
  activeQuestions.push({
    id: `mock_phase_2_3_${i}`,
    scenario: `Mock Scenario ${i}`,
    options: [{ id: 'A', text: 'Opt' }]
  });
}

console.log("Current active questions count:", activeQuestions.length);

const generated = generateProceduralQuestions(13, 25, "Ni_vs_Si", "Ti_vs_Fi", ["Se_Inferior_or_Blind"], activeQuestions);
const allQuestions = [...activeQuestions, ...generated];

console.log("\n--- Generated Questions 14 to 25 ---");
generated.forEach((q, i) => {
  console.log(`Q${i + 14} (index ${i + 13}): ID: ${q.id}, Scenario: ${q.scenario}`);
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
