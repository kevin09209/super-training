import type { Exercise } from '../types';

/**
 * 動作庫。
 * tier 1：網路上普遍公認 CP 值最高的動作（多關節、大重量、可進步性高）。
 * load.ratio：以臥推 / 引體(體重+負重) / 深蹲 1RM 估算此動作 1RM 的比例，僅供參考。
 */
export const EXERCISES: Exercise[] = [
  // ───────────── 胸 ─────────────
  { id: 'bench_press', name: '槓鈴臥推', nameEn: 'Barbell Bench Press', primary: 'chest', secondary: ['triceps', 'shoulders'], equipment: ['barbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 1 }, tip: '肩胛後收下壓，腳踩穩，槓落在胸線下緣。' },
  { id: 'incline_bench', name: '上斜槓鈴臥推', nameEn: 'Incline Barbell Bench Press', primary: 'chest', secondary: ['shoulders', 'triceps'], equipment: ['barbell', 'bench'], type: 'compound', tier: 2, load: { base: 'bench', ratio: 0.8 }, tip: '椅背 30° 左右，著重上胸。' },
  { id: 'db_bench', name: '啞鈴臥推', nameEn: 'Dumbbell Bench Press', primary: 'chest', secondary: ['triceps', 'shoulders'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.33 }, perHand: true, tip: '活動度比槓鈴大，底部微收肘。' },
  { id: 'incline_db_bench', name: '上斜啞鈴臥推', nameEn: 'Incline Dumbbell Press', primary: 'chest', secondary: ['shoulders', 'triceps'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.28 }, perHand: true },
  { id: 'dips', name: '雙槓撐體', nameEn: 'Dips', primary: 'chest', secondary: ['triceps', 'shoulders'], equipment: ['dipStation'], type: 'compound', tier: 1, bodyweight: true, tip: '身體前傾練胸，直立則偏三頭。可負重進階。' },
  { id: 'pushup', name: '伏地挺身', nameEn: 'Push-up', primary: 'chest', secondary: ['triceps', 'core'], equipment: ['bodyweight'], type: 'compound', tier: 2, bodyweight: true, tip: '太輕鬆可腳墊高或背負重。' },
  { id: 'machine_chest_press', name: '胸推機', nameEn: 'Machine Chest Press', primary: 'chest', secondary: ['triceps'], equipment: ['chestPress'], type: 'compound', tier: 2, load: { base: 'bench', ratio: 0.85 } },
  { id: 'smith_bench', name: '史密斯臥推', nameEn: 'Smith Machine Bench Press', primary: 'chest', secondary: ['triceps', 'shoulders'], equipment: ['smith', 'bench'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.95 } },
  { id: 'cable_fly', name: '繩索夾胸', nameEn: 'Cable Fly', primary: 'chest', secondary: [], equipment: ['cable'], type: 'isolation', tier: 2, tip: '高位往下夾偏下胸，低位往上夾偏上胸。' },
  { id: 'pec_deck', name: '蝴蝶機夾胸', nameEn: 'Pec Deck', primary: 'chest', secondary: [], equipment: ['pecDeck'], type: 'isolation', tier: 3 },
  { id: 'db_fly', name: '啞鈴飛鳥', nameEn: 'Dumbbell Fly', primary: 'chest', secondary: [], equipment: ['dumbbell', 'bench'], type: 'isolation', tier: 3, load: { base: 'bench', ratio: 0.12 }, perHand: true },
  { id: 'landmine_press', name: '地雷管推舉', nameEn: 'Landmine Press', primary: 'chest', secondary: ['shoulders', 'triceps'], equipment: ['landmine', 'barbell'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.45 } },

  // ───────────── 背 ─────────────
  { id: 'pullup', name: '引體向上', nameEn: 'Pull-up', primary: 'back', secondary: ['biceps', 'core'], equipment: ['pullupBar'], type: 'compound', tier: 1, bodyweight: true, load: { base: 'pullup', ratio: 1 }, tip: '肩胛先下壓再拉，胸口朝槓。可負重或彈力帶輔助。' },
  { id: 'chinup', name: '反手引體向上', nameEn: 'Chin-up', primary: 'back', secondary: ['biceps'], equipment: ['pullupBar'], type: 'compound', tier: 2, bodyweight: true, load: { base: 'pullup', ratio: 1.05 } },
  { id: 'band_pullup', name: '彈力帶輔助引體', nameEn: 'Band-assisted Pull-up', primary: 'back', secondary: ['biceps'], equipment: ['pullupBar', 'band'], type: 'compound', tier: 2, bodyweight: true },
  { id: 'lat_pulldown', name: '滑輪下拉', nameEn: 'Lat Pulldown', primary: 'back', secondary: ['biceps'], equipment: ['latPulldown'], type: 'compound', tier: 1, load: { base: 'pullup', ratio: 0.85 }, tip: '身體微後傾，拉到上胸。' },
  { id: 'barbell_row', name: '槓鈴划船', nameEn: 'Barbell Row', primary: 'back', secondary: ['biceps', 'hamstrings'], equipment: ['barbell'], type: 'compound', tier: 1, load: { base: 'pullup', ratio: 0.75 }, tip: '背打直約 45°，拉向肚臍下方。' },
  { id: 'db_row', name: '單手啞鈴划船', nameEn: 'One-arm Dumbbell Row', primary: 'back', secondary: ['biceps'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'pullup', ratio: 0.3 }, perHand: true },
  { id: 'seated_cable_row', name: '坐姿繩索划船', nameEn: 'Seated Cable Row', primary: 'back', secondary: ['biceps'], equipment: ['cable'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.8 } },
  { id: 'machine_row', name: '划船機', nameEn: 'Machine Row', primary: 'back', secondary: ['biceps'], equipment: ['rowMachine'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.8 } },
  { id: 'chest_supported_row', name: '上斜啞鈴划船', nameEn: 'Chest-supported Dumbbell Row', primary: 'back', secondary: ['biceps', 'shoulders'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.22 }, perHand: true },
  { id: 'tbar_row', name: 'T 槓划船', nameEn: 'T-bar / Landmine Row', primary: 'back', secondary: ['biceps'], equipment: ['landmine', 'barbell'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.7 } },
  { id: 'inverted_row', name: '反向划船', nameEn: 'Inverted Row', primary: 'back', secondary: ['biceps', 'core'], equipment: ['smith'], type: 'compound', tier: 2, bodyweight: true, tip: '史密斯槓調低，身體越水平越難。' },
  { id: 'deadlift', name: '傳統硬舉', nameEn: 'Conventional Deadlift', primary: 'back', secondary: ['hamstrings', 'glutes', 'core'], equipment: ['barbell'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1.15 }, tip: '槓貼脛骨，背打直，臀腿發力。' },
  { id: 'trap_bar_deadlift', name: '六角槓硬舉', nameEn: 'Trap Bar Deadlift', primary: 'back', secondary: ['quads', 'glutes'], equipment: ['trapBar'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 1.2 } },
  { id: 'straight_arm_pulldown', name: '直臂下壓', nameEn: 'Straight-arm Pulldown', primary: 'back', secondary: [], equipment: ['cable'], type: 'isolation', tier: 3 },
  { id: 'db_pullover', name: '啞鈴仰臥拉舉', nameEn: 'Dumbbell Pullover', primary: 'back', secondary: ['chest'], equipment: ['dumbbell', 'bench'], type: 'isolation', tier: 3, load: { base: 'bench', ratio: 0.3 } },

  // ───────────── 肩 ─────────────
  { id: 'ohp', name: '槓鈴肩推', nameEn: 'Overhead Press', primary: 'shoulders', secondary: ['triceps', 'core'], equipment: ['barbell', 'rack'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.62 }, tip: '臀腹收緊，槓走直線，頭在最高點穿過。' },
  { id: 'db_shoulder_press', name: '啞鈴肩推', nameEn: 'Dumbbell Shoulder Press', primary: 'shoulders', secondary: ['triceps'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.22 }, perHand: true },
  { id: 'machine_shoulder_press', name: '肩推機', nameEn: 'Machine Shoulder Press', primary: 'shoulders', secondary: ['triceps'], equipment: ['shoulderPress'], type: 'compound', tier: 2, load: { base: 'bench', ratio: 0.55 } },
  { id: 'push_press', name: '槓鈴借力推', nameEn: 'Push Press', primary: 'shoulders', secondary: ['triceps', 'quads'], equipment: ['barbell', 'rack'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.72 } },
  { id: 'arnold_press', name: '阿諾肩推', nameEn: 'Arnold Press', primary: 'shoulders', secondary: ['triceps'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.18 }, perHand: true },
  { id: 'lateral_raise', name: '啞鈴側平舉', nameEn: 'Dumbbell Lateral Raise', primary: 'shoulders', secondary: [], equipment: ['dumbbell'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.1 }, perHand: true, tip: '中三角肌 CP 值最高的動作，寧輕勿借力。' },
  { id: 'cable_lateral_raise', name: '繩索側平舉', nameEn: 'Cable Lateral Raise', primary: 'shoulders', secondary: [], equipment: ['cable'], type: 'isolation', tier: 2 },
  { id: 'face_pull', name: '面拉', nameEn: 'Face Pull', primary: 'shoulders', secondary: ['back'], equipment: ['cable'], type: 'isolation', tier: 1, tip: '後三角與旋轉肌群，護肩必練。' },
  { id: 'rear_delt_fly', name: '俯身啞鈴反向飛鳥', nameEn: 'Bent-over Rear Delt Fly', primary: 'shoulders', secondary: ['back'], equipment: ['dumbbell'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.08 }, perHand: true },
  { id: 'reverse_pec_deck', name: '反向蝴蝶機', nameEn: 'Reverse Pec Deck', primary: 'shoulders', secondary: ['back'], equipment: ['pecDeck'], type: 'isolation', tier: 2 },
  { id: 'band_pull_apart', name: '彈力帶拉開', nameEn: 'Band Pull-apart', primary: 'shoulders', secondary: ['back'], equipment: ['band'], type: 'isolation', tier: 3 },
  { id: 'pike_pushup', name: '屈體伏地挺身', nameEn: 'Pike Push-up', primary: 'shoulders', secondary: ['triceps'], equipment: ['bodyweight'], type: 'compound', tier: 3, bodyweight: true },

  // ───────────── 二頭 ─────────────
  { id: 'ez_curl', name: 'EZ 槓彎舉', nameEn: 'EZ-bar Curl', primary: 'biceps', secondary: [], equipment: ['ezBar'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.35 } },
  { id: 'bb_curl', name: '槓鈴彎舉', nameEn: 'Barbell Curl', primary: 'biceps', secondary: [], equipment: ['barbell'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.35 } },
  { id: 'db_curl', name: '啞鈴彎舉', nameEn: 'Dumbbell Curl', primary: 'biceps', secondary: [], equipment: ['dumbbell'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.15 }, perHand: true },
  { id: 'incline_db_curl', name: '上斜啞鈴彎舉', nameEn: 'Incline Dumbbell Curl', primary: 'biceps', secondary: [], equipment: ['dumbbell', 'bench'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.12 }, perHand: true, tip: '二頭長頭拉長位訓練，效果佳。' },
  { id: 'hammer_curl', name: '錘式彎舉', nameEn: 'Hammer Curl', primary: 'biceps', secondary: [], equipment: ['dumbbell'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.16 }, perHand: true },
  { id: 'cable_curl', name: '繩索彎舉', nameEn: 'Cable Curl', primary: 'biceps', secondary: [], equipment: ['cable'], type: 'isolation', tier: 2 },
  { id: 'preacher_curl', name: '牧師椅彎舉', nameEn: 'Preacher Curl', primary: 'biceps', secondary: [], equipment: ['ezBar', 'bench'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.28 }, tip: '若無牧師椅，可用上斜椅背代替。' },
  { id: 'band_curl', name: '彈力帶彎舉', nameEn: 'Band Curl', primary: 'biceps', secondary: [], equipment: ['band'], type: 'isolation', tier: 3 },

  // ───────────── 三頭 ─────────────
  { id: 'close_grip_bench', name: '窄握臥推', nameEn: 'Close-grip Bench Press', primary: 'triceps', secondary: ['chest', 'shoulders'], equipment: ['barbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.85 } },
  { id: 'triceps_pushdown', name: '繩索下壓', nameEn: 'Triceps Pushdown', primary: 'triceps', secondary: [], equipment: ['cable'], type: 'isolation', tier: 1 },
  { id: 'overhead_cable_ext', name: '繩索過頭臂屈伸', nameEn: 'Overhead Cable Triceps Extension', primary: 'triceps', secondary: [], equipment: ['cable'], type: 'isolation', tier: 1, tip: '長頭拉長位，研究顯示增肌效果優於下壓。' },
  { id: 'skull_crusher', name: '仰臥臂屈伸', nameEn: 'Skull Crusher', primary: 'triceps', secondary: [], equipment: ['ezBar', 'bench'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.35 } },
  { id: 'db_overhead_ext', name: '啞鈴過頭臂屈伸', nameEn: 'Dumbbell Overhead Extension', primary: 'triceps', secondary: [], equipment: ['dumbbell'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.25 } },
  { id: 'bench_dip', name: '板凳撐體', nameEn: 'Bench Dip', primary: 'triceps', secondary: ['chest'], equipment: ['bench', 'bodyweight'], type: 'compound', tier: 3, bodyweight: true },
  { id: 'diamond_pushup', name: '鑽石伏地挺身', nameEn: 'Diamond Push-up', primary: 'triceps', secondary: ['chest'], equipment: ['bodyweight'], type: 'compound', tier: 3, bodyweight: true },
  { id: 'db_kickback', name: '啞鈴後踢', nameEn: 'Dumbbell Kickback', primary: 'triceps', secondary: [], equipment: ['dumbbell'], type: 'isolation', tier: 3, load: { base: 'bench', ratio: 0.08 }, perHand: true },

  // ───────────── 股四頭 ─────────────
  { id: 'back_squat', name: '槓鈴深蹲', nameEn: 'Barbell Back Squat', primary: 'quads', secondary: ['glutes', 'hamstrings', 'core'], equipment: ['barbell', 'rack'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1 }, tip: '腳掌踩實，膝蓋順腳尖方向，蹲到大腿平行以下。' },
  { id: 'front_squat', name: '前蹲', nameEn: 'Front Squat', primary: 'quads', secondary: ['glutes', 'core'], equipment: ['barbell', 'rack'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.85 } },
  { id: 'leg_press', name: '腿推機', nameEn: 'Leg Press', primary: 'quads', secondary: ['glutes'], equipment: ['legPress'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1.6 }, tip: '不同機型阻力差異大，重量僅供參考。' },
  { id: 'hack_squat', name: '哈克深蹲', nameEn: 'Hack Squat', primary: 'quads', secondary: ['glutes'], equipment: ['hackSquat'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1 } },
  { id: 'bulgarian_split_squat', name: '保加利亞分腿蹲', nameEn: 'Bulgarian Split Squat', primary: 'quads', secondary: ['glutes', 'hamstrings'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 0.2 }, perHand: true, tip: '單腿動作 CP 值王者，前腳吃重。' },
  { id: 'goblet_squat', name: '高腳杯深蹲', nameEn: 'Goblet Squat', primary: 'quads', secondary: ['glutes', 'core'], equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.3 } },
  { id: 'kb_goblet_squat', name: '壺鈴高腳杯深蹲', nameEn: 'Kettlebell Goblet Squat', primary: 'quads', secondary: ['glutes', 'core'], equipment: ['kettlebell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.3 } },
  { id: 'smith_squat', name: '史密斯深蹲', nameEn: 'Smith Machine Squat', primary: 'quads', secondary: ['glutes'], equipment: ['smith'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.9 } },
  { id: 'leg_extension', name: '腿伸展機', nameEn: 'Leg Extension', primary: 'quads', secondary: [], equipment: ['legExtension'], type: 'isolation', tier: 2 },
  { id: 'walking_lunge', name: '啞鈴走路弓步', nameEn: 'Dumbbell Walking Lunge', primary: 'quads', secondary: ['glutes', 'hamstrings'], equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.18 }, perHand: true },
  { id: 'reverse_lunge', name: '啞鈴後弓步', nameEn: 'Dumbbell Reverse Lunge', primary: 'quads', secondary: ['glutes'], equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.18 }, perHand: true },
  { id: 'step_up', name: '啞鈴登階', nameEn: 'Dumbbell Step-up', primary: 'quads', secondary: ['glutes'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.15 }, perHand: true },
  { id: 'landmine_squat', name: '地雷管深蹲', nameEn: 'Landmine Squat', primary: 'quads', secondary: ['glutes'], equipment: ['landmine', 'barbell'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.4 } },
  { id: 'bw_split_squat', name: '徒手分腿蹲', nameEn: 'Bodyweight Split Squat', primary: 'quads', secondary: ['glutes'], equipment: ['bodyweight'], type: 'compound', tier: 3, bodyweight: true },

  // ───────────── 腿後 ─────────────
  { id: 'rdl', name: '羅馬尼亞硬舉', nameEn: 'Romanian Deadlift', primary: 'hamstrings', secondary: ['glutes', 'back'], equipment: ['barbell'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 0.8 }, tip: '屁股往後推，槓貼腿，膝微彎不鎖死。' },
  { id: 'db_rdl', name: '啞鈴羅馬尼亞硬舉', nameEn: 'Dumbbell Romanian Deadlift', primary: 'hamstrings', secondary: ['glutes', 'back'], equipment: ['dumbbell'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 0.28 }, perHand: true },
  { id: 'lying_leg_curl', name: '俯臥腿彎舉', nameEn: 'Lying Leg Curl', primary: 'hamstrings', secondary: [], equipment: ['legCurl'], type: 'isolation', tier: 1 },
  { id: 'seated_leg_curl', name: '坐姿腿彎舉', nameEn: 'Seated Leg Curl', primary: 'hamstrings', secondary: [], equipment: ['legCurl'], type: 'isolation', tier: 1, tip: '坐姿版本拉長位更多，增肌研究表現較佳。' },
  { id: 'nordic_curl', name: '北歐腿後彎舉', nameEn: 'Nordic Hamstring Curl', primary: 'hamstrings', secondary: [], equipment: ['bodyweight'], type: 'isolation', tier: 2, bodyweight: true, tip: '找固定腳踝的地方（滑輪下拉機座、深蹲架），離心慢放。' },
  { id: 'single_leg_rdl', name: '單腳啞鈴羅馬尼亞硬舉', nameEn: 'Single-leg Dumbbell RDL', primary: 'hamstrings', secondary: ['glutes', 'core'], equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.15 }, perHand: true },
  { id: 'good_morning', name: '早安式', nameEn: 'Good Morning', primary: 'hamstrings', secondary: ['glutes', 'back'], equipment: ['barbell', 'rack'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.4 } },
  { id: 'kb_swing', name: '壺鈴擺盪', nameEn: 'Kettlebell Swing', primary: 'hamstrings', secondary: ['glutes', 'core'], equipment: ['kettlebell'], type: 'compound', tier: 2 },

  // ───────────── 臀 ─────────────
  { id: 'hip_thrust', name: '槓鈴臀推', nameEn: 'Barbell Hip Thrust', primary: 'glutes', secondary: ['hamstrings'], equipment: ['barbell', 'bench'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1.1 }, tip: '下巴收，頂端骨盆後傾停一秒。' },
  { id: 'machine_hip_thrust', name: '臀推機', nameEn: 'Machine Hip Thrust', primary: 'glutes', secondary: ['hamstrings'], equipment: ['hipThrustMachine'], type: 'compound', tier: 1 },
  { id: 'db_hip_thrust', name: '啞鈴臀推', nameEn: 'Dumbbell Hip Thrust', primary: 'glutes', secondary: ['hamstrings'], equipment: ['dumbbell', 'bench'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.4 } },
  { id: 'sumo_deadlift', name: '相撲硬舉', nameEn: 'Sumo Deadlift', primary: 'glutes', secondary: ['quads', 'hamstrings', 'back'], equipment: ['barbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 1.1 } },
  { id: 'cable_pull_through', name: '繩索穿拉', nameEn: 'Cable Pull-through', primary: 'glutes', secondary: ['hamstrings'], equipment: ['cable'], type: 'compound', tier: 3 },
  { id: 'cable_kickback', name: '繩索後踢', nameEn: 'Cable Glute Kickback', primary: 'glutes', secondary: [], equipment: ['cable'], type: 'isolation', tier: 3 },
  { id: 'glute_bridge', name: '徒手臀橋', nameEn: 'Glute Bridge', primary: 'glutes', secondary: ['hamstrings'], equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true },
  { id: 'band_lateral_walk', name: '彈力帶側走', nameEn: 'Band Lateral Walk', primary: 'glutes', secondary: [], equipment: ['band'], type: 'isolation', tier: 3 },

  // ───────────── 小腿 ─────────────
  { id: 'standing_calf_raise', name: '站姿小腿機', nameEn: 'Standing Calf Raise', primary: 'calves', secondary: [], equipment: ['calfMachine'], type: 'isolation', tier: 1, tip: '底部充分伸展停一秒再上。' },
  { id: 'leg_press_calf_raise', name: '腿推機提踵', nameEn: 'Leg Press Calf Raise', primary: 'calves', secondary: [], equipment: ['legPress'], type: 'isolation', tier: 1 },
  { id: 'smith_calf_raise', name: '史密斯提踵', nameEn: 'Smith Machine Calf Raise', primary: 'calves', secondary: [], equipment: ['smith'], type: 'isolation', tier: 2 },
  { id: 'db_calf_raise', name: '單腳啞鈴提踵', nameEn: 'Single-leg Dumbbell Calf Raise', primary: 'calves', secondary: [], equipment: ['dumbbell'], type: 'isolation', tier: 2, perHand: true },
  { id: 'bw_calf_raise', name: '徒手提踵', nameEn: 'Bodyweight Calf Raise', primary: 'calves', secondary: [], equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true },

  // ───────────── 核心 ─────────────
  { id: 'hanging_leg_raise', name: '懸垂舉腿', nameEn: 'Hanging Leg Raise', primary: 'core', secondary: [], equipment: ['pullupBar'], type: 'isolation', tier: 1, bodyweight: true, tip: '骨盆後傾捲起，不要只用髖屈肌甩腿。' },
  { id: 'cable_crunch', name: '繩索捲腹', nameEn: 'Cable Crunch', primary: 'core', secondary: [], equipment: ['cable'], type: 'isolation', tier: 1 },
  { id: 'ab_machine', name: '腹肌機捲腹', nameEn: 'Machine Crunch', primary: 'core', secondary: [], equipment: ['abMachine'], type: 'isolation', tier: 2 },
  { id: 'plank', name: '棒式', nameEn: 'Plank', primary: 'core', secondary: [], equipment: ['bodyweight'], type: 'isolation', tier: 2, bodyweight: true },
  { id: 'pallof_press', name: '帕洛夫推', nameEn: 'Pallof Press', primary: 'core', secondary: [], equipment: ['cable'], type: 'isolation', tier: 2, tip: '抗旋轉核心，每邊各做。' },
  { id: 'band_pallof_press', name: '彈力帶帕洛夫推', nameEn: 'Band Pallof Press', primary: 'core', secondary: [], equipment: ['band'], type: 'isolation', tier: 3 },
  { id: 'farmers_carry', name: '農夫走路', nameEn: "Farmer's Carry", primary: 'core', secondary: ['back'], equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.3 }, perHand: true, tip: '每組走 30–40 公尺，肩胛下壓不聳肩。' },
  { id: 'dead_bug', name: '死蟲式', nameEn: 'Dead Bug', primary: 'core', secondary: [], equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true },
  { id: 'side_plank', name: '側棒式', nameEn: 'Side Plank', primary: 'core', secondary: [], equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true },
  { id: 'reverse_crunch', name: '反向捲腹', nameEn: 'Reverse Crunch', primary: 'core', secondary: [], equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true },

  // ───────────── 有氧 ─────────────
  { id: 'treadmill_run', name: '跑步機跑步', nameEn: 'Treadmill Run', primary: 'cardio', secondary: [], equipment: ['treadmill'], type: 'cardio', tier: 1, cardioStyle: 'any' },
  { id: 'incline_walk', name: '跑步機坡度快走', nameEn: 'Incline Treadmill Walk', primary: 'cardio', secondary: [], equipment: ['treadmill'], type: 'cardio', tier: 1, cardioStyle: 'liss', tip: '坡度 10–12%、速度 5–6 km/h，對膝蓋友善又燃脂。' },
  { id: 'bike', name: '飛輪 / 健身車', nameEn: 'Stationary Bike', primary: 'cardio', secondary: [], equipment: ['bike'], type: 'cardio', tier: 1, cardioStyle: 'any' },
  { id: 'rower', name: '划船機', nameEn: 'Rowing Machine', primary: 'cardio', secondary: ['back'], equipment: ['rower'], type: 'cardio', tier: 1, cardioStyle: 'any' },
  { id: 'elliptical', name: '橢圓機', nameEn: 'Elliptical', primary: 'cardio', secondary: [], equipment: ['elliptical'], type: 'cardio', tier: 2, cardioStyle: 'liss' },
  { id: 'stairmaster', name: '爬梯機', nameEn: 'Stairmaster', primary: 'cardio', secondary: ['glutes'], equipment: ['stairmaster'], type: 'cardio', tier: 2, cardioStyle: 'liss' },
  { id: 'ski_erg', name: '滑雪機', nameEn: 'SkiErg', primary: 'cardio', secondary: ['back', 'core'], equipment: ['skiErg'], type: 'cardio', tier: 2, cardioStyle: 'hiit' },
  { id: 'jump_rope', name: '跳繩', nameEn: 'Jump Rope', primary: 'cardio', secondary: ['calves'], equipment: ['jumpRope'], type: 'cardio', tier: 2, cardioStyle: 'hiit' },
  { id: 'burpees', name: '波比跳', nameEn: 'Burpees', primary: 'cardio', secondary: ['core'], equipment: ['bodyweight'], type: 'cardio', tier: 3, cardioStyle: 'hiit' },
  { id: 'outdoor_run', name: '戶外跑步 / 快走', nameEn: 'Outdoor Run / Walk', primary: 'cardio', secondary: [], equipment: [], type: 'cardio', tier: 2, cardioStyle: 'any' },
];

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e]),
);

export function getExercise(id: string): Exercise {
  const ex = EXERCISE_BY_ID[id];
  if (!ex) throw new Error(`Unknown exercise: ${id}`);
  return ex;
}
