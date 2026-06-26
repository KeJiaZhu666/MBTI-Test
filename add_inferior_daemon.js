import fs from 'fs';

const filePath = './src/data/mbtiQuizData.js';
let content = fs.readFileSync(filePath, 'utf8');

// We locate the end of p3_sh_ti_blind
const targetBlock = `  {
    id: "p3_sh_ti_blind",
    phase: 3,
    type: "single",
    targetShadow: "Ti_Inferior_or_Blind",
    scenario: "🧩 认知选择 (思考阴影与盲点)：逻辑纠缠与定义排斥",
    description: "我非常抗拒在沟通中进行极其咬文嚼字的词义界定、推导公式般的定义纠缠，或者死磕某句话的底层推论是否绝对严密自洽，认为这种纯逻辑层面的“文字死胡同”毫无意义，阻碍了真诚的交流。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 认为死磕纯逻辑自洽是毫无实效且枯燥的“文字游戏”，沟通应注重内心真实态度或现实解决。", weights: { Fi: 6, Te: 2, Ti: -4 }, label: "情感实效" },
      { id: "B", text: "不同意 / 否 (Disagree) - 极度重视底层定义的严密自洽，认为概念如果不精准，后续的一切衍生逻辑都是沙上建塔。", weights: { Ti: 8, Fi: -2 }, label: "逻辑重构" }
    ]
  }
];`;

const replacementBlock = `  {
    id: "p3_sh_ti_blind",
    phase: 3,
    type: "single",
    targetShadow: "Ti_Inferior_or_Blind",
    scenario: "🧩 认知选择 (思考阴影与盲点)：逻辑纠缠与定义排斥",
    description: "我非常抗拒在沟通中进行极其咬文嚼字的词义界定、推导公式般的定义纠缠，或者死磕某句话的底层推论是否绝对严密自洽，认为这种纯逻辑层面的“文字死胡同”毫无意义，阻碍了真诚的交流。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 认为死磕纯逻辑自洽是毫无实效且枯燥的“文字游戏”，沟通应注重内心真实态度或现实解决。", weights: { Fi: 6, Te: 2, Ti: -4 }, label: "情感实效" },
      { id: "B", text: "不同意 / 否 (Disagree) - 极度重视底层定义的严密自洽，认为概念如果不精准，后续的一切衍生逻辑都是沙上建塔。", weights: { Ti: 8, Fi: -2 }, label: "逻辑重构" }
    ]
  },
  // --- 第 4 劣势功能渴望维度 (Inferior Aspiration Probes) ---
  {
    id: "p3_inf_se_asp",
    phase: 3,
    type: "single",
    targetShadow: "Se_Inferior_or_Blind",
    scenario: "🥋 认知选择 (感觉劣势与渴望)：感官绽放与肢体向往",
    description: "我深知自己在感官即时体验、身体物理协调和随性享受当下上像个“婴儿”般笨拙，但我内心其实非常渴望这种纯粹、充满生命力的感官绽放，极度羡慕和向往那些能在大自然或肢体运动中展现出完美掌控力与野性魅力的人。你的感受是：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 渴望这种纯粹的感官释放，向往并羡慕那些感官极其敏锐且活得真实洒脱的人。", weights: { Se: 6, Ni: -2 }, label: "感官向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 并不特别渴望这种纯粹的感官释放，更习惯于留在精神的抽象思考或内省世界中。", weights: { Ni: 4 }, label: "精神深耕" }
    ]
  },
  {
    id: "p3_inf_ne_asp",
    phase: 3,
    type: "single",
    targetShadow: "Ne_Inferior_or_Blind",
    scenario: "🔮 认知选择 (直觉劣势与渴望)：创意大爆发与灵性向往",
    description: "我习惯了生活在有条不紊的秩序和经验中，但我内心其实极度渴望打破常规，去拥抱无限的创造力与可能性。我深切羡慕那些能在脑海中瞬间涌现无数跨界奇思妙想、活得天马行空且充满灵性的人。你的态度是：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 内心极度向往天马行空的创意灵感，羡慕并渴望自己也能有思维无边界的灵活想象力。", weights: { Ne: 6, Si: -2 }, label: "灵感向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 更看重经验的稳健与秩序的安宁，并不渴望这种过于跳跃和不确定的思维方式。", weights: { Si: 4 }, label: "经验留存" }
    ]
  },
  {
    id: "p3_inf_si_asp",
    phase: 3,
    type: "single",
    targetShadow: "Si_Inferior_or_Blind",
    scenario: "📜 认知选择 (感觉劣势与渴望)：历史温情与精细秩序向往",
    description: "我习惯了在脑海里追逐新奇的可能性和宏大理念，但我内心其实极度渴望拥有一种能各安其位、踏实精致、与过去岁月和传统和谐共处的稳定感。我深深羡慕那些生活起居规律、能够精细打理好每一处生活细节的人。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 向往经验的沉淀与精致安稳的规程细节，极其渴望自己也能拥有这种自律且宁静的归属感。", weights: { Si: 6, Ne: -2 }, label: "秩序向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 认为一成不变的平稳和繁琐的细节有些枯燥，更愿意继续在未知的变数中寻找新鲜感。", weights: { Ne: 4 }, label: "发散求新" }
    ]
  },
  {
    id: "p3_inf_ni_asp",
    phase: 3,
    type: "single",
    targetShadow: "Ni_Inferior_or_Blind",
    scenario: "🔮 认知选择 (直觉劣势与渴望)：本质洞察与宏观定力向往",
    description: "我擅长在现实世界里当场破局和享受感官实感，但我内心深处极度渴望捕捉到人生的长远主线、洞察事物的隐藏本质与哲学远景。我非常羡慕那些能在一瞬间洞穿迷雾、坚守宏大精神内核的人。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 渴望获得深度的宏观预知力和本质洞察，向往并羡慕那些精神世界极其深邃、目光如炬的智者。", weights: { Ni: 6, Se: -2 }, label: "本质向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 觉得当下的现实体验与实际产出最重要，不怎么向往过于玄虚的精神本质洞察。", weights: { Se: 4 }, label: "现时实存" }
    ]
  },
  {
    id: "p3_inf_fe_asp",
    phase: 3,
    type: "single",
    targetShadow: "Fe_Inferior_or_Blind",
    scenario: "🎭 认知选择 (情感劣势与渴望)：集体融洽与情感共鸣向往",
    description: "我习惯了在冷静客观的逻辑和个人独立世界中分析事物，但我内心其实极其渴望去真诚关怀他人、去拥抱团队群体，并渴望被大家喜爱。我非常羡慕那些能天然维持人际融洽、散发着春风般温暖善意的人。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 渴望建立有温度的社交联结，向往并羡慕那种能让身边每个人都感到温情和归属的社交魅力。", weights: { Fe: 6, Ti: -2 }, label: "情感向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 认为保持理智边界和独立思考更重要，不特别向往那种过度合群或温情的人际氛围。", weights: { Ti: 4 }, label: "独立理性" }
    ]
  },
  {
    id: "p3_inf_fi_asp",
    phase: 3,
    type: "single",
    targetShadow: "Fi_Inferior_or_Blind",
    scenario: "❤️ 认知选择 (情感劣势与渴望)：灵魂本真与自我坚守向往",
    description: "我习惯了高效执行、追求客观指标与掌控全局，但我内心深处极其羡慕和向往那些能够全然忠于自我灵魂、毫无杂质地坚守本真情感与道德准则的人。我渴望自己也能拥有一片不受外界打扰的纯粹心灵净土。你的感受是：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 极其向往内心深处的自我一致与道德本真，羡慕那些灵魂纯粹、不被外界利弊和考核指标绑架的人。", weights: { Fi: 6, Te: -2 }, label: "信仰向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 更相信功利效能和客观大局的价值，并不向往过于感性、纯粹主观的个人道德净土。", weights: { Te: 4 }, label: "客观效能" }
    ]
  },
  {
    id: "p3_inf_ti_asp",
    phase: 3,
    type: "single",
    targetShadow: "Ti_Inferior_or_Blind",
    scenario: "🧩 认知选择 (思考劣势与渴望)：逻辑精密与自洽模型向往",
    description: "我习惯了为了集体和谐与情感共鸣而奔波，但我内心其实极其向往那种拥有精密底层逻辑、能完全不受他人情绪干扰而客观分析一切的独立心智。我非常羡慕那些能建立复杂自洽理论模型的理智极客。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 向往高度理智自洽与独立的底层拆解心智，羡慕那些能冷酷剖析概念、建立纯粹逻辑体系的人。", weights: { Ti: 6, Fe: -2 }, label: "理智向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 觉得情感温情、人际关怀和社会价值更重要，不特别渴望那种过于冰冷理智的公式化模型。", weights: { Fe: 4 }, label: "和谐共鸣" }
    ]
  },
  {
    id: "p3_inf_te_asp",
    phase: 3,
    type: "single",
    targetShadow: "Te_Inferior_or_Blind",
    scenario: "📊 认知选择 (思考劣势与渴望)：硬核推进与决断力量向往",
    description: "我注重内心的情感体验与本真操守，但我内心极其渴望拥有一套高效整理资源、果断推进现实项目的硬核执行力。我深深羡慕和向往那些在职场上杀伐决断、能以超强效能将宏伟设想彻底落地的人。你的态度是：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 向往高效推进、杀伐决断的客观效能，极其渴望自己也能掌握将设想转化为硬核现实的决断手段。", weights: { Te: 6, Fi: -2 }, label: "效能向往" },
      { id: "B", text: "不同意 / 否 (Disagree) - 更看重内心精神生活的自洽与真诚，并不向往那种过于刚硬和追求利益最大化的推进方式。", weights: { Fi: 4 }, label: "道德自洽" }
    ]
  },

  // --- 第 8 魔鬼功能彻底黑化维度 (Daemon Takeover Probes) ---
  {
    id: "p3_dem_si",
    phase: 3,
    type: "single",
    targetShadow: "Se_Inferior_or_Blind",
    scenario: "💀 认知选择 (魔鬼功能彻底黑化)：经验创伤退缩与细节折磨",
    description: "当遭遇极其沉重的感情背叛或信念崩溃等重大变故时，我会彻底放弃长远规划（Ni），整个人黑化并退缩进极端的负面经验细节中。我会疯狂翻出陈年旧账、执拗于琐碎过往，用身体的自残式透支或极端顽固的守旧规矩来折磨自己与他人。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 在极度毁灭性变故下，本能地退缩进过去的创伤印记中，用极端死板的经验细节进行毁灭性自我防御。", weights: { Si: 8, Ni: -4 }, label: "创伤防御" },
      { id: "B", text: "不同意 / 否 (Disagree) - 哪怕信念彻底坍塌，也会在精神的宏观走向中寻找出路，不会用琐碎往事与死板细节折磨自己。", weights: { Ni: 4 }, label: "精神坚守" }
    ]
  },
  {
    id: "p3_dem_se",
    phase: 3,
    type: "single",
    targetShadow: "Si_Inferior_or_Blind",
    scenario: "💥 认知选择 (魔鬼功能彻底黑化)：感官失控狂欢与物理破坏",
    description: "在面临自我认同彻底撕裂、精神世界崩溃的极端绝境下，我大脑中所有天马行空的灵感（Ne）会瞬间蒸发，取而代之的是纯粹冷酷的感官魔鬼。我会陷入失控的暴饮暴食、报复性纵欲或不计后果的疯狂肢体冒险，用最极端的身体快感和破坏欲来接管人生。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 在极度绝望时会被狂暴的感官冲动彻底接管，用最原始的物理感官享受和纯粹的物理破坏力去碾碎一切痛苦。", weights: { Se: 8, Ne: -4 }, label: "物理崩坏" },
      { id: "B", text: "不同意 / 否 (Disagree) - 哪怕在最深的绝望中，也会试图通过思维的转移或寻找新的理论出路来疗伤，不会被狂暴的感官冲动支配。", weights: { Ne: 4 }, label: "思维转移" }
    ]
  },
  {
    id: "p3_dem_ni",
    phase: 3,
    type: "single",
    targetShadow: "Ne_Inferior_or_Blind",
    scenario: "🔮 认知选择 (魔鬼功能彻底黑化)：宿命论黑暗深渊与阴谋直觉",
    description: "当面临多年坚守的生活根基或人际秩序彻底毁灭的深重打击时，我会彻底推翻按部就班的原则（Si），变得极度冷酷且充满宿命论阴谋论。我确信某种灾难性的命运已经注定，并坚信世人皆是带着恶意的伪君子，用极端的宿命论彻底将自己隔绝。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 在极端崩溃时被强烈的宿命感和阴谋论接管，彻底推翻理性秩序，用直觉推演一切最黑暗的结局。", weights: { Ni: 8, Si: -4 }, label: "宿命接管" },
      { id: "B", text: "不同意 / 否 (Disagree) - 即便秩序崩溃，也会依靠传统的经验规程与脚踏实地的行动自救，不会陷入黑暗的直觉预测中。", weights: { Si: 4 }, label: "常规防御" }
    ]
  },
  {
    id: "p3_dem_ne",
    phase: 3,
    type: "single",
    targetShadow: "Ni_Inferior_or_Blind",
    scenario: "🌪️ 认知选择 (魔鬼功能彻底黑化)：灾难可能性臆测与脑洞迫害",
    description: "在遭遇个人信念毁灭或情感坍塌等极端精神创伤时，我会彻底丧失当下的实操掌控力（Se），退化为一个充满荒谬灾难幻想的阴谋论者。我脑海里会疯狂泛滥出各种毫无逻辑依据的“最坏可能、迫害阴谋和荒诞假说”，甚至坚信整个世界都在针对我。你的态度是：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 在绝境中会彻底迷失在各种荒谬的灾难假说中，被发散的负面直觉接管，丧失对现实的实际掌控。", weights: { Ne: 8, Se: -4 }, label: "负面发散" },
      { id: "B", text: "不同意 / 否 (Disagree) - 哪怕遭遇重创，也只会关注眼前的实际生活细节与物理动作，不会陷入荒谬失控的脑洞内耗。", weights: { Se: 4 }, label: "现时实存" }
    ]
  },
  {
    id: "p3_dem_fi",
    phase: 3,
    type: "single",
    targetShadow: "Fe_Inferior_or_Blind",
    scenario: "❤️ 认知选择 (魔鬼功能彻底黑化)：黑化道德审判与毁灭性反击",
    description: "在经历极其深重的背叛、人际崩溃或良知撕裂等感情重创时，我会彻底摒弃冷酷的逻辑推理（Ti），被内心的黑化魔鬼（Fi）所接管。我会变得极度执拗、任性且充满道德毁灭感，带着强烈的恨意去审判身边每一个人的虚伪，甚至采取玉石俱焚的报复。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 极度重创下会彻底黑化，以冷酷偏执的黑化道德审判代替理性，带着玉石俱焚的自毁情绪反击世俗。", weights: { Fi: 8, Ti: -4 }, label: "道德审判" },
      { id: "B", text: "不同意 / 否 (Disagree) - 哪怕情感崩溃，也会尽量用冰冷隔离的逻辑划清界限，理性止损，而不会采取情感上的毁灭性玉石俱焚。", weights: { Ti: 4 }, label: "理智边界" }
    ]
  },
  {
    id: "p3_dem_fe",
    phase: 3,
    type: "single",
    targetShadow: "Fi_Inferior_or_Blind",
    scenario: "🎭 认知选择 (魔鬼功能彻底黑化)：假面情感操弄与道德勒索",
    description: "当面临事业坍塌、团队破产或核心信念毁灭的重大变故时，我会彻底卸下冰冷的绩效面具与效率推进（Te）。我会陷入一种歇斯底里、具有极大欺骗性和破坏性的情感操弄状态，利用假意的温情、装可怜或煽动人际情绪来彻底裹挟并毁灭身边的群体。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 极度变故下会退化为情感操弄的魔鬼，通过玩弄群体人际关系与歇斯底里的情感勒索来反噬他人。", weights: { Fe: 8, Te: -4 }, label: "情感勒索" },
      { id: "B", text: "不同意 / 否 (Disagree) - 即便彻底失败，也只会站在利弊得失的效率框架上硬撑或另起炉灶，不会利用伪善情感去伤害周围群体。", weights: { Te: 4 }, label: "效能防线" }
    ]
  },
  {
    id: "p3_dem_ti",
    phase: 3,
    type: "single",
    targetShadow: "Te_Inferior_or_Blind",
    scenario: "🧩 认知选择 (魔鬼功能彻底黑化)：逻辑利刃肢解与冷酷审判",
    description: "在经历彻底的精神打击或自尊粉碎的极端情感灾难后，我会彻底丧失内心本真的善意与道德操守（Fi）。我会突然黑化为一个冷酷无情、极致挑剔、纯理性利己主义的心智魔鬼，用尖酸刻薄、毫无温情且绝对严密的解构逻辑去残酷审判并刺痛对方的软肋。你认为：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 在被毁灭性刺痛后会彻底抛弃善意，转而用极其冰冷、残忍且精确无情的底层逻辑利刃去解构并刺痛他人。", weights: { Ti: 8, Fi: -4 }, label: "逻辑利刃" },
      { id: "B", text: "不同意 / 否 (Disagree) - 即便内心千疮百孔，也绝无法让自己变成一个毫无温情的冷酷逻辑机器去刺痛他人，仍会死守内心底线。", weights: { Fi: 4 }, label: "价值守护" }
    ]
  },
  {
    id: "p3_dem_te",
    phase: 3,
    type: "single",
    targetShadow: "Ti_Inferior_or_Blind",
    scenario: "📊 认知选择 (魔鬼功能彻底黑化)：冷酷强权碾碎与行政清除",
    description: "当面临人际关系彻底决裂、社会尊严被无情剥夺等极端深重的感情变故时，我会彻底撕下往日温情与和稀泥的社交面具（Fe），黑化为一个唯利是图、残酷无情的高效执行者。我会动用一切冷硬的行政手段、规则和权力工具，以最高效、最残忍的方式将对方在社会层面上彻底清除和粉碎。你的态度是：",
    options: [
      { id: "A", text: "同意 / 是 (Agree) - 在面具破裂时会彻底展现出极度冰冷残酷的权力与效能压制，用最硬核、不带任何情感的强硬手段清除障碍。", weights: { Te: 8, Fe: -4 }, label: "铁血碾碎" },
      { id: "B", text: "不同意 / 否 (Disagree) - 即便关系毁灭，也无法让自己变成一个纯粹冷血功利、运用行政强权手段摧毁他人的魔鬼，宁可抱憾离场。", weights: { Fe: 4 }, label: "善意留存" }
    ]
  }
];`;

if (!content.includes(targetBlock)) {
  console.error("Could not find the target end block p3_sh_ti_blind in mbtiQuizData.js!");
  process.exit(1);
}

content = content.replace(targetBlock, replacementBlock);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully added 8 Inferior Aspiration questions and 8 Daemon Takeover questions!");
