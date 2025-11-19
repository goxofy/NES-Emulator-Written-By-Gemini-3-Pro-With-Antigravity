# React NES Emulator (Web版红白机模拟器)

这是一个基于 React、TypeScript 和 Vite 构建的 Web 版 NES (FC) 模拟器。核心使用 `jsnes` 库，并在此基础上进行了大量的 UI/UX 优化和性能改进。

## ✨ 功能特点

*   **高性能游戏循环**: 采用基于时间的渲染循环，确保在各种刷新率的屏幕上都能稳定保持 60 FPS，拒绝“慢动作”或“快进”。
*   **Web Audio 音效**: 使用 `ScriptProcessorNode` 实现音频缓冲和播放，完美还原游戏背景音乐和音效。
*   **复古街机 UI**: 采用“街机柜”风格的布局，屏幕比例强制锁定 4:3，还原真实显示效果。
*   **人性化控制**: 
    *   支持键盘操作，键位经过优化（WASD + J/K）。
    *   **连发功能 (Turbo)**: 专为射击游戏设计，轻松实现火力全开。
    *   **防误触**: 智能屏蔽方向键滚动网页，提供沉浸式体验。
*   **ROM 加载**: 支持拖拽或点击加载 `.nes` 游戏文件。
*   **硬重置**: 真实的“重置”按钮，重新加载 ROM 数据，防止游戏卡死。

## 🎮 操作说明

| 动作 | 按键 | 说明 |
| :--- | :--- | :--- |
| **移动** | **W / A / S / D** | 上 / 左 / 下 / 右 |
| **A 键** | **K** | 跳跃 / 确认 |
| **B 键** | **J** | 攻击 / 取消 |
| **连发 A** | **I** | 自动连按 A 键 |
| **连发 B** | **U** | 自动连按 B 键 |
| **选择** | **Shift** | Select 键 |
| **开始** | **Enter** | Start 键 |

## 🚀 快速开始

1.  **安装依赖**:
    ```bash
    npm install
    ```

2.  **启动开发服务器**:
    ```bash
    npm run dev
    ```

3.  **构建生产版本**:
    ```bash
    npm run build
    ```

## 🛠️ 技术栈

*   [React](https://reactjs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   [jsnes](https://github.com/bfirsh/jsnes) (模拟器核心)

## 📝 待办事项 / 计划

- [ ] 🎮 手柄支持 (Gamepad API)
- [ ] 💾 存档/读档功能
- [ ] 📱 移动端触摸控制
- [ ] 📚 最近玩过的游戏列表

---

Enjoy the nostalgia! 🕹️
