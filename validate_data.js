import { PHASE1_QUESTIONS, PHASE2_ADAPTIVE_POOL, PHASE3_SHADOW_POOL, POLITICAL_TEMPLATES } from './src/data/mbtiQuizData.js';

console.log("Checking PHASE1_QUESTIONS...");
PHASE1_QUESTIONS.forEach((q, idx) => {
  console.log(`Q${idx+1} (${q.id}): ${q.options.length} options, type: ${q.type}`);
});

console.log("\nChecking PHASE2_ADAPTIVE_POOL...");
PHASE2_ADAPTIVE_POOL.forEach((q) => {
  console.log(`Q_${q.id}: ${q.options.length} options, type: ${q.type}`);
});

console.log("\nChecking PHASE3_SHADOW_POOL...");
PHASE3_SHADOW_POOL.forEach((q) => {
  console.log(`Q_${q.id}: ${q.options.length} options, type: ${q.type}`);
});

console.log("\nChecking POLITICAL_TEMPLATES...");
POLITICAL_TEMPLATES.forEach((q) => {
  console.log(`Q_${q.id}: ${q.options.length} options`);
});
