const WALK_FRAME_COUNT = 8; // 設定走路精靈圖的影格總數
const WALK_FRAME_HEIGHT = 39; // 設定走路精靈每格的高度
const JUMP_FRAME_COUNT = 10; // 設定跳躍精靈圖的影格總數
const JUMP_FRAME_HEIGHT = 42; // 設定跳躍精靈每格的高度
const MOVE_SPEED = 3.5; // 設定角色每次繪製時的移動速度
const FRAME_DURATION = 100; // 設定動畫每格顯示的毫秒數

let walkSprite; // 儲存走路精靈圖
let jumpSprite; // 儲存跳躍精靈圖
let characterX; // 儲存角色目前的水平位置
let characterY; // 儲存角色目前的垂直位置
let facingDirection = 1; // 儲存角色朝向，1 為右方，-1 為左方

function preload() { // 在畫布開始繪製前載入精靈圖
  walkSprite = loadImage('1/walk/walk..png'); // 載入走路精靈圖
  jumpSprite = loadImage('1/jump/jump..png'); // 載入跳躍精靈圖
} // 結束精靈圖載入函式

function setup() { // 設定畫布與角色初始狀態
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布
  imageMode(CENTER); // 將圖片繪製座標設定為圖片中心
  characterX = width / 2; // 將角色放在畫面水平中央
  characterY = height / 2; // 將角色放在畫面垂直中央
} // 結束畫布設定函式

function draw() { // 每個動畫影格更新並繪製畫面
  background('#bde0fe'); // 使用指定的淺藍色清除畫面

  let currentSprite = walkSprite; // 預設使用走路精靈圖
  let frameCount = WALK_FRAME_COUNT; // 預設使用走路精靈圖的影格數
  let frameWidth = Math.ceil(walkSprite.width / WALK_FRAME_COUNT); // 依圖片實際寬度計算走路第一格的整數寬度
  let frameHeight = WALK_FRAME_HEIGHT; // 預設使用走路動畫每格的高度
  const isMoving = keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW); // 判斷目前是否按住左右方向鍵

  if (keyIsDown(RIGHT_ARROW)) { // 檢查使用者是否按住鍵盤右鍵
    characterX += MOVE_SPEED; // 持續將角色向右移動
    facingDirection = 1; // 讓角色面向右方
  } else if (keyIsDown(LEFT_ARROW)) { // 檢查使用者是否按住鍵盤左鍵
    characterX -= MOVE_SPEED; // 持續將角色向左移動
    facingDirection = -1; // 讓角色面向左方
    currentSprite = jumpSprite; // 將動畫切換為跳躍精靈圖
    frameCount = JUMP_FRAME_COUNT; // 使用跳躍精靈圖的影格數
    frameWidth = Math.ceil(jumpSprite.width / JUMP_FRAME_COUNT); // 依圖片實際寬度計算跳躍第一格的整數寬度
    frameHeight = JUMP_FRAME_HEIGHT; // 使用跳躍動畫每格的高度
  } // 結束左右方向鍵判斷

  characterX = constrain(characterX, frameWidth / 2, width - frameWidth / 2); // 限制角色不會移出畫布左右邊界

  const frameIndex = isMoving ? floor(millis() / FRAME_DURATION) % frameCount : 0; // 移動時循環播放，停止時固定顯示第一格
  const sourceX = Math.floor(frameIndex * currentSprite.width / frameCount); // 計算目前影格在精靈圖上的整數起點
  const sourceRight = Math.floor((frameIndex + 1) * currentSprite.width / frameCount); // 計算目前影格在精靈圖上的整數終點
  const sourceWidth = sourceRight - sourceX; // 計算目前影格實際的整數裁切寬度

  push(); // 暫存畫布狀態以便只翻轉角色圖片
  translate(characterX, characterY); // 將圖片原點移到角色目前位置
  scale(facingDirection, 1); // 依角色朝向決定是否水平翻轉圖片
  image(currentSprite, 0, 0, frameWidth, frameHeight, sourceX, 0, sourceWidth, frameHeight); // 繪製目前影格並避免裁切到相鄰影格
  pop(); // 還原畫布狀態以免影響其他繪圖
} // 結束每影格繪製函式

function windowResized() { // 在瀏覽器視窗尺寸改變時更新畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布重新符合瀏覽器視窗大小
  const walkFrameWidth = Math.ceil(walkSprite.width / WALK_FRAME_COUNT); // 計算走路第一格的整數寬度
  characterX = constrain(characterX, walkFrameWidth / 2, width - walkFrameWidth / 2); // 將角色位置限制在新的畫布範圍內
  characterY = height / 2; // 讓角色保持在畫面垂直中央
} // 結束視窗尺寸更新函式

function keyPressed() { // 接收鍵盤按下事件
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 判斷是否按下左右方向鍵
    return false; // 阻止方向鍵捲動瀏覽器頁面
  } // 結束方向鍵判斷
} // 結束鍵盤事件函式
