// DOM Elements
const promptsTextarea = document.getElementById('promptInput');
const promptCount = document.getElementById('promptCount');
const directoryInput = document.getElementById('directoryInput');
const actionBtn = document.getElementById('actionBtn');
const clearBtn = document.getElementById('clearBtn');
const progressArea = document.getElementById('progressArea');
const progressCount = document.getElementById('progressCount');
const progressBar = document.getElementById('progressBar');
const currentStatus = document.getElementById('currentStatus');
const errorMsg = document.getElementById('errorMsg');
const statusIndicator = document.getElementById('statusIndicator');

// State Management
let isRunning = false;

// Auto-resize textarea and update count
promptsTextarea.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
  chrome.storage.local.set({ lastPrompts: this.value });
  updatePromptCount(this.value);
});

function updatePromptCount(text) {
  const prompts = text.split('\n').filter(line => line.trim() !== '');
  promptCount.textContent = `${prompts.length} 条提示词已被识别，随时可以开始`;
}

// Clear Prompts
clearBtn.addEventListener('click', () => {
  if (confirm('确定要清空所有提示词吗？')) {
    promptsTextarea.value = '';
    promptsTextarea.style.height = 'auto';
    chrome.storage.local.remove('lastPrompts');
    updatePromptCount('');
  }
});

// Save directory to storage
directoryInput.addEventListener('input', function () {
  chrome.storage.local.set({ saveDirectory: this.value });
});

// Restore state on load
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lastPrompts', 'saveDirectory'], (result) => {
    if (result.lastPrompts) {
      promptsTextarea.value = result.lastPrompts;
      // Trigger resize
      promptsTextarea.style.height = 'auto';
      promptsTextarea.style.height = (promptsTextarea.scrollHeight) + 'px';
      updatePromptCount(promptsTextarea.value);
    }
    if (result.saveDirectory) {
      directoryInput.value = result.saveDirectory;
    }
  });

  restoreStatus();
});

// Unified Action Button Click Handler
actionBtn.addEventListener('click', async () => {
  if (isRunning) {
    // Stop Logic
    handleStop();
  } else {
    // Start Logic
    handleStart();
  }
});

async function handleStart() {
  console.log('[Popup] 📌 handleStart 被调用');

  const input = promptsTextarea.value.trim();
  const directory = directoryInput.value.trim();

  if (!input) {
    showError('请输入至少一个提示词');
    return;
  }

  const prompts = input.split('\n').filter(line => line.trim() !== '');
  console.log('[Popup] 📝 识别到提示词数量:', prompts.length);

  if (prompts.length === 0) {
    showError('请输入有效的提示词');
    return;
  }

  // Check if on Gemini page
  console.log('[Popup] 🔍 查询当前标签页...');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('[Popup] 📋 当前标签页:', tab?.url);

  if (!tab.url || !tab.url.includes('gemini.google.com')) {
    showError('请先打开 Gemini 页面 (https://gemini.google.com/app)');
    return;
  }

  console.log('[Popup] ✅ 验证通过，开始生成');
  startGeneration(prompts, directory);
}

async function handleStop() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'stopTask' });
    if (response && response.success) {
      resetUI();
      showStatus('Ready', false);
      currentStatus.textContent = '任务已中止';
    }
  } catch (error) {
    console.error('停止任务失败:', error);
  }
}

async function startGeneration(prompts, directory) {
  setRunningState(true);
  hideError();
  showProgress(0, prompts.length, '正在准备...');
  showStatus('Running', true);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('[Popup] 📤 准备发送消息到 background...');
    console.log('[Popup] 📤 TabId:', tab.id);
    console.log('[Popup] 📤 Prompts:', prompts.length, '条');

    const response = await chrome.runtime.sendMessage({
      action: 'startGeneration',
      prompts: prompts,
      directory: directory,
      tabId: tab.id
    });

    console.log('[Popup] 📥 收到响应:', response);

    if (response && response.success) {
      console.log('[Popup] ✅ 任务启动成功');
    } else {
      throw new Error(response?.error || '启动失败');
    }
  } catch (error) {
    console.error('[Popup] ❌ 启动失败:', error);
    let msg = '启动失败: ';
    if (error.message.includes('Could not establish connection')) {
      msg = '无法连接后台，请刷新页面后重试';
    } else {
      msg += error.message;
    }
    showError(msg);
    resetUI();
  }
}

// UI Helpers
function setRunningState(running) {
  isRunning = running;
  const btnIcon = actionBtn.querySelector('.btn-icon');
  const btnText = actionBtn.querySelector('.btn-text');

  if (running) {
    actionBtn.classList.add('stop-mode');
    btnIcon.textContent = '⏹';
    btnText.textContent = '停止任务';
  } else {
    actionBtn.classList.remove('stop-mode');
    btnIcon.textContent = '🎨';
    btnText.textContent = '批量生成';
  }
}

function showProgress(current, total, message) {
  progressArea.classList.remove('hidden');
  const percentage = total > 0 ? (current / total) * 100 : 0;
  progressBar.style.width = percentage + '%';
  progressCount.textContent = `${current} / ${total}`;
  currentStatus.textContent = message;
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
  setTimeout(() => errorMsg.classList.add('hidden'), 5000);
}

function resetUI() {
  setRunningState(false);
  showStatus('Ready', false);
}

function hideError() {
  errorMsg.classList.add('hidden');
}

function showStatus(text, active) {
  const dot = statusIndicator.querySelector('.dot');
  const txt = statusIndicator.querySelector('.status-text');

  if (!dot || !txt) return;

  txt.textContent = text;
  if (active) {
    dot.style.backgroundColor = '#ffd700'; // Running yellow
    dot.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.6)';
  } else {
    dot.style.backgroundColor = '#4caf50'; // Ready green
    dot.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.4)';
  }
}

// Message Listener
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateProgress') {
    const { current, total, status } = message;
    showProgress(current, total, status);
    // Sync running state if we get progress updates
    if (!isRunning) setRunningState(true);

    if (current === total) {
      setTimeout(() => {
        resetUI();
        currentStatus.textContent = '全部完成！';
      }, 1000);
    }
  } else if (message.action === 'generationError') {
    showError(message.error);
    resetUI();
  }
});

// Restore Status
async function restoreStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getTaskStatus' });
    if (response && response.isProcessing) {
      setRunningState(true);
      showStatus('Running', true);
      showProgress(response.currentIndex, response.total, response.status);
    } else {
      resetUI();
    }
  } catch (e) {
    console.log('状态恢复失败:', e);
    resetUI();
  }
}
