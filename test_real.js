import { 
  PERSONALITY_TYPES,
  generateProceduralQuestions,
  getDynamicPhase1Questions,
  getDynamicPhase2Questions,
  getDynamicPhase3Questions
} from './src/data/mbtiQuizData.js';

// 1. Start with Phase 1
let activeQuestions = getDynamicPhase1Questions();
const answers = {};

// Mock answers for Phase 1
activeQuestions.forEach(q => {
  answers[q.id] = [q.options[0].id];
});

// Helper: Calculate intermediate function scores (same logic as App.jsx)
const computeIntermediateScores = (currentQuestions, currentAnswers) => {
  const scores = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
  currentQuestions.forEach(q => {
    const selectedOptionIds = currentAnswers[q.id] || [];
    selectedOptionIds.forEach(optId => {
      const option = q.options.find(o => o.id === optId);
      if (option && option.weights) {
        Object.keys(option.weights).forEach(func => {
          scores[func] += option.weights[func];
        });
      }
    });
  });
  return scores;
};

// 2. Simulate Phase 2 Generation
const currentScores = computeIntermediateScores(activeQuestions, answers);
const axesConflicts = [
  { axis: "Ni_vs_Si", diff: Math.abs(currentScores.Ni - currentScores.Si) },
  { axis: "Ti_vs_Fi", diff: Math.abs(currentScores.Ti - currentScores.Fi) },
  { axis: "Te_vs_Fe", diff: Math.abs(currentScores.Te - currentScores.Fe) },
  { axis: "Ne_vs_Se", diff: Math.abs(currentScores.Ne - currentScores.Se) }
];
axesConflicts.sort((a, b) => a.diff - b.diff);
const conflictedAxis1 = axesConflicts[0].axis;
const conflictedAxis2 = axesConflicts[1].axis;

const criticConflicts = [
  { axis: "Ti_vs_Te", diff: Math.abs(currentScores.Ti - currentScores.Te) },
  { axis: "Fi_vs_Fe", diff: Math.abs(currentScores.Fi - currentScores.Fe) },
  { axis: "Ni_vs_Ne", diff: Math.abs(currentScores.Ni - currentScores.Ne) },
  { axis: "Si_vs_Se", diff: Math.abs(currentScores.Si - currentScores.Se) }
];
criticConflicts.sort((a, b) => a.diff - b.diff);
const conflictedCriticAxis = criticConflicts[0].axis;

const p2Selected = getDynamicPhase2Questions(activeQuestions, conflictedAxis1, conflictedAxis2, conflictedCriticAxis);
activeQuestions = [...activeQuestions.slice(0, 4), ...p2Selected];

// Mock answers for Phase 2
activeQuestions.forEach(q => {
  if (!answers[q.id]) {
    answers[q.id] = [q.options[0].id];
  }
});

// 3. Simulate Phase 3 Generation
const tempScores = computeIntermediateScores(activeQuestions, answers);
const tempFits = [];
Object.keys(PERSONALITY_TYPES).forEach(typeKey => {
  const typeConfig = PERSONALITY_TYPES[typeKey];
  let fitScore = 0;
  Object.keys(typeConfig.weights).forEach(func => {
    fitScore += (tempScores[func] || 0) * typeConfig.weights[func];
  });
  tempFits.push({ type: typeKey, fitScore, ...typeConfig });
});
tempFits.sort((a, b) => b.fitScore - a.fitScore);
const leadingType1 = tempFits[0];

const shadowTargets = [];
if (leadingType1.type === "INTJ" || leadingType1.type === "INFJ") {
  shadowTargets.push("Se_Inferior_or_Blind", "Fe_Inferior_or_Blind");
} else if (leadingType1.type === "ISTJ" || leadingType1.type === "ISFJ") {
  shadowTargets.push("Ne_Inferior_or_Blind", "Fe_Inferior_or_Blind");
} else if (leadingType1.type === "INFP" || leadingType1.type === "ISFP") {
  shadowTargets.push("Te_Inferior_or_Blind", "Si_Inferior_or_Blind");
} else if (leadingType1.type === "ENTJ" || leadingType1.type === "ESTJ") {
  shadowTargets.push("Fi_Inferior_or_Blind", "Fe_Inferior_or_Blind");
} else if (leadingType1.type === "ENTP" || leadingType1.type === "ENFP") {
  shadowTargets.push("Si_Inferior_or_Blind", "Fi_Inferior_or_Blind");
} else if (leadingType1.type === "INTP" || leadingType1.type === "ISTP") {
  shadowTargets.push("Fe_Inferior_or_Blind", "Si_Inferior_or_Blind");
} else {
  shadowTargets.push("Ni_Inferior_or_Blind", "Ti_Inferior_or_Blind");
}

const p3Selected = getDynamicPhase3Questions(activeQuestions, shadowTargets);
activeQuestions = [...activeQuestions.slice(0, 9), ...p3Selected];

// Mock answers for Phase 3
activeQuestions.forEach(q => {
  if (!answers[q.id]) {
    answers[q.id] = [q.options[0].id];
  }
});

// 4. Generate first 25 questions
let targetLength = 25;
const moreQs = generateProceduralQuestions(13, targetLength, conflictedAxis1, conflictedAxis2, shadowTargets, activeQuestions);
activeQuestions = [...activeQuestions, ...moreQs];

// Mock answers for Phase 4 (12 to 24)
activeQuestions.forEach(q => {
  if (!answers[q.id]) {
    answers[q.id] = [q.options[0].id];
  }
});

console.log("Answers length:", Object.keys(answers).length);
console.log("Questions length:", activeQuestions.length);
activeQuestions.forEach((q, idx) => {
  console.log(`Q${idx + 1} (id: ${q.id}, phase: ${q.phase}): "${q.scenario.substring(0, 40)}" - ${q.options ? q.options.length : 0} options`);
});

// 5. Try running the calculateFinalResults equivalent logic to see if it throws any errors
try {
  const userRawScores = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
  const maxPossibleScores = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
  let econCoord = 0;
  let authCoord = 0;

  activeQuestions.forEach(q => {
    if (q.type === 'open') {
      const textArray = answers[q.id] || [];
      const text = textArray[0] || "";
      if (text.trim().length >= 15) {
        // Mock open answers text logic
      }
      return;
    }

    const tempMax = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    q.options.forEach(opt => {
      if (opt.weights) {
        Object.keys(opt.weights).forEach(func => {
          if (opt.weights[func] > tempMax[func]) {
            tempMax[func] = opt.weights[func];
          }
        });
      }
    });

    Object.keys(tempMax).forEach(func => {
      maxPossibleScores[func] += tempMax[func];
    });

    const selectedOptionIds = answers[q.id] || [];
    selectedOptionIds.forEach(optId => {
      const option = q.options.find(o => o.id === optId);
      if (option) {
        if (option.weights) {
          Object.keys(option.weights).forEach(func => {
            userRawScores[func] += option.weights[func];
          });
        }
        if (option.political) {
          econCoord += option.political.econ || 0;
          authCoord += option.political.auth || 0;
        }
      }
    });
  });

  const normalizedScores = {};
  Object.keys(userRawScores).forEach(func => {
    const maxVal = maxPossibleScores[func] || 1;
    normalizedScores[func] = Math.min(100, Math.round((userRawScores[func] / maxVal) * 100));
  });

  const typeFits = [];
  Object.keys(PERSONALITY_TYPES).forEach(typeKey => {
    const typeConfig = PERSONALITY_TYPES[typeKey];
    let fitScore = 0;
    Object.keys(typeConfig.weights).forEach(func => {
      fitScore += (normalizedScores[func] || 0) * typeConfig.weights[func];
    });
    typeFits.push({
      type: typeKey,
      fitScore: Math.round(fitScore * 10) / 10,
      ...typeConfig
    });
  });

  typeFits.sort((a, b) => b.fitScore - a.fitScore);
  const primaryMatch = typeFits[0];

  console.log("Calculation succeeded! Primary match is:", primaryMatch.type, primaryMatch.title);
} catch (err) {
  console.error("Error occurred during calculation:", err);
}
