import fs from 'fs';
import path from 'path';

const filePath = path.resolve('/Users/dahuaigou/Documents/MBTI测试/src/data/mbtiQuizData.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

// Find the start index of the corrupted segment
const startKeyword = 'id: "B",\n        text: "强力支持企业松绑、市场竞争与效率优先。在当前的全球竞争和经济大势下，生存和发展才是唯一的硬道理export const PHASE3_SHADOW_POOL = [';
const startIndex = fileContent.indexOf(startKeyword);

// Find the end index of the corrupted segment (including label: "核心洞察")
const endKeyword = 'label: "核心洞察"\n      }\n    ]\n  },';
const endIndex = fileContent.indexOf(endKeyword, startIndex);

if (startIndex === -1) {
  console.error("Start keyword not found!");
  process.exit(1);
}
if (endIndex === -1) {
  console.error("End keyword not found!");
  process.exit(1);
}

// We want to replace from startIndex to endIndex + endKeyword.length
const fullEndIndex = endIndex + endKeyword.length;

console.log(`Found corrupted segment from index ${startIndex} to ${fullEndIndex}`);
console.log("Length of corrupted segment:", fullEndIndex - startIndex);

// Correct replacement content: Option B of p2_pol_econ, p2_pol_auth, p2_ad_ni_si_1, p2_ad_ni_si_2
const replacementContent = `id: "B",
        text: "强力支持企业松绑、市场竞争与效率优先。在当前的全球竞争和经济大势下，生存和发展才是唯一的硬道理。一味地用福利主义和过度的劳动法强监管来束缚企业，只会扼杀市场活力，导致资本撤退、小企业倒闭，最终反而伤害了劳动者自身的就业机会。国家应当做的是精简审批、减税降费、鼓励民营资本放手拼搏。只有把社会财富的蛋糕做大，用公平竞争的法则激发效率与创新，才能在根本上解决发展中的民生问题。",
        political: { econ: 30, auth: -5 }, // Economic Right
        weights: { Te: 5, Se: 4 },
        label: "市场效率"
      }
    ]
  },
  // 【政治与社会学轴二：国家秩序与个人权利 (Authoritarian/Libertarian Axis)】
  {
    id: "p2_pol_auth",
    targetAxis: "Political_Authoritarian",
    phase: 2,
    type: "single",
    scenario: "🛡️ 尖锐社会学探针二：关于“公共安全、社会秩序与个人自由隐私”的冲突困境",
    description: "当面临公共危机、或为了防范潜在的社会治安风险时，社会往往需要在‘强化国家监管与技术监控（如人脸识别、实名制、内容审核）以确保绝对安全和秩序’与‘捍卫个人隐私、言论空间与个体权利以防止公权力过度扩张’之间做出抉择。你骨子里最坚守的倾向是：",
    options: [
      {
        id: "A",
        text: "强力支持国家秩序与社会大局稳定。没有国家的强大控制力与高效的治安网络，个人的自由只会沦为沙中城堡。在治安威胁、网络谣言或重大社会危机面前，让渡一部分隐私和个体发言权是理性的必要代价。国家通过先进技术对公共空间实施强力监管和审核，不仅能最大程度维护老百姓的生命财产安全，更是确保社会长期长治久安、防范一切无序动荡的根本基石。",
        political: { econ: 0, auth: -30 }, // Authoritarian
        weights: { Te: 5, Si: 4 },
        label: "秩序大局"
      },
      {
        id: "B",
        text: "强力支持捍卫个人隐私与个体权利。公权力的边界如果得不到严苛的法律约束与公众舆论的监督，其自我膨胀与对个人空间的无孔不入将是所有人的噩梦。绝对的安全本身就是一个伪命题，以牺牲个人言论自由、通信隐私和行动自主为代价换来的所谓秩序，本质上是思想的囚笼。社会必须保留足够的批判空间和容错度，任何时候都应警惕公权力的过度渗透，优先捍卫个体的基本权利与尊严。",
        political: { econ: 0, auth: 30 }, // Libertarian
        weights: { Fi: 5, Ne: 4 },
        label: "个体自由"
      }
    ]
  },
  // 【轴一：Ni vs Si 深度判别】
  {
    id: "p2_ad_ni_si_1",
    targetAxis: "Ni_vs_Si",
    phase: 2,
    type: "single",
    scenario: "🔮 关于事物的底层规律与经验常识",
    description: "当你进入一个全新的复杂领域（如学习一门硬核新学科、面对一个极具挑战性的新项目）时，你最本能的认知切入习惯是哪一种？",
    options: [
      {
        id: "A",
        text: "首先在大脑中构筑起高度抽象的宏观骨架、核心演化路径或第一性原理。如果没有这套最底层的逻辑模型作为路标，即使收集再多的具体事实与数据，你也会觉得它们是一堆无序的噪音，无法在大脑里产生归属感。",
        weights: { Ni: 8, Si: -2 },
        label: "核心洞察"
      },
      {
        id: "B",
        text: "首先沉下心来，极其扎实地梳理和研读前人留留下来的经典案例、标准操作流程（SOP）和最详尽的基础数据。通过在细节上反复推敲、对比历史经验，你才能在踏实的经验积累中，逐渐建立起对全局的准确把握。",
        weights: { Si: 8, Ni: -2 },
        label: "经验重现"
      }
    ]
  },
  {
    id: "p2_ad_ni_si_2",
    targetAxis: "Ni_vs_Si",
    phase: 2,
    type: "single",
    scenario: "📖 面对一本硬核的理论/专业书籍或复杂的长篇文章",
    description: "当你翻开一本讨论宏观经济、技术哲学或历史规律的硬核书籍时，你最天然的注意力分配与理解习惯是：",
    options: [
      {
        id: "A",
        text: "倾向于关注具体落地、有据可查的事实、历史细节和可靠数据。你喜欢从已知和熟悉的经验出发，逐步、有序地构建知识或项目的全貌，排斥任何没有实际落脚点、虚无缥缈的空论。",
        weights: { Si: 8, Ni: -1 },
        label: "经验细节"
      },
      {
        id: "B",
        text: "相比具体的事实细节，你更迷恋隐藏在事物背后的演化规律、“第一性原理”或精神脉络。你必须先在脑海中建立起最宏观的骨架，否则那些具体细节对你毫无意义。",
        weights: { Ni: 8, Si: -1 },
        label: "核心洞察"
      }
    ]
  },`;

const newContent = fileContent.substring(0, startIndex) + replacementContent + fileContent.substring(fullEndIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Repair completed successfully!");
