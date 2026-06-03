// 2026 美加墨世界杯 完整赛程数据

// Matches data for 2026 World Cup

export interface Match {
  id: number;
  date: string;
  time: string;
  group: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  venue: string;
  city: string;
  round: string;
  status: 'upcoming' | 'live' | 'finished';
  score1?: number;
  score2?: number;
}

// 16座球场信息
export const venues: Record<string, { name: string; city: string; country: string; capacity: string }> = {
  'azteca': { name: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', capacity: '87,523' },
  ' Akron': { name: ' Akron体育场', city: '瓜达拉哈拉', country: '墨西哥', capacity: '48,071' },
  'bbva': { name: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', capacity: '53,500' },
  'sofi': { name: 'SoFi体育场', city: '洛杉矶', country: '美国', capacity: '100,240' },
  'levis': { name: '李维斯体育场', city: '旧金山湾区', country: '美国', capacity: '75,000' },
  'lumen': { name: '流明球场', city: '西雅图', country: '美国', capacity: '72,000' },
  'at-t': { name: 'AT&T体育场', city: '达拉斯', country: '美国', capacity: '92,967' },
  'arrowhead': { name: '箭头体育场', city: '堪萨斯城', country: '美国', capacity: '76,640' },
  'metlife': { name: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', capacity: '87,157' },
  'mercedes': { name: '梅赛德斯-奔驰体育场', city: '亚特兰大', country: '美国', capacity: '71,000' },
  'hard-rock': { name: '硬石体育场', city: '迈阿密', country: '美国', capacity: '65,326' },
  'gillette': { name: '吉列体育场', city: '波士顿', country: '美国', capacity: '70,000' },
  'lincoln': { name: '林肯金融球场', city: '费城', country: '美国', capacity: '71,896' },
  'nrg': { name: 'NRG体育场', city: '休斯顿', country: '美国', capacity: '72,220' },
  'bc-place': { name: '不列颠哥伦比亚体育馆', city: '温哥华', country: '加拿大', capacity: '54,500' },
  'bmo': { name: 'BMO球场', city: '多伦多', country: '加拿大', capacity: '45,736' },
};

// 小组赛赛程（北京时间）
export const groupStageMatches: Match[] = [
  // A组
  { id: 1, date: '2026-06-12', time: '03:00', group: 'A', team1: '墨西哥', team2: '南非', team1Flag: '🇲🇽', team2Flag: '🇿🇦', venue: '阿兹特克体育场', city: '墨西哥城', round: '小组赛', status: 'upcoming' },
  { id: 2, date: '2026-06-12', time: '10:00', group: 'A', team1: '韩国', team2: '捷克', team1Flag: '🇰🇷', team2Flag: '🇨🇿', venue: 'BBVA体育场', city: '蒙特雷', round: '小组赛', status: 'upcoming' },
  { id: 3, date: '2026-06-19', time: '00:00', group: 'A', team1: '捷克', team2: '南非', team1Flag: '🇨🇿', team2Flag: '🇿🇦', venue: '阿兹特克体育场', city: '墨西哥城', round: '小组赛', status: 'upcoming' },
  { id: 4, date: '2026-06-19', time: '09:00', group: 'A', team1: '墨西哥', team2: '韩国', team1Flag: '🇲🇽', team2Flag: '🇰🇷', venue: ' Akron体育场', city: '瓜达拉哈拉', round: '小组赛', status: 'upcoming' },
  { id: 5, date: '2026-06-25', time: '09:00', group: 'A', team1: '捷克', team2: '墨西哥', team1Flag: '🇨🇿', team2Flag: '🇲🇽', venue: '阿兹特克体育场', city: '墨西哥城', round: '小组赛', status: 'upcoming' },
  { id: 6, date: '2026-06-25', time: '09:00', group: 'A', team1: '南非', team2: '韩国', team1Flag: '🇿🇦', team2Flag: '🇰🇷', venue: 'BBVA体育场', city: '蒙特雷', round: '小组赛', status: 'upcoming' },

  // B组
  { id: 7, date: '2026-06-13', time: '03:00', group: 'B', team1: '加拿大', team2: '波黑', team1Flag: '🇨🇦', team2Flag: '🇧🇦', venue: 'BMO球场', city: '多伦多', round: '小组赛', status: 'upcoming' },
  { id: 8, date: '2026-06-14', time: '03:00', group: 'B', team1: '卡塔尔', team2: '瑞士', team1Flag: '🇶🇦', team2Flag: '🇨🇭', venue: '流明球场', city: '西雅图', round: '小组赛', status: 'upcoming' },
  { id: 9, date: '2026-06-19', time: '03:00', group: 'B', team1: '瑞士', team2: '波黑', team1Flag: '🇨🇭', team2Flag: '🇧🇦', venue: 'SoFi体育场', city: '洛杉矶', round: '小组赛', status: 'upcoming' },
  { id: 10, date: '2026-06-19', time: '06:00', group: 'B', team1: '加拿大', team2: '卡塔尔', team1Flag: '🇨🇦', team2Flag: '🇶🇦', venue: '不列颠哥伦比亚体育馆', city: '温哥华', round: '小组赛', status: 'upcoming' },
  { id: 11, date: '2026-06-25', time: '03:00', group: 'B', team1: '瑞士', team2: '加拿大', team1Flag: '🇨🇭', team2Flag: '🇨🇦', venue: '不列颠哥伦比亚体育馆', city: '温哥华', round: '小组赛', status: 'upcoming' },
  { id: 12, date: '2026-06-25', time: '03:00', group: 'B', team1: '波黑', team2: '卡塔尔', team1Flag: '🇧🇦', team2Flag: '🇶🇦', venue: '流明球场', city: '西雅图', round: '小组赛', status: 'upcoming' },

  // C组
  { id: 13, date: '2026-06-14', time: '06:00', group: 'C', team1: '巴西', team2: '摩洛哥', team1Flag: '🇧🇷', team2Flag: '🇲🇦', venue: '林肯金融球场', city: '费城', round: '小组赛', status: 'upcoming' },
  { id: 14, date: '2026-06-14', time: '09:00', group: 'C', team1: '海地', team2: '苏格兰', team1Flag: '🇭🇹', team2Flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', venue: '吉列体育场', city: '波士顿', round: '小组赛', status: 'upcoming' },
  { id: 15, date: '2026-06-20', time: '06:00', group: 'C', team1: '苏格兰', team2: '摩洛哥', team1Flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', team2Flag: '🇲🇦', venue: '吉列体育场', city: '波士顿', round: '小组赛', status: 'upcoming' },
  { id: 16, date: '2026-06-20', time: '09:00', group: 'C', team1: '巴西', team2: '海地', team1Flag: '🇧🇷', team2Flag: '🇭🇹', venue: '林肯金融球场', city: '费城', round: '小组赛', status: 'upcoming' },
  { id: 17, date: '2026-06-25', time: '06:00', group: 'C', team1: '苏格兰', team2: '巴西', team1Flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', team2Flag: '🇧🇷', venue: '硬石体育场', city: '迈阿密', round: '小组赛', status: 'upcoming' },
  { id: 18, date: '2026-06-25', time: '06:00', group: 'C', team1: '摩洛哥', team2: '海地', team1Flag: '🇲🇦', team2Flag: '🇭🇹', venue: '梅赛德斯-奔驰体育场', city: '亚特兰大', round: '小组赛', status: 'upcoming' },

  // D组
  { id: 19, date: '2026-06-13', time: '09:00', group: 'D', team1: '美国', team2: '巴拉圭', team1Flag: '🇺🇸', team2Flag: '🇵🇾', venue: 'SoFi体育场', city: '洛杉矶', round: '小组赛', status: 'upcoming' },
  { id: 20, date: '2026-06-14', time: '12:00', group: 'D', team1: '澳大利亚', team2: '土耳其', team1Flag: '🇦🇺', team2Flag: '🇹🇷', venue: '李维斯体育场', city: '旧金山湾区', round: '小组赛', status: 'upcoming' },
  { id: 21, date: '2026-06-20', time: '03:00', group: 'D', team1: '美国', team2: '澳大利亚', team1Flag: '🇺🇸', team2Flag: '🇦🇺', venue: '流明球场', city: '西雅图', round: '小组赛', status: 'upcoming' },
  { id: 22, date: '2026-06-20', time: '12:00', group: 'D', team1: '土耳其', team2: '巴拉圭', team1Flag: '🇹🇷', team2Flag: '🇵🇾', venue: '李维斯体育场', city: '旧金山湾区', round: '小组赛', status: 'upcoming' },
  { id: 23, date: '2026-06-26', time: '10:00', group: 'D', team1: '土耳其', team2: '美国', team1Flag: '🇹🇷', team2Flag: '🇺🇸', venue: 'SoFi体育场', city: '洛杉矶', round: '小组赛', status: 'upcoming' },
  { id: 24, date: '2026-06-26', time: '10:00', group: 'D', team1: '巴拉圭', team2: '澳大利亚', team1Flag: '🇵🇾', team2Flag: '🇦🇺', venue: '李维斯体育场', city: '旧金山湾区', round: '小组赛', status: 'upcoming' },

  // E组
  { id: 25, date: '2026-06-15', time: '01:00', group: 'E', team1: '德国', team2: '库拉索', team1Flag: '🇩🇪', team2Flag: '🇨🇼', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '小组赛', status: 'upcoming' },
  { id: 26, date: '2026-06-15', time: '07:00', group: 'E', team1: '科特迪瓦', team2: '厄瓜多尔', team1Flag: '🇨🇮', team2Flag: '🇪🇨', venue: '林肯金融球场', city: '费城', round: '小组赛', status: 'upcoming' },
  { id: 27, date: '2026-06-21', time: '04:00', group: 'E', team1: '德国', team2: '科特迪瓦', team1Flag: '🇩🇪', team2Flag: '🇨🇮', venue: '吉列体育场', city: '波士顿', round: '小组赛', status: 'upcoming' },
  { id: 28, date: '2026-06-21', time: '08:00', group: 'E', team1: '厄瓜多尔', team2: '库拉索', team1Flag: '🇪🇨', team2Flag: '🇨🇼', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '小组赛', status: 'upcoming' },
  { id: 29, date: '2026-06-26', time: '04:00', group: 'E', team1: '厄瓜多尔', team2: '德国', team1Flag: '🇪🇨', team2Flag: '🇩🇪', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '小组赛', status: 'upcoming' },
  { id: 30, date: '2026-06-26', time: '04:00', group: 'E', team1: '库拉索', team2: '科特迪瓦', team1Flag: '🇨🇼', team2Flag: '🇨🇮', venue: '林肯金融球场', city: '费城', round: '小组赛', status: 'upcoming' },

  // F组
  { id: 31, date: '2026-06-15', time: '04:00', group: 'F', team1: '荷兰', team2: '日本', team1Flag: '🇳🇱', team2Flag: '🇯🇵', venue: 'AT&T体育场', city: '达拉斯', round: '小组赛', status: 'upcoming' },
  { id: 32, date: '2026-06-15', time: '10:00', group: 'F', team1: '瑞典', team2: '突尼斯', team1Flag: '🇸🇪', team2Flag: '🇹🇳', venue: '箭头体育场', city: '堪萨斯城', round: '小组赛', status: 'upcoming' },
  { id: 33, date: '2026-06-21', time: '01:00', group: 'F', team1: '荷兰', team2: '瑞典', team1Flag: '🇳🇱', team2Flag: '🇸🇪', venue: 'AT&T体育场', city: '达拉斯', round: '小组赛', status: 'upcoming' },
  { id: 34, date: '2026-06-21', time: '12:00', group: 'F', team1: '突尼斯', team2: '日本', team1Flag: '🇹🇳', team2Flag: '🇯🇵', venue: '流明球场', city: '西雅图', round: '小组赛', status: 'upcoming' },
  { id: 35, date: '2026-06-26', time: '07:00', group: 'F', team1: '日本', team2: '瑞典', team1Flag: '🇯🇵', team2Flag: '🇸🇪', venue: 'AT&T体育场', city: '达拉斯', round: '小组赛', status: 'upcoming' },
  { id: 36, date: '2026-06-26', time: '07:00', group: 'F', team1: '突尼斯', team2: '荷兰', team1Flag: '🇹🇳', team2Flag: '🇳🇱', venue: '箭头体育场', city: '堪萨斯城', round: '小组赛', status: 'upcoming' },

  // G组
  { id: 37, date: '2026-06-16', time: '03:00', group: 'G', team1: '比利时', team2: '埃及', team1Flag: '🇧🇪', team2Flag: '🇪🇬', venue: 'NRG体育场', city: '休斯顿', round: '小组赛', status: 'upcoming' },
  { id: 38, date: '2026-06-16', time: '09:00', group: 'G', team1: '伊朗', team2: '新西兰', team1Flag: '🇮🇷', team2Flag: '🇳🇿', venue: '流明球场', city: '西雅图', round: '小组赛', status: 'upcoming' },
  { id: 39, date: '2026-06-22', time: '03:00', group: 'G', team1: '比利时', team2: '伊朗', team1Flag: '🇧🇪', team2Flag: '🇮🇷', venue: 'NRG体育场', city: '休斯顿', round: '小组赛', status: 'upcoming' },
  { id: 40, date: '2026-06-22', time: '09:00', group: 'G', team1: '新西兰', team2: '埃及', team1Flag: '🇳🇿', team2Flag: '🇪🇬', venue: '不列颠哥伦比亚体育馆', city: '温哥华', round: '小组赛', status: 'upcoming' },
  { id: 41, date: '2026-06-27', time: '11:00', group: 'G', team1: '埃及', team2: '伊朗', team1Flag: '🇪🇬', team2Flag: '🇮🇷', venue: '流明球场', city: '西雅图', round: '小组赛', status: 'upcoming' },
  { id: 42, date: '2026-06-27', time: '11:00', group: 'G', team1: '新西兰', team2: '比利时', team1Flag: '🇳🇿', team2Flag: '🇧🇪', venue: '不列颠哥伦比亚体育馆', city: '温哥华', round: '小组赛', status: 'upcoming' },

  // H组
  { id: 43, date: '2026-06-16', time: '00:00', group: 'H', team1: '西班牙', team2: '佛得角', team1Flag: '🇪🇸', team2Flag: '🇨🇻', venue: '阿兹特克体育场', city: '墨西哥城', round: '小组赛', status: 'upcoming' },
  { id: 44, date: '2026-06-16', time: '06:00', group: 'H', team1: '沙特阿拉伯', team2: '乌拉圭', team1Flag: '🇸🇦', team2Flag: '🇺🇾', venue: ' Akron体育场', city: '瓜达拉哈拉', round: '小组赛', status: 'upcoming' },
  { id: 45, date: '2026-06-22', time: '00:00', group: 'H', team1: '西班牙', team2: '沙特阿拉伯', team1Flag: '🇪🇸', team2Flag: '🇸🇦', venue: '阿兹特克体育场', city: '墨西哥城', round: '小组赛', status: 'upcoming' },
  { id: 46, date: '2026-06-22', time: '06:00', group: 'H', team1: '乌拉圭', team2: '佛得角', team1Flag: '🇺🇾', team2Flag: '🇨🇻', venue: ' Akron体育场', city: '瓜达拉哈拉', round: '小组赛', status: 'upcoming' },
  { id: 47, date: '2026-06-27', time: '08:00', group: 'H', team1: '佛得角', team2: '沙特阿拉伯', team1Flag: '🇨🇻', team2Flag: '🇸🇦', venue: 'NRG体育场', city: '休斯顿', round: '小组赛', status: 'upcoming' },
  { id: 48, date: '2026-06-27', time: '08:00', group: 'H', team1: '乌拉圭', team2: '西班牙', team1Flag: '🇺🇾', team2Flag: '🇪🇸', venue: ' Akron体育场', city: '瓜达拉哈拉', round: '小组赛', status: 'upcoming' },

  // I组
  { id: 49, date: '2026-06-17', time: '03:00', group: 'I', team1: '法国', team2: '塞内加尔', team1Flag: '🇫🇷', team2Flag: '🇸🇳', venue: '吉列体育场', city: '波士顿', round: '小组赛', status: 'upcoming' },
  { id: 50, date: '2026-06-17', time: '06:00', group: 'I', team1: '伊拉克', team2: '挪威', team1Flag: '🇮🇶', team2Flag: '🇳🇴', venue: 'BMO球场', city: '多伦多', round: '小组赛', status: 'upcoming' },
  { id: 51, date: '2026-06-23', time: '05:00', group: 'I', team1: '法国', team2: '伊拉克', team1Flag: '🇫🇷', team2Flag: '🇮🇶', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '小组赛', status: 'upcoming' },
  { id: 52, date: '2026-06-23', time: '08:00', group: 'I', team1: '挪威', team2: '塞内加尔', team1Flag: '🇳🇴', team2Flag: '🇸🇳', venue: 'BMO球场', city: '多伦多', round: '小组赛', status: 'upcoming' },
  { id: 53, date: '2026-06-27', time: '03:00', group: 'I', team1: '挪威', team2: '法国', team1Flag: '🇳🇴', team2Flag: '🇫🇷', venue: '吉列体育场', city: '波士顿', round: '小组赛', status: 'upcoming' },
  { id: 54, date: '2026-06-27', time: '03:00', group: 'I', team1: '塞内加尔', team2: '伊拉克', team1Flag: '🇸🇳', team2Flag: '🇮🇶', venue: 'BMO球场', city: '多伦多', round: '小组赛', status: 'upcoming' },

  // J组
  { id: 55, date: '2026-06-17', time: '09:00', group: 'J', team1: '阿根廷', team2: '阿尔及利亚', team1Flag: '🇦🇷', team2Flag: '🇩🇿', venue: '硬石体育场', city: '迈阿密', round: '小组赛', status: 'upcoming' },
  { id: 56, date: '2026-06-17', time: '12:00', group: 'J', team1: '奥地利', team2: '约旦', team1Flag: '🇦🇹', team2Flag: '🇯🇴', venue: 'AT&T体育场', city: '达拉斯', round: '小组赛', status: 'upcoming' },
  { id: 57, date: '2026-06-23', time: '01:00', group: 'J', team1: '阿根廷', team2: '奥地利', team1Flag: '🇦🇷', team2Flag: '🇦🇹', venue: '硬石体育场', city: '迈阿密', round: '小组赛', status: 'upcoming' },
  { id: 58, date: '2026-06-23', time: '11:00', group: 'J', team1: '约旦', team2: '阿尔及利亚', team1Flag: '🇯🇴', team2Flag: '🇩🇿', venue: 'AT&T体育场', city: '达拉斯', round: '小组赛', status: 'upcoming' },
  { id: 59, date: '2026-06-28', time: '10:00', group: 'J', team1: '阿尔及利亚', team2: '奥地利', team1Flag: '🇩🇿', team2Flag: '🇦🇹', venue: '箭头体育场', city: '堪萨斯城', round: '小组赛', status: 'upcoming' },
  { id: 60, date: '2026-06-28', time: '10:00', group: 'J', team1: '约旦', team2: '阿根廷', team1Flag: '🇯🇴', team2Flag: '🇦🇷', venue: '梅赛德斯-奔驰体育场', city: '亚特兰大', round: '小组赛', status: 'upcoming' },

  // K组
  { id: 61, date: '2026-06-18', time: '01:00', group: 'K', team1: '葡萄牙', team2: '民主刚果', team1Flag: '🇵🇹', team2Flag: '🇨🇩', venue: 'NRG体育场', city: '休斯顿', round: '小组赛', status: 'upcoming' },
  { id: 62, date: '2026-06-18', time: '10:00', group: 'K', team1: '乌兹别克斯坦', team2: '哥伦比亚', team1Flag: '🇺🇿', team2Flag: '🇨🇴', venue: ' Akron体育场', city: '瓜达拉哈拉', round: '小组赛', status: 'upcoming' },
  { id: 63, date: '2026-06-24', time: '01:00', group: 'K', team1: '葡萄牙', team2: '乌兹别克斯坦', team1Flag: '🇵🇹', team2Flag: '🇺🇿', venue: 'NRG体育场', city: '休斯顿', round: '小组赛', status: 'upcoming' },
  { id: 64, date: '2026-06-24', time: '10:00', group: 'K', team1: '哥伦比亚', team2: '民主刚果', team1Flag: '🇨🇴', team2Flag: '🇨🇩', venue: ' Akron体育场', city: '瓜达拉哈拉', round: '小组赛', status: 'upcoming' },
  { id: 65, date: '2026-06-28', time: '07:30', group: 'K', team1: '哥伦比亚', team2: '葡萄牙', team1Flag: '🇨🇴', team2Flag: '🇵🇹', venue: 'SoFi体育场', city: '洛杉矶', round: '小组赛', status: 'upcoming' },
  { id: 66, date: '2026-06-28', time: '07:30', group: 'K', team1: '民主刚果', team2: '乌兹别克斯坦', team1Flag: '🇨🇩', team2Flag: '🇺🇿', venue: '李维斯体育场', city: '旧金山湾区', round: '小组赛', status: 'upcoming' },

  // L组
  { id: 67, date: '2026-06-18', time: '04:00', group: 'L', team1: '英格兰', team2: '克罗地亚', team1Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2Flag: '🇭🇷', venue: 'AT&T体育场', city: '达拉斯', round: '小组赛', status: 'upcoming' },
  { id: 68, date: '2026-06-18', time: '07:00', group: 'L', team1: '加纳', team2: '巴拿马', team1Flag: '🇬🇭', team2Flag: '🇵🇦', venue: 'BMO球场', city: '多伦多', round: '小组赛', status: 'upcoming' },
  { id: 69, date: '2026-06-24', time: '04:00', group: 'L', team1: '英格兰', team2: '加纳', team1Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', team2Flag: '🇬🇭', venue: '吉列体育场', city: '波士顿', round: '小组赛', status: 'upcoming' },
  { id: 70, date: '2026-06-24', time: '07:00', group: 'L', team1: '巴拿马', team2: '克罗地亚', team1Flag: '🇵🇦', team2Flag: '🇭🇷', venue: 'BMO球场', city: '多伦多', round: '小组赛', status: 'upcoming' },
  { id: 71, date: '2026-06-28', time: '10:00', group: 'L', team1: '加纳', team2: '克罗地亚', team1Flag: '🇬🇭', team2Flag: '🇭🇷', venue: '硬石体育场', city: '迈阿密', round: '小组赛', status: 'upcoming' },
  { id: 72, date: '2026-06-28', time: '10:00', group: 'L', team1: '巴拿马', team2: '英格兰', team1Flag: '🇵🇦', team2Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '小组赛', status: 'upcoming' },
];

// 淘汰赛赛程框架
export const knockoutMatches: Match[] = [
  // 1/16决赛 (6月28日-7月3日)
  { id: 73, date: '2026-06-28', time: '待定', group: '32强', team1: 'A组第二', team2: 'B组第二', team1Flag: '🔘', team2Flag: '🔘', venue: 'SoFi体育场', city: '洛杉矶', round: '1/16决赛', status: 'upcoming' },
  { id: 74, date: '2026-06-29', time: '待定', group: '32强', team1: 'E组第一', team2: 'A/B/C/D/F组第三', team1Flag: '🔘', team2Flag: '🔘', venue: '吉列体育场', city: '波士顿', round: '1/16决赛', status: 'upcoming' },
  { id: 75, date: '2026-06-29', time: '待定', group: '32强', team1: 'F组第一', team2: 'C组第二', team1Flag: '🔘', team2Flag: '🔘', venue: 'BBVA体育场', city: '蒙特雷', round: '1/16决赛', status: 'upcoming' },
  { id: 76, date: '2026-06-29', time: '待定', group: '32强', team1: 'C组第一', team2: 'F组第二', team1Flag: '🔘', team2Flag: '🔘', venue: 'NRG体育场', city: '休斯顿', round: '1/16决赛', status: 'upcoming' },
  { id: 77, date: '2026-06-30', time: '待定', group: '32强', team1: 'I组第一', team2: 'C/D/F/G/H组第三', team1Flag: '🔘', team2Flag: '🔘', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '1/16决赛', status: 'upcoming' },
  { id: 78, date: '2026-06-30', time: '待定', group: '32强', team1: 'E组第二', team2: 'I组第二', team1Flag: '🔘', team2Flag: '🔘', venue: 'AT&T体育场', city: '达拉斯', round: '1/16决赛', status: 'upcoming' },
  { id: 79, date: '2026-07-01', time: '待定', group: '32强', team1: 'A组第一', team2: 'C/E/F/H/I组第三', team1Flag: '🔘', team2Flag: '🔘', venue: '阿兹特克体育场', city: '墨西哥城', round: '1/16决赛', status: 'upcoming' },
  { id: 80, date: '2026-07-01', time: '待定', group: '32强', team1: 'L组第一', team2: 'E/H/I/J/K组第三', team1Flag: '🔘', team2Flag: '🔘', venue: '梅赛德斯-奔驰体育场', city: '亚特兰大', round: '1/16决赛', status: 'upcoming' },
  { id: 81, date: '2026-07-02', time: '待定', group: '32强', team1: 'D组第一', team2: 'B/E/F/I/J组第三', team1Flag: '🔘', team2Flag: '🔘', venue: '李维斯体育场', city: '旧金山湾区', round: '1/16决赛', status: 'upcoming' },
  { id: 82, date: '2026-07-02', time: '待定', group: '32强', team1: 'G组第一', team2: 'A/E/H/I/J组第三', team1Flag: '🔘', team2Flag: '🔘', venue: '流明球场', city: '西雅图', round: '1/16决赛', status: 'upcoming' },
  { id: 83, date: '2026-07-03', time: '待定', group: '32强', team1: 'K组第二', team2: 'L组第二', team1Flag: '🔘', team2Flag: '🔘', venue: 'BMO球场', city: '多伦多', round: '1/16决赛', status: 'upcoming' },
  { id: 84, date: '2026-07-03', time: '待定', group: '32强', team1: 'H组第一', team2: 'J组第二', team1Flag: '🔘', team2Flag: '🔘', venue: 'SoFi体育场', city: '洛杉矶', round: '1/16决赛', status: 'upcoming' },
  { id: 85, date: '2026-07-03', time: '待定', group: '32强', team1: 'B组第一', team2: 'E/F/G/I/J组第三', team1Flag: '🔘', team2Flag: '🔘', venue: '不列颠哥伦比亚体育馆', city: '温哥华', round: '1/16决赛', status: 'upcoming' },
  { id: 86, date: '2026-07-03', time: '待定', group: '32强', team1: 'J组第一', team2: 'H组第二', team1Flag: '🔘', team2Flag: '🔘', venue: '硬石体育场', city: '迈阿密', round: '1/16决赛', status: 'upcoming' },

  // 1/8决赛 (7月4日-7月7日)
  { id: 87, date: '2026-07-04', time: '待定', group: '16强', team1: '第73场胜者', team2: '第74场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '箭头体育场', city: '堪萨斯城', round: '1/8决赛', status: 'upcoming' },
  { id: 88, date: '2026-07-04', time: '待定', group: '16强', team1: '第75场胜者', team2: '第76场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: 'AT&T体育场', city: '达拉斯', round: '1/8决赛', status: 'upcoming' },
  { id: 89, date: '2026-07-05', time: '待定', group: '16强', team1: '第77场胜者', team2: '第78场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '林肯金融球场', city: '费城', round: '1/8决赛', status: 'upcoming' },
  { id: 90, date: '2026-07-05', time: '待定', group: '16强', team1: '第79场胜者', team2: '第80场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: 'NRG体育场', city: '休斯顿', round: '1/8决赛', status: 'upcoming' },
  { id: 91, date: '2026-07-06', time: '待定', group: '16强', team1: '第81场胜者', team2: '第82场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '1/8决赛', status: 'upcoming' },
  { id: 92, date: '2026-07-06', time: '待定', group: '16强', team1: '第83场胜者', team2: '第84场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '阿兹特克体育场', city: '墨西哥城', round: '1/8决赛', status: 'upcoming' },
  { id: 93, date: '2026-07-07', time: '待定', group: '16强', team1: '第85场胜者', team2: '第86场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: 'AT&T体育场', city: '达拉斯', round: '1/8决赛', status: 'upcoming' },
  { id: 94, date: '2026-07-07', time: '待定', group: '16强', team1: '第87场胜者', team2: '第88场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '流明球场', city: '西雅图', round: '1/8决赛', status: 'upcoming' },

  // 1/4决赛 (7月9日-7月11日)
  { id: 95, date: '2026-07-09', time: '待定', group: '8强', team1: '第89场胜者', team2: '第90场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '梅赛德斯-奔驰体育场', city: '亚特兰大', round: '1/4决赛', status: 'upcoming' },
  { id: 96, date: '2026-07-10', time: '待定', group: '8强', team1: '第91场胜者', team2: '第92场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '不列颠哥伦比亚体育馆', city: '温哥华', round: '1/4决赛', status: 'upcoming' },
  { id: 97, date: '2026-07-11', time: '待定', group: '8强', team1: '第93场胜者', team2: '第94场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '吉列体育场', city: '波士顿', round: '1/4决赛', status: 'upcoming' },
  { id: 98, date: '2026-07-11', time: '待定', group: '8强', team1: '第95场胜者', team2: '第96场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: 'SoFi体育场', city: '洛杉矶', round: '1/4决赛', status: 'upcoming' },

  // 半决赛 (7月14日-7月15日)
  { id: 99, date: '2026-07-14', time: '待定', group: '4强', team1: '第97场胜者', team2: '第98场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: 'AT&T体育场', city: '达拉斯', round: '半决赛', status: 'upcoming' },
  { id: 100, date: '2026-07-15', time: '待定', group: '4强', team1: '第99场胜者', team2: '第100场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '梅赛德斯-奔驰体育场', city: '亚特兰大', round: '半决赛', status: 'upcoming' },

  // 三四名决赛 (7月18日)
  { id: 101, date: '2026-07-18', time: '待定', group: '决赛', team1: '第99场负者', team2: '第100场负者', team1Flag: '🔘', team2Flag: '🔘', venue: '硬石体育场', city: '迈阿密', round: '三四名决赛', status: 'upcoming' },

  // 决赛 (7月19日)
  { id: 102, date: '2026-07-19', time: '08:00', group: '决赛', team1: '第99场胜者', team2: '第100场胜者', team1Flag: '🔘', team2Flag: '🔘', venue: '大都会人寿体育场', city: '纽约/新泽西', round: '决赛', status: 'upcoming' },
];

export const allMatches = [...groupStageMatches, ...knockoutMatches];

// 阶段信息
export const tournamentPhases = [
  { name: '小组赛', startDate: '2026-06-11', endDate: '2026-06-28', matches: 72 },
  { name: '1/16决赛', startDate: '2026-06-28', endDate: '2026-07-03', matches: 16 },
  { name: '1/8决赛', startDate: '2026-07-04', endDate: '2026-07-07', matches: 8 },
  { name: '1/4决赛', startDate: '2026-07-09', endDate: '2026-07-11', matches: 4 },
  { name: '半决赛', startDate: '2026-07-14', endDate: '2026-07-15', matches: 2 },
  { name: '三四名决赛', startDate: '2026-07-18', endDate: '2026-07-18', matches: 1 },
  { name: '决赛', startDate: '2026-07-19', endDate: '2026-07-19', matches: 1 },
];
