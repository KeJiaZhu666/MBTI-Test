import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  TrendingUp, 
  Info, 
  CheckCircle2,
  Users,
  Scale,
  BarChart2
} from 'lucide-react';
import { 
  QUADRAS_INFO, 
  PERSONALITY_TYPES, 
  COGNITIVE_FUNCTIONS_INFO,
  ENNEAGRAM_INFO,
  generateProceduralQuestions,
  parseOpenEndedAnswer,
  getDynamicPhase1Questions,
  getDynamicPhase2Questions,
  getDynamicPhase3Questions
} from './data/mbtiQuizData';


// 64-Type Suffix Information (A/O, H/C)
const SUFFIX_64_INFO = {
  AH: {
    name: "行动温情型 (Assertive & Warm)",
    tag: "AH",
    tagline: "具有强大推进力的温情推动者",
    description: "您对人际生态充满真诚与温暖，同时行动雷厉风行，兼具极强的现实执行力与社交感召力。在解决冲突或面对挑战时，您展现出敢于拍板、坚决果断的一面，但内心绝不放弃维持人伦情感的温度与道德自省。您通常敢作敢当，是深受群体信赖、具有人情温度的行动领袖。",
    shadowDescription: "在高压崩溃、算力死机或遭遇重大信任背叛时，您平日里的温和可能骤然退潮，转而进入极端冷酷、计算人际利弊的防卫反噬状态，或者用严苛的逻辑对他人施加窒息性控制（如劣势功能 Grip 暴走），事后又容易陷入深刻的自责内耗。"
  },
  AC: {
    name: "行动理智型 (Assertive & Rational)",
    tag: "AC",
    tagline: "铁血理智的现实执行官",
    description: "您行事雷厉风行，个人边界极其清晰，凡事以结果、客观程序与利弊自洽为导向。您奉行冷静而冷峻的利弊账本，拒绝廉价的情感抚慰、和稀泥和社交套客套。在竞争或逆境中，您像一架极度理性、意志钢铁般坚硬的高效推土机，迅速破局，用硬核数据与客观战绩说话。",
    shadowDescription: "当由于长期超负荷运转、遭遇系统性死局或陷入严重的情感废墟时，您极其容易爆发强烈的躯体化焦虑或疑病症（Si grip 疑病），或者通过极端、强迫性的感官透支（Se grip 暴饮暴食、彻夜狂欢）来麻痹神经。此时的您显得冷酷、暴躁、抗拒一切温情沟通。"
  },
  OH: {
    name: "深思温情型 (Reflective & Warm)",
    tag: "OH",
    tagline: "温柔内省的思想守护者",
    description: "您内心极其敏感细腻，追求灵魂深处的本真与道德真实，做事沉稳反思，富有浓厚的温和人文主义精神。您极不愿流俗，对粗暴的权力压迫与尖锐冲突感到本能嫌恶。在做决定时，您极其审慎，需要在脑海中反复评估其长远价值与是否违背内心道德，追求润物细无声的和谐共振。",
    shadowDescription: "由于您平时高度克己、极力消解人际张力，一旦外界压力击穿了您的最后一层防线，您可能会陷入极具破坏性的情绪火山喷射中（Te grip 爆裂）。您会突然展现出前所未有的暴躁、冷血与刻薄，用极度刺耳、条理清晰的尖锐事实将挑衅者撕得粉碎。"
  },
  OC: {
    name: "深思理智型 (Reflective & Rational)",
    tag: "OC",
    tagline: "冷峻精密的深潜思想家",
    description: "您极度追求逻辑的极致纯度、定义的极端精准与系统底层原理的自洽，散发着冷静高冷、遗世独立的极客气场。您习惯在后台默默耕耘，进行极为漫长、多维、深层的概念推演。您拉起极高的防卫红线，冷眼旁观世俗的人情拉扯与观念纷争，宁可陷入虚无与孤独，也绝不在原则上妥协半分。",
    shadowDescription: "当外界的强行应酬、非理性的无理要求或杂乱无章的杂务彻底压垮您的心智时，您会瞬间触发“冷眼断联”机制（Fe blind 情感黑洞），切断与外界的物理及精神连接，扮演彻底的虚无隐形人，甚至在神经高度紧张下在大脑里做出一系列灾难化毁灭预言。"
  }
};

export default function App() {
  const [screen, setScreen] = useState('welcome'); // 'welcome' | 'quiz' | 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // activeQuestions starts with Phase 1 (4 questions)
  const [activeQuestions, setActiveQuestions] = useState(() => getDynamicPhase1Questions());
  
  // Store selected option IDs for each question. Format: answers[questionId] = ['A'] or ['typed text'] for open questions
  const [answers, setAnswers] = useState({});
  
  // Results calculation state
  const [results, setResults] = useState(null);
  
  // Hovered or selected cognitive function for details display
  const [selectedFunc, setSelectedFunc] = useState('Ni');

  // Interactive feedback log during the quiz (simulates conversational feedback)
  const [interrogationFeedbacks, setInterrogationFeedbacks] = useState([
    "🔬 心智探测模块已就绪，正在准备捕捉第一层级基本倾向..."
  ]);

  // Milestone levels: 25 -> 50 -> 100 -> 150
  const [targetLength, setTargetLength] = useState(25);

  // States to persist adaptive parameters determined in Phase 2 & 3
  const [axesState, setAxesState] = useState({ axis1: "Ni_vs_Si", axis2: "Ti_vs_Fi" });
  const [shadowState, setShadowState] = useState([]);

  const startTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setActiveQuestions(getDynamicPhase1Questions());
    setTargetLength(25);
    setAxesState({ axis1: "Ni_vs_Si", axis2: "Ti_vs_Fi" });
    setShadowState([]);
    setInterrogationFeedbacks(["🔬 实验室已启动：请根据您在日常高频生活场景中的本能反应进行选择。"]);
    setScreen('quiz');
  };

  const handleContinueTesting = () => {
    const nextTarget = targetLength === 25 ? 50 : targetLength === 50 ? 100 : 150;
    setTargetLength(nextTarget);
    
    // Generate more questions from current targetLength to nextTarget
    const moreQs = generateProceduralQuestions(targetLength, nextTarget, axesState.axis1, axesState.axis2, shadowState, activeQuestions);
    const updatedQs = [...activeQuestions, ...moreQs];
    setActiveQuestions(updatedQs);
    
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleContinueFromResults = () => {
    const nextTarget = targetLength === 25 ? 50 : targetLength === 50 ? 100 : 150;
    setTargetLength(nextTarget);
    
    // Generate more questions from current targetLength to nextTarget
    const moreQs = generateProceduralQuestions(targetLength, nextTarget, axesState.axis1, axesState.axis2, shadowState, activeQuestions);
    const updatedQs = [...activeQuestions, ...moreQs];
    setActiveQuestions(updatedQs);
    
    // Set index to the start of the newly added questions
    setCurrentQuestionIndex(targetLength);
    setScreen('quiz');
  };


  // Check if current question's answers are valid (at least 1 option selected, or >= 15 chars for open questions)
  const isQuestionAnswered = (question) => {
    if (!question) return false;
    const qAnswers = answers[question.id] || [];
    if (question.type === 'open') {
      return qAnswers.length > 0 && qAnswers[0] && qAnswers[0].trim().length >= 15;
    }
    return qAnswers.length > 0;
  };


  // Toggle option selection (handles single-select and multi-select)
  const handleOptionToggle = (question, optionId) => {
    const currentSelections = answers[question.id] || [];
    let updatedSelections = [];

    if (question.type === 'single' || question.type === 'judgment') {
      updatedSelections = [optionId];
    } else {
      // multi-select: allow selecting up to 2 options
      if (currentSelections.includes(optionId)) {
        updatedSelections = currentSelections.filter(id => id !== optionId);
      } else {
        if (currentSelections.length < 2) {
          updatedSelections = [...currentSelections, optionId];
        } else {
          updatedSelections = [currentSelections[1], optionId];
        }
      }
    }

    setAnswers({
      ...answers,
      [question.id]: updatedSelections
    });
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const nextQuestion = () => {
    const currentQuestion = activeQuestions[currentQuestionIndex];
    
    if (!isQuestionAnswered(currentQuestion)) {
      alert("请根据探测情境完成选择或自陈后再继续进行！");
      return;
    }

    let hasTransitioned = false;

    // Trigger Adaptive Transitions
    if (currentQuestionIndex === 3) {
      // Phase 1 finished! Generate Phase 2 (Adaptive Probing + Political Spectrum)
      generatePhase2Questions();
      hasTransitioned = true;
    } else if (currentQuestionIndex === 7) {
      // Phase 2 finished! Generate Phase 3 (Shadow & Stress Probing)
      generatePhase3Questions();
      hasTransitioned = true;
    } else if (currentQuestionIndex === 11) {
      // Phase 3 finished! Dynamically append procedural questions to reach targetLength (initially 25)
      if (activeQuestions.length === 12) {
        const moreQs = generateProceduralQuestions(12, targetLength, axesState.axis1, axesState.axis2, shadowState, activeQuestions);
        setActiveQuestions([...activeQuestions, ...moreQs]);
      }
      hasTransitioned = true;
    }

    if (hasTransitioned) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Reached the end of current active questions!
      if (currentQuestionIndex === targetLength - 1) {
        if (targetLength >= 150) {
          calculateFinalResults();
        }
      } else {
        calculateFinalResults();
      }
    }
  };


  // Calculate intermediate function scores for adaptive selection
  const computeIntermediateScores = (currentAnswers) => {
    const scores = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    
    activeQuestions.forEach((q, idx) => {
      if (idx > currentQuestionIndex) return; // only score answered questions
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

  // Generate Phase 2 (Adaptive Probing - 4 questions) dynamically based on Phase 1 scores
  const generatePhase2Questions = () => {
    const currentScores = computeIntermediateScores(answers);
    
    // Find the closest (most conflicted) axes
    const axesConflicts = [
      { axis: "Ni_vs_Si", diff: Math.abs(currentScores.Ni - currentScores.Si) },
      { axis: "Ti_vs_Fi", diff: Math.abs(currentScores.Ti - currentScores.Fi) },
      { axis: "Te_vs_Fe", diff: Math.abs(currentScores.Te - currentScores.Fe) },
      { axis: "Ne_vs_Se", diff: Math.abs(currentScores.Ne - currentScores.Se) }
    ];

    // Sort by diff ascending (lower difference means higher tension/conflict!)
    axesConflicts.sort((a, b) => a.diff - b.diff);

    // Pick top 2 most conflicted axes
    const conflictedAxis1 = axesConflicts[0].axis;
    const conflictedAxis2 = axesConflicts[1].axis;
    setAxesState({ axis1: conflictedAxis1, axis2: conflictedAxis2 });

    const p2Selected = getDynamicPhase2Questions(activeQuestions, conflictedAxis1, conflictedAxis2);

    // Append to active questions
    const updatedQuestions = [...activeQuestions.slice(0, 4), ...p2Selected];
    setActiveQuestions(updatedQuestions);

    const axisChMap = {
      Ni_vs_Si: "内倾直觉(Ni) 与 内倾感觉(Si) 的经验虚实纠缠",
      Ti_vs_Fi: "内倾思考(Ti) 与 内倾情感(Fi) 的理性/良知深度博弈",
      Te_vs_Fe: "外倾思考(Te) 与 外倾情感(Fe) 的团队效能人情撕扯",
      Ne_vs_Se: "外倾直觉(Ne) 与 外倾感觉(Se) 的世界可能/感官边界"
    };

    setInterrogationFeedbacks([
      ...interrogationFeedbacks,
      `🔍 核心倾向锁定。系统检测到您在【${axisChMap[conflictedAxis1]}】与【${axisChMap[conflictedAxis2]}】上展现出高度的心智摇摆。`,
      `🧬 已经动态调取了自适应辩论式试题与社会/政治倾向探针，正在为您层层拆解认知面具，切入第二深度阶段...`
    ]);
  };

  // Generate Phase 3 (Shadow & Stress Probing - 4 questions) dynamically based on Phase 2 results
  const generatePhase3Questions = () => {
    const tempScores = computeIntermediateScores(answers);

    // Fit temporary scores to find top personality fits
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
    const leadingType2 = tempFits[1];

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

    const updatedQuestions = [...activeQuestions.slice(0, 8), ...p3Selected];
    setActiveQuestions(updatedQuestions);
    setShadowState(shadowTargets);

    setInterrogationFeedbacks([
      ...interrogationFeedbacks,
      `🎯 第二阶段探针合围。您目前的心智特征逼近【${leadingType1.type} — ${leadingType1.title}】与【${leadingType2.type} — ${leadingType2.title}】。`,
      `🧠 系统已装载劣势与阴影盲区应激探针。我们将通过高压下的“失控变态反应”彻底还原您的底层内核，排除假性暗示！进入核心深潜...`
    ]);
  };

  // Algorithm for computing MBTI results based on Beebe 8-function weighting + 64-subtype (A/O, H/C) + Enneagram + Political Spectrum
  // Algorithm for computing MBTI results based on Beebe 8-function weighting + 64-subtype (A/O, H/C) + Enneagram + Political Spectrum
  const calculateFinalResults = () => {
    const userRawScores = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    const maxPossibleScores = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    let econCoord = 0;
    let authCoord = 0;
    let politicalInputsCount = 0;
    const openAnswersText = [];

    activeQuestions.forEach(q => {
      if (q.type === 'open') {
        const textArray = answers[q.id] || [];
        const text = textArray[0] || "";
        if (text.trim().length >= 15) {
          const parsed = parseOpenEndedAnswer(text);
          Object.keys(parsed.weights).forEach(func => {
            userRawScores[func] += parsed.weights[func];
            maxPossibleScores[func] += Math.max(parsed.weights[func], 15);
          });
          if (parsed.political.econ !== 0 || parsed.political.auth !== 0) {
            econCoord += parsed.political.econ;
            authCoord += parsed.political.auth;
            politicalInputsCount++;
          }

          openAnswersText.push({
            id: q.id,
            scenario: q.scenario,
            text: text,
            matchedKeywords: parsed.matchedKeywords
          });
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
            politicalInputsCount++;
          }
        }
      });
    });

    const normalizedScores = {};
    Object.keys(userRawScores).forEach(func => {
      const maxVal = maxPossibleScores[func] || 1;
      normalizedScores[func] = Math.min(100, Math.round((userRawScores[func] / maxVal) * 100));
    });

    // Fit scores against standard weights matrix
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
    const secondaryMatch = typeFits[1];

    // Calculate Socionics Quadra Scores
    const quadraScores = {
      alpha: Math.round(((normalizedScores.Ne + normalizedScores.Si + normalizedScores.Fe + normalizedScores.Ti) / 400) * 100),
      beta: Math.round(((normalizedScores.Ni + normalizedScores.Se + normalizedScores.Fe + normalizedScores.Ti) / 400) * 100),
      gamma: Math.round(((normalizedScores.Ni + normalizedScores.Se + normalizedScores.Te + normalizedScores.Fi) / 400) * 100),
      delta: Math.round(((normalizedScores.Ne + normalizedScores.Si + normalizedScores.Te + normalizedScores.Fi) / 400) * 100)
    };
    const leadingQuadra = Object.keys(quadraScores).reduce((a, b) => quadraScores[a] > quadraScores[b] ? a : b);

    // --- 64-Type Suffix Calculations (A/O, H/C) ---
    // A (Assertive) vs O (Overthinking)
    const scoreA = normalizedScores.Te * 0.4 + normalizedScores.Se * 0.3 + normalizedScores.Ni * 0.3;
    const scoreO = normalizedScores.Ti * 0.4 + normalizedScores.Si * 0.3 + normalizedScores.Ne * 0.3;
    const suffix1 = scoreA >= scoreO ? 'A' : 'O';

    // H (Hospitable) vs C (Chilly)
    const scoreH = normalizedScores.Fe + normalizedScores.Fi;
    const scoreC = normalizedScores.Te + normalizedScores.Ti;
    const suffix2 = scoreH >= scoreC ? 'H' : 'C';

    const full64Code = `${primaryMatch.type}-${suffix1}${suffix2}`;

    // --- Enneagram Calculations ---
    const enneagramScores = {
      1: Math.round(normalizedScores.Ti * 0.5 + normalizedScores.Si * 0.5),
      2: Math.round(normalizedScores.Fe * 0.7 + normalizedScores.Fi * 0.3),
      3: Math.round(normalizedScores.Te * 0.6 + normalizedScores.Se * 0.4),
      4: Math.round(normalizedScores.Fi * 0.7 + normalizedScores.Ne * 0.3),
      5: Math.round(normalizedScores.Ti * 0.6 + normalizedScores.Ni * 0.4),
      6: Math.round(normalizedScores.Si * 0.6 + normalizedScores.Fe * 0.4),
      7: Math.round(normalizedScores.Ne * 0.7 + normalizedScores.Se * 0.3),
      8: Math.round(normalizedScores.Te * 0.5 + normalizedScores.Se * 0.5),
      9: Math.round(normalizedScores.Fi * 0.5 + normalizedScores.Fe * 0.5)
    };

    let primaryEnneatype = "5";
    let maxEnneaScore = -1;
    Object.keys(enneagramScores).forEach(type => {
      if (enneagramScores[type] > maxEnneaScore) {
        maxEnneaScore = enneagramScores[type];
        primaryEnneatype = type;
      }
    });

    // --- 2D Political Spectrum Calculations ---
    // Note: Coordinates from all closed-ended political questions (including Phase 2 and all Phase 4 procedural questions) 
    // are now automatically and elegantly accumulated in the main activeQuestions scoring loop above.
    // This supports multi-stage test scaling (25, 50, 100, 150 questions) without double-counting.

    if (politicalInputsCount > 0) {
      econCoord = Math.round(econCoord / politicalInputsCount);
      authCoord = Math.round(authCoord / politicalInputsCount);
    }

    // Psychological modulation based on Beebe function scores
    // Fe & Si (traditional & conforming) -> shift auth down (Authoritarian/Order-oriented), econ down (welfare/collective)
    // Fi & Ti (individualistic & critical) -> shift auth up (Libertarian/Skeptical), econ up (market competition/efficiency)
    const psyAuthMod = ((normalizedScores.Fi + normalizedScores.Ti) - (normalizedScores.Fe + normalizedScores.Si)) * 0.15;
    const psyEconMod = ((normalizedScores.Te + normalizedScores.Se) - (normalizedScores.Fe + normalizedScores.Fi)) * 0.1;
    
    authCoord += Math.round(psyAuthMod);
    econCoord += Math.round(psyEconMod);

    // Clamp coordinates to [-50, 50]
    econCoord = Math.max(-50, Math.min(50, econCoord));
    authCoord = Math.max(-50, Math.min(50, authCoord));

    setResults({
      primary: primaryMatch,
      secondary: secondaryMatch,
      scores: normalizedScores,
      allFits: typeFits.slice(0, 4),
      quadraScores,
      leadingQuadra,
      
      // 64-Type Suffix parameters
      full64Code,
      suffix1,
      suffix2,
      scoreA: Math.round(scoreA),
      scoreO: Math.round(scoreO),
      scoreH: Math.round(scoreH),
      scoreC: Math.round(scoreC),

      // Enneagram parameters
      primaryEnneatype,
      enneagramScores,

      // Political Spectrum parameters
      econCoord,
      authCoord,

      // Open question Qualitative texts
      openAnswersText
    });

    setSelectedFunc(primaryMatch.stack[0]);
    setScreen('result');
  };

  // SVG Radar Chart Math calculations (Fully native interactive element)
  const renderRadarChart = (scores) => {
    const size = 320;
    const center = size / 2;
    const radius = 95;
    const functionsList = ['Ni', 'Te', 'Fi', 'Se', 'Ne', 'Ti', 'Fe', 'Si'];
    
    const getCoordinates = (index, value) => {
      const angle = (index * 2 * Math.PI) / 8 - Math.PI / 2;
      const r = (value / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };

    const grids = [0.25, 0.5, 0.75, 1.0].map((level, i) => {
      const points = functionsList.map((_, idx) => {
        const coords = getCoordinates(idx, level * 100);
        return `${coords.x},${coords.y}`;
      }).join(' ');
      return (
        <polygon 
          key={i} 
          points={points} 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.05)" 
          strokeWidth="1" 
        />
      );
    });

    const axesLines = functionsList.map((_, idx) => {
      const endCoords = getCoordinates(idx, 100);
      return (
        <line 
          key={idx} 
          x1={center} 
          y1={center} 
          x2={endCoords.x} 
          y2={endCoords.y} 
          stroke="rgba(255, 255, 255, 0.06)" 
          strokeWidth="1" 
        />
      );
    });

    const scorePoints = functionsList.map((func, idx) => {
      const score = scores[func] || 0;
      const coords = getCoordinates(idx, score);
      return `${coords.x},${coords.y}`;
    }).join(' ');

    const dots = functionsList.map((func, idx) => {
      const score = scores[func] || 0;
      const coords = getCoordinates(idx, score);
      const isFocused = selectedFunc === func;
      return (
        <g key={idx} cursor="pointer" onClick={() => setSelectedFunc(func)}>
          <circle 
            cx={coords.x} 
            cy={coords.y} 
            r={isFocused ? "7" : "5"} 
            fill={isFocused ? "var(--color-accent)" : "var(--color-primary)"} 
            stroke="#ffffff" 
            strokeWidth="1.5"
            style={{ transition: 'all 0.3s' }}
          />
          <circle 
            cx={coords.x} 
            cy={coords.y} 
            r={isFocused ? "15" : "10"} 
            fill={isFocused ? "rgba(34, 211, 238, 0.2)" : "rgba(129, 140, 248, 0.1)"} 
            style={{ transition: 'all 0.3s' }}
          />
        </g>
      );
    });

    const labels = functionsList.map((func, idx) => {
      const angle = (idx * 2 * Math.PI) / 8 - Math.PI / 2;
      const score = scores[func] || 0;
      const labelRadius = radius + 25; 
      const x = center + labelRadius * Math.cos(angle);
      const y = center + labelRadius * Math.sin(angle) + 4;
      
      const isFocused = selectedFunc === func;
      const funcNameCh = func === 'Ni' ? '内倾直觉' :
                         func === 'Ne' ? '外倾直觉' :
                         func === 'Si' ? '内倾感觉' :
                         func === 'Se' ? '外倾感觉' :
                         func === 'Ti' ? '内倾思考' :
                         func === 'Te' ? '外倾思考' :
                         func === 'Fi' ? '内倾情感' : '外倾情感';

      return (
        <g key={idx} cursor="pointer" onClick={() => setSelectedFunc(func)}>
          <text 
            x={x} 
            y={y - 8} 
            textAnchor="middle" 
            fill={isFocused ? "var(--color-accent)" : "#ffffff"} 
            fontSize="12" 
            fontWeight={isFocused ? "700" : "600"}
            style={{ transition: 'all 0.3s', fontFamily: 'var(--font-display)' }}
          >
            {func} ({score}%)
          </text>
          <text 
            x={x} 
            y={y + 6} 
            textAnchor="middle" 
            fill={isFocused ? "rgba(34, 211, 238, 0.8)" : "var(--text-secondary)"} 
            fontSize="9"
            fontWeight="500"
            style={{ transition: 'all 0.3s' }}
          >
            {funcNameCh}
          </text>
        </g>
      );
    });

    return (
      <div className="flex flex-col items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          <defs>
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(129, 140, 248, 0.45)" />
              <stop offset="100%" stopColor="rgba(192, 132, 252, 0.0)" />
            </radialGradient>
            <linearGradient id="polygon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(129, 140, 248, 0.35)" />
              <stop offset="100%" stopColor="rgba(34, 211, 238, 0.35)" />
            </linearGradient>
          </defs>
          <circle cx={center} cy={center} r={radius} fill="url(#radar-glow)" />
          {grids}
          {axesLines}
          <polygon 
            points={scorePoints} 
            fill="url(#polygon-grad)" 
            stroke="var(--color-primary)" 
            strokeWidth="2.5" 
            strokeLinejoin="round"
            filter="drop-shadow(0px 0px 8px rgba(129, 140, 248, 0.5))"
          />
          {labels}
          {dots}
          <circle cx={center} cy={center} r="3" fill="#ffffff" opacity="0.5" />
        </svg>
      </div>
    );
  };

  // Render 2D Political Spectrum Grid
  const renderPoliticalSpectrum = (econ, auth) => {
    // econ: -50 (Left/Collective) to +50 (Right/Market)
    // auth: -50 (Top/Authoritarian/Statist) to +50 (Bottom/Libertarian/Individual)
    const dotX = 50 + (econ / 50) * 50;
    const dotY = 50 + (auth / 50) * 50;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{
          position: 'relative',
          width: '256px',
          height: '256px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 50px -10px rgba(129, 140, 248, 0.08)'
        }}>
          {/* Quadrants */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '50%', height: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.04)',
            borderRight: '1px dashed rgba(255, 255, 255, 0.08)',
            borderBottom: '1px dashed rgba(255, 255, 255, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '9px', color: '#f87171', fontWeight: 600, opacity: 0.35, userSelect: 'none' }}>威权公有派</span>
          </div>
          
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '50%', height: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.04)',
            borderLeft: '1px dashed rgba(255, 255, 255, 0.08)',
            borderBottom: '1px dashed rgba(255, 255, 255, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '9px', color: '#60a5fa', fontWeight: 600, opacity: 0.35, userSelect: 'none' }}>威权保守派</span>
          </div>
          
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.04)',
            borderRight: '1px dashed rgba(255, 255, 255, 0.08)',
            borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '9px', color: '#34d399', fontWeight: 600, opacity: 0.35, userSelect: 'none' }}>自由左派</span>
          </div>
          
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%',
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
            borderLeft: '1px dashed rgba(255, 255, 255, 0.08)',
            borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '9px', color: '#c084fc', fontWeight: 600, opacity: 0.35, userSelect: 'none' }}>自由右派</span>
          </div>

          {/* Core Axis Lines */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>

          {/* Labels */}
          <div style={{
            position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '8px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em', whiteSpace: 'nowrap'
          }}>
            威权秩序 (Statist)
          </div>
          <div style={{
            position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)',
            fontSize: '8px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em', whiteSpace: 'nowrap'
          }}>
            个人自由 (Libertarian)
          </div>
          <div style={{
            position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'left center', fontSize: '8px', fontWeight: 'bold', color: '#94a3b8', whiteSpace: 'nowrap'
          }}>
            经济公平 (Left)
          </div>
          <div style={{
            position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'right center', fontSize: '8px', fontWeight: 'bold', color: '#94a3b8', whiteSpace: 'nowrap'
          }}>
            自由市场 (Right)
          </div>

          {/* Glowing Indicator Node */}
          <div 
            style={{ 
              position: 'absolute',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#22d3ee',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              left: `${dotX}%`, 
              top: `${dotY}%`,
              boxShadow: '0 0 12px #22d3ee',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="animate-ping" style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: '#ffffff', position: 'absolute'
            }}></div>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: '#ffffff', position: 'absolute', zIndex: 2
            }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between py-12 px-4 md:px-8 w-full">
      {/* Background Ambience */}
      <div className="ambient-bg">
        <div className="ambient-glow-1"></div>
        <div className="ambient-glow-2"></div>
        <div className="ambient-glow-3"></div>
      </div>

      {/* Header Bar */}
      <header className="max-w-5xl mx-auto w-full flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setScreen('welcome')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display text-white">8-Axis MBTI</h1>
            <p className="text-xs text-slate-400 tracking-wider uppercase font-medium">64-Type Cognitive Matrix</p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-white-5 text-xs text-slate-400">
          心智多层探测器 <span className="text-indigo-400 font-bold">v3.0</span>
        </div>
      </header>

      {/* Main Screen Router */}
      <main className="max-w-4xl mx-auto w-full flex-grow flex flex-col items-center justify-center z-10 my-4">
        
        {/* SCREEN 1: WELCOME SCREEN */}
        {screen === 'welcome' && (
          <div className="w-full text-center space-y-8 fade-in">
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-300 bg-indigo-10/50 border border-indigo-20 uppercase font-display inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 融合64高阶亚型、九型与深度政治光谱
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
                基于 <span className="text-gradient">自适应探索</span> 的<br />64型高阶心智与政治集群测验
              </h2>
              <p className="text-lg text-slate-400 font-light leading-relaxed">
                你是否也在市面普通MBTI测试的“刻板两极倾向”暗示下产生伪饰，导致结果屡测不准？<br />
                我们摒弃了工作经验门槛，采用**生活经验无关的高敏日常情境**、**六选多设陷选项**与**三阶段自适应探针干预算法**。
                系统会根据您前期的作答，实时算力重组后期的阴影测谎试题，并全方位解构您的**64亚型人格**、**九型人格**与**2D政治/社会学倾向**，揭秘深层心智集群。
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left pt-4">
              <div className="glass-container p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                </div>
                <h4 className="text-white text-base font-semibold">自适应追问 & 压力深潜</h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  前4题锁定高纠缠维度，自动生成中盘自适应分流题；第8题后抓取变态高压阴影（Grip）失控反应，击碎伪装、直切本真。
                </p>
              </div>

              <div className="glass-container p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="text-white text-base font-semibold">64 亚型后缀 (A/O & H/C)</h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  传统16型升级为64高阶型。通过引入行动作风后缀 <strong>A/O</strong>（行动/思虑）与人际风格后缀 <strong>H/C</strong>（温情/冷峻），拒绝扁平化标签。
                </p>
              </div>

              <div className="glass-container p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white text-base font-semibold">九型整合与尖锐政治光谱</h4>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  首创荣格八维对九型人格的动态拟合。内置尖锐、深刻的社会博弈探针，描绘您的2D政治 spectrum 坐标，揭秘认知集群演化。
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button onClick={startTest} className="btn-premium px-10 py-5 text-lg rounded-2xl group inline-flex items-center gap-2">
                立即开启心智探秘 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: QUIZ SCREEN */}
        {screen === 'quiz' && activeQuestions.length > 0 && activeQuestions[currentQuestionIndex] && (
          <div className="w-full max-w-3xl glass-container p-8 md:p-12 space-y-8 slide-up relative overflow-hidden">
            {/* Corner ambient micro glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Progress Indicators */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-400 font-display font-semibold uppercase tracking-wider">
                  {currentQuestionIndex < 4 
                    ? "阶段 I: 基础场景解构" 
                    : currentQuestionIndex < 8 
                      ? "阶段 II: 自适应分流探测" 
                      : currentQuestionIndex < 12 
                        ? "阶段 III: 阴影与逆境应激" 
                        : "阶段 IV: 质性自陈与多维拓展"} 
                  &nbsp;• Question {currentQuestionIndex + 1} of {targetLength}
                </span>
                <span className="text-slate-400 font-medium">
                  已完成 {Math.round(((currentQuestionIndex + 1) / targetLength) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / targetLength) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Simulated Live Interrogation Log (套话反馈展示区) - Hidden as requested by user to prevent interference */}
            {/*
            <div className="p-4 rounded-xl bg-slate-950 border border-white-5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                <Compass className="w-3.5 h-3.5 animate-spin-slow" /> 心理实验室实时算力探针日志:
              </div>
              <div className="text-xs text-slate-400 font-light space-y-1 max-h-16 overflow-y-auto leading-relaxed">
                {interrogationFeedbacks.slice(-2).map((feedback, idx) => (
                  <p key={idx} className="fade-in">✓ {feedback}</p>
                ))}
              </div>
            </div>
            */}

            {/* Question Situation Card */}
            <div className="space-y-4 text-center flex flex-col items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center gap-2.5 text-center w-full">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-white-5 border border-white-10 text-indigo-300 self-center">
                  {activeQuestions[currentQuestionIndex].type === 'open' 
                    ? "开放式质性质感自白" 
                    : activeQuestions[currentQuestionIndex].type === 'judgment'
                      ? "观点判断 (同意/不同意)"
                      : activeQuestions[currentQuestionIndex].type === 'single' 
                        ? `单选 (${activeQuestions[currentQuestionIndex].options.length} 选 1)` 
                        : "多选 (至多选 2 项)"}
                </span>
                <h3 className="text-white text-lg md:text-xl font-bold font-display text-center">{activeQuestions[currentQuestionIndex].scenario}</h3>
              </div>
              <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed text-center max-w-3xl">
                {activeQuestions[currentQuestionIndex].description}
              </p>
            </div>

            {/* Custom Textarea for Open Questions OR standard 6-Option Grid */}
            {activeQuestions[currentQuestionIndex].type === 'open' ? (
              <div className="space-y-4 py-2 fade-in">
                <textarea
                  value={answers[activeQuestions[currentQuestionIndex].id]?.[0] || ""}
                  onChange={(e) => {
                    setAnswers({
                      ...answers,
                      [activeQuestions[currentQuestionIndex].id]: [e.target.value]
                    });
                  }}
                  placeholder="在此输入您的深刻抉择与理由，吐露最真实的心声..."
                  className={`w-full min-h-[160px] p-5 rounded-2xl border bg-slate-950/60 text-slate-200 text-sm font-light leading-relaxed focus:outline-none focus:ring-1 transition-all resize-none ${
                    (answers[activeQuestions[currentQuestionIndex].id]?.[0] || "").trim().length >= 15
                      ? 'border-emerald-500/30 focus:border-emerald-500/50 focus:ring-emerald-500/20 shadow-lg shadow-emerald-500/5'
                      : 'border-white-5 focus:border-amber-500/50 focus:ring-amber-500/20'
                  }`}
                />
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-light flex items-center gap-1">
                    💡 提示：输入将由自研中文心智分析器进行多维词频扫描
                  </span>
                  <span className={`font-display font-medium px-2 py-0.5 rounded ${
                    (answers[activeQuestions[currentQuestionIndex].id]?.[0] || "").trim().length >= 15
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-amber-400 bg-amber-500/10 border border-amber-500/20 animate-pulse'
                  }`}>
                    字数：{(answers[activeQuestions[currentQuestionIndex].id]?.[0] || "").trim().length} / 建议 15 字以上
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    <strong>质性心智探针：</strong>开放式自陈将直接激活系统底层的「自研中文心智词频扫描器 (NLP Qualitative Mind Parser)」，您的每一个实词词频密度、句式结构与认知底色都会深度扭转八维向量与政治光谱，请务必真实陈述，卸下伪饰。
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 py-2">
                {activeQuestions[currentQuestionIndex].options.map((opt) => {
                  const isSelected = (answers[activeQuestions[currentQuestionIndex].id] || []).includes(opt.id);
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => handleOptionToggle(activeQuestions[currentQuestionIndex], opt.id)}
                      className={`p-4 md:p-5 rounded-xl border text-left cursor-pointer transition-all flex gap-3.5 items-start relative overflow-hidden ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5 scale-[1.01]' 
                          : 'bg-slate-950/40 border-white-5 hover:bg-white-5 hover:border-white-10'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                      )}
                      
                      {/* Tick box or radio icon */}
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-indigo-500 border-indigo-500 text-white' 
                          : 'border-slate-600'
                      }`}>
                        {isSelected && (
                          <span className="text-[10px] font-bold">✓</span>
                        )}
                      </div>

                      <div className="space-y-1 flex-grow">
                        <p className="text-slate-200 text-sm font-light leading-relaxed">
                          {opt.text.replace(/^【[^】]+】/, '')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Guidance tip for multi-select */}
            {activeQuestions[currentQuestionIndex].type === 'multi' && (
              <p className="text-xs text-slate-500 text-center font-light italic">
                提示：此场景心智极其复杂，支持多选，您可以选择最契合您当下切身本能的 1 至 2 项。
              </p>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white-5 w-full">
              <button 
                onClick={prevQuestion} 
                disabled={currentQuestionIndex === 0}
                className="btn-secondary px-6 py-3 disabled:opacity-25 disabled:pointer-events-none inline-flex items-center gap-1.5 self-start md:self-auto"
              >
                <ArrowLeft className="w-4 h-4" /> 返回上一题
              </button>
              
              {currentQuestionIndex === targetLength - 1 && targetLength < 150 ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center justify-end">
                  <button 
                    onClick={() => {
                      if (!isQuestionAnswered(activeQuestions[currentQuestionIndex])) {
                        alert("请根据探测情境完成选择或自陈后再继续进行！");
                        return;
                      }
                      calculateFinalResults();
                    }}
                    disabled={!isQuestionAnswered(activeQuestions[currentQuestionIndex])}
                    className="btn-secondary px-5 py-3 text-sm font-medium rounded-xl inline-flex items-center justify-center gap-1.5 disabled:opacity-50 w-full sm:w-auto"
                  >
                    立即生成阶段结果 <Sparkles className="w-4 h-4 text-indigo-400" />
                  </button>
                  <button 
                    onClick={() => {
                      if (!isQuestionAnswered(activeQuestions[currentQuestionIndex])) {
                        alert("请根据探测情境完成选择或自陈后再继续进行！");
                        return;
                      }
                      handleContinueTesting();
                    }}
                    disabled={!isQuestionAnswered(activeQuestions[currentQuestionIndex])}
                    className="btn-premium px-6 py-3 text-sm font-medium rounded-xl inline-flex items-center justify-center gap-1.5 group disabled:opacity-50 w-full sm:w-auto"
                  >
                    继续深度探测 (至 {targetLength === 25 ? 50 : targetLength === 50 ? 100 : 150} 题)
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={nextQuestion} 
                  disabled={!isQuestionAnswered(activeQuestions[currentQuestionIndex])}
                  className="btn-premium px-8 py-3 disabled:opacity-50 inline-flex items-center gap-1.5 w-full md:w-auto justify-center"
                >
                  {currentQuestionIndex === targetLength - 1 ? (
                    <>生成终极心智报告 <Sparkles className="w-4 h-4 text-indigo-400" /></>
                  ) : (
                    <>确认并进行下一步 <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 3: RESULTS SCREEN */}
        {screen === 'result' && results && (
          <div className="w-full space-y-8 fade-in">
            
            {/* Top Match Result Banner */}
            <div className="glass-container p-8 md:p-12 text-center relative overflow-hidden space-y-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500"></div>
              {/* Giant background typography */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8vw] font-black opacity-[0.015] pointer-events-none uppercase font-display select-none whitespace-nowrap">
                {results.full64Code}
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 uppercase font-display inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> 64型高阶多维契合画像
                </span>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-display">
                  <span className="text-gradient">{results.full64Code}</span>
                </h2>
                <h3 className="text-lg md:text-xl text-slate-200 font-medium font-display tracking-tight">
                  {results.primary.title} · <span className="text-indigo-400 font-bold">{SUFFIX_64_INFO[results.suffix1 + results.suffix2]?.name || ''}</span>
                </h3>
              </div>

              <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed max-w-3xl mx-auto pt-2">
                作为 <strong>{results.primary.name} ({results.primary.title})</strong> 底色心智者，结合您高频在现实中的行动调控与人际投射，您展现出了 <strong>{SUFFIX_64_INFO[results.suffix1 + results.suffix2]?.tagline || ''}</strong> 的高阶特质。
                {SUFFIX_64_INFO[results.suffix1 + results.suffix2]?.description || ''}
              </p>

              {/* Cognitive stack tags */}
              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                {results.primary.stack.map((func, i) => {
                  const role = i === 0 ? '主导(英雄)' : 
                               i === 1 ? '辅助(家长)' : 
                               i === 2 ? '第三(少男)' : 
                               i === 3 ? '劣势(阿尼玛)' : 
                               i === 4 ? '第五(批评)' : 
                               i === 5 ? '第六(魔术师)' : 
                               i === 6 ? '第七(小丑)' : 
                               i === 7 ? '第八(魔鬼)' : '阴影';
                               
                  const styleColors = i === 0 ? { backgroundColor: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.3)' } :
                                      i === 1 ? { backgroundColor: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', borderColor: 'rgba(34, 211, 238, 0.3)' } :
                                      i === 2 ? { backgroundColor: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.2)' } :
                                      i === 3 ? { backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' } :
                                      i === 4 ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' } :
                                      i === 5 ? { backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.3)' } :
                                      i === 6 ? { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' } :
                                      i === 7 ? { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' } :
                                      { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', borderColor: 'rgba(255, 255, 255, 0.1)' };
                  return (
                    <span 
                      key={func} 
                      onClick={() => setSelectedFunc(func)}
                      style={styleColors}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer hover:scale-105 transition-all inline-flex items-center gap-1.5"
                    >
                      <span className="opacity-60">{role} :</span> {func}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* TWO-COLUMN LAYOUT: VISUAL RADAR CHART vs FUNCTION DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Interactive Radar Chart */}
              <div className="glass-container p-8 flex flex-col justify-between items-center text-center space-y-6">
                <div className="w-full text-left space-y-1">
                  <h3 className="text-lg text-white font-bold inline-flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-5 text-indigo-400" /> 荣格八维心智雷达图
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    点击下方雷达图轴点或标签，查看单个认知功能及心理位置详细剖析。
                  </p>
                </div>

                {renderRadarChart(results.scores)}

                <div className="text-xs text-slate-500 leading-relaxed font-light">
                  雷达面积展示您八维认知心智的充沛度，通过自适应和影子题消除了表面社会伪饰。
                </div>
              </div>

              {/* Right Column: Interactive Details Panel */}
              <div className="glass-container p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-display">
                      {selectedFunc} 认知维解析
                    </span>
                    <span className="text-xs text-slate-400 font-medium font-display">
                      拟合强度: <strong className="text-white text-sm">{results.scores[selectedFunc] || 0}%</strong>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white text-base font-bold font-display">
                      {COGNITIVE_FUNCTIONS_INFO[selectedFunc].chineseName}
                    </h4>
                    <p className="text-slate-300 text-sm font-light leading-relaxed">
                      {COGNITIVE_FUNCTIONS_INFO[selectedFunc].meaning}
                    </p>
                  </div>

                  {/* Function Role details based on Beebe model */}
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white-5 space-y-2">
                    <h5 className="text-xs font-bold text-slate-300 inline-flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-indigo-400" /> 压力、阴影与变态应激机制：
                    </h5>
                    <p className="text-xs text-slate-450 leading-relaxed font-light">
                      <strong>【阴影状态】</strong>{COGNITIVE_FUNCTIONS_INFO[selectedFunc].shadow}
                      <br /><br />
                      <strong>【心智定位】</strong>
                      {(() => {
                        const prim = results.primary;
                        const idxInStack = prim.stack.indexOf(selectedFunc);
                        
                        if (idxInStack === 0) {
                          return `作为【第一主导功能(英雄)】，您日常思考几乎无意识依赖它，处于高度常态表达，得分达 ${results.scores[selectedFunc]}%。`;
                        } else if (idxInStack === 1) {
                          return `作为【第二辅助功能(家长)】，它是您同社会打交道的理性刹车与保护拐杖，协调和纠偏主导功能的狂热偏振。`;
                        } else if (idxInStack === 2) {
                          return `作为【第三功能(永恒少年/少男)】，它是您在放松、沉浸或无压力自娱自乐时的避难玩具，得分代表您童年心理偏好的残留。`;
                        } else if (idxInStack === 3) {
                          return `作为【第四劣势功能(阿尼玛)】，它是您的脆弱死穴。在极端负面情绪爆发时，您可能瞬间失控呈现其极端恶化姿态（如 Se grip 的暴饮暴食，Ne grip 的灾难妄想）。`;
                        }
                        
                        // TJ Fe Trickster check
                        if (selectedFunc === 'Fe' && prim.name.includes('TJ')) {
                          return `【第七小丑(Trickster)盲区】作为典型的 TJ 脑，您本能排斥 Fe。您可能会固执地认为“人情社交、和稀泥、客套礼貌都是极其低效和虚伪的”，这导致您容易被社会群体贴上冷酷或孤僻的标签。`;
                        }
                        // NJ Si Demon check
                        if (selectedFunc === 'Si' && prim.name.includes('NJ')) {
                          return `【第八魔鬼(Demon)功能】作为 NJ 前瞻直觉者，Si 是您的最阴暗死角。您极度反感一成不变的传统细节与历史约束，极易丢三落四、忽视自己身体的亚健康信号，将规程妖魔化。`;
                        }
                        // SJ Ni Demon check
                        if (selectedFunc === 'Ni' && prim.name.includes('SJ')) {
                          return `【第八魔鬼(Demon)功能】作为 SJ 传统经验维护者，Ni 是您的最阴暗死角。您极度警惕任何毫无实物与数据支撑的“空洞概念、玄学大师预言”或不切实际的颠覆。`;
                        }

                        if (idxInStack === 4) {
                          return `【第五批评(Critic)功能】作为主导(英雄)功能的影子对立面，该功能常以内心深处对自我或他人的批评、审视、质疑形式出现，也是您在受到外部观念侵犯时的第一本能防御防线。`;
                        } else if (idxInStack === 5) {
                          return `【第六魔术师功能】作为潜意识防御武器，在您深感压抑、委屈或无能为力时，您可能会以此功能暗中操作局势、开展心智防卫，呈现某种出其不意的魔术师式反制与情境操控效果。`;
                        } else if (idxInStack === 6) {
                          return `【第七小丑(Trickster)功能】作为意识盲点与心智圈套，您在此功能上最易产生认知偏差与自我欺骗。通常您以戏谑、玩世不恭的小丑防卫姿态去调侃和解构此维度的严肃冲突。`;
                        } else if (idxInStack === 7) {
                          return `【第八魔鬼(Demon)功能】是您潜意识最底层的阴影深谷与魔鬼防线。常态下此功能几乎被隔离，但在遭遇系统性信念危机或毁灭性打击时它会被黑化触发，释放出极端偏执、自我毁灭或非理性报复力量。`;
                        }

                        return `作为潜意识中的阴影，该功能在常规状态下不显山露水，但决定了您在社交反击、极度自卫时的隐性心理投射。`;
                      })()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white-5 flex flex-wrap gap-2 items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-light">
                    点击雷达图或按键快速切换：
                  </span>
                  <div className="flex gap-1">
                    {['Ni', 'Te', 'Fi', 'Se', 'Ne', 'Ti', 'Fe', 'Si'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setSelectedFunc(f)}
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold font-display flex items-center justify-center border transition-all ${
                          selectedFunc === f 
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' 
                            : 'bg-white-5 border-white-5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* NEW ADDITION: 2D POLITICAL COMPASS & SOCIAL ANALYSIS SECTION */}
            <div className="glass-container p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white-5 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    Political & Sociological Spectrum Analysis
                  </span>
                  <h3 className="text-xl text-white font-bold inline-flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" /> 社会学与政治倾向坐标：
                    {(() => {
                      const econ = results.econCoord;
                      const auth = results.authCoord;
                      if (econ <= 0 && auth <= 0) return "威权公有派 (Auth-Left)";
                      if (econ > 0 && auth <= 0) return "威权保守派 (Auth-Right)";
                      if (econ <= 0 && auth > 0) return "自由左派 (Lib-Left)";
                      return "自由右派 (Lib-Right)";
                    })()}
                  </h3>
                </div>
                <div className="text-xs text-indigo-400 font-bold tracking-wider uppercase font-display">
                  2D Spectrum Box
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* 2D Grid render on the left */}
                <div className="md:col-span-5 flex justify-center">
                  {renderPoliticalSpectrum(results.econCoord, results.authCoord)}
                </div>

                {/* Analytical text on the right */}
                <div className="md:col-span-7 space-y-4">
                  <h4 className="text-white text-sm font-semibold">🔍 2D 坐标解释与心理解构</h4>
                  <p className="text-slate-300 text-xs font-light leading-relaxed">
                    在我们的心智模型中，政治/社会学选择不是孤立的见解，而是<strong>认知功能在大脑中的具体投影</strong>。
                  </p>
                  
                  <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/10 space-y-2">
                    <h5 className="text-xs font-bold text-slate-200">📊 您的光谱定位剖析：</h5>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">
                      {results.authCoord <= 0 ? (
                        <span>
                          <strong>威权秩序侧（建制/集体秩序）:</strong> 您在选择中展现出对国家宏观秩序、安全保障与集体共识的底层认同。在重大变局下，您倾向于认为稳定的主权和强有力的统一机构是一切权利的前提，因此为了宏观大局牺牲部分言论细节是必要成本。这与您的 <strong>Si (经验秩序)</strong> 或 <strong>Fe (集体情感凝聚)</strong> 心智得分有着深层契合。
                        </span>
                      ) : (
                        <span>
                          <strong>自由批判侧（异见/个人权利）:</strong> 您展现出了极强的警惕公权、防范系统同化、捍卫个体自由（言论、隐私与思考）的神圣信仰。您坚信权力必须受全方位的监督。无论出于任何借口，思想控制都极其危险。这在心理学上对应着您深邃发达的 <strong>Ti (逻辑去中心解构)</strong> 与 <strong>Fi (道德良知纯粹性)</strong>，您几乎无法被群体催眠。
                        </span>
                      )}
                      <br /><br />
                      {results.econCoord <= 0 ? (
                        <span>
                          <strong>经济左翼倾向（福利兜底/公平优先）:</strong> 您倾向于支持财富的二次调节。社会贫富分化在您看来多是结构剥削导致，因此强力税收和公共福利（UBI、免费医疗）宁可牺牲部分效率也必须执行，以此保障底层尊严。这由您内心深处的 <strong>Fi (人文关怀)</strong> 或 <strong>Fe (情感共鸣)</strong> 驱动。
                        </span>
                      ) : (
                        <span>
                          <strong>经济右翼倾向（自由竞争/效率至上）:</strong> 您更偏向自由达尔文竞争。您倾向于认为贫富差距是天然的筛分结果，应当削减高税收和过度福利、警惕“养懒汉”机制、给资本松绑、充分激活市场竞争来做大蛋糕。这紧密关联着您 <strong>Te (效能调配)</strong> 或 <strong>Se (现时获取)</strong> 的实感功能。
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* SPECIAL RESEARCH CORRELATION CARD */}
              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3 mt-4">
                <h4 className="text-white text-xs font-bold font-display flex items-center gap-1.5 text-indigo-300">
                  <Users className="w-4 h-4" /> 🔬 心理-政治倾向集群演化研究 (Psychological-Political Clusters)
                </h4>
                <div className="text-slate-350 text-xs font-light leading-relaxed space-y-2">
                  <p>
                    为什么在互联网上针对社会和地缘事件的争论总是充斥着“鸡同鸭讲”、甚至相互谩骂扣帽子（如“小粉红”与“反贼”）？您的研究所指出的正是这套心智认知的核心分野。
                  </p>
                  <p>
                    <strong>【小粉红 / 秩序建制派的心理土壤（SJ/Fe 偏频）】</strong>：研究发现，高度认同国家 consensus 与秩序的群体，往往 <strong>Si (内倾感觉)</strong> 与 <strong>Fe (外倾情感)</strong> 分值极高。
                    在他们的心智中，Si 建立起对历史荣誉、国族传统与教科书规范的稳固实感安全，而 Fe 促成了“全人类/全社会情感命运共同体”的情感共振与从众本能。在这种认知下，国家的强盛与稳定被等同于个人的安全，任何对权威的质疑都会被 Fe 视为对“家庭/集体和谐”的背叛，被 Si 视为对安全防线的摧毁。
                  </p>
                  <p>
                    <strong>【反贼 / 自由批判派的心理土壤（NT/Fi 偏频）】</strong>：与之相对，习惯对权力保持高度怀疑和不服从的群体，通常 <strong>Ti (内倾思考)</strong> 与 <strong>Fi (内倾情感)</strong> 评分处于压倒性优势。
                    Ti 充当了最冷酷的去神圣化解构显微镜，致力于解构所有的政治口号、宣传套路与逻辑漏洞；而 Fi 指向个体内在牢不可破、绝不妥协的道德律令。在他们的心智中，任何强迫的和谐都是对个体尊严（Fi）和真理逻辑（Ti）的强暴。
                  </p>
                  <p className="text-indigo-400 font-medium italic pt-1">
                    结论：网上的骂战本质上根本不是真理或论据的多寡之争，而是“Si/Fe 集体凝聚大脑”与“Ti/Fi 独立解构大脑”的生理级认知冲突。理解这一点，正是抹平两极割裂、探索心智演化规律的科学第一步。
                  </p>
                </div>
              </div>
            </div>

            {/* NEW ADDITION: ENNEAGRAM (九型人格) INTEGRATION CARD */}
            <div className="glass-container p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white-5 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Enneagram Profile
                  </span>
                  <h3 className="text-xl text-white font-bold inline-flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-emerald-400" /> 九型人格拟合：{ENNEAGRAM_INFO[results.primaryEnneatype]?.name || (results.primaryEnneatype + "型")}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    主导型：{results.primaryEnneatype}型
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 p-5 rounded-2xl bg-slate-950 border border-emerald-500/15 space-y-2 text-center">
                  <div className="text-4xl">🧘</div>
                  <h4 className="text-white text-xs font-bold font-display tracking-wide uppercase pt-1">心理能量共鸣 vibe</h4>
                  <p className="text-slate-350 text-xs font-light italic leading-relaxed">
                    “{ENNEAGRAM_INFO[results.primaryEnneatype]?.vibe || ''}”
                  </p>
                </div>

                <div className="md:col-span-8 space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950-30 border border-white-5 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">🌟 核心欲望 (Desire)</span>
                      <p className="text-slate-200 text-xs font-light">{ENNEAGRAM_INFO[results.primaryEnneatype]?.desire || ''}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950-30 border border-white-5 space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">☠️ 核心恐惧 (Fear)</span>
                      <p className="text-rose-400 text-xs font-light">{ENNEAGRAM_INFO[results.primaryEnneatype]?.fear || ''}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs font-light leading-relaxed">
                    <strong>九型特征深度剖析：</strong>
                    {ENNEAGRAM_INFO[results.primaryEnneatype]?.description || ''} 通过荣格八维拟合计算，您的八维分配深度契合了九型人格中该型号的特质。这展示了您在生存策略中的核心心理防御机制和应对外界的习惯反应。
                  </p>
                </div>
              </div>

              {/* All Enneagram Scores Bar Graph */}
              <div className="space-y-3 border-t border-white-5 pt-4">
                <h4 className="text-xs font-semibold text-slate-300">九种生存防御姿态拟合强度全谱系：</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.keys(results.enneagramScores).map(typeKey => {
                    const score = results.enneagramScores[typeKey];
                    const isPrimary = results.primaryEnneatype === typeKey;
                    const cleanName = ENNEAGRAM_INFO[typeKey]?.name || `${typeKey}型`;
                    return (
                      <div 
                        key={typeKey} 
                        className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${
                          isPrimary 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : 'bg-slate-900/30 border-white-5'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-bold ${isPrimary ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {typeKey}型 {cleanName.split('(')[0]}
                          </span>
                          <span className="text-slate-500 font-display font-medium">{score}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isPrimary ? 'bg-emerald-400' : 'bg-slate-700'}`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* NEW ADDITION: QUALITATIVE CONFESSION ARCHIVE (心智质性自白档案) */}
            {results.openAnswersText && results.openAnswersText.length > 0 && (
              <div className="glass-container p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white-5 pb-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      Qualitative Mental Confession Archive
                    </span>
                    <h3 className="text-xl text-white font-bold inline-flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" /> 心智质性自白档案 (Qualitative Essays)
                    </h3>
                  </div>
                  <div className="text-xs text-slate-400 font-light italic">
                    通过自研中文心智词频扫描器 (NLP Qualitative Mind Parser) 深度映射
                  </div>
                </div>

                <div className="space-y-4">
                  {results.openAnswersText.map((item, index) => (
                    <div key={item.id} className="p-5 rounded-2xl bg-slate-950 border border-white-5 space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 tracking-wider">
                          {item.scenario}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-white-5 border border-white-10 text-slate-400">
                          探针 #{index + 1}
                        </span>
                      </div>
                      
                      <div className="text-slate-200 text-sm font-light italic leading-relaxed pl-3 border-l-2 border-amber-500/30 whitespace-pre-wrap">
                        “{item.text}”
                      </div>

                      {item.matchedKeywords && item.matchedKeywords.length > 0 ? (
                        <div className="space-y-1.5 pt-2 border-t border-white-5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">
                            🔍 捕获到心智/意识锚点词 (Keyword Hits):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.matchedKeywords.map((kw, kwIdx) => (
                              <span 
                                key={kwIdx} 
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                  kw.type === 'cognitive' 
                                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                }`}
                              >
                                {kw.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-light italic pt-2 border-t border-white-5">
                          未检测到明显符合本能八维与社会光谱语义倾向的典型词，已通过底层隐式上下文和语法密度微调。
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOCIONICS QUADRA & VALUE QUANTRANT (象限深度剖析卡) */}
            <div className="glass-container p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white-5 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    Socionics Quadrant Analysis
                  </span>
                  <h3 className="text-xl text-white font-bold inline-flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" /> 社会人格心理象限：{QUADRAS_INFO[results.leadingQuadra]?.chineseName || QUADRAS_INFO[results.leadingQuadra]?.name || results.leadingQuadra}
                  </h3>
                </div>
                <div className="flex gap-2">
                  {Object.keys(results.quadraScores).map(qKey => (
                    <span 
                      key={qKey} 
                      className={`px-3 py-1 rounded-xl text-xs font-semibold font-display border ${
                        results.leadingQuadra === qKey 
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold' 
                          : 'bg-white-5 border-white-5 text-slate-400 opacity-60'
                      }`}
                    >
                      {qKey === 'alpha' ? 'α 阿尔法' : qKey === 'beta' ? 'β 贝塔' : qKey === 'gamma' ? 'γ 伽马' : 'δ 德尔塔'}: {results.quadraScores[qKey]}%
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-sm">
                <div className="space-y-3">
                  <p className="text-slate-300 font-light">
                    {QUADRAS_INFO[results.leadingQuadra]?.description || QUADRAS_INFO[results.leadingQuadra]?.values || ''}
                  </p>
                  <p className="text-cyan-400 font-semibold text-xs inline-flex items-center gap-1">
                    🎯 象限共有意识功能 (共享阳面)：
                    {(QUADRAS_INFO[results.leadingQuadra]?.valuedFunctions || []).map(f => (
                      <span key={f} className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold font-display ml-1">{f}</span>
                    ))}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/10 space-y-2">
                  <h4 className="text-white text-xs font-bold font-display">☕ 心理气场与价值追求 (Vibe)：</h4>
                  <p className="text-slate-350 text-xs font-light italic leading-relaxed">
                    “{QUADRAS_INFO[results.leadingQuadra]?.vibe || ''}”
                  </p>
                  <p className="text-xs text-slate-500 font-light border-t border-white-5 pt-2 mt-2">
                    {QUADRAS_INFO[results.leadingQuadra]?.analysis || ''}
                  </p>
                </div>
              </div>
            </div>

            {/* THREE-COLUMN DEEP ANALYSIS: STRENGTHS, WEAKNESSES, GROWTH */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Strengths Card */}
              <div className="glass-container p-6 space-y-4">
                <h4 className="text-white text-base font-bold inline-flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 核心心智优势
                </h4>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  {results.primary.strengths}
                </p>
              </div>

              {/* Blindspots Card */}
              <div className="glass-container p-6 space-y-4">
                <h4 className="text-white text-base font-bold inline-flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> 潜在阴影防线
                </h4>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  {results.primary.weaknesses}
                  <br /><br />
                  <strong>劣势应激：</strong>
                  {SUFFIX_64_INFO[results.suffix1 + results.suffix2]?.shadowDescription || ''}
                </p>
              </div>

              {/* Growth Card */}
              <div className="glass-container p-6 space-y-4">
                <h4 className="text-white text-base font-bold inline-flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> 破局成长指南
                </h4>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  {results.primary.growth}
                  <br /><br />
                  <strong>建议：</strong>
                  {COGNITIVE_FUNCTIONS_INFO[results.primary.stack[0]].tip}
                </p>
              </div>
            </div>

            {/* CRITICAL COGNITIVE CORRELATION: Mistyping Analysis (ISTJ vs INTJ, etc.) */}
            <div className="glass-container p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg text-white font-bold inline-flex items-center gap-2">
                  <Users className="w-4.5 h-5 text-purple-400" /> 为什么您在普通测试中容易遭遇误判？
                </h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  传统测试往往通过简单、表面的“二选一选择题”给您贴上静态的 16 型标签，忽略了心智功能在不同压力和自适应情境下的动态变化。因此难以有效解决像 INTJ 与 ISTJ 这类由于 Ni/Si 实虚高频纠缠而引发的边缘混淆。
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/40 border border-white-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-300">
                      您的紧邻契合维度： <span className="text-purple-400 font-display font-bold text-base">{results.secondary.type} — {results.secondary.title}</span>
                    </h4>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      (拟合评分: {results.secondary.fitScore} pt，首要匹配: {results.primary.fitScore} pt)
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                    次优拟合
                  </span>
                </div>

                <div className="text-slate-300 text-sm font-light leading-relaxed border-t border-white-5 pt-3 space-y-2">
                  <p>{results.primary.mistypeAnalysis}</p>
                  <p>{results.secondary.mistypeAnalysis}</p>
                  <p className="text-xs text-slate-500 italic font-light pt-2">
                    注：本系统采用高阶数学加权向量拟合（Weighted Vector Distance Fitting）。
                    如果您的首优与次优拟合分值相差极小（小于 5 pt），说明您具备极强的“双脑高阶平衡度”，可以根据生活和工作场景快速调用不同的认知功能，这是高级心智的表现。
                  </p>
                </div>
              </div>

              {/* Top Fits comparison table */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300">全谱系心智契合度排名前四位：</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.allFits.map((fit, idx) => {
                    const isLeading = idx === 0;
                    return (
                      <div 
                        key={fit.type} 
                        className={`p-4 rounded-xl text-center border ${
                          isLeading 
                            ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5' 
                            : 'bg-slate-900/30 border-white-5'
                        }`}
                      >
                        <div className="text-xs text-slate-500 mb-1">Rank #{idx+1}</div>
                        <div className={`text-base font-bold font-display ${isLeading ? 'text-indigo-300' : 'text-white'}`}>{fit.type}</div>
                        <div className="text-xs text-slate-400 font-light truncate mt-0.5">{fit.title}</div>
                        <div className="text-xs text-indigo-400 font-semibold font-display mt-1.5">{fit.fitScore} pt</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center items-center gap-4 pt-4">
              <button onClick={startTest} className="btn-secondary px-8 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> 重新测试
              </button>
              {targetLength < 150 && (
                <button onClick={handleContinueFromResults} className="btn-premium px-8 flex items-center gap-1.5">
                  继续深度探测 (至 {targetLength === 25 ? 50 : targetLength === 50 ? 100 : 150} 题) <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

      </main>



      {/* Footer copyright */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 pt-8 border-t border-white-5 z-10">
        <p>© 2026 8-Axis MBTI Cognitive Engine. Designed for Aberdeen Alumnus & High-End Mental Labs.</p>
        <p className="mt-1 font-light opacity-60">自适应算力探针多维干预引擎 v3.0 · 纯前端静态应用，全隐私人性安全保密保障</p>
      </footer>

    </div>
  );
}
