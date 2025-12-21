export interface Template {
  id: number;
  name: string;
  description: string;
  category: 'finish' | 'medal' | 'track' | 'victory';
  gender: 'male' | 'female' | 'unisex';
  imageUrl: string;
  thumbnailUrl: string;
}

export const templates: Template[] = [
  // 冲线时刻 - 男性
  {
    id: 1,
    name: "冲线荣耀",
    description: "经典的冲线瞬间，展现胜利者的姿态",
    category: 'finish',
    gender: 'male',
    imageUrl: "/templates/finish-male-1.jpg",
    thumbnailUrl: "/templates/finish-male-1-thumb.jpg"
  },
  {
    id: 2,
    name: "冲线突破",
    description: "突破极限的冲线时刻，汗水与荣耀并存",
    category: 'finish',
    gender: 'male',
    imageUrl: "/templates/finish-male-2.jpg",
    thumbnailUrl: "/templates/finish-male-2-thumb.jpg"
  },

  // 冲线时刻 - 女性
  {
    id: 3,
    name: "冲线绽放",
    description: "优雅的冲线姿态，绽放胜利的光芒",
    category: 'finish',
    gender: 'female',
    imageUrl: "/templates/finish-female-1.jpg",
    thumbnailUrl: "/templates/finish-female-1-thumb.jpg"
  },
  {
    id: 4,
    name: "冲线飞跃",
    description: "飞跃式的冲线瞬间，展现力量与美感",
    category: 'finish',
    gender: 'female',
    imageUrl: "/templates/finish-female-2.jpg",
    thumbnailUrl: "/templates/finish-female-2-thumb.jpg"
  },

  // 奖牌时刻 - 男性
  {
    id: 5,
    name: "奖牌荣耀",
    description: "佩戴奖牌的骄傲时刻，荣耀加身",
    category: 'medal',
    gender: 'male',
    imageUrl: "/templates/medal-male-1.jpg",
    thumbnailUrl: "/templates/medal-male-1-thumb.jpg"
  },
  {
    id: 6,
    name: "奖牌见证",
    description: "奖牌见证你的付出与坚持",
    category: 'medal',
    gender: 'male',
    imageUrl: "/templates/medal-male-2.jpg",
    thumbnailUrl: "/templates/medal-male-2-thumb.jpg"
  },

  // 奖牌时刻 - 女性
  {
    id: 7,
    name: "奖牌绽放",
    description: "奖牌在胸前的璀璨绽放",
    category: 'medal',
    gender: 'female',
    imageUrl: "/templates/medal-female-1.jpg",
    thumbnailUrl: "/templates/medal-female-1-thumb.jpg"
  },
  {
    id: 8,
    name: "奖牌微笑",
    description: "佩戴奖牌的幸福微笑",
    category: 'medal',
    gender: 'female',
    imageUrl: "/templates/medal-female-2.jpg",
    thumbnailUrl: "/templates/medal-female-2-thumb.jpg"
  },

  // 赛道风景 - 中性
  {
    id: 9,
    name: "赛道奔驰",
    description: "在赛道上自由奔驰的姿态",
    category: 'track',
    gender: 'unisex',
    imageUrl: "/templates/track-1.jpg",
    thumbnailUrl: "/templates/track-1-thumb.jpg"
  },
  {
    id: 10,
    name: "赛道坚持",
    description: "赛道上的坚持与毅力",
    category: 'track',
    gender: 'unisex',
    imageUrl: "/templates/track-2.jpg",
    thumbnailUrl: "/templates/track-2-thumb.jpg"
  },

  // 胜利手势 - 中性
  {
    id: 11,
    name: "胜利之V",
    description: "经典的胜利手势，V形符号",
    category: 'victory',
    gender: 'unisex',
    imageUrl: "/templates/victory-1.jpg",
    thumbnailUrl: "/templates/victory-1-thumb.jpg"
  },
  {
    id: 12,
    name: "胜利高举",
    description: "高举双手的胜利庆祝",
    category: 'victory',
    gender: 'unisex',
    imageUrl: "/templates/victory-2.jpg",
    thumbnailUrl: "/templates/victory-2-thumb.jpg"
  },
];

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return templates.filter(template => template.category === category);
}

export function getTemplateById(id: number): Template | undefined {
  return templates.find(template => template.id === id);
}

export function getRandomTemplate(): Template {
  return templates[Math.floor(Math.random() * templates.length)];
}
