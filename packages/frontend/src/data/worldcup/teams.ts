// 2026 美加墨世界杯 48支球队数据

export interface Team {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  group: string;
  fifaRank: number;
  coach: string;
  captain: string;
  starPlayer: string;
  worldCupTitles: number;
  bestResult: string;
  squad: Player[];
  recentMatches: RecentMatch[];
  prediction: Prediction;
}

export interface Player {
  number: number;
  name: string;
  position: string;
  age: number;
  club: string;
  isStarter?: boolean;
}

export interface RecentMatch {
  date: string;
  opponent: string;
  opponentFlag: string;
  result: string;
  score: string;
  competition: string;
}

export interface Prediction {
  groupStage: string;
  winProbability: number;
  championProbability: number;
  analysis: string;
}

// 国旗映射
export const flagMap: Record<string, string> = {
  'mexico': '🇲🇽', 'south-africa': '🇿🇦', 'south-korea': '🇰🇷', 'czech': '🇨🇿',
  'canada': '🇨🇦', 'bosnia': '🇧🇦', 'qatar': '🇶🇦', 'switzerland': '🇨🇭',
  'brazil': '🇧🇷', 'morocco': '🇲🇦', 'haiti': '🇭🇹', 'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'usa': '🇺🇸', 'paraguay': '🇵🇾', 'australia': '🇦🇺', 'turkey': '🇹🇷',
  'germany': '🇩🇪', 'curacao': '🇨🇼', 'ivory-coast': '🇨🇮', 'ecuador': '🇪🇨',
  'netherlands': '🇳🇱', 'japan': '🇯🇵', 'sweden': '🇸🇪', 'tunisia': '🇹🇳',
  'belgium': '🇧🇪', 'egypt': '🇪🇬', 'iran': '🇮🇷', 'new-zealand': '🇳🇿',
  'spain': '🇪🇸', 'cape-verde': '🇨🇻', 'saudi-arabia': '🇸🇦', 'uruguay': '🇺🇾',
  'france': '🇫🇷', 'senegal': '🇸🇳', 'iraq': '🇮🇶', 'norway': '🇳🇴',
  'argentina': '🇦🇷', 'algeria': '🇩🇿', 'austria': '🇦🇹', 'jordan': '🇯🇴',
  'portugal': '🇵🇹', 'dr-congo': '🇨🇩', 'uzbekistan': '🇺🇿', 'colombia': '🇨🇴',
  'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'croatia': '🇭🇷', 'ghana': '🇬🇭', 'panama': '🇵🇦',
};

// 球队ID到名称映射
export const teamNames: Record<string, { name: string; nameEn: string }> = {
  'mexico': { name: '墨西哥', nameEn: 'Mexico' },
  'south-africa': { name: '南非', nameEn: 'South Africa' },
  'south-korea': { name: '韩国', nameEn: 'South Korea' },
  'czech': { name: '捷克', nameEn: 'Czech Republic' },
  'canada': { name: '加拿大', nameEn: 'Canada' },
  'bosnia': { name: '波黑', nameEn: 'Bosnia & Herzegovina' },
  'qatar': { name: '卡塔尔', nameEn: 'Qatar' },
  'switzerland': { name: '瑞士', nameEn: 'Switzerland' },
  'brazil': { name: '巴西', nameEn: 'Brazil' },
  'morocco': { name: '摩洛哥', nameEn: 'Morocco' },
  'haiti': { name: '海地', nameEn: 'Haiti' },
  'scotland': { name: '苏格兰', nameEn: 'Scotland' },
  'usa': { name: '美国', nameEn: 'USA' },
  'paraguay': { name: '巴拉圭', nameEn: 'Paraguay' },
  'australia': { name: '澳大利亚', nameEn: 'Australia' },
  'turkey': { name: '土耳其', nameEn: 'Turkey' },
  'germany': { name: '德国', nameEn: 'Germany' },
  'curacao': { name: '库拉索', nameEn: 'Curacao' },
  'ivory-coast': { name: '科特迪瓦', nameEn: 'Ivory Coast' },
  'ecuador': { name: '厄瓜多尔', nameEn: 'Ecuador' },
  'netherlands': { name: '荷兰', nameEn: 'Netherlands' },
  'japan': { name: '日本', nameEn: 'Japan' },
  'sweden': { name: '瑞典', nameEn: 'Sweden' },
  'tunisia': { name: '突尼斯', nameEn: 'Tunisia' },
  'belgium': { name: '比利时', nameEn: 'Belgium' },
  'egypt': { name: '埃及', nameEn: 'Egypt' },
  'iran': { name: '伊朗', nameEn: 'Iran' },
  'new-zealand': { name: '新西兰', nameEn: 'New Zealand' },
  'spain': { name: '西班牙', nameEn: 'Spain' },
  'cape-verde': { name: '佛得角', nameEn: 'Cape Verde' },
  'saudi-arabia': { name: '沙特阿拉伯', nameEn: 'Saudi Arabia' },
  'uruguay': { name: '乌拉圭', nameEn: 'Uruguay' },
  'france': { name: '法国', nameEn: 'France' },
  'senegal': { name: '塞内加尔', nameEn: 'Senegal' },
  'iraq': { name: '伊拉克', nameEn: 'Iraq' },
  'norway': { name: '挪威', nameEn: 'Norway' },
  'argentina': { name: '阿根廷', nameEn: 'Argentina' },
  'algeria': { name: '阿尔及利亚', nameEn: 'Algeria' },
  'austria': { name: '奥地利', nameEn: 'Austria' },
  'jordan': { name: '约旦', nameEn: 'Jordan' },
  'portugal': { name: '葡萄牙', nameEn: 'Portugal' },
  'dr-congo': { name: '民主刚果', nameEn: 'DR Congo' },
  'uzbekistan': { name: '乌兹别克斯坦', nameEn: 'Uzbekistan' },
  'colombia': { name: '哥伦比亚', nameEn: 'Colombia' },
  'england': { name: '英格兰', nameEn: 'England' },
  'croatia': { name: '克罗地亚', nameEn: 'Croatia' },
  'ghana': { name: '加纳', nameEn: 'Ghana' },
  'panama': { name: '巴拿马', nameEn: 'Panama' },
};

// 各小组球队
export const groups: Record<string, string[]> = {
  'A': ['mexico', 'south-africa', 'south-korea', 'czech'],
  'B': ['canada', 'bosnia', 'qatar', 'switzerland'],
  'C': ['brazil', 'morocco', 'haiti', 'scotland'],
  'D': ['usa', 'paraguay', 'australia', 'turkey'],
  'E': ['germany', 'curacao', 'ivory-coast', 'ecuador'],
  'F': ['netherlands', 'japan', 'sweden', 'tunisia'],
  'G': ['belgium', 'egypt', 'iran', 'new-zealand'],
  'H': ['spain', 'cape-verde', 'saudi-arabia', 'uruguay'],
  'I': ['france', 'senegal', 'iraq', 'norway'],
  'J': ['argentina', 'algeria', 'austria', 'jordan'],
  'K': ['portugal', 'dr-congo', 'uzbekistan', 'colombia'],
  'L': ['england', 'croatia', 'ghana', 'panama'],
};

// 生成球队详细信息
function generateSquad(teamId: string): Player[] {
  const positions = ['GK', 'DF', 'DF', 'DF', 'DF', 'MF', 'MF', 'MF', 'FW', 'FW', 'FW'];
  const squadMap: Record<string, { players: { name: string; pos: string; age: number; club: string }[]; coach: string; captain: string; star: string; titles: number; best: string }> = {
    'argentina': {
      coach: '利昂内尔·斯卡洛尼',
      captain: '利昂内尔·梅西',
      star: '利昂内尔·梅西',
      titles: 3,
      best: '冠军（1978, 1986, 2022）',
      players: [
        { name: '达米安·马丁内斯', pos: 'GK', age: 33, club: '阿斯顿维拉' },
        { name: '纳韦尔·莫利纳', pos: 'DF', age: 27, club: '马德里竞技' },
        { name: '克里斯蒂安·罗梅罗', pos: 'DF', age: 27, club: '热刺' },
        { name: '尼古拉斯·奥塔门迪', pos: 'DF', age: 37, club: '本菲卡' },
        { name: '尼古拉斯·塔利亚菲科', pos: 'DF', age: 32, club: '里昂' },
        { name: '德保罗', pos: 'MF', age: 31, club: '马德里竞技' },
        { name: '恩佐·费尔南德斯', pos: 'MF', age: 24, club: '切尔西' },
        { name: '麦卡利斯特', pos: 'MF', age: 26, club: '利物浦' },
        { name: '阿尔瓦雷斯', pos: 'FW', age: 25, club: '马德里竞技' },
        { name: '劳塔罗·马丁内斯', pos: 'FW', age: 28, club: '国际米兰' },
        { name: '利昂内尔·梅西', pos: 'FW', age: 39, club: '迈阿密国际' },
        { name: '鲁利', pos: 'GK', age: 33, club: '马赛' },
        { name: '利桑德罗·马丁内斯', pos: 'DF', age: 27, club: '曼联' },
        { name: '蒙铁尔', pos: 'DF', age: 28, club: '塞维利亚' },
        { name: '洛塞尔索', pos: 'MF', age: 29, club: '皇家贝蒂斯' },
        { name: '帕雷德斯', pos: 'MF', age: 31, club: '罗马' },
        { name: '迪马利亚', pos: 'FW', age: 38, club: '本菲卡' },
        { name: '加纳乔', pos: 'FW', age: 21, club: '曼联' },
        { name: '巴雷拉', pos: 'MF', age: 22, club: '科莫' },
        { name: '科雷亚', pos: 'FW', age: 30, club: '马德里竞技' },
        { name: '佩泽拉', pos: 'DF', age: 34, club: '皇家贝蒂斯' },
        { name: '圭多·罗德里格斯', pos: 'MF', age: 31, club: '西汉姆联' },
        { name: '阿尔马尼', pos: 'GK', age: 39, club: '河床' },
      ]
    },
    'france': {
      coach: '迪迪埃·德尚',
      captain: '姆巴佩',
      star: '姆巴佩',
      titles: 2,
      best: '冠军（1998, 2018）',
      players: [
        { name: '迈尼昂', pos: 'GK', age: 30, club: 'AC米兰' },
        { name: '孔德', pos: 'DF', age: 26, club: '巴塞罗那' },
        { name: '萨利巴', pos: 'DF', age: 24, club: '阿森纳' },
        { name: '于帕梅卡诺', pos: 'DF', age: 26, club: '拜仁慕尼黑' },
        { name: '特奥·埃尔南德斯', pos: 'DF', age: 27, club: 'AC米兰' },
        { name: '坎特', pos: 'MF', age: 35, club: '吉达联合' },
        { name: '楚阿梅尼', pos: 'MF', age: 25, club: '皇家马德里' },
        { name: '卡马文加', pos: 'MF', age: 22, club: '皇家马德里' },
        { name: '登贝莱', pos: 'FW', age: 28, club: '巴黎圣日耳曼' },
        { name: '姆巴佩', pos: 'FW', age: 27, club: '皇家马德里' },
        { name: '格里兹曼', pos: 'FW', age: 35, club: '马德里竞技' },
        { name: '阿雷奥拉', pos: 'GK', age: 32, club: '西汉姆联' },
        { name: '帕瓦尔', pos: 'DF', age: 29, club: '国际米兰' },
        { name: '科纳特', pos: 'DF', age: 26, club: '利物浦' },
        { name: '拉比奥', pos: 'MF', age: 30, club: '马赛' },
        { name: '科曼', pos: 'FW', age: 29, club: '拜仁慕尼黑' },
        { name: '穆阿尼', pos: 'FW', age: 27, club: '巴黎圣日耳曼' },
        { name: '图拉姆', pos: 'FW', age: 24, club: '国际米兰' },
        { name: '福法纳', pos: 'MF', age: 26, club: '切尔西' },
        { name: '克劳斯', pos: 'DF', age: 33, club: '尼斯' },
        { name: '恩昆库', pos: 'FW', age: 28, club: '切尔西' },
        { name: '迈尼昂', pos: 'GK', age: 30, club: 'AC米兰' },
        { name: '巴尔科拉', pos: 'FW', age: 22, club: '巴黎圣日耳曼' },
      ]
    },
    'brazil': {
      coach: '多里瓦尔·儒尼奥尔',
      captain: '卡塞米罗',
      star: '维尼修斯',
      titles: 5,
      best: '冠军（1958, 1962, 1970, 1994, 2002）',
      players: [
        { name: '阿利松', pos: 'GK', age: 33, club: '利物浦' },
        { name: '达尼洛', pos: 'DF', age: 34, club: '尤文图斯' },
        { name: '马尔基尼奥斯', pos: 'DF', age: 31, club: '巴黎圣日耳曼' },
        { name: '加布里埃尔', pos: 'DF', age: 27, club: '阿森纳' },
        { name: '阿拉纳', pos: 'DF', age: 28, club: '米内罗竞技' },
        { name: '卡塞米罗', pos: 'MF', age: 33, club: '曼联' },
        { name: '帕奎塔', pos: 'MF', age: 28, club: '西汉姆联' },
        { name: '吉马良斯', pos: 'MF', age: 27, club: '纽卡斯尔' },
        { name: '拉菲尼亚', pos: 'FW', age: 28, club: '巴塞罗那' },
        { name: '维尼修斯', pos: 'FW', age: 25, club: '皇家马德里' },
        { name: '罗德里戈', pos: 'FW', age: 24, club: '皇家马德里' },
        { name: '埃德森', pos: 'GK', age: 32, club: '曼城' },
        { name: '米利唐', pos: 'DF', age: 27, club: '皇家马德里' },
        { name: '布雷默', pos: 'DF', age: 28, club: '尤文图斯' },
        { name: '道格拉斯·路易斯', pos: 'MF', age: 27, club: '尤文图斯' },
        { name: '安德烈', pos: 'MF', age: 24, club: '狼队' },
        { name: '萨维尼奥', pos: 'FW', age: 21, club: '曼城' },
        { name: '恩德里克', pos: 'FW', age: 19, club: '皇家马德里' },
        { name: '埃万尼尔松', pos: 'FW', age: 26, club: '伯恩茅斯' },
        { name: '特莱斯', pos: 'DF', age: 32, club: '利雅得胜利' },
        { name: '佩雷拉', pos: 'MF', age: 29, club: '富勒姆' },
        { name: '本托', pos: 'GK', age: 26, club: '利雅得胜利' },
        { name: '马丁内利', pos: 'FW', age: 24, club: '阿森纳' },
      ]
    },
    'england': {
      coach: '托马斯·图赫尔',
      captain: '哈里·凯恩',
      star: '贝林厄姆',
      titles: 1,
      best: '冠军（1966）',
      players: [
        { name: '皮克福德', pos: 'GK', age: 32, club: '埃弗顿' },
        { name: '沃克', pos: 'DF', age: 35, club: 'AC米兰' },
        { name: '斯通斯', pos: 'DF', age: 31, club: '曼城' },
        { name: '格伊', pos: 'DF', age: 25, club: '水晶宫' },
        { name: '卢克·肖', pos: 'DF', age: 30, club: '曼联' },
        { name: '赖斯', pos: 'MF', age: 26, club: '阿森纳' },
        { name: '贝林厄姆', pos: 'MF', age: 22, club: '皇家马德里' },
        { name: '福登', pos: 'MF', age: 25, club: '曼城' },
        { name: '萨卡', pos: 'FW', age: 24, club: '阿森纳' },
        { name: '哈里·凯恩', pos: 'FW', age: 32, club: '拜仁慕尼黑' },
        { name: '帕尔默', pos: 'FW', age: 23, club: '切尔西' },
        { name: '拉姆斯代尔', pos: 'GK', age: 27, club: '南安普顿' },
        { name: '阿诺德', pos: 'DF', age: 26, club: '利物浦' },
        { name: '科尔维尔', pos: 'DF', age: 22, club: '切尔西' },
        { name: '加拉格尔', pos: 'MF', age: 25, club: '马德里竞技' },
        { name: '梅努', pos: 'MF', age: 20, club: '曼联' },
        { name: '麦迪逊', pos: 'MF', age: 28, club: '热刺' },
        { name: '格拉利什', pos: 'FW', age: 30, club: '曼城' },
        { name: '沃特金斯', pos: 'FW', age: 29, club: '阿斯顿维拉' },
        { name: '亨德森', pos: 'GK', age: 35, club: '水晶宫' },
        { name: '特里皮尔', pos: 'DF', age: 34, club: '纽卡斯尔' },
        { name: '埃泽', pos: 'FW', age: 27, club: '水晶宫' },
        { name: '戈登', pos: 'FW', age: 24, club: '纽卡斯尔' },
      ]
    },
    'spain': {
      coach: '路易斯·德拉富恩特',
      captain: '莫拉塔',
      star: '亚马尔',
      titles: 1,
      best: '冠军（2010）',
      players: [
        { name: '乌奈·西蒙', pos: 'GK', age: 28, club: '毕尔巴鄂竞技' },
        { name: '卡瓦哈尔', pos: 'DF', age: 33, club: '皇家马德里' },
        { name: '勒诺尔芒', pos: 'DF', age: 28, club: '马德里竞技' },
        { name: '拉波尔特', pos: 'DF', age: 31, club: '利雅得胜利' },
        { name: '格里马尔多', pos: 'DF', age: 30, club: '勒沃库森' },
        { name: '罗德里', pos: 'MF', age: 29, club: '曼城' },
        { name: '佩德里', pos: 'MF', age: 22, club: '巴塞罗那' },
        { name: '法比安', pos: 'MF', age: 29, club: '巴黎圣日耳曼' },
        { name: '亚马尔', pos: 'FW', age: 18, club: '巴塞罗那' },
        { name: '莫拉塔', pos: 'FW', age: 32, club: 'AC米兰' },
        { name: '尼科·威廉姆斯', pos: 'FW', age: 23, club: '毕尔巴鄂竞技' },
        { name: '拉亚', pos: 'GK', age: 30, club: '阿森纳' },
        { name: '纳瓦斯', pos: 'DF', age: 39, club: '塞维利亚' },
        { name: '保·托雷斯', pos: 'DF', age: 28, club: '阿斯顿维拉' },
        { name: '梅里诺', pos: 'MF', age: 28, club: '阿森纳' },
        { name: '祖比门迪', pos: 'MF', age: 26, club: '皇家社会' },
        { name: '奥尔莫', pos: 'FW', age: 27, club: '巴塞罗那' },
        { name: '奥亚萨瓦尔', pos: 'FW', age: 28, club: '皇家社会' },
        { name: '阿森西奥', pos: 'FW', age: 29, club: '巴黎圣日耳曼' },
        { name: '库库雷利亚', pos: 'DF', age: 26, club: '切尔西' },
        { name: '巴埃纳', pos: 'MF', age: 23, club: '比利亚雷亚尔' },
        { name: '费尔明', pos: 'MF', age: 22, club: '巴塞罗那' },
        { name: '何塞卢', pos: 'FW', age: 35, club: '加拉法' },
      ]
    },
    'germany': {
      coach: '尤利安·纳格尔斯曼',
      captain: '基米希',
      star: '穆西亚拉',
      titles: 4,
      best: '冠军（1954, 1974, 1990, 2014）',
      players: [
        { name: '诺伊尔', pos: 'GK', age: 40, club: '拜仁慕尼黑' },
        { name: '基米希', pos: 'DF', age: 30, club: '拜仁慕尼黑' },
        { name: '吕迪格', pos: 'DF', age: 32, club: '皇家马德里' },
        { name: '塔', pos: 'DF', age: 29, club: '勒沃库森' },
        { name: '米特尔施泰特', pos: 'DF', age: 28, club: '斯图加特' },
        { name: '安德里希', pos: 'MF', age: 30, club: '勒沃库森' },
        { name: '穆西亚拉', pos: 'MF', age: 23, club: '拜仁慕尼黑' },
        { name: '维尔茨', pos: 'MF', age: 22, club: '勒沃库森' },
        { name: '萨内', pos: 'FW', age: 29, club: '拜仁慕尼黑' },
        { name: '哈弗茨', pos: 'FW', age: 26, club: '阿森纳' },
        { name: '菲尔克鲁格', pos: 'FW', age: 32, club: '西汉姆联' },
        { name: '特尔施特根', pos: 'GK', age: 33, club: '巴塞罗那' },
        { name: '劳姆', pos: 'DF', age: 28, club: '莱比锡' },
        { name: '施洛特贝克', pos: 'DF', age: 26, club: '多特蒙德' },
        { name: '格罗斯', pos: 'MF', age: 34, club: '多特蒙德' },
        { name: '京多安', pos: 'MF', age: 34, club: '曼城' },
        { name: '布兰特', pos: 'MF', age: 29, club: '多特蒙德' },
        { name: '格纳布里', pos: 'FW', age: 30, club: '拜仁慕尼黑' },
        { name: '翁达夫', pos: 'FW', age: 29, club: '斯图加特' },
        { name: '科赫', pos: 'DF', age: 29, club: '法兰克福' },
        { name: '亨里希斯', pos: 'DF', age: 28, club: '莱比锡' },
        { name: '鲍曼', pos: 'GK', age: 35, club: '霍芬海姆' },
        { name: '拜尔', pos: 'FW', age: 22, club: '多特蒙德' },
      ]
    },
    'portugal': {
      coach: '罗伯托·马丁内斯',
      captain: 'C罗',
      star: 'C罗',
      titles: 0,
      best: '季军（1966）',
      players: [
        { name: '迪奥戈·科斯塔', pos: 'GK', age: 26, club: '波尔图' },
        { name: '达洛特', pos: 'DF', age: 26, club: '曼联' },
        { name: '鲁本·迪亚斯', pos: 'DF', age: 28, club: '曼城' },
        { name: '安东尼奥·席尔瓦', pos: 'DF', age: 21, club: '本菲卡' },
        { name: '努诺·门德斯', pos: 'DF', age: 23, club: '巴黎圣日耳曼' },
        { name: '帕利尼亚', pos: 'MF', age: 30, club: '拜仁慕尼黑' },
        { name: '布鲁诺·费尔南德斯', pos: 'MF', age: 30, club: '曼联' },
        { name: '维蒂尼亚', pos: 'MF', age: 25, club: '巴黎圣日耳曼' },
        { name: '贝尔纳多·席尔瓦', pos: 'FW', age: 31, club: '曼城' },
        { name: 'C罗', pos: 'FW', age: 41, club: '利雅得胜利' },
        { name: '莱奥', pos: 'FW', age: 26, club: 'AC米兰' },
        { name: '若泽·萨', pos: 'GK', age: 32, club: '狼队' },
        { name: '坎塞洛', pos: 'DF', age: 31, club: '利雅得新月' },
        { name: '伊纳西奥', pos: 'DF', age: 24, club: '葡萄牙体育' },
        { name: '内维斯', pos: 'MF', age: 27, club: '巴黎圣日耳曼' },
        { name: '若昂·内维斯', pos: 'MF', age: 20, club: '巴黎圣日耳曼' },
        { name: '菲利克斯', pos: 'FW', age: 26, club: 'AC米兰' },
        { name: '内托', pos: 'FW', age: 25, club: '切尔西' },
        { name: '贡萨洛·拉莫斯', pos: 'FW', age: 24, club: '巴黎圣日耳曼' },
        { name: '塞梅多', pos: 'DF', age: 31, club: '狼队' },
        { name: '鲁伊', pos: 'DF', age: 30, club: '那不勒斯' },
        { name: '佩德罗·内托', pos: 'FW', age: 25, club: '切尔西' },
        { name: '特林康', pos: 'FW', age: 26, club: '葡萄牙体育' },
      ]
    },
  };

  const defaultData = {
    coach: '待定',
    captain: '待定',
    star: '待定',
    titles: 0,
    best: '待定',
    players: Array.from({ length: 23 }, (_, i) => ({
      name: `球员 ${i + 1}`,
      pos: positions[i % positions.length] || 'MF',
      age: 25 + (i % 10),
      club: '待定',
    })),
  };

  const data = squadMap[teamId] || defaultData;

  return data.players.map((p, i) => ({
    number: i + 1,
    name: p.name,
    position: p.pos,
    age: p.age,
    club: p.club,
    isStarter: i < 11,
  }));
}

function generateRecentMatches(teamId: string): RecentMatch[] {
  const matchMap: Record<string, RecentMatch[]> = {
    'argentina': [
      { date: '2025-11-19', opponent: '秘鲁', opponentFlag: '🇵🇪', result: 'W', score: '2-0', competition: '世预赛南美区' },
      { date: '2025-11-14', opponent: '乌拉圭', opponentFlag: '🇺🇾', result: 'W', score: '1-0', competition: '世预赛南美区' },
      { date: '2025-10-15', opponent: '巴拉圭', opponentFlag: '🇵🇾', result: 'D', score: '1-1', competition: '世预赛南美区' },
      { date: '2025-10-10', opponent: '智利', opponentFlag: '🇨🇱', result: 'W', score: '3-0', competition: '世预赛南美区' },
      { date: '2025-09-09', opponent: '哥伦比亚', opponentFlag: '🇨🇴', result: 'L', score: '1-2', competition: '世预赛南美区' },
    ],
    'france': [
      { date: '2025-11-19', opponent: '意大利', opponentFlag: '🇮🇹', result: 'W', score: '3-1', competition: '欧国联' },
      { date: '2025-11-15', opponent: '克罗地亚', opponentFlag: '🇭🇷', result: 'W', score: '2-0', competition: '欧国联' },
      { date: '2025-10-14', opponent: '比利时', opponentFlag: '🇧🇪', result: 'D', score: '1-1', competition: '欧国联' },
      { date: '2025-10-11', opponent: '以色列', opponentFlag: '🇮🇱', result: 'W', score: '4-1', competition: '欧国联' },
      { date: '2025-09-09', opponent: '德国', opponentFlag: '🇩🇪', result: 'W', score: '2-1', competition: '友谊赛' },
    ],
    'brazil': [
      { date: '2025-11-19', opponent: '智利', opponentFlag: '🇨🇱', result: 'W', score: '2-0', competition: '世预赛南美区' },
      { date: '2025-11-14', opponent: '哥伦比亚', opponentFlag: '🇨🇴', result: 'D', score: '1-1', competition: '世预赛南美区' },
      { date: '2025-10-15', opponent: '委内瑞拉', opponentFlag: '🇻🇪', result: 'W', score: '3-1', competition: '世预赛南美区' },
      { date: '2025-10-10', opponent: '秘鲁', opponentFlag: '🇵🇪', result: 'W', score: '2-0', competition: '世预赛南美区' },
      { date: '2025-09-09', opponent: '厄瓜多尔', opponentFlag: '🇪🇨', result: 'D', score: '0-0', competition: '世预赛南美区' },
    ],
    'england': [
      { date: '2025-11-19', opponent: '西班牙', opponentFlag: '🇪🇸', result: 'W', score: '2-1', competition: '欧国联' },
      { date: '2025-11-15', opponent: '希腊', opponentFlag: '🇬🇷', result: 'W', score: '3-0', competition: '欧国联' },
      { date: '2025-10-14', opponent: '芬兰', opponentFlag: '🇫🇮', result: 'W', score: '2-0', competition: '欧国联' },
      { date: '2025-10-11', opponent: '爱尔兰', opponentFlag: '🇮🇪', result: 'D', score: '1-1', competition: '欧国联' },
      { date: '2025-09-09', opponent: '荷兰', opponentFlag: '🇳🇱', result: 'W', score: '2-1', competition: '友谊赛' },
    ],
    'spain': [
      { date: '2025-11-19', opponent: '英格兰', opponentFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', result: 'L', score: '1-2', competition: '欧国联' },
      { date: '2025-11-15', opponent: '塞尔维亚', opponentFlag: '🇷🇸', result: 'W', score: '3-0', competition: '欧国联' },
      { date: '2025-10-14', opponent: '丹麦', opponentFlag: '🇩🇰', result: 'W', score: '2-1', competition: '欧国联' },
      { date: '2025-10-11', opponent: '瑞士', opponentFlag: '🇨🇭', result: 'W', score: '4-1', competition: '欧国联' },
      { date: '2025-09-09', opponent: '法国', opponentFlag: '🇫🇷', result: 'D', score: '1-1', competition: '友谊赛' },
    ],
    'germany': [
      { date: '2025-11-19', opponent: '荷兰', opponentFlag: '🇳🇱', result: 'W', score: '2-1', competition: '欧国联' },
      { date: '2025-11-15', opponent: '波黑', opponentFlag: '🇧🇦', result: 'W', score: '3-0', competition: '欧国联' },
      { date: '2025-10-14', opponent: '匈牙利', opponentFlag: '🇭🇺', result: 'D', score: '1-1', competition: '欧国联' },
      { date: '2025-10-11', opponent: '奥地利', opponentFlag: '🇦🇹', result: 'W', score: '2-0', competition: '欧国联' },
      { date: '2025-09-09', opponent: '法国', opponentFlag: '🇫🇷', result: 'L', score: '1-2', competition: '友谊赛' },
    ],
    'portugal': [
      { date: '2025-11-19', opponent: '克罗地亚', opponentFlag: '🇭🇷', result: 'W', score: '2-1', competition: '欧国联' },
      { date: '2025-11-15', opponent: '波兰', opponentFlag: '🇵🇱', result: 'W', score: '3-1', competition: '欧国联' },
      { date: '2025-10-14', opponent: '苏格兰', opponentFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', result: 'W', score: '2-0', competition: '欧国联' },
      { date: '2025-10-11', opponent: '丹麦', opponentFlag: '🇩🇰', result: 'D', score: '1-1', competition: '欧国联' },
      { date: '2025-09-09', opponent: '斯洛文尼亚', opponentFlag: '🇸🇮', result: 'W', score: '2-0', competition: '友谊赛' },
    ],
  };

  const defaults: RecentMatch[] = [
    { date: '2025-11-19', opponent: '友谊对手A', opponentFlag: '🏳️', result: 'W', score: '2-0', competition: '友谊赛' },
    { date: '2025-11-15', opponent: '友谊对手B', opponentFlag: '🏳️', result: 'D', score: '1-1', competition: '友谊赛' },
    { date: '2025-10-14', opponent: '友谊对手C', opponentFlag: '🏳️', result: 'W', score: '3-1', competition: '友谊赛' },
    { date: '2025-10-10', opponent: '友谊对手D', opponentFlag: '🏳️', result: 'W', score: '2-1', competition: '友谊赛' },
    { date: '2025-09-09', opponent: '友谊对手E', opponentFlag: '🏳️', result: 'L', score: '0-1', competition: '友谊赛' },
  ];

  return matchMap[teamId] || defaults;
}

function getPrediction(teamId: string): Prediction {
  const predictions: Record<string, Prediction> = {
    'argentina': { groupStage: '小组第一出线', winProbability: 18, championProbability: 14, analysis: '卫冕冠军，梅西最后一届世界杯，阵容经验丰富，但球员年龄偏大。' },
    'france': { groupStage: '小组第一出线', winProbability: 20, championProbability: 16, analysis: '阵容深度世界最强，姆巴佩正值巅峰，后防线稳固。' },
    'brazil': { groupStage: '小组第一出线', winProbability: 17, championProbability: 13, analysis: '五星巴西底蕴深厚，维尼修斯领衔新生代，进攻火力强劲。' },
    'england': { groupStage: '小组第一出线', winProbability: 15, championProbability: 11, analysis: '图赫尔执教后战术更灵活，凯恩领衔锋线实力不俗。' },
    'spain': { groupStage: '小组第一出线', winProbability: 16, championProbability: 15, analysis: '新科欧洲杯冠军，亚马尔等新星崛起，传控体系成熟。' },
    'germany': { groupStage: '小组第一出线', winProbability: 14, championProbability: 10, analysis: '东道主之一的优势，纳格尔斯曼战术先进，年轻一代崛起。' },
    'portugal': { groupStage: '小组第一出线', winProbability: 13, championProbability: 9, analysis: 'C罗最后一舞，B席B费领衔黄金一代，中前场配置豪华。' },
    'netherlands': { groupStage: '小组第一出线', winProbability: 11, championProbability: 6, analysis: '范迪克领衔防线稳固，但锋线得分能力稍显不足。' },
    'belgium': { groupStage: '小组第二出线', winProbability: 10, championProbability: 5, analysis: '黄金一代逐渐落幕，德布劳内仍是核心，整体实力下滑。' },
    'uruguay': { groupStage: '小组第二出线', winProbability: 9, championProbability: 4, analysis: '南美劲旅作风硬朗，努涅斯领衔新一代，经验丰富。' },
  };

  return predictions[teamId] || {
    groupStage: '力争出线',
    winProbability: Math.floor(Math.random() * 8) + 2,
    championProbability: Math.floor(Math.random() * 3) + 1,
    analysis: '本届世界杯扩军后的参赛队伍，面对强敌需要超常发挥。',
  };
}

function getTeamDetails(teamId: string) {
  const detailsMap: Record<string, { coach: string; captain: string; star: string; titles: number; best: string }> = {
    'argentina': { coach: '利昂内尔·斯卡洛尼', captain: '利昂内尔·梅西', star: '利昂内尔·梅西', titles: 3, best: '冠军（1978, 1986, 2022）' },
    'france': { coach: '迪迪埃·德尚', captain: '姆巴佩', star: '姆巴佩', titles: 2, best: '冠军（1998, 2018）' },
    'brazil': { coach: '多里瓦尔·儒尼奥尔', captain: '卡塞米罗', star: '维尼修斯', titles: 5, best: '冠军（1958, 1962, 1970, 1994, 2002）' },
    'england': { coach: '托马斯·图赫尔', captain: '哈里·凯恩', star: '贝林厄姆', titles: 1, best: '冠军（1966）' },
    'spain': { coach: '路易斯·德拉富恩特', captain: '莫拉塔', star: '亚马尔', titles: 1, best: '冠军（2010）' },
    'germany': { coach: '尤利安·纳格尔斯曼', captain: '基米希', star: '穆西亚拉', titles: 4, best: '冠军（1954, 1974, 1990, 2014）' },
    'portugal': { coach: '罗伯托·马丁内斯', captain: 'C罗', star: 'C罗', titles: 0, best: '季军（1966）' },
    'netherlands': { coach: '罗纳德·科曼', captain: '范迪克', star: '哈维·西蒙斯', titles: 0, best: '亚军（1974, 1978, 2010）' },
    'belgium': { coach: '鲁迪·加西亚', captain: '德布劳内', star: '德布劳内', titles: 0, best: '季军（2018）' },
    'uruguay': { coach: '马塞洛·贝尔萨', captain: '何塞·希门尼斯', star: '达尔文·努涅斯', titles: 2, best: '冠军（1930, 1950）' },
    'mexico': { coach: '哈维尔·阿吉雷', captain: '埃德松·阿尔瓦雷斯', star: '希门尼斯', titles: 0, best: '八强（1970, 1986）' },
    'usa': { coach: '毛里西奥·波切蒂诺', captain: '普利西奇', star: '普利西奇', titles: 0, best: '季军（1930）' },
    'canada': { coach: '杰西·马什', captain: '阿方索·戴维斯', star: '阿方索·戴维斯', titles: 0, best: '小组赛' },
    'japan': { coach: '森保一', captain: '远藤航', star: '三笘薰', titles: 0, best: '16强（2022）' },
    'south-korea': { coach: '洪明甫', captain: '孙兴慜', star: '孙兴慜', titles: 0, best: '四强（2002）' },
    'morocco': { coach: '瓦利德·雷格拉吉', captain: '赛斯', star: '阿什拉夫', titles: 0, best: '四强（2022）' },
    'croatia': { coach: '兹拉特科·达利奇', captain: '莫德里奇', star: '莫德里奇', titles: 0, best: '亚军（2018）' },
    'senegal': { coach: '阿利乌·西塞', captain: '库利巴利', star: '马内', titles: 0, best: '八强（2022）' },
    'colombia': { coach: '内斯托尔·洛伦索', captain: '哈梅斯·罗德里格斯', star: '路易斯·迪亚斯', titles: 0, best: '八强（2014）' },
    'switzerland': { coach: '穆拉特·亚金', captain: '扎卡', star: '扎卡', titles: 0, best: '八强（1934, 1938, 1954）' },
    'australia': { coach: '托尼·波波维奇', captain: '马修·瑞恩', star: '古德温', titles: 0, best: '16强（2006, 2022）' },
    'austria': { coach: '拉尔夫·朗尼克', captain: '萨比策', star: '阿瑙托维奇', titles: 0, best: '季军（1954）' },
    'norway': { coach: '斯塔勒·索尔巴肯', captain: '厄德高', star: '哈兰德', titles: 0, best: '小组赛' },
    'turkey': { coach: '蒙特拉', captain: '恰尔汗奥卢', star: '居莱尔', titles: 0, best: '季军（2002）' },
    'ecuador': { coach: '塞巴斯蒂安·贝卡切斯', captain: '巴伦西亚', star: '凯塞多', titles: 0, best: '16强（2022）' },
    'qatar': { coach: '路易斯·加西亚', captain: '海多斯', star: '阿菲夫', titles: 0, best: '小组赛' },
    'ghana': { coach: '奥托·阿多', captain: '安德烈·阿尤', star: '库杜斯', titles: 0, best: '八强（2010）' },
    'ivory-coast': { coach: '埃默塞·法埃', captain: '奥里耶', star: '尼古拉·佩佩', titles: 0, best: '小组赛' },
    'algeria': { coach: '弗拉迪米尔·佩特科维奇', captain: '马赫雷斯', star: '马赫雷斯', titles: 0, best: '16强（2014）' },
    'egypt': { coach: '埃克托·库珀', captain: '萨拉赫', star: '萨拉赫', titles: 0, best: '小组赛' },
    'iran': { coach: '阿米尔·加莱诺伊', captain: '塔雷米', star: '塔雷米', titles: 0, best: '小组赛' },
    'saudi-arabia': { coach: '埃尔韦·雷纳尔', captain: '法拉吉', star: '多萨里', titles: 0, best: '16强（1994）' },
    'iraq': { coach: '耶稣·卡萨斯', captain: '阿德南', star: '阿里', titles: 0, best: '小组赛' },
    'uzbekistan': { coach: '斯雷奇科·卡塔尼奇', captain: '艾哈迈多夫', star: '肖穆罗多夫', titles: 0, best: '首次参赛' },
    'new-zealand': { coach: '达伦·巴泽利', captain: '温斯顿·里德', star: '克里斯·伍德', titles: 0, best: '小组赛' },
    'panama': { coach: '托马斯·克里斯蒂安森', captain: '戈多伊', star: '法哈多', titles: 0, best: '小组赛' },
    'paraguay': { coach: '古斯塔沃·阿尔法罗', captain: '古斯塔沃·戈麦斯', star: '恩西索', titles: 0, best: '八强（2010）' },
    'bosnia': { coach: '谢尔盖·巴巴雷茨', captain: '哲科', star: '哲科', titles: 0, best: '小组赛' },
    'czech': { coach: '伊万·哈谢克', captain: '绍切克', star: '希克', titles: 0, best: '亚军（1934, 1962）' },
    'sweden': { coach: '容·达尔·托马松', captain: '林德洛夫', star: '伊萨克', titles: 0, best: '亚军（1958）' },
    'tunisia': { coach: '蒙塔萨尔·奥阿巴迪', captain: '姆萨克尼', star: '贾兹里', titles: 0, best: '小组赛' },
    'scotland': { coach: '史蒂夫·克拉克', captain: '罗伯逊', star: '麦克托米奈', titles: 0, best: '小组赛' },
    'south-africa': { coach: '雨果·布鲁斯', captain: '莫科伊纳', star: '姆韦拉', titles: 0, best: '小组赛' },
    'cape-verde': { coach: '布比斯塔', captain: '瑞恩', star: '塔瓦雷斯', titles: 0, best: '首次参赛' },
    'curacao': { coach: '迪克·艾德沃卡特', captain: '弗洛拉努斯', star: '马加里塔', titles: 0, best: '首次参赛' },
    'haiti': { coach: '让-雅克·皮埃尔', captain: '阿德', star: '纳宗', titles: 0, best: '首次参赛' },
    'dr-congo': { coach: '塞巴斯蒂安·德萨布雷', captain: '姆博卡尼', star: '巴坎布', titles: 0, best: '小组赛' },
    'jordan': { coach: '侯赛因·阿穆塔', captain: '巴尼·亚辛', star: '奥尔万', titles: 0, best: '首次参赛' },
  };

  return detailsMap[teamId] || { coach: '待定', captain: '待定', star: '待定', titles: 0, best: '待定' };
}

// FIFA排名（2025年4月左右的大致排名）
const fifaRanks: Record<string, number> = {
  'argentina': 1, 'france': 2, 'spain': 3, 'england': 4, 'brazil': 5,
  'portugal': 6, 'netherlands': 7, 'belgium': 8, 'germany': 9, 'croatia': 10,
  'uruguay': 11, 'morocco': 12, 'italy': 13, 'colombia': 14, 'japan': 15,
  'usa': 16, 'mexico': 17, 'iran': 18, 'senegal': 19, 'south-korea': 20,
  'australia': 21, 'switzerland': 22, 'ecuador': 23, 'denmark': 24, 'qatar': 25,
  'ukraine': 26, 'austria': 27, 'turkey': 28, 'sweden': 29, 'wales': 30,
  'chile': 31, 'tunisia': 32, 'poland': 33, 'egypt': 34, 'nigeria': 35,
  'czech': 36, 'serbia': 37, 'peru': 38, 'norway': 39, 'algeria': 40,
  'hungary': 41, 'scotland': 42, 'ghana': 43, 'cameroon': 44, 'ivory-coast': 45,
  'greece': 46, 'slovakia': 47, 'saudi-arabia': 48, 'romania': 49, 'bosnia': 50,
  'costa-rica': 51, 'russia': 52, 'panama': 53, 'slovenia': 54, 'canada': 55,
  'paraguay': 56, 'jamaica': 57, 'new-zealand': 58, 'finland': 59, 'iraq': 60,
  'uzbekistan': 61, 'mali': 62, 'south-africa': 63, 'cape-verde': 64, 'congo': 65,
  'dr-congo': 66, 'jordan': 67, 'haiti': 68, 'curacao': 69,
};

// 导出所有球队
export const allTeams: Team[] = Object.keys(teamNames).map(id => {
  const details = getTeamDetails(id);
  const squad = generateSquad(id);
  return {
    id,
    name: teamNames[id].name,
    nameEn: teamNames[id].nameEn,
    flag: flagMap[id] || '🏳️',
    group: Object.entries(groups).find(([_, teams]) => teams.includes(id))?.[0] || '',
    fifaRank: fifaRanks[id] || 99,
    coach: details.coach,
    captain: details.captain,
    starPlayer: details.star,
    worldCupTitles: details.titles,
    bestResult: details.best,
    squad,
    recentMatches: generateRecentMatches(id),
    prediction: getPrediction(id),
  };
});

export function getTeamById(id: string): Team | undefined {
  return allTeams.find(t => t.id === id);
}

export function getTeamsByGroup(group: string): Team[] {
  return allTeams.filter(t => t.group === group);
}
