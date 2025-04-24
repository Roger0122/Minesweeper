// File: MinESWEEPER/src/stores/MINESWEEPER.js
import { ref } from 'vue';

// 定義遊戲板的尺寸 (可以根據需要調整或作為參數傳入 initializeBoard)
const defaultRows = 10;
const defaultCols = 10;
const defaultNumberOfMines = 15; // 範例地雷數


// 定義遊戲狀態的 ref
export const board = ref([]);
export const isGameOver = ref(false);
export const remainingMines = ref(0); // 可以用來追蹤未標記的地雷數或剩餘格子數

// 初始化遊戲板的函數
export function initializeBoard(rows = defaultRows, cols = defaultCols, numberOfMines = defaultNumberOfMines) {
    // 重置遊戲狀態
    isGameOver.value = false;
    remainingMines.value = numberOfMines; // 初始化剩餘地雷數

    // 清空並建立新的遊戲板
    board.value = [];
    for (let i = 0; i < rows; i++) {
        board.value[i] = [];
        for (let j = 0; j < cols; j++) {
            board.value[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                count: 0,
                row: i,
                col: j
            };
        }
    }

    // 隨機放置地雷
    let minesPlaced = 0;
    while (minesPlaced < numberOfMines) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);

        if (!board.value[randomRow][randomCol].isMine) {
            board.value[randomRow][randomCol].isMine = true;
            minesPlaced++;
        }
    }

    // 計算每個非地雷格子的相鄰地雷數
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!board.value[i][j].isMine) {
                let mineCount = 0;
                // 檢查周圍 8 個格子
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        // 排除自身
                        if (dr === 0 && dc === 0) continue;

                        const neighborRow = i + dr;
                        const neighborCol = j + dc;

                        // 檢查是否在邊界內
                        if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
                            if (board.value[neighborRow][neighborCol].isMine) {
                                mineCount++;
                            }
                        }
                    }
                }
                board.value[i][j].count = mineCount;
            }
        }
    }
}

// 輔助函數：遞迴翻開相鄰的空白格子
function revealAdjacentEmptyCells(row, col, rows, cols) {
    // 檢查周圍 8 個格子
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            // 排除自身
            if (dr === 0 && dc === 0) continue;

            const neighborRow = row + dr;
            const neighborCol = col + dc;

            // 檢查是否在邊界內
            if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
                const neighborCell = board.value[neighborRow][neighborCol];

                // 如果相鄰格子未翻開且未標記
                if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
                    neighborCell.isRevealed = true; // 翻開相鄰格子

                    // 如果相鄰格子也是空白格子 (count === 0)，則繼續遞迴翻開其相鄰格子
                    if (neighborCell.count === 0) {
                        revealAdjacentEmptyCells(neighborRow, neighborCol, rows, cols);
                    }
                }
            }
        }
    }
}


// 翻開格子的主要邏輯函數
export function revealCell(row, col) {
    // 確保遊戲未結束且格子在邊界內
    if (isGameOver.value || row < 0 || row >= board.value.length || col < 0 || col >= board.value[0].length) {
        return;
    }

    const cell = board.value[row][col];

    // 如果格子已翻開或已標記，則不做任何事
    if (cell.isRevealed || cell.isFlagged) {
        return;
    }

    cell.isRevealed = true; // 翻開當前格子

    // 如果點到地雷
    if (cell.isMine) {
        isGameOver.value = true; // 遊戲結束
        // TODO: 您可以在這裡添加顯示所有地雷的邏輯
        console.log("Game Over! You hit a mine.");
        return;
    }

    // 如果點到空白格子 (相鄰地雷數為 0)
    if (cell.count === 0) {
        // 遞迴翻開相鄰的空白格子
        revealAdjacentEmptyCells(row, col, board.value.length, board.value[0].length);
    }

    // TODO: 檢查遊戲是否勝利 (所有非地雷格子都被翻開)
    // 您需要一個函數來檢查這個條件
    // 例如: checkWinCondition();
}

// 您可以在這裡添加標記格子的邏輯函數
// export function flagCell(row, col) { ... }
