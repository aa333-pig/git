const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

// --- Theme settings ---
pptx.layout = "LAYOUT_WIDE";
pptx.author = "浙江省就业研究课题组";
pptx.title = "关于促进浙江省高质量充分就业的对策建议";

// Color scheme
const C = {
  primary: "003d7a",
  accent: "c41e3a",
  light: "e8f0f8",
  dark: "1a1a2e",
  gray: "666666",
  white: "ffffff",
  lightGray: "f5f5f5",
};

// Helper: replace Chinese quotes in text for safe output
const LQ = "“"; // "
const RQ = "”"; // "

// --- Slide 1: Title ---
const slide1 = pptx.addSlide();
slide1.background = { color: C.primary };
slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: C.accent } });
slide1.addText("关于促进浙江省高质量充分就业的\n对策建议", {
  x: 1, y: 1.2, w: 11.33, h: 2.2,
  fontSize: 36, fontFace: "Microsoft YaHei", color: C.white, bold: true,
  align: "center", valign: "middle",
});
slide1.addShape(pptx.ShapeType.rect, { x: 4.5, y: 3.6, w: 4.33, h: 0.04, fill: { color: C.accent } });
slide1.addText("浙江省就业政策研究专题", {
  x: 1, y: 3.9, w: 11.33, h: 0.8,
  fontSize: 18, fontFace: "Microsoft YaHei", color: C.light, align: "center",
});
slide1.addText("2026年5月", {
  x: 1, y: 4.8, w: 11.33, h: 0.6,
  fontSize: 14, fontFace: "Microsoft YaHei", color: C.light, align: "center",
});

// --- Slide 2: Table of Contents ---
const slide2 = pptx.addSlide();
slide2.background = { color: C.white };
slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: C.accent } });
slide2.addText("汇 报 提 纲", {
  x: 0.5, y: 0.5, w: 4, h: 0.9,
  fontSize: 28, fontFace: "Microsoft YaHei", color: C.primary, bold: true,
});

const tocItems = [
  { num: "01", title: "意义与缘由", desc: "新时代新征程就业工作的新定位、新使命" },
  { num: "02", title: "突出问题", desc: "结构性矛盾、新业态质量、重点群体压力" },
  { num: "03", title: "对策建议", desc: "四大举措构建高质量充分就业新格局" },
  { num: "04", title: "结语", desc: `为全国就业治理现代化提供${LQ}浙江方案${RQ}` },
];

tocItems.forEach((item, i) => {
  const yBase = 1.8 + i * 1.15;
  slide2.addShape(pptx.ShapeType.ellipse, {
    x: 0.8, y: yBase, w: 0.65, h: 0.65, fill: { color: i === 2 ? C.accent : C.primary },
  });
  slide2.addText(item.num, {
    x: 0.8, y: yBase, w: 0.65, h: 0.65,
    fontSize: 16, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle",
  });
  slide2.addText(item.title, {
    x: 1.8, y: yBase - 0.02, w: 4, h: 0.4,
    fontSize: 20, fontFace: "Microsoft YaHei", color: C.dark, bold: true,
  });
  slide2.addText(item.desc, {
    x: 1.8, y: yBase + 0.38, w: 6, h: 0.3,
    fontSize: 13, fontFace: "Microsoft YaHei", color: C.gray,
  });
  if (i < 3) {
    slide2.addShape(pptx.ShapeType.line, {
      x: 1.8, y: yBase + 0.85, w: 9, h: 0, line: { color: "e0e0e0", width: 0.5 },
    });
  }
});

// --- Slide 3: 意义与缘由 ---
const slide3 = pptx.addSlide();
slide3.background = { color: C.white };
slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: C.accent } });
slide3.addText("一、意义与缘由", {
  x: 0.5, y: 0.4, w: 5, h: 0.8,
  fontSize: 26, fontFace: "Microsoft YaHei", color: C.primary, bold: true,
});
slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 1.2, h: 0.04, fill: { color: C.accent } });

const bgInfo = [
  {
    label: "国家战略",
    text: `党的二十大明确提出${LQ}促进高质量充分就业${RQ}的目标任务。2024年5月，习近平总书记在中央政治局第十四次集体学习时强调，促进高质量充分就业是新时代新征程就业工作的新定位、新使命。`,
  },
  {
    label: "浙江使命",
    text: `浙江作为高质量发展建设共同富裕示范区，高质量充分就业是${LQ}扩中提低${RQ}、缩小收入差距的根本支撑。2024年全省城乡居民收入倍差已缩小至1.83。`,
  },
  {
    label: "紧迫形势",
    text: `${LQ}十四五${RQ}期间就业人口增幅仅约2%（远低于${LQ}十三五${RQ}的10%）；2025年三季度就业信心指数降至113.3，创近年新低。从${LQ}有就业${RQ}向${LQ}高质量就业${RQ}转型刻不容缓。`,
  },
];

bgInfo.forEach((item, i) => {
  const yBase = 1.6 + i * 1.35;
  slide3.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: yBase, w: 12.33, h: 1.1,
    fill: { color: i % 2 === 0 ? C.light : C.lightGray },
    rectRadius: 0.1,
  });
  slide3.addText(item.label, {
    x: 0.8, y: yBase + 0.1, w: 1.8, h: 0.35,
    fontSize: 12, fontFace: "Microsoft YaHei", color: C.white, bold: true,
    fill: { color: C.accent }, align: "center",
  });
  slide3.addText(item.text, {
    x: 0.8, y: yBase + 0.48, w: 11.6, h: 0.55,
    fontSize: 13, fontFace: "Microsoft YaHei", color: C.dark, lineSpacingMultiple: 1.3,
  });
});

slide3.addText(`数据来源：浙江省统计局${LQ}2024年统计公报${RQ}、浙江省发展规划研究院（2025年11月）`, {
  x: 0.5, y: 5.8, w: 10, h: 0.4,
  fontSize: 10, fontFace: "Microsoft YaHei", color: C.gray, italic: true,
});

// --- Slide 4: 突出问题 ---
const slide4 = pptx.addSlide();
slide4.background = { color: C.white };
slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: C.accent } });
slide4.addText("二、突出问题", {
  x: 0.5, y: 0.4, w: 5, h: 0.8,
  fontSize: 26, fontFace: "Microsoft YaHei", color: C.primary, bold: true,
});
slide4.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 1.2, h: 0.04, fill: { color: C.accent } });

const problems = [
  {
    title: "结构性矛盾突出",
    items: [
      `求人倍率连续保持在1.6以上，企业${LQ}用工荒${RQ}与青年${LQ}就业难${RQ}并存`,
      "2025届高校毕业生单位就业占比仅72.2%，升学占比升至19.0%",
      `数字经济核心产业劳动生产率为全社会平均的2.3倍，但${LQ}数字+制造${RQ}复合型人才严重短缺`,
    ],
  },
  {
    title: "新就业形态质量不高",
    items: [
      "全省新就业形态群体近300万人，外卖骑手约110万人",
      "普遍面临社保覆盖不足、职业伤害风险高、技能积累有限",
    ],
  },
  {
    title: "重点群体压力加大",
    items: [
      "2025年全省将80万重点群体纳入就业帮扶",
      "AI技术加速渗透，低技能群体岗位替代风险上升",
    ],
  },
];

let pY = 1.6;
problems.forEach((prob) => {
  slide4.addText(prob.title, {
    x: 0.5, y: pY, w: 3.5, h: 0.4,
    fontSize: 16, fontFace: "Microsoft YaHei", color: C.accent, bold: true,
  });
  pY += 0.45;
  prob.items.forEach((item) => {
    slide4.addText("• " + item, {
      x: 0.8, y: pY, w: 11.5, h: 0.38,
      fontSize: 13, fontFace: "Microsoft YaHei", color: C.dark,
    });
    pY += 0.38;
  });
  pY += 0.2;
});

slide4.addText("数据来源：人社部官网（2025年3月）、浙江省发展规划研究院", {
  x: 0.5, y: 5.8, w: 10, h: 0.4,
  fontSize: 10, fontFace: "Microsoft YaHei", color: C.gray, italic: true,
});

// --- Slide 5-8: 对策建议 ---
const measures = [
  {
    num: "（一）",
    title: `构建${LQ}产业—就业—人才${RQ}联动机制，破解结构性矛盾`,
    points: [
      `建立重点产业人才需求预测预警制度，由省发改委牵头，会同经信厅、人社厅，按季度发布先进制造业、数字经济、现代服务业人才需求目录`,
      `实施${LQ}数字+制造${RQ}复合型人才专项培育计划，依托浙江大学、之江实验室等平台，到2027年新增数字高技能人才50万人以上`,
      `深化${LQ}一试双证${RQ}改革，在现有224批次试点基础上，2026年底前实现先进制造业重点领域全覆盖`,
      `设立县域数字人才专项补贴，推广${LQ}周末工程师${RQ}${LQ}云端专家${RQ}等柔性引才模式`,
    ],
    source: `人社部官网、浙江省社科联${LQ}之江策${RQ}2025年9月`,
  },
  {
    num: "（二）",
    title: "提升新就业形态就业质量，构建全周期保障体系",
    points: [
      "扩大职业伤害保障覆盖面，2026年底前将保障范围拓展至所有平台从业人员，实现300万新就业形态群体应保尽保",
      `建立灵活就业人员${LQ}技能银行${RQ}制度，依托${LQ}30分钟职业技能培训圈${RQ}提供免费短期培训，累计达标可兑换职业技能等级证书`,
      `引导平台企业建立${LQ}基础单价+技能等级溢价+全勤奖励${RQ}薪酬结构，推动灵活就业从${LQ}拼时长${RQ}向${LQ}拼技能${RQ}转型`,
      `建设灵活就业综合服务平台，整合社保缴纳、技能培训、法律援助、岗位对接等功能，实现${LQ}一码通办${RQ}`,
    ],
    source: `浙江省${LQ}2025年政府工作报告${RQ}`,
  },
  {
    num: "（三）",
    title: "强化重点群体精准帮扶，兜牢就业民生底线",
    points: [
      `做实${LQ}15分钟就业服务圈${RQ}，2026年底前实现全省所有街道和中心镇全覆盖，对零就业家庭实行${LQ}一户一策${RQ}动态清零`,
      `对离校未就业高校毕业生实行${LQ}131${RQ}服务（1次职业指导、3次岗位推荐、1次培训机会），开发政策性岗位3万个以上`,
      "建立大龄劳动者就业过渡机制，对距退休不足5年的大龄失业人员发放社保补贴，严禁年龄歧视",
      `深化${LQ}浙江无欠薪${RQ}行动，将保障范围拓展至新就业形态，建立工资支付监测预警平台`,
    ],
    source: `浙江省人民政府官网2025年4月、浙江省${LQ}2025年政府工作报告${RQ}`,
  },
  {
    num: "（四）",
    title: `以创业带动就业倍增，打造${LQ}浙里创业${RQ}最优生态`,
    points: [
      "设立省级青年入乡创业基金10亿元，聚焦智慧农业、农村电商、乡村旅游，每年扶持2000个以上青年创业项目，带动就业2万人以上",
      `推广${LQ}没有围墙的创业园${RQ}模式，在杭州、宁波等城市提供${LQ}零租金${RQ}孵化工位3万个`,
      "将个人创业担保贷款上限提高至80万元、小微企业提高至500万元，省财政安排创业担保基金5亿元",
      `构建${LQ}创业陪跑${RQ}全链条体系，引入创业导师2000名以上，提供${LQ}培训—陪跑—再创业${RQ}闭环支持`,
    ],
    source: `浙江省${LQ}2025年政府工作报告${RQ}、浙江省经济信息中心2025年4月报告`,
  },
];

measures.forEach((m) => {
  const slide = pptx.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: C.accent } });

  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.06, w: "100%", h: 0.7, fill: { color: C.primary } });
  slide.addText(`三、对策建议  ${m.num}`, {
    x: 0.5, y: 0.06, w: 12.33, h: 0.7,
    fontSize: 20, fontFace: "Microsoft YaHei", color: C.white, bold: true, valign: "middle",
  });

  slide.addText(m.title, {
    x: 0.5, y: 1.1, w: 12.33, h: 0.7,
    fontSize: 20, fontFace: "Microsoft YaHei", color: C.accent, bold: true, valign: "middle",
  });
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.8, w: 1.0, h: 0.03, fill: { color: C.accent } });

  const labels = ["需求导向", "人才培育", "改革创新", "激励保障"];

  m.points.forEach((point, pi) => {
    const yBase = 2.1 + pi * 0.82;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: yBase, w: 12.33, h: 0.72,
      fill: { color: pi % 2 === 0 ? C.light : C.lightGray },
      rectRadius: 0.08,
    });
    slide.addText(labels[pi] || "", {
      x: 0.75, y: yBase + 0.08, w: 1.5, h: 0.28,
      fontSize: 10, fontFace: "Microsoft YaHei", color: C.white, bold: true,
      fill: { color: C.primary }, align: "center",
    });
    slide.addText(point, {
      x: 2.5, y: yBase + 0.05, w: 10, h: 0.62,
      fontSize: 12.5, fontFace: "Microsoft YaHei", color: C.dark, lineSpacingMultiple: 1.2, valign: "middle",
    });
  });

  slide.addText(`数据来源：${m.source}`, {
    x: 0.5, y: 5.75, w: 10, h: 0.35,
    fontSize: 10, fontFace: "Microsoft YaHei", color: C.gray, italic: true,
  });
});

// --- Slide 9: 结语 ---
const slide9 = pptx.addSlide();
slide9.background = { color: C.primary };
slide9.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: C.accent } });
slide9.addText("四、结  语", {
  x: 1, y: 0.8, w: 11.33, h: 1,
  fontSize: 30, fontFace: "Microsoft YaHei", color: C.white, bold: true, align: "center",
});
slide9.addShape(pptx.ShapeType.rect, { x: 5.5, y: 1.8, w: 2.33, h: 0.04, fill: { color: C.accent } });

slide9.addText(
  `促进高质量充分就业，是浙江建设共同富裕示范区的${LQ}必答题${RQ}。\n\n` +
  "面对结构性矛盾、新业态质量不高、重点群体压力增大等多重挑战，\n" +
  `浙江应以${LQ}产业—就业—人才${RQ}联动破解结构矛盾，\n` +
  "以全周期保障提升灵活就业质量，\n" +
  "以精准帮扶兜牢民生底线，\n" +
  "以创业带动释放倍增效应，\n\n" +
  "加快构建高质量充分就业新格局，\n" +
  `为全国就业治理现代化提供${LQ}浙江方案${RQ}。`,
  {
    x: 1.5, y: 2.3, w: 10.33, h: 3.5,
    fontSize: 18, fontFace: "Microsoft YaHei", color: C.white,
    align: "center", valign: "middle", lineSpacingMultiple: 1.7,
  }
);

slide9.addText("谢  谢", {
  x: 1, y: 5.2, w: 11.33, h: 0.8,
  fontSize: 24, fontFace: "Microsoft YaHei", color: C.accent, bold: true, align: "center",
});

// --- Save ---
const outputPath = "C:\\Users\\赵景锋\\Desktop\\新建文件夹\\高质量充分就业对策建议.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(() => console.log("PPT 已生成: " + outputPath))
  .catch((err) => console.error("生成失败:", err));
