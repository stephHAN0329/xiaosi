document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const pauseScreen = document.getElementById('pause-screen');
    const rotateMessage = document.getElementById('rotate-message');
    const livesCount = document.getElementById('lives-count');
    const timerCount = document.getElementById('timer-count');
    const scoreCount = document.getElementById('score-count');
    const question = document.getElementById('question');
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const finalScore = document.getElementById('final-score');
    const pauseScore = document.getElementById('pause-score');
    const restartBtn = document.getElementById('restart-btn');
    const highScoreElement = document.getElementById('high-score');
    const gameOverHighScore = document.getElementById('game-over-high-score');
    const musicToggle = document.getElementById('music-toggle');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const quitBtn = document.getElementById('quit-btn');
    const currentModeDisplay = document.getElementById('current-mode');
    const gameOverModeDisplay = document.getElementById('game-over-mode');
    const startBtn = document.getElementById('start-btn');
    const numKeys = document.querySelectorAll('.num-key');
    
    // Mode selection elements
    const easyModeBtn = document.getElementById('easy-mode');
    const normalModeBtn = document.getElementById('normal-mode');
    const hardModeBtn = document.getElementById('hard-mode');
    const modeDescription = document.getElementById('mode-description');
    
    // Background music
    const bgMusic = new Audio('assets/background-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    // Sound effects
    const correctSound = new Audio('assets/correct.mp3');
    const wrongSound = new Audio('assets/wrong.mp3');
    const gameOverSound = new Audio('assets/game-over.mp3');
    const buttonSound = new Audio('assets/button.mp3');
    
    // Music state
    let isMusicOn = false;

    // Game modes
    const gameModes = {
        EASY: { lives: 5, timer: 15, name: 'EASY' },
        NORMAL: { lives: 3, timer: 10, name: 'NORMAL' },
        HARD: { lives: 1, timer: 5, name: 'HARD' }
    };
    
    // Game state
    let currentMode = gameModes.NORMAL;
    let lives = currentMode.lives;
    let maxLives = currentMode.lives;
    let initialTimer = currentMode.timer;
    let score = 0;
    let timer = initialTimer;
    let timerInterval;
    let currentAnswer = 0;
    let gameActive = false;
    let isPaused = false;
    
    // High scores for each mode - Parse stored values as integers
    let highScores = {
        EASY: parseInt(localStorage.getItem('mathGameHighScoreEASY')) || 0,
        NORMAL: parseInt(localStorage.getItem('mathGameHighScoreNORMAL')) || 0,
        HARD: parseInt(localStorage.getItem('mathGameHighScoreHARD')) || 0
    };

    // Update lives display with heart emoji
    updateLivesDisplay();
    
    // Update high score display for current mode
    updateHighScoreDisplay();
    
    // 检测是否为iOS设备
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // 检测屏幕方向
    function checkOrientation() {
        // 只在移动设备上检测方向
        if (window.innerWidth <= 1024) {
            if (window.innerHeight > window.innerWidth) {
                // 竖屏
                if (rotateMessage) rotateMessage.style.display = 'flex';
                if (gameActive && !isPaused) {
                    // 如果游戏正在进行，暂停游戏
                    pauseGame();
                }
            } else {
                // 横屏
                if (rotateMessage) rotateMessage.style.display = 'none';
                // 如果游戏已暂停且暂停原因是屏幕方向，则恢复游戏
                if (gameActive && isPaused && pauseScreen.classList.contains('active') && 
                    pauseReason === 'orientation') {
                    resumeGame();
                }
            }
        } else {
            // 桌面设备不显示旋转提示
            if (rotateMessage) rotateMessage.style.display = 'none';
        }
    }
    
    // 添加暂停原因变量
    let pauseReason = '';
    
    // 修改暂停游戏函数
    function pauseGame(reason = '') {
        if (!gameActive || isPaused) return;
        
        pauseReason = reason;
        isPaused = true;
        clearInterval(timerInterval);
        pauseScore.textContent = score;
        
        // 隐藏游戏屏幕，显示暂停屏幕
        gameScreen.classList.remove('active');
        pauseScreen.classList.add('active');
        
        // 暂停背景音乐
        if (isMusicOn) {
            bgMusic.pause();
        }
    }
    
    // 修改恢复游戏函数
    function resumeGame() {
        // 检查是否处于竖屏模式，如果是则不恢复游戏
        if (window.innerHeight > window.innerWidth && window.innerWidth <= 1024) {
            return;
        }
        
        if (!isPaused) return;
        
        isPaused = false;
        pauseReason = '';
        
        // 隐藏暂停屏幕，显示游戏屏幕
        pauseScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // 恢复计时器
        startTimer();
        
        // 恢复背景音乐
        if (isMusicOn) {
            bgMusic.play().catch(e => console.log('无法播放背景音乐:', e));
        }
        
        // 聚焦到输入框
        setTimeout(() => {
            answerInput.focus();
        }, 100);
    }
    
    // 修改暂停按钮事件处理
    pauseBtn.addEventListener('click', () => {
        buttonSound.play().catch(e => console.log('无法播放按钮音效:', e));
        pauseGame('manual');
    });
    
    // 添加屏幕方向变化监听
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    // 初始检查屏幕方向
    checkOrientation();
    
    // iOS设备优化
    if (isIOS) {
        // 防止双指缩放
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });
        
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd < 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // 修复iOS上的音频问题
        document.addEventListener('touchstart', function() {
            // 创建一个静音的音频上下文，以解锁iOS上的Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const emptyBuffer = audioContext.createBuffer(1, 1, 22050);
            const source = audioContext.createBufferSource();
            source.buffer = emptyBuffer;
            source.connect(audioContext.destination);
            source.start(0);
            
            // 预加载所有音频
            bgMusic.load();
            correctSound.load();
            wrongSound.load();
            gameOverSound.load();
            buttonSound.load();
            
            // 移除此事件监听器，因为我们只需要执行一次
            document.removeEventListener('touchstart', arguments.callee);
        }, false);
    }
    
    // 尝试自动播放背景音乐（可能会被浏览器阻止）
    bgMusic.play().then(() => {
        isMusicOn = true;
        musicToggle.textContent = '🔇';
    }).catch(e => {
        console.log('自动播放音乐被阻止，需要用户交互:', e);
        isMusicOn = false;
        musicToggle.textContent = '🔊';
    });
    
    // Mode selection
    easyModeBtn.addEventListener('click', () => {
        selectMode(gameModes.EASY);
        playButtonSound();
        
        // 如果音乐已开启，确保音乐正在播放
        if (isMusicOn && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Unable to play music:', e));
        }
    });
    
    normalModeBtn.addEventListener('click', () => {
        selectMode(gameModes.NORMAL);
        playButtonSound();
        
        // 如果音乐已开启，确保音乐正在播放
        if (isMusicOn && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Unable to play music:', e));
        }
    });
    
    hardModeBtn.addEventListener('click', () => {
        selectMode(gameModes.HARD);
        playButtonSound();
        
        // 如果音乐已开启，确保音乐正在播放
        if (isMusicOn && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Unable to play music:', e));
        }
    });
    
    // 为iOS设备添加触摸事件支持
    if (isIOS) {
        // 为模式选择按钮添加触摸事件
        easyModeBtn.addEventListener('touchstart', function(e) {
            e.preventDefault(); // 防止默认行为
            selectMode(gameModes.EASY);
            playButtonSound();
            
            // 如果音乐已开启，确保音乐正在播放
            if (isMusicOn && bgMusic.paused) {
                bgMusic.play().catch(e => console.log('Unable to play music:', e));
            }
        });
        
        normalModeBtn.addEventListener('touchstart', function(e) {
            e.preventDefault(); // 防止默认行为
            selectMode(gameModes.NORMAL);
            playButtonSound();
            
            // 如果音乐已开启，确保音乐正在播放
            if (isMusicOn && bgMusic.paused) {
                bgMusic.play().catch(e => console.log('Unable to play music:', e));
            }
        });
        
        hardModeBtn.addEventListener('touchstart', function(e) {
            e.preventDefault(); // 防止默认行为
            selectMode(gameModes.HARD);
            playButtonSound();
            
            // 如果音乐已开启，确保音乐正在播放
            if (isMusicOn && bgMusic.paused) {
                bgMusic.play().catch(e => console.log('Unable to play music:', e));
            }
        });
    }
    
    // Select game mode
    function selectMode(mode) {
        currentMode = mode;
        maxLives = mode.lives;
        initialTimer = mode.timer;
        
        // Update UI
        updateModeDescription();
        updateModeButtons();
        updateHighScoreDisplay();
    }
    
    // Update mode description
    function updateModeDescription() {
        modeDescription.textContent = `LIVES: ${currentMode.lives} | TIME: ${currentMode.timer}s`;
    }
    
    // Update mode buttons
    function updateModeButtons() {
        easyModeBtn.classList.remove('selected');
        normalModeBtn.classList.remove('selected');
        hardModeBtn.classList.remove('selected');
        
        if (currentMode === gameModes.EASY) {
            easyModeBtn.classList.add('selected');
        } else if (currentMode === gameModes.NORMAL) {
            normalModeBtn.classList.add('selected');
        } else if (currentMode === gameModes.HARD) {
            hardModeBtn.classList.add('selected');
        }
    }
    
    // Play button sound
    function playButtonSound() {
        if (isMusicOn) {
            buttonSound.currentTime = 0;
            buttonSound.play().catch(e => console.log('Unable to play sound effect:', e));
        }
    }
    
    // Music control
    musicToggle.addEventListener('click', () => {
        if (isMusicOn) {
            bgMusic.pause();
            musicToggle.textContent = '🔊';
        } else {
            bgMusic.play().catch(e => console.log('Unable to play music:', e));
            musicToggle.textContent = '🔇';
        }
        isMusicOn = !isMusicOn;
        playButtonSound();
    });
    
    // Resume button
    resumeBtn.addEventListener('click', () => {
        if (isPaused) {
            resumeGame();
        }
        playButtonSound();
    });
    
    // Quit button
    quitBtn.addEventListener('click', () => {
        if (isPaused) {
            quitGame();
        }
        playButtonSound();
    });

    // Listen for space key to start game
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && startScreen.classList.contains('active')) {
            startGame();
            // Play background music if enabled
            if (isMusicOn) {
                bgMusic.play().catch(e => console.log('Unable to play music:', e));
            }
        } else if (e.code === 'Escape' && gameActive && !isPaused) {
            pauseGame();
        }
    });

    // Listen for submit button
    submitBtn.addEventListener('click', checkAnswer);

    // Listen for enter key to submit answer
    answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && gameActive && !isPaused) {
            checkAnswer();
        }
    });

    // Listen for restart button
    restartBtn.addEventListener('click', () => {
        gameOverScreen.classList.remove('active');
        startScreen.classList.add('active');
        // 如果音乐已开启，确保音乐正在播放
        if (isMusicOn) {
            bgMusic.play().catch(e => console.log('Unable to play music:', e));
        } else {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
        // Update high score display for the current mode
        updateHighScoreDisplay();
        playButtonSound();
    });

    // Update high score display
    function updateHighScoreDisplay() {
        if (highScoreElement) {
            highScoreElement.textContent = highScores[currentMode.name];
        }
    }
    
    // Quit game
    function quitGame() {
        isPaused = false;
        gameActive = false;
        
        // Hide pause screen
        pauseScreen.classList.remove('active');
        startScreen.classList.add('active');
        
        // 如果音乐已开启，确保音乐正在播放
        if (isMusicOn) {
            bgMusic.play().catch(e => console.log('Unable to play music:', e));
        } else {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
    }

    // Start game
    function startGame() {
        // 检查是否处于横屏模式
        if (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth) {
            // 如果是竖屏，不开始游戏，显示旋转提示
            if (rotateMessage) rotateMessage.style.display = 'flex';
            return;
        }
        
        // Reset game state
        lives = currentMode.lives;
        score = 0;
        timer = currentMode.timer;
        updateLivesDisplay();
        scoreCount.textContent = score;
        
        // Update mode display
        currentModeDisplay.textContent = currentMode.name;
        
        // Switch screens
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        gameOverScreen.classList.remove('active');
        pauseScreen.classList.remove('active');
        
        // Start game
        gameActive = true;
        isPaused = false;
        pauseReason = '';
        generateQuestion();
        
        // 确保音乐正在播放（如果已启用）
        if (isMusicOn && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('无法播放背景音乐:', e));
        }
        
        // 聚焦到输入框
        setTimeout(() => {
            answerInput.focus();
        }, 100);
    }

    // Update lives display with heart emoji
    function updateLivesDisplay() {
        livesCount.textContent = '❤️'.repeat(lives);
    }

    // Add shake effect
    function addShakeEffect() {
        gameScreen.classList.add('shake');
        setTimeout(() => {
            gameScreen.classList.remove('shake');
        }, 500);
    }

    // Generate question
    function generateQuestion() {
        // Reset timer
        clearInterval(timerInterval);
        timer = currentMode.timer;
        timerCount.textContent = timer;
        
        // Clear input and focus
        answerInput.value = '';
        answerInput.focus();
        
        // Randomly select operator
        const operators = ['+', '-', '*', '/'];
        let operator = operators[Math.floor(Math.random() * operators.length)];
        
        let num1, num2;
        
        // Generate numbers based on operator
        if (operator === '*') {
            // Multiplication: ensure numbers don't exceed 20
            num1 = Math.floor(Math.random() * 11) + 10; // 10-20
            num2 = Math.floor(Math.random() * 11) + 10; // 10-20
        } else {
            // Other operations: two-digit numbers
            num1 = Math.floor(Math.random() * 90) + 10; // 10-99
            num2 = Math.floor(Math.random() * 90) + 10; // 10-99
        }
        
        // Ensure subtraction result is positive
        if (operator === '-' && num1 < num2) {
            // Swap numbers
            [num1, num2] = [num2, num1];
        }
        
        // Ensure division result is an integer
        if (operator === '/') {
            // Find a factor of num1 to use as num2
            const factors = [];
            for (let i = 2; i <= Math.min(99, num1); i++) {
                if (num1 % i === 0) {
                    factors.push(i);
                }
            }
            
            if (factors.length > 0) {
                // Randomly select a factor
                const randomFactor = factors[Math.floor(Math.random() * factors.length)];
                // Ensure num2 is a two-digit number
                if (randomFactor >= 10) {
                    currentAnswer = num1 / randomFactor;
                    question.textContent = `${num1} ÷ ${randomFactor} = ?`;
                } else {
                    // If factor is less than 10, use addition
                    operator = '+';
                }
            } else {
                // If no suitable factors, use addition
                operator = '+';
            }
        }
        
        // Calculate answer and display question based on operator
        if (operator === '+') {
            currentAnswer = num1 + num2;
            question.textContent = `${num1} + ${num2} = ?`;
        } else if (operator === '-') {
            currentAnswer = num1 - num2;
            question.textContent = `${num1} - ${num2} = ?`;
        } else if (operator === '*') {
            currentAnswer = num1 * num2;
            question.textContent = `${num1} × ${num2} = ?`;
        }
        
        // Start timer
        startTimer();
        
        // 在iOS上，不自动聚焦输入框，避免弹出系统键盘
        if (!isIOS) {
            answerInput.focus();
        } else {
            // 清空输入框
            answerInput.value = '';
        }
    }

    // Start timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timer--;
            timerCount.textContent = timer;
            
            if (timer <= 0) {
                clearInterval(timerInterval);
                handleWrongAnswer();
            }
        }, 1000);
    }

    // Check answer
    function checkAnswer() {
        if (!gameActive || isPaused) return;
        
        const userAnswer = parseInt(answerInput.value);
        
        if (isNaN(userAnswer)) {
            // If user didn't enter a valid number, do nothing
            return;
        }
        
        if (userAnswer === currentAnswer) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
        }
    }

    // Handle correct answer
    function handleCorrectAnswer() {
        // Play correct sound effect
        if (isMusicOn) {
            correctSound.play().catch(e => console.log('Unable to play sound effect:', e));
        }
        
        // Increase score
        score++;
        scoreCount.textContent = score;
        
        // Generate new question
        generateQuestion();
    }

    // Handle wrong answer
    function handleWrongAnswer() {
        // Play wrong sound effect
        if (isMusicOn) {
            wrongSound.play().catch(e => console.log('Unable to play sound effect:', e));
        }
        
        // Decrease lives
        lives--;
        updateLivesDisplay();
        
        // Add shake effect
        addShakeEffect();
        
        // Show correct answer
        question.textContent = `CORRECT ANSWER: ${currentAnswer}`;
        
        // Clear timer
        clearInterval(timerInterval);
        
        // Check if game is over
        if (lives <= 0) {
            endGame();
        } else {
            // Show new question after 2 seconds
            setTimeout(generateQuestion, 2000);
        }
    }

    // End game
    function endGame() {
        gameActive = false;
        isPaused = false;
        pauseReason = '';
        clearInterval(timerInterval);
        
        // Play game over sound effect
        if (isMusicOn) {
            gameOverSound.play().catch(e => console.log('无法播放游戏结束音效:', e));
        }
        
        // Check if this is a new high score
        const currentHighScore = highScores[currentMode.name];
        if (score > currentHighScore) {
            // Update high score in memory
            highScores[currentMode.name] = score;
            // Save to localStorage with the correct key
            localStorage.setItem(`mathGameHighScore${currentMode.name}`, score);
            console.log(`新的${currentMode.name}模式最高分: ${score}`);
        }
        
        // Show final score and high score
        finalScore.textContent = score;
        gameOverModeDisplay.textContent = currentMode.name;
        
        // Always update the high score display with the current high score
        if (gameOverHighScore) {
            gameOverHighScore.textContent = highScores[currentMode.name];
        }
        
        // 检查屏幕方向
        checkOrientation();
        
        // 如果不是竖屏模式，显示游戏结束屏幕
        if (!(window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)) {
            // Switch to game over screen
            gameScreen.classList.remove('active');
            pauseScreen.classList.remove('active');
            gameOverScreen.classList.add('active');
        }
        
        // 如果音乐已开启，确保音乐正在播放
        if (isMusicOn && bgMusic.paused) {
            bgMusic.play().catch(e => console.log('无法播放背景音乐:', e));
        }
    }

    // 添加触摸事件支持
    if (isIOS) {
        // 为空格键添加触摸事件
        startScreen.addEventListener('touchstart', function() {
            if (startScreen.classList.contains('active')) {
                startGame();
                // Play background music if enabled
                if (isMusicOn) {
                    bgMusic.play().catch(e => console.log('Unable to play music:', e));
                }
            }
        });
        
        // 优化输入框焦点
        answerInput.addEventListener('touchstart', function(e) {
            // 防止事件冒泡，确保只有输入框获得焦点
            e.stopPropagation();
        });
    }
    
    // 添加iOS上的虚拟键盘处理
    if (isIOS) {
        // 监听虚拟键盘显示事件
        window.addEventListener('resize', function() {
            // 如果游戏正在进行且输入框有焦点
            if (gameActive && document.activeElement === answerInput) {
                // 滚动到问题区域，确保问题和输入框可见
                question.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        });
    }

    // 开始游戏按钮
    startBtn.addEventListener('click', () => {
        startGame();
        // Play background music if enabled
        if (isMusicOn) {
            bgMusic.play().catch(e => console.log('Unable to play music:', e));
        }
        playButtonSound();
    });
    
    // 数字键盘处理
    numKeys.forEach(key => {
        key.addEventListener('click', () => {
            if (!gameActive || isPaused) return;
            
            const keyValue = key.getAttribute('data-key');
            
            if (keyValue === 'backspace') {
                // 删除最后一个字符
                answerInput.value = answerInput.value.slice(0, -1);
            } else if (keyValue === 'clear') {
                // 清空输入
                answerInput.value = '';
            } else {
                // 添加数字
                answerInput.value += keyValue;
            }
            
            // 播放按钮音效
            playButtonSound();
            
            // 保持输入框焦点
            answerInput.focus();
        });
    });
    
    // 防止输入框获取焦点时弹出系统键盘
    if (isIOS) {
        answerInput.addEventListener('focus', function(e) {
            // 在iOS上，阻止系统键盘弹出
            answerInput.blur();
            // 但保持视觉上的焦点状态
            answerInput.classList.add('focused');
            e.preventDefault();
        });
        
        // 点击输入框时不弹出键盘，而是显示我们的自定义键盘
        answerInput.addEventListener('click', function(e) {
            e.preventDefault();
            // 确保数字键盘可见
            document.querySelector('.number-keyboard').style.display = 'flex';
        });
    }
}); 