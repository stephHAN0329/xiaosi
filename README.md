# Math Practice Game - Pixel Art Style

A pixel art style HTML math practice game to help users improve their two-digit arithmetic skills. The game offers multiple difficulty modes, records high scores for each mode, and includes background music and sound effects.

## Game Features

- Pixel art style UI design
- Three difficulty modes: Easy, Normal, and Hard
- Includes start screen, game interface, pause screen, and game over screen
- Practice two-digit addition, subtraction, multiplication, and division
- Multiplication ensures numbers don't exceed 20
- Division problems always result in integers
- Countdown timer for each problem (varies by difficulty)
- Player has multiple lives (varies by difficulty)
- Wrong answers or timeouts reduce lives and shake the game window
- Game ends when lives reach 0
- Records high scores for each difficulty mode
- Pause functionality
- Background music and sound effects

## Game Modes

- **Easy Mode**: 5 lives, 15 seconds per problem
- **Normal Mode**: 3 lives, 10 seconds per problem
- **Hard Mode**: 1 life, 5 seconds per problem

## How to Start

1. Open the `index.html` file
2. Select a difficulty mode (Easy, Normal, or Hard)
3. Click the music button in the top right to enable/disable music and sound effects
4. Press the space key on the start screen to begin the game
5. Enter your answer in the input field, then click "SUBMIT" or press Enter
6. Press Escape or click the pause button to pause the game
7. After the game ends, click "PLAY AGAIN" to restart

## Game Controls

- **Space**: Start game
- **Enter**: Submit answer
- **Escape**: Pause game
- **Music Button**: Toggle music and sound effects
- **Pause Button**: Pause the game

## Game Rules

- Timer countdown for each problem (varies by difficulty)
- Score 1 point for each correct answer
- Lose 1 life for wrong answers or timeouts
- Number of lives depends on difficulty mode
- Game ends when lives reach 0
- Final score and high score are displayed at the end

## File Structure

- `index.html`: Game HTML structure
- `style.css`: Game stylesheet
- `script.js`: Game JavaScript logic
- `assets/`: Contains images and audio files needed for the game
  - `pixel-bg.png`: Pixel art background image
  - `character.png`: Game character image
  - `character-sad.png`: Character image for game over screen
  - `background-music.mp3`: Background music
  - `correct.mp3`: Sound effect for correct answers
  - `wrong.mp3`: Sound effect for wrong answers
  - `game-over.mp3`: Sound effect for game over
  - `button.mp3`: Sound effect for button clicks

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage (for saving high scores)

## Compatibility

The game works in modern browsers, including but not limited to:
- Chrome
- Firefox
- Safari
- Edge

## Local Execution

Simply open the `index.html` file in a browser to run the game.

## Notes

- Due to browser security policies, some browsers may block automatic audio playback. If this happens, click the music button to manually enable audio.
- The game uses LocalStorage to save high scores for each difficulty mode. Clearing browser data may result in the loss of high score records. 