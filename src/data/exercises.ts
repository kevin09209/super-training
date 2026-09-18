import type { Exercise } from '../types';

/**
 * 動作庫。
 * tier 1：網路上普遍公認 CP 值最高的動作（多關節、大重量、可進步性高）。
 * load.ratio：以臥推 / 引體(體重+負重) / 深蹲 1RM 估算此動作 1RM 的比例，僅供參考。
 * tip：設定 → 關鍵要領 → 常見錯誤 → 進退階，盡量寫成在健身房能直接照做的指令。
 */
export const EXERCISES: Exercise[] = [
  // ───────────── 胸 ─────────────
  {
    id: 'bench_press', name: '槓鈴臥推', nameEn: 'Barbell Bench Press', primary: 'chest', secondary: ['triceps', 'shoulders'],
    equipment: ['barbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 1 },
    tip: '握距約 1.5 倍肩寬，肩胛後收下壓、上背與臀貼椅，腳踩實。槓下放到胸線下緣（乳頭下方），手肘與身體夾 45–75°，控制 1–2 秒後推起。常見錯誤：手肘外開成 90°、屁股離椅、槓在頸部上方。',
  },
  {
    id: 'incline_bench', name: '上斜槓鈴臥推', nameEn: 'Incline Barbell Bench Press', primary: 'chest', secondary: ['shoulders', 'triceps'],
    equipment: ['barbell', 'bench'], type: 'compound', tier: 2, load: { base: 'bench', ratio: 0.8 },
    tip: '椅背 30°（超過 45° 就變成肩推）。槓落點在鎖骨下方，比平板高，手肘略收。上胸沒感覺通常是重量太重、離心太快，先降重放慢。',
  },
  {
    id: 'db_bench', name: '啞鈴臥推', nameEn: 'Dumbbell Bench Press', primary: 'chest', secondary: ['triceps', 'shoulders'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.33 }, perHand: true,
    tip: '啞鈴先放大腿，躺下時用膝蓋踢上來。底部手肘略低於身體平面、與軀幹夾 45°，頂端不必碰啞鈴，全程肩胛後收。活動度比槓鈴大，肩不舒服的人優先選這個。',
  },
  {
    id: 'incline_db_bench', name: '上斜啞鈴臥推', nameEn: 'Incline Dumbbell Press', primary: 'chest', secondary: ['shoulders', 'triceps'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.28 }, perHand: true,
    tip: '椅背 30–45°，啞鈴下放到上胸兩側，掌心可微微內轉。頂端手臂略向內收讓上胸擠壓，但不要聳肩。是上胸最實用的動作。',
  },
  {
    id: 'dips', name: '雙槓撐體', nameEn: 'Dips', primary: 'chest', secondary: ['triceps', 'shoulders'],
    equipment: ['dipStation'], type: 'compound', tier: 1, bodyweight: true,
    tip: '練胸：身體前傾約 30°、手肘略外開、下放到上臂與地面平行；身體直立、肘貼身則偏三頭。肩前側會痛就不要下太深。做超過 12 下就用腰帶掛片負重。',
  },
  {
    id: 'pushup', name: '伏地挺身', nameEn: 'Push-up', primary: 'chest', secondary: ['triceps', 'core'],
    equipment: ['bodyweight'], type: 'compound', tier: 2, bodyweight: true,
    tip: '手掌略寬於肩，身體從頭到腳一直線、核心與臀夾緊，胸口下到離地一拳。太輕鬆就腳墊高或背上放槓片；太難就手撐在椅子上。',
  },
  {
    id: 'machine_chest_press', name: '胸推機', nameEn: 'Machine Chest Press', primary: 'chest', secondary: ['triceps'],
    equipment: ['chestPress'], type: 'compound', tier: 2, load: { base: 'bench', ratio: 0.85 },
    tip: '調座椅高度讓把手對齊胸中線，肩胛後收貼椅背，推出時手肘不鎖死。軌道固定所以很安全，適合放在最後做到力竭。',
  },
  {
    id: 'smith_bench', name: '史密斯臥推', nameEn: 'Smith Machine Bench Press', primary: 'chest', secondary: ['triceps', 'shoulders'],
    equipment: ['smith', 'bench'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.95 },
    tip: '先空槓試位置，讓槓自然落在胸線下緣再固定椅子。沒有補手時做大重量或慢離心（4 秒）很好用，但少了穩定肌參與，不要完全取代自由重量。',
  },
  {
    id: 'cable_fly', name: '繩索夾胸', nameEn: 'Cable Fly', primary: 'chest', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 2,
    tip: '手肘微彎固定，以肩關節畫弧線，雙手在胸前交會時擠壓 1 秒。滑輪高於肩往下夾偏下胸，低於腰往上夾偏上胸。重量太重會變成推而不是夾。',
  },
  {
    id: 'pec_deck', name: '蝴蝶機夾胸', nameEn: 'Pec Deck', primary: 'chest', secondary: [],
    equipment: ['pecDeck'], type: 'isolation', tier: 3,
    tip: '座椅高度讓把手與胸線同高，手肘微彎。回放時不要超過身體平面，以免肩前側過度拉扯。頂端停 1 秒擠壓。',
  },
  {
    id: 'db_fly', name: '啞鈴飛鳥', nameEn: 'Dumbbell Fly', primary: 'chest', secondary: [],
    equipment: ['dumbbell', 'bench'], type: 'isolation', tier: 3, load: { base: 'bench', ratio: 0.12 }, perHand: true,
    tip: '手肘微彎固定，下放到胸部有拉伸感即可，不要放到比椅面更低。重量寧輕勿重，這個動作在底部對肩的壓力很大。',
  },
  {
    id: 'landmine_press', name: '地雷管推舉', nameEn: 'Landmine Press', primary: 'chest', secondary: ['shoulders', 'triceps'],
    equipment: ['landmine', 'barbell'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.45 },
    tip: '站姿或半跪，單手或雙手握槓端於肩前，往斜上方推出。推的路徑介於臥推與肩推之間，對肩關節友善，肩推會痛的人可用它取代。',
  },

  // ───────────── 背 ─────────────
  {
    id: 'pullup', name: '引體向上', nameEn: 'Pull-up', primary: 'back', secondary: ['biceps', 'core'],
    equipment: ['pullupBar'], type: 'compound', tier: 1, bodyweight: true, load: { base: 'pullup', ratio: 1 },
    tip: '正握、握距略寬於肩。起始先肩胛下壓（不聳肩）再拉，胸口帶向槓、下巴過槓，下放到手臂全直。做不到 5 下：用彈力帶，或跳上去慢放 3–5 秒只做離心；輕鬆做 10 下就掛片負重。',
  },
  {
    id: 'chinup', name: '反手引體向上', nameEn: 'Chin-up', primary: 'back', secondary: ['biceps'],
    equipment: ['pullupBar'], type: 'compound', tier: 2, bodyweight: true, load: { base: 'pullup', ratio: 1.05 },
    tip: '反握、與肩同寬，二頭參與更多，通常能比正握多做 1–2 下。一樣以肩胛啟動、胸口朝槓，不要只用手臂拉。',
  },
  {
    id: 'band_pullup', name: '彈力帶輔助引體', nameEn: 'Band-assisted Pull-up', primary: 'back', secondary: ['biceps'],
    equipment: ['pullupBar', 'band'], type: 'compound', tier: 2, bodyweight: true,
    tip: '帶子套在槓上，單膝或雙腳踩住。帶子越粗輔助越多。目標是每組 8 下，能做 3×8 就換更細的帶，最後脫離帶子。',
  },
  {
    id: 'lat_pulldown', name: '滑輪下拉', nameEn: 'Lat Pulldown', primary: 'back', secondary: ['biceps'],
    equipment: ['latPulldown'], type: 'compound', tier: 1, load: { base: 'pullup', ratio: 0.85 },
    tip: '大腿墊壓緊，上身後傾 15–20°，把槓拉到上胸、手肘往後下方帶。頂端手臂全伸讓闊背拉開。常見錯誤：身體往後甩、拉到肚子、只做半程。',
  },
  {
    id: 'barbell_row', name: '槓鈴划船', nameEn: 'Barbell Row', primary: 'back', secondary: ['biceps', 'hamstrings'],
    equipment: ['barbell'], type: 'compound', tier: 1, load: { base: 'pullup', ratio: 0.75 },
    tip: '髖鉸鏈到上身 30–45°，背打直、膝微彎，槓從膝下拉到肚臍下方，手肘沿身體往後。每下之間可短暫停在下方重置。重量太重的訊號：上身站起來甩、聳肩。',
  },
  {
    id: 'db_row', name: '單手啞鈴划船', nameEn: 'One-arm Dumbbell Row', primary: 'back', secondary: ['biceps'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'pullup', ratio: 0.3 }, perHand: true,
    tip: '一手一膝撐椅，背平行地面。啞鈴沿身體側邊拉到髖旁，手肘往後不外開，頂端停 1 秒。不要轉身借力，下放時讓肩胛完全前伸。',
  },
  {
    id: 'seated_cable_row', name: '坐姿繩索划船', nameEn: 'Seated Cable Row', primary: 'back', secondary: ['biceps'],
    equipment: ['cable'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.8 },
    tip: '胸挺、背直，先肩胛後收再把把手拉到肚臍，回放時讓肩胛前伸拉開闊背。上身前後晃動控制在 10° 以內，太晃就是重量太重。',
  },
  {
    id: 'machine_row', name: '划船機', nameEn: 'Machine Row', primary: 'back', secondary: ['biceps'],
    equipment: ['rowMachine'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.8 },
    tip: '胸靠墊調到把手在下胸位置，胸全程貼墊避免借力。寬握、肘外開偏上背與後肩；窄握、肘貼身偏闊背。',
  },
  {
    id: 'chest_supported_row', name: '上斜啞鈴划船', nameEn: 'Chest-supported Dumbbell Row', primary: 'back', secondary: ['biceps', 'shoulders'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.22 }, perHand: true,
    tip: '椅背 30–45°，胸趴在椅上，啞鈴自然下垂。手肘往後拉到身體平面、頂端肩胛擠壓 1 秒。因為胸有支撐幾乎不能借力，是感受度最好的划船。',
  },
  {
    id: 'tbar_row', name: 'T 槓划船', nameEn: 'T-bar / Landmine Row', primary: 'back', secondary: ['biceps'],
    equipment: ['landmine', 'barbell'], type: 'compound', tier: 2, load: { base: 'pullup', ratio: 0.7 },
    tip: '槓一端固定，雙手握 V 把手跨在槓上。背打直、髖鉸鏈到上身約 45°，拉向下胸。可以放比啞鈴划船重很多的重量，但背一圓就停。',
  },
  {
    id: 'inverted_row', name: '反向划船', nameEn: 'Inverted Row', primary: 'back', secondary: ['biceps', 'core'],
    equipment: ['smith'], type: 'compound', tier: 2, bodyweight: true,
    tip: '史密斯槓調到腰高，身體一直線掛在槓下，胸口碰槓。槓越低、腳墊越高越難；槓調高則簡單。做不到引體向上的人從這裡開始。',
  },
  {
    id: 'deadlift', name: '傳統硬舉', nameEn: 'Conventional Deadlift', primary: 'back', secondary: ['hamstrings', 'glutes', 'core'],
    equipment: ['barbell'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1.15 },
    tip: '腳與髖同寬、槓在腳掌中段、脛骨貼槓。背打直、肩胛在槓正上方，深吸氣繃緊核心，用腿「推地」讓槓離地，槓全程貼腿。頂端髖完全伸直、不後仰。每下都從靜止開始，不要彈地。',
  },
  {
    id: 'trap_bar_deadlift', name: '六角槓硬舉', nameEn: 'Trap Bar Deadlift', primary: 'back', secondary: ['quads', 'glutes'],
    equipment: ['trapBar'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 1.2 },
    tip: '站在槓中央，握把在身體兩側，重心中立、上身較直立，對下背比傳統硬舉友善。高握把較簡單、低握把活動範圍較大。腿日的髖主導動作首選。',
  },
  {
    id: 'straight_arm_pulldown', name: '直臂下壓', nameEn: 'Straight-arm Pulldown', primary: 'back', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 3,
    tip: '手臂微彎固定，以肩關節為軸把繩索從頭高壓到大腿，全程感受闊背。手肘一彎就變成三頭在做。適合當背日開頭的啟動動作。',
  },
  {
    id: 'db_pullover', name: '啞鈴仰臥拉舉', nameEn: 'Dumbbell Pullover', primary: 'back', secondary: ['chest'],
    equipment: ['dumbbell', 'bench'], type: 'isolation', tier: 3, load: { base: 'bench', ratio: 0.3 },
    tip: '平躺，雙手托住啞鈴內側，手肘微彎固定。下放到頭後方感覺闊背與胸的拉伸，回到眼睛上方即可，不必回到胸前。',
  },

  // ───────────── 肩 ─────────────
  {
    id: 'ohp', name: '槓鈴肩推', nameEn: 'Overhead Press', primary: 'shoulders', secondary: ['triceps', 'core'],
    equipment: ['barbell', 'rack'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.62 },
    tip: '握距略寬於肩、前臂垂直，臀腹夾緊、肋骨不外翻。槓走直線：經過臉時頭微後縮，槓過頭後頭回到中立，頂端耳朵、槓、髖一直線，肩胛自然上旋聳起。常見錯誤：後仰變成上斜臥推。',
  },
  {
    id: 'db_shoulder_press', name: '啞鈴肩推', nameEn: 'Dumbbell Shoulder Press', primary: 'shoulders', secondary: ['triceps'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.22 }, perHand: true,
    tip: '坐姿椅背 80–90°，啞鈴從肩側推到頭頂上方。手肘略在身體前方（約 30°），不要在正側方，對肩關節較安全。底部到耳朵高度即可。',
  },
  {
    id: 'machine_shoulder_press', name: '肩推機', nameEn: 'Machine Shoulder Press', primary: 'shoulders', secondary: ['triceps'],
    equipment: ['shoulderPress'], type: 'compound', tier: 2, load: { base: 'bench', ratio: 0.55 },
    tip: '調座椅讓把手起始約在下巴高度，背貼椅、腳踩地，推到手肘接近伸直但不鎖死。適合安全做到力竭或當第二個肩推動作。',
  },
  {
    id: 'push_press', name: '槓鈴借力推', nameEn: 'Push Press', primary: 'shoulders', secondary: ['triceps', 'quads'],
    equipment: ['barbell', 'rack'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.72 },
    tip: '微蹲（約 10–15 公分）後用腿的爆發力把槓推起，手臂只是收尾。適合突破肩推重量或練爆發力，下放一定要控制、不要讓槓砸在鎖骨上。',
  },
  {
    id: 'arnold_press', name: '阿諾肩推', nameEn: 'Arnold Press', primary: 'shoulders', secondary: ['triceps'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 3, load: { base: 'bench', ratio: 0.18 }, perHand: true,
    tip: '起始啞鈴在下巴前、掌心朝自己，推起時邊轉邊推到頂端掌心朝前。活動範圍大、前三角參與多，重量要比一般啞鈴肩推輕 20–30%。',
  },
  {
    id: 'lateral_raise', name: '啞鈴側平舉', nameEn: 'Dumbbell Lateral Raise', primary: 'shoulders', secondary: [],
    equipment: ['dumbbell'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.1 }, perHand: true,
    tip: '上身微前傾、手肘微彎固定，以手肘領先往側上方舉到與肩同高，小指略高於拇指，頂端停 1 秒。重量要輕到不聳肩、不用身體甩；肩寬靠的是次數與張力，不是重量。',
  },
  {
    id: 'cable_lateral_raise', name: '繩索側平舉', nameEn: 'Cable Lateral Raise', primary: 'shoulders', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 2,
    tip: '滑輪調到最低，繩索從身後或身前穿過，單手做、身體微側傾。相比啞鈴，底部也有張力，是中三角很好的補充。',
  },
  {
    id: 'face_pull', name: '面拉', nameEn: 'Face Pull', primary: 'shoulders', secondary: ['back'],
    equipment: ['cable'], type: 'isolation', tier: 1,
    tip: '繩索調到臉高，掌心相對握繩。手肘高於手、往臉兩側拉，末端外旋讓拳頭到耳旁，肩胛後收。後三角與旋轉肌群，每週至少 2 次，是護肩的關鍵動作。',
  },
  {
    id: 'rear_delt_fly', name: '俯身啞鈴反向飛鳥', nameEn: 'Bent-over Rear Delt Fly', primary: 'shoulders', secondary: ['back'],
    equipment: ['dumbbell'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.08 }, perHand: true,
    tip: '髖鉸鏈到上身接近平行地面，手肘微彎，往側後方舉到與肩同高，用後肩發力、不要聳肩或後收肩胛太多（那會變成上背）。重量很輕即可。',
  },
  {
    id: 'reverse_pec_deck', name: '反向蝴蝶機', nameEn: 'Reverse Pec Deck', primary: 'shoulders', secondary: ['back'],
    equipment: ['pecDeck'], type: 'isolation', tier: 2,
    tip: '把手調到肩高，掌心朝內或朝下。手肘微彎往後拉到肩平面即可，不必拉更後面。動作終點停 1 秒，感覺後肩發熱而不是上背。',
  },
  {
    id: 'band_pull_apart', name: '彈力帶拉開', nameEn: 'Band Pull-apart', primary: 'shoulders', secondary: ['back'],
    equipment: ['band'], type: 'isolation', tier: 3,
    tip: '雙手握帶與肩同寬、手臂伸直在胸前，往兩側拉開到帶子碰胸，肩胛後收擠壓。最適合當推日的熱身或組間填充，每組 15–20 下。',
  },
  {
    id: 'pike_pushup', name: '屈體伏地挺身', nameEn: 'Pike Push-up', primary: 'shoulders', secondary: ['triceps'],
    equipment: ['bodyweight'], type: 'compound', tier: 3, bodyweight: true,
    tip: '屁股抬高成倒 V 字，頭往雙手之間的地面下降再推起。腳越靠近手、或腳墊高，越接近倒立推，難度越高。沒器材時的肩推替代。',
  },

  // ───────────── 二頭 ─────────────
  {
    id: 'ez_curl', name: 'EZ 槓彎舉', nameEn: 'EZ-bar Curl', primary: 'biceps', secondary: [],
    equipment: ['ezBar'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.35 },
    tip: '手肘固定在身體兩側、不前後擺，舉起時肘不往前抬。放下 2–3 秒到手臂全直。曲槓角度對手腕比直槓友善，可放稍重一點。',
  },
  {
    id: 'bb_curl', name: '槓鈴彎舉', nameEn: 'Barbell Curl', primary: 'biceps', secondary: [],
    equipment: ['barbell'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.35 },
    tip: '握距與肩同寬，站姿、膝微彎，不用身體甩（可背靠牆檢查）。底部手臂全直、頂端不必舉到肩前失去張力。手腕不舒服就換 EZ 槓。',
  },
  {
    id: 'db_curl', name: '啞鈴彎舉', nameEn: 'Dumbbell Curl', primary: 'biceps', secondary: [],
    equipment: ['dumbbell'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.15 }, perHand: true,
    tip: '交替或同時做都可以。舉起時掌心逐漸外轉（旋後）到頂端小指略高，二頭收縮更完整。下放全程控制，不要讓啞鈴掉下來。',
  },
  {
    id: 'incline_db_curl', name: '上斜啞鈴彎舉', nameEn: 'Incline Dumbbell Curl', primary: 'biceps', secondary: [],
    equipment: ['dumbbell', 'bench'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.12 }, perHand: true,
    tip: '椅背 45–60°，手臂自然垂在身體後方，此拉長位對二頭長頭刺激最大。上臂固定不往前抬，重量要比站姿輕。研究顯示拉長位訓練增肌效果較佳。',
  },
  {
    id: 'hammer_curl', name: '錘式彎舉', nameEn: 'Hammer Curl', primary: 'biceps', secondary: [],
    equipment: ['dumbbell'], type: 'isolation', tier: 1, load: { base: 'bench', ratio: 0.16 }, perHand: true,
    tip: '掌心相對、像握鐵鎚，同時練肱肌與前臂，是增加手臂「厚度」的關鍵動作。可比一般彎舉重 10–20%。肘固定，可交替做。',
  },
  {
    id: 'cable_curl', name: '繩索彎舉', nameEn: 'Cable Curl', primary: 'biceps', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 2,
    tip: '滑輪調到最低，用直桿或繩索。繩索提供全程張力，頂端也不會失去阻力。手肘固定身側，退一步站可讓底部張力更好。',
  },
  {
    id: 'preacher_curl', name: '牧師椅彎舉', nameEn: 'Preacher Curl', primary: 'biceps', secondary: [],
    equipment: ['ezBar', 'bench'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.28 },
    tip: '上臂完全貼墊、腋下卡在墊子上緣。底部不要完全鎖直（保護肘），頂端也不必舉到失去張力。沒有牧師椅可用上斜椅背代替。',
  },
  {
    id: 'band_curl', name: '彈力帶彎舉', nameEn: 'Band Curl', primary: 'biceps', secondary: [],
    equipment: ['band'], type: 'isolation', tier: 3,
    tip: '雙腳踩住彈力帶，越往上阻力越大。適合旅行、熱身或器材都被佔用時，每組做到 15–20 下。',
  },

  // ───────────── 三頭 ─────────────
  {
    id: 'close_grip_bench', name: '窄握臥推', nameEn: 'Close-grip Bench Press', primary: 'triceps', secondary: ['chest', 'shoulders'],
    equipment: ['barbell', 'bench'], type: 'compound', tier: 1, load: { base: 'bench', ratio: 0.85 },
    tip: '握距與肩同寬即可（太窄手腕會痛），手肘貼身體兩側，槓落在下胸。三頭複合動作首選，也能直接提升臥推鎖定力。',
  },
  {
    id: 'triceps_pushdown', name: '繩索下壓', nameEn: 'Triceps Pushdown', primary: 'triceps', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 1,
    tip: '手肘固定在身體兩側，前臂往下推到全直，用繩索時底部可向外分開。上身微前傾但肩不要往前壓借力。感覺是手肘伸直，不是把重量壓下去。',
  },
  {
    id: 'overhead_cable_ext', name: '繩索過頭臂屈伸', nameEn: 'Overhead Cable Triceps Extension', primary: 'triceps', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 1,
    tip: '背對滑輪、繩索從頭後方，手肘指向前上方固定，前臂從頭後方往前伸直。長頭在拉長位受訓，增肌研究表現優於下壓，兩者可搭配。',
  },
  {
    id: 'skull_crusher', name: '仰臥臂屈伸', nameEn: 'Skull Crusher', primary: 'triceps', secondary: [],
    equipment: ['ezBar', 'bench'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.35 },
    tip: '平躺，槓往頭後方（額頭上方或更後面）下放，手肘略指向後方而不是正上方，可減輕肘關節壓力並拉長長頭。手肘痛就改繩索過頭伸展。',
  },
  {
    id: 'db_overhead_ext', name: '啞鈴過頭臂屈伸', nameEn: 'Dumbbell Overhead Extension', primary: 'triceps', secondary: [],
    equipment: ['dumbbell'], type: 'isolation', tier: 2, load: { base: 'bench', ratio: 0.25 },
    tip: '雙手托住一顆啞鈴的上緣，手肘貼耳側、指向天花板，下放到後腦感覺三頭拉伸再推直。坐姿有椅背較穩。',
  },
  {
    id: 'bench_dip', name: '板凳撐體', nameEn: 'Bench Dip', primary: 'triceps', secondary: ['chest'],
    equipment: ['bench', 'bodyweight'], type: 'compound', tier: 3, bodyweight: true,
    tip: '手撐椅緣、腿伸直在前，下放到上臂平行地面。腿墊高或大腿放槓片可加難度。肩前側會痛的人請改繩索動作。',
  },
  {
    id: 'diamond_pushup', name: '鑽石伏地挺身', nameEn: 'Diamond Push-up', primary: 'triceps', secondary: ['chest'],
    equipment: ['bodyweight'], type: 'compound', tier: 3, bodyweight: true,
    tip: '雙手拇指與食指相碰成菱形，放在胸口正下方，手肘貼身下放。比一般伏地挺身更偏三頭，手腕不適可改握啞鈴做。',
  },
  {
    id: 'db_kickback', name: '啞鈴後踢', nameEn: 'Dumbbell Kickback', primary: 'triceps', secondary: [],
    equipment: ['dumbbell'], type: 'isolation', tier: 3, load: { base: 'bench', ratio: 0.08 }, perHand: true,
    tip: '上身平行地面、上臂貼身固定，前臂往後伸直到與上臂成一直線，頂端停 1 秒。重量很輕，一甩就沒效果。適合當最後的收尾動作。',
  },

  // ───────────── 股四頭 ─────────────
  {
    id: 'back_squat', name: '槓鈴深蹲', nameEn: 'Barbell Back Squat', primary: 'quads', secondary: ['glutes', 'hamstrings', 'core'],
    equipment: ['barbell', 'rack'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1 },
    tip: '槓放上斜方肌（高槓）或後三角上方（低槓），腳略寬於肩、腳尖外開 15–30°。深吸氣繃緊核心，髖膝同時屈，膝蓋順著腳尖方向、腳掌三點踩實，蹲到髖低於膝。站起時胸口與臀同步上升，不要屁股先起。',
  },
  {
    id: 'front_squat', name: '前蹲', nameEn: 'Front Squat', primary: 'quads', secondary: ['glutes', 'core'],
    equipment: ['barbell', 'rack'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.85 },
    tip: '槓架在前三角與鎖骨上，手肘抬高、上臂平行地面（手腕不舒服可雙手交叉抱槓）。上身比後蹲更直立，四頭與上背刺激更大。手肘一掉槓就會往前滑，肘要撐住。',
  },
  {
    id: 'leg_press', name: '腿推機', nameEn: 'Leg Press', primary: 'quads', secondary: ['glutes'],
    equipment: ['legPress'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1.6 },
    tip: '腳與肩同寬放在踏板中間偏上，下放到膝約 90° 或屁股快離座為止，推起時不鎖膝。腳放越高越練臀腿後，越低越練四頭。不同機型阻力差異大，重量僅供參考。',
  },
  {
    id: 'hack_squat', name: '哈克深蹲', nameEn: 'Hack Squat', primary: 'quads', secondary: ['glutes'],
    equipment: ['hackSquat'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1 },
    tip: '背與臀貼墊，腳放踏板中間或略前，蹲到大腿平行以下再推起。不用平衡所以能專心把四頭做到力竭，是四頭增肌最有效率的機器之一。',
  },
  {
    id: 'bulgarian_split_squat', name: '保加利亞分腿蹲', nameEn: 'Bulgarian Split Squat', primary: 'quads', secondary: ['glutes', 'hamstrings'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 0.2 }, perHand: true,
    tip: '後腳腳背放椅上，前腳離椅子約一大步。上身直立偏四頭、微前傾偏臀，前腳膝蓋可以超過腳尖。先做弱腳、兩邊同次數。單腿動作 CP 值王者，也是平衡與髖穩定的訓練。',
  },
  {
    id: 'goblet_squat', name: '高腳杯深蹲', nameEn: 'Goblet Squat', primary: 'quads', secondary: ['glutes', 'core'],
    equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.3 },
    tip: '啞鈴豎握於胸前、手肘往內夾，蹲到手肘碰到膝蓋內側。前方負重讓上身自然直立，是學深蹲與熱身的最佳動作。',
  },
  {
    id: 'kb_goblet_squat', name: '壺鈴高腳杯深蹲', nameEn: 'Kettlebell Goblet Squat', primary: 'quads', secondary: ['glutes', 'core'],
    equipment: ['kettlebell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.3 },
    tip: '雙手握壺鈴握把兩側（握角）托於胸前，其餘要領同高腳杯深蹲。壺鈴重心比啞鈴集中，握起來更順手。',
  },
  {
    id: 'smith_squat', name: '史密斯深蹲', nameEn: 'Smith Machine Squat', primary: 'quads', secondary: ['glutes'],
    equipment: ['smith'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.9 },
    tip: '腳可放在槓前方 20–30 公分做「靠背式」蹲，四頭刺激更高且不用擔心平衡。注意軌道若有斜角，面向要讓下蹲時槓往後走。',
  },
  {
    id: 'leg_extension', name: '腿伸展機', nameEn: 'Leg Extension', primary: 'quads', secondary: [],
    equipment: ['legExtension'], type: 'isolation', tier: 2,
    tip: '座椅調到膝關節對齊機器轉軸，腳墊在腳踝上方。頂端停 1 秒、下放 2–3 秒。膝痛的人不要完全鎖直，或改用較小活動範圍。',
  },
  {
    id: 'walking_lunge', name: '啞鈴走路弓步', nameEn: 'Dumbbell Walking Lunge', primary: 'quads', secondary: ['glutes', 'hamstrings'],
    equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.18 }, perHand: true,
    tip: '步幅大、前腳膝蓋在腳踝正上方，後膝輕觸地。每步站穩再跨下一步，上身保持直立。每邊 8–12 步為一組。',
  },
  {
    id: 'reverse_lunge', name: '啞鈴後弓步', nameEn: 'Dumbbell Reverse Lunge', primary: 'quads', secondary: ['glutes'],
    equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.18 }, perHand: true,
    tip: '往後跨步比往前跨對膝蓋更友善，前腳吃力。後膝輕觸地後用前腳推回站直。上身微前傾偏臀、直立偏四頭。',
  },
  {
    id: 'step_up', name: '啞鈴登階', nameEn: 'Dumbbell Step-up', primary: 'quads', secondary: ['glutes'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.15 }, perHand: true,
    tip: '椅子高度約膝蓋，用上方那隻腳「拉」身體上去，下方腳不要蹬地借力。下來時慢放控制。單邊做完再換邊。',
  },
  {
    id: 'landmine_squat', name: '地雷管深蹲', nameEn: 'Landmine Squat', primary: 'quads', secondary: ['glutes'],
    equipment: ['landmine', 'barbell'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.4 },
    tip: '雙手托槓端於胸前，槓的弧線會引導身體往後坐，讓踝關節活動度不足的人也能蹲深。適合當熱身或高次數收尾。',
  },
  {
    id: 'bw_split_squat', name: '徒手分腿蹲', nameEn: 'Bodyweight Split Squat', primary: 'quads', secondary: ['glutes'],
    equipment: ['bodyweight'], type: 'compound', tier: 3, bodyweight: true,
    tip: '前後分腿站定，後膝往地面降到快碰地再站起，上身直立。每邊能做 15 下後再進階到保加利亞分腿蹲或手持啞鈴。',
  },

  // ───────────── 腿後 ─────────────
  {
    id: 'rdl', name: '羅馬尼亞硬舉', nameEn: 'Romanian Deadlift', primary: 'hamstrings', secondary: ['glutes', 'back'],
    equipment: ['barbell'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 0.8 },
    tip: '從站姿開始，膝微彎固定，髖往後推、上身前傾，槓貼著大腿下放到腿後有明顯拉伸（約膝下）就回，不必碰地。背全程打直、肩胛微收。感覺在腿後而不是下背才是對的。',
  },
  {
    id: 'db_rdl', name: '啞鈴羅馬尼亞硬舉', nameEn: 'Dumbbell Romanian Deadlift', primary: 'hamstrings', secondary: ['glutes', 'back'],
    equipment: ['dumbbell'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 0.28 }, perHand: true,
    tip: '啞鈴貼大腿前側下放，其餘要領同槓鈴 RDL。啞鈴版本握力先到極限時可用助握帶。',
  },
  {
    id: 'lying_leg_curl', name: '俯臥腿彎舉', nameEn: 'Lying Leg Curl', primary: 'hamstrings', secondary: [],
    equipment: ['legCurl'], type: 'isolation', tier: 1,
    tip: '髖貼墊不抬起、腳踝勾起（背屈），彎到腳跟接近臀部停 1 秒，下放 2–3 秒。臀部翹起代表重量太重。',
  },
  {
    id: 'seated_leg_curl', name: '坐姿腿彎舉', nameEn: 'Seated Leg Curl', primary: 'hamstrings', secondary: [],
    equipment: ['legCurl'], type: 'isolation', tier: 1,
    tip: '大腿墊壓緊、背貼椅。坐姿讓髖處於屈曲，腿後在拉長位受訓，增肌研究表現優於俯臥版本。頂端停 1 秒，回放時腿不要完全放鬆。',
  },
  {
    id: 'nordic_curl', name: '北歐腿後彎舉', nameEn: 'Nordic Hamstring Curl', primary: 'hamstrings', secondary: [],
    equipment: ['bodyweight'], type: 'isolation', tier: 2, bodyweight: true,
    tip: '跪姿、腳踝固定（滑輪下拉機的腿墊、深蹲架底或請人壓），身體從膝到頭一直線慢慢往前倒 3–5 秒，撐不住時手撐地再推回。只做離心就非常有效，也是預防拉傷的黃金動作。',
  },
  {
    id: 'single_leg_rdl', name: '單腳啞鈴羅馬尼亞硬舉', nameEn: 'Single-leg Dumbbell RDL', primary: 'hamstrings', secondary: ['glutes', 'core'],
    equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.15 }, perHand: true,
    tip: '單腳站立、另一腳往後伸與上身成一直線，髖鉸鏈下放，骨盆保持水平不打開。先徒手掌握平衡，再用對側手拿啞鈴。',
  },
  {
    id: 'good_morning', name: '早安式', nameEn: 'Good Morning', primary: 'hamstrings', secondary: ['glutes', 'back'],
    equipment: ['barbell', 'rack'], type: 'compound', tier: 3, load: { base: 'squat', ratio: 0.4 },
    tip: '槓在背上、膝微彎，髖鉸鏈到上身約 45° 再夾臀站直。重量一定要輕、屬輔助動作，背一圓立刻停。也能改善深蹲的髖鉸鏈。',
  },
  {
    id: 'kb_swing', name: '壺鈴擺盪', nameEn: 'Kettlebell Swing', primary: 'hamstrings', secondary: ['glutes', 'core'],
    equipment: ['kettlebell'], type: 'compound', tier: 2,
    tip: '髖鉸鏈把壺鈴往後甩過胯下，再用臀爆發性伸髖把它「彈」到胸口高度，手臂只是繩子。頂端臀夾緊、身體一直線，不是用手舉也不是深蹲。適合當腿日或有氧的收尾。',
  },

  // ───────────── 臀 ─────────────
  {
    id: 'hip_thrust', name: '槓鈴臀推', nameEn: 'Barbell Hip Thrust', primary: 'glutes', secondary: ['hamstrings'],
    equipment: ['barbell', 'bench'], type: 'compound', tier: 1, load: { base: 'squat', ratio: 1.1 },
    tip: '上背靠椅緣（肩胛下方），槓放髖前加護墊，腳踩到頂端時小腿垂直地面。頂端下巴收、骨盆後傾夾臀停 1–2 秒，身體從肩到膝一直線；不要腰過度後仰去追高度。',
  },
  {
    id: 'machine_hip_thrust', name: '臀推機', nameEn: 'Machine Hip Thrust', primary: 'glutes', secondary: ['hamstrings'],
    equipment: ['hipThrustMachine'], type: 'compound', tier: 1,
    tip: '依機器調整靠墊高度與腳踏板，其餘要領同槓鈴臀推。換片快、不用架槓，是臀推的首選機器。',
  },
  {
    id: 'db_hip_thrust', name: '啞鈴臀推', nameEn: 'Dumbbell Hip Thrust', primary: 'glutes', secondary: ['hamstrings'],
    equipment: ['dumbbell', 'bench'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.4 },
    tip: '啞鈴橫放在髖前雙手扶住，要領同槓鈴臀推。重量有限，適合做 12–20 下的高次數或頂端停留 3 秒。',
  },
  {
    id: 'sumo_deadlift', name: '相撲硬舉', nameEn: 'Sumo Deadlift', primary: 'glutes', secondary: ['quads', 'hamstrings', 'back'],
    equipment: ['barbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 1.1 },
    tip: '站距寬、腳尖外開約 45°，雙手在腿內側握槓。起始膝往外推、上身較直立，用臀與內收肌把槓推離地。活動範圍比傳統硬舉短，下背壓力較小。',
  },
  {
    id: 'cable_pull_through', name: '繩索穿拉', nameEn: 'Cable Pull-through', primary: 'glutes', secondary: ['hamstrings'],
    equipment: ['cable'], type: 'compound', tier: 3,
    tip: '背對低位滑輪、繩索從胯下穿過，髖往後推讓繩索往後走，再夾臀站直。手臂完全不出力。學髖鉸鏈與感受臀的好動作。',
  },
  {
    id: 'cable_kickback', name: '繩索後踢', nameEn: 'Cable Glute Kickback', primary: 'glutes', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 3,
    tip: '腳踝扣繩索、雙手扶機器，上身微前傾，腿往後上方踢並在頂端夾臀 1 秒。膝微彎、不要用腰後仰去追高度。',
  },
  {
    id: 'glute_bridge', name: '徒手臀橋', nameEn: 'Glute Bridge', primary: 'glutes', secondary: ['hamstrings'],
    equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true,
    tip: '平躺屈膝、腳跟靠近臀部，臀推起到肩、髖、膝一直線，頂端停 2 秒。單腿版本或大腿放重物可加難度。適合當腿日熱身啟動臀部。',
  },
  {
    id: 'band_lateral_walk', name: '彈力帶側走', nameEn: 'Band Lateral Walk', primary: 'glutes', secondary: [],
    equipment: ['band'], type: 'isolation', tier: 3,
    tip: '帶子套在膝上或腳踝，半蹲、腳尖朝前，往側邊小步走，帶子全程保持張力。臀中肌啟動，最適合當深蹲前的熱身。',
  },

  // ───────────── 小腿 ─────────────
  {
    id: 'standing_calf_raise', name: '站姿小腿機', nameEn: 'Standing Calf Raise', primary: 'calves', secondary: [],
    equipment: ['calfMachine'], type: 'isolation', tier: 1,
    tip: '前腳掌踩台階邊緣，底部腳跟完全下沉停 1–2 秒，頂端踮到最高停 1 秒。全程慢、不要彈跳。膝伸直練腓腸肌，若機器可坐姿則練比目魚肌。',
  },
  {
    id: 'leg_press_calf_raise', name: '腿推機提踵', nameEn: 'Leg Press Calf Raise', primary: 'calves', secondary: [],
    equipment: ['legPress'], type: 'isolation', tier: 1,
    tip: '腳掌前緣踩踏板下緣，膝微彎固定、只動腳踝。底部充分伸展停 1 秒再推。沒有小腿機時最好的替代。',
  },
  {
    id: 'smith_calf_raise', name: '史密斯提踵', nameEn: 'Smith Machine Calf Raise', primary: 'calves', secondary: [],
    equipment: ['smith'], type: 'isolation', tier: 2,
    tip: '槓在背上，前腳掌踩在踏板或槓片上讓腳跟能下沉。動作要領同站姿小腿機，可放大重量。',
  },
  {
    id: 'db_calf_raise', name: '單腳啞鈴提踵', nameEn: 'Single-leg Dumbbell Calf Raise', primary: 'calves', secondary: [],
    equipment: ['dumbbell'], type: 'isolation', tier: 2, perHand: true,
    tip: '一手扶牆、另一手拿啞鈴，單腳前掌踩台階，每邊做到力竭。單腳版本比雙腳更容易做到有效強度。',
  },
  {
    id: 'bw_calf_raise', name: '徒手提踵', nameEn: 'Bodyweight Calf Raise', primary: 'calves', secondary: [],
    equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true,
    tip: '找樓梯或台階讓腳跟能下沉，每組做 20 下以上、慢速。能輕鬆做 25 下再改單腳或負重。',
  },

  // ───────────── 核心 ─────────────
  {
    id: 'hanging_leg_raise', name: '懸垂舉腿', nameEn: 'Hanging Leg Raise', primary: 'core', secondary: [],
    equipment: ['pullupBar'], type: 'isolation', tier: 1, bodyweight: true,
    tip: '懸掛不晃動，骨盆後傾把腿「捲」起來到與地面平行以上，感覺是下腹在捲而不是髖屈肌甩腿。太難就屈膝做（懸垂抬膝），太簡單就直腿碰槓或腳踝夾啞鈴。',
  },
  {
    id: 'cable_crunch', name: '繩索捲腹', nameEn: 'Cable Crunch', primary: 'core', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 1,
    tip: '跪姿、握繩索固定在頭兩側，髖不動，用腹肌把手肘往膝蓋方向捲、肋骨靠近骨盆。手臂只是掛著繩索，不要用手拉。腹肌也需要漸進負重，這是最好加重的腹肌動作。',
  },
  {
    id: 'ab_machine', name: '腹肌機捲腹', nameEn: 'Machine Crunch', primary: 'core', secondary: [],
    equipment: ['abMachine'], type: 'isolation', tier: 2,
    tip: '調整靠墊對齊胸口、腳勾住腳墊，捲腹時想像肋骨靠近骨盆，頂端停 1 秒。不要用手臂拉把手或用髖屈肌拉。',
  },
  {
    id: 'plank', name: '棒式', nameEn: 'Plank', primary: 'core', secondary: [],
    equipment: ['bodyweight'], type: 'isolation', tier: 2, bodyweight: true,
    tip: '手肘在肩正下方、身體從頭到腳跟一直線，臀夾緊、骨盆後傾、腹部用力像要被打一拳。能撐 60 秒就別再加時間，改成背上放槓片或單腳抬起。',
  },
  {
    id: 'pallof_press', name: '帕洛夫推', nameEn: 'Pallof Press', primary: 'core', secondary: [],
    equipment: ['cable'], type: 'isolation', tier: 2,
    tip: '側對滑輪、把手調到胸高，雙手握把在胸前往前推直，抗住被拉回的旋轉停 2 秒再收回。抗旋轉核心，每邊各做。腳站越窄越難。',
  },
  {
    id: 'band_pallof_press', name: '彈力帶帕洛夫推', nameEn: 'Band Pallof Press', primary: 'core', secondary: [],
    equipment: ['band'], type: 'isolation', tier: 3,
    tip: '彈力帶固定在腰高的柱子上，側對、雙手握帶在胸前推直，抗住旋轉。要領同繩索帕洛夫推，離固定點越遠阻力越大。',
  },
  {
    id: 'farmers_carry', name: '農夫走路', nameEn: "Farmer's Carry", primary: 'core', secondary: ['back'],
    equipment: ['dumbbell'], type: 'compound', tier: 2, load: { base: 'squat', ratio: 0.3 }, perHand: true,
    tip: '雙手提盡量重的啞鈴，肩胛下壓不聳肩、身體直、視線前方，小步快走 30–40 公尺或 30–45 秒。練握力、上背與抗側彎核心，是被低估的全身動作。',
  },
  {
    id: 'dead_bug', name: '死蟲式', nameEn: 'Dead Bug', primary: 'core', secondary: [],
    equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true,
    tip: '平躺、腰貼地，手指天花板、膝屈 90°。對側手腳緩慢伸直到接近地面再收回，全程腰不離地、吐氣時伸出。動作慢才有效。',
  },
  {
    id: 'side_plank', name: '側棒式', nameEn: 'Side Plank', primary: 'core', secondary: [],
    equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true,
    tip: '手肘在肩正下方、髖抬高讓身體一直線、不要往後倒。每側 30–45 秒。太難就下方膝著地，太簡單就抬上方腳。',
  },
  {
    id: 'reverse_crunch', name: '反向捲腹', nameEn: 'Reverse Crunch', primary: 'core', secondary: [],
    equipment: ['bodyweight'], type: 'isolation', tier: 3, bodyweight: true,
    tip: '平躺、屈膝抬腿，用下腹把骨盆捲離地面（不是用腿甩），慢放回。手可以壓在身體兩側幫助穩定，但不要用手推地。',
  },

  // ───────────── 有氧 ─────────────
  {
    id: 'treadmill_run', name: '跑步機跑步', nameEn: 'Treadmill Run', primary: 'cardio', secondary: [],
    equipment: ['treadmill'], type: 'cardio', tier: 1, cardioStyle: 'any',
    tip: '坡度設 1% 較接近戶外的風阻。間歇時先把速度調好再跳上去，緩和段用快走。落地在身體正下方、步頻高一點對膝蓋較好。',
  },
  {
    id: 'incline_walk', name: '跑步機坡度快走', nameEn: 'Incline Treadmill Walk', primary: 'cardio', secondary: [],
    equipment: ['treadmill'], type: 'cardio', tier: 1, cardioStyle: 'liss',
    tip: '坡度 10–12%、速度 5–6 km/h，不要扶把手（扶了強度少一半）。對膝蓋友善、熱量消耗高，練腿後恢復日也能做。',
  },
  {
    id: 'bike', name: '飛輪 / 健身車', nameEn: 'Stationary Bike', primary: 'cardio', secondary: [],
    equipment: ['bike'], type: 'cardio', tier: 1, cardioStyle: 'any',
    tip: '座墊高度讓踏板最低點時膝微彎（約 25–30°）。間歇時加阻力而不是只加轉速，維持 80–95 rpm。對關節衝擊最低，腿日後做也不會太累。',
  },
  {
    id: 'rower', name: '划船機', nameEn: 'Rowing Machine', primary: 'cardio', secondary: ['back'],
    equipment: ['rower'], type: 'cardio', tier: 1, cardioStyle: 'any',
    tip: '順序是腿→身→手，回程手→身→腿，力量 60% 來自腿。每分鐘 20–26 槳，追求每槳的力道而不是槳頻。阻力風門設 4–6。',
  },
  {
    id: 'elliptical', name: '橢圓機', nameEn: 'Elliptical', primary: 'cardio', secondary: [],
    equipment: ['elliptical'], type: 'cardio', tier: 2, cardioStyle: 'liss',
    tip: '阻力調到有點喘但能持續、不要只靠慣性滑。腳跟踩實、身體直，可放開把手增加核心參與。膝痛時最安全的有氧選擇。',
  },
  {
    id: 'stairmaster', name: '爬梯機', nameEn: 'Stairmaster', primary: 'cardio', secondary: ['glutes'],
    equipment: ['stairmaster'], type: 'cardio', tier: 2, cardioStyle: 'liss',
    tip: '不要扶把手撐體重，整個腳掌踩上階梯用臀推。速度以能持續 15–20 分鐘為準，強度比看起來高很多。',
  },
  {
    id: 'ski_erg', name: '滑雪機', nameEn: 'SkiErg', primary: 'cardio', secondary: ['back', 'core'],
    equipment: ['skiErg'], type: 'cardio', tier: 2, cardioStyle: 'hiit',
    tip: '髖鉸鏈帶動、雙手從頭頂往下拉到大腿旁，像闊背與核心在做爆發性捲腹。適合上肢日的高強度間歇，對腿的負擔小。',
  },
  {
    id: 'jump_rope', name: '跳繩', nameEn: 'Jump Rope', primary: 'cardio', secondary: ['calves'],
    equipment: ['jumpRope'], type: 'cardio', tier: 2, cardioStyle: 'hiit',
    tip: '前腳掌落地、膝微彎、手腕轉繩而不是手臂。先練連續跳 1 分鐘不絆，再做間歇。小腿會很酸，一開始別排在腿日。',
  },
  {
    id: 'burpees', name: '波比跳', nameEn: 'Burpees', primary: 'cardio', secondary: ['core'],
    equipment: ['bodyweight'], type: 'cardio', tier: 3, cardioStyle: 'hiit',
    tip: '下去時手先撐穩再跳腳、跳起時全身伸直。不求快，每下都做完整，喘不過來就改成走步版本（不跳、慢慢站起）。',
  },
  {
    id: 'outdoor_run', name: '戶外跑步 / 快走', nameEn: 'Outdoor Run / Walk', primary: 'cardio', secondary: [],
    equipment: [], type: 'cardio', tier: 2, cardioStyle: 'any',
    tip: '快走或慢跑皆可，能邊跑邊說完整句子就是 LISS 強度。間歇可用電線桿或路燈當標記：一段快、兩段慢。',
  },
];

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e]),
);

export function getExercise(id: string): Exercise {
  const ex = EXERCISE_BY_ID[id];
  if (!ex) throw new Error(`Unknown exercise: ${id}`);
  return ex;
}
