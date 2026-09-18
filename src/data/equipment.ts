import type { Equipment, Gym } from '../types';

export interface EquipmentInfo {
  id: Equipment;
  label: string;
  group: '自由重量' | '固定式器材' | '有氧器材' | '其他';
}

export const EQUIPMENT: EquipmentInfo[] = [
  { id: 'barbell', label: '槓鈴', group: '自由重量' },
  { id: 'rack', label: '深蹲架 / 蹲舉架', group: '自由重量' },
  { id: 'bench', label: '臥推椅（可調角度）', group: '自由重量' },
  { id: 'dumbbell', label: '啞鈴', group: '自由重量' },
  { id: 'ezBar', label: 'EZ 曲槓', group: '自由重量' },
  { id: 'kettlebell', label: '壺鈴', group: '自由重量' },
  { id: 'trapBar', label: '六角槓', group: '自由重量' },
  { id: 'landmine', label: '地雷管', group: '自由重量' },
  { id: 'pullupBar', label: '單槓', group: '自由重量' },
  { id: 'dipStation', label: '雙槓 / 撐體架', group: '自由重量' },
  { id: 'band', label: '彈力帶', group: '其他' },
  { id: 'bodyweight', label: '徒手（地墊）', group: '其他' },
  { id: 'cable', label: '繩索機 / 龍門架', group: '固定式器材' },
  { id: 'smith', label: '史密斯機', group: '固定式器材' },
  { id: 'latPulldown', label: '滑輪下拉機', group: '固定式器材' },
  { id: 'rowMachine', label: '坐姿划船機', group: '固定式器材' },
  { id: 'chestPress', label: '胸推機', group: '固定式器材' },
  { id: 'pecDeck', label: '蝴蝶機', group: '固定式器材' },
  { id: 'shoulderPress', label: '肩推機', group: '固定式器材' },
  { id: 'legPress', label: '腿推機', group: '固定式器材' },
  { id: 'hackSquat', label: '哈克深蹲機', group: '固定式器材' },
  { id: 'legCurl', label: '腿彎舉機', group: '固定式器材' },
  { id: 'legExtension', label: '腿伸展機', group: '固定式器材' },
  { id: 'hipThrustMachine', label: '臀推機', group: '固定式器材' },
  { id: 'calfMachine', label: '小腿機', group: '固定式器材' },
  { id: 'abMachine', label: '腹肌機', group: '固定式器材' },
  { id: 'treadmill', label: '跑步機', group: '有氧器材' },
  { id: 'bike', label: '飛輪 / 健身車', group: '有氧器材' },
  { id: 'rower', label: '划船機', group: '有氧器材' },
  { id: 'elliptical', label: '橢圓機', group: '有氧器材' },
  { id: 'stairmaster', label: '爬梯機', group: '有氧器材' },
  { id: 'skiErg', label: '滑雪機', group: '有氧器材' },
  { id: 'jumpRope', label: '跳繩', group: '有氧器材' },
];

export const EQUIPMENT_LABEL: Record<Equipment, string> = Object.fromEntries(
  EQUIPMENT.map((e) => [e.id, e.label]),
) as Record<Equipment, string>;

export const ALL_EQUIPMENT: Equipment[] = EQUIPMENT.map((e) => e.id);

const FREE_WEIGHT: Equipment[] = [
  'barbell', 'rack', 'bench', 'dumbbell', 'ezBar', 'kettlebell', 'pullupBar', 'dipStation', 'band', 'bodyweight',
];

export const DEFAULT_GYMS: Gym[] = [
  { id: 'gym-commercial', name: '商業健身房', equipment: [...ALL_EQUIPMENT] },
  {
    id: 'gym-office',
    name: '公司健身房',
    equipment: [
      ...FREE_WEIGHT, 'cable', 'smith', 'latPulldown', 'rowMachine', 'chestPress', 'legPress',
      'legCurl', 'legExtension', 'treadmill', 'bike', 'rower', 'elliptical',
    ],
  },
  {
    id: 'gym-community',
    name: '社區健身房',
    equipment: [
      'dumbbell', 'bench', 'pullupBar', 'band', 'bodyweight', 'cable', 'smith', 'latPulldown',
      'chestPress', 'legPress', 'treadmill', 'bike', 'elliptical',
    ],
  },
];
