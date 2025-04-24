<template>
<div class='game-controls'>
 <input type="number" placeholder="長寬"  v-model.number="boardSize" min="5"/>
  
 <input type="number" placeholder="地雷數" v-model.nunber="minesCount" min="1"/>


  <button @click="startNewGame">重新開始</button>


</div>

  <div class="minesweeper-board">
    <!-- 遍歷每一行 -->
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="board-row">
      <!-- 遍歷行中的每一個格子 -->
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="board-cell"
        :class="{
          'revealed': cell.isRevealed,
          'mine': cell.isMine && cell.isRevealed,
          'flagged': cell.isFlagged
        }"
        @click="handleLeftClick(cell)"
        @contextmenu.prevent="handleRightClick(cell)"
      >
        <!-- 顯示格子的內容 -->
        <template v-if="cell.isRevealed">
          <template v-if="cell.isMine">
            💣 <!-- 地雷圖示 -->
          </template>
          <template v-else-if="cell.count > 0">
            {{ cell.count }} <!-- 顯示相鄰地雷數 -->
          </template>
          <!-- 如果 count 是 0，這裡不顯示任何東西 -->
        </template>
        <template v-else-if="cell.isFlagged">
          🚩 <!-- 旗子圖示 -->
        </template>
        <!-- 如果未翻開且未標記，這裡不顯示任何東西 -->
      </div>
    </div>
  </div>


</template>

<script setup>
import { board, isGameOver, remainingMines, initializeBoard, revealCell } from '@/stores/minesweeper';
import { onMounted } from 'vue'; // 導入 onMounted
import  { ref } from 'vue';

const boardSize = ref(10);
const minesCount = ref(15);

const startNewGame = () => {
  
  const rows = boardSize.value > 0 ? boardSize.value : 10; //確保長寬大於0
  const cols = boardSize.value > 0 ? boardSize.value : 10;

  const maxMines = rows * cols -1;
  const mines = minesCount.value > 0 && minesCount.value <= maxMines ?  minesCount.value : Math.min(15,maxMines);

  initializeBoard(rows, cols, mines);
}

// 在組件掛載後初始化遊戲板
onMounted(() => {
  // 您可以在這裡設定遊戲板的尺寸和地雷數
  initializeBoard(10, 10, 15);
});

// 處理左鍵點擊事件 (翻開格子)
const handleLeftClick = (cell) => {
  if (isGameOver.value || cell.isRevealed || cell.isFlagged) {
    return; // 如果遊戲結束、格子已翻開或已標記，則不做任何事
  }
  // TODO: 呼叫 MINESWEEPER.js 中的函數來處理翻開格子的邏輯
  revealCell(cell.row, cell.col)
  console.log('Left clicked:', cell);
};

// 處理右鍵點擊事件 (標記/取消標記格子)
const handleRightClick = (cell) => {
   if (isGameOver.value || cell.isRevealed) {
    return; // 如果遊戲結束或格子已翻開，則不做任何事
  }

  // TODO: 呼叫 MINESWEEPER.js 中的函數來處理標記格子的邏輯
  // 例如: flagCell(cell.row, cell.col);
   console.log('Right clicked:', cell);
};

// TODO: 您可能還需要監聽 isGameOver 的變化來顯示遊戲結束訊息
// watch(isGameOver, (newValue) => {
//   if (newValue) {
//     alert('遊戲結束!'); // 簡單的提示
//   }
// });

</script>

<style scoped>
.minesweeper-board {
  display: inline-block; /* 讓整個板子根據內容調整寬度 */
  border: 3px solid #ccc;
}

.board-row {
  display: flex; /* 讓同一行的格子水平排列 */
}

.board-cell {
  width: 30px; /* 格子寬度 */
  height: 30px; /* 格子高度 */
  border: 1px solid #999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  background-color: #eee; /* 未翻開的格子背景色 */
  user-select: none; /* 防止選中文字 */
}

.board-cell.revealed {
  background-color: #ddd; /* 翻開的格子背景色 */
}

.board-cell.mine {
  background-color: red; /* 點到地雷的背景色 */
  color: white;
}

.board-cell.flagged {
  background-color: yellow; /* 標記旗子的背景色 */
}

/* 數字的顏色可以根據 count 調整 */
.board-cell.revealed:not(.mine):not(.flagged) {
  color: blue; /* 範例顏色 */
}
</style>
