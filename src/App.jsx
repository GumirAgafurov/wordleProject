import './App.css'
import { useState, useEffect } from 'react';

// список слов для игры
  const WORDS = [
    "КНИГА",
    "ТОПОР",
    "МЫШКА",
    "РАДИО",
    "ДИВАН",
    "ЛАМПА",
    "РУБКА",
    "ТУСИМ",
    "ШКОЛА",
    "ПЕСНЯ",
    "ЖИВОТ",
    "ОТВАЛ",
    "КАБАН",
    "ЗАВАЛ"
  ]

function App() {
  // состояние для игры

  const [secretWord, setSecretWord] = useState(''); // загаданное слово
  const [guesses, setGuesses] = useState([]); // массив попыток
  const [currentGuess, setCurrentGuess] = useState(''); // текущий ввод
  const [gameOver, setGameOver] = useState(false); // gameOver
  const [message, setMessage] = useState(''); // Сообщение
  
  const MAX_ATTEMPTS = 6; // максимальное количество попыток


  // выбираем слово при первой загрузке
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setSecretWord(WORDS[randomIndex]);
  }, []);

  useEffect(() => {
      const handleKeyDown = (event) => {
        if (gameOver) return;

        //если нажат русский алфавит
        if (/^[а-яА-ЯЁ]$/.test(event.key)) {
          if (currentGuess.length < 5) {
            setCurrentGuess(prev => prev + event.key.toUpperCase())
          }
        }

        //Если нажата Бэкспейс
        else if (event.key === 'Backspace') {
          console.log("BSPC")
          setCurrentGuess(prev => prev.slice(0, -1))
        }

        else if (event.key === 'Enter') {
          console.log("Enter")
          if (currentGuess.length === 5) {
            checkGuess ();
          } else {
            setMessage ("Слово из 5 букв!")
            setTimeout (() => {
              setMessage("")
            }, 3000);
          }
        }
      }
      window.addEventListener('keydown', handleKeyDown); // прикрепляем обработчик
      return () => window.removeEventListener ('keydown', handleKeyDown); // убираем обработчик
  }, [currentGuess, gameOver]);


  // Функция проверки слова

  const checkGuess = () => {
    // добавляем слово в массив попыток
    const newGuess = [...guesses, currentGuess];
    setGuesses(newGuess);
    setCurrentGuess("");

    // угадали ли слово
    if (currentGuess === secretWord) {
      setGameOver(true);
      setMessage("Поздравляем, угадали!");
      return
    }

    // провверить закончились ли попытки
    if (newGuess.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setMessage(`Вы проиграли! Слово было ${secretWord}`)
    }
  }

  // функция определения цвета клетки

  const getCellColor = (letter, index, word) => {
    if (!letter) return ''

    // если буква на своем месте

    if (secretWord[index] === letter){
      return 'correct'
    }

    // если буква есть в слове, но не там
    if (secretWord.includes(letter)){
      return 'present'
    }

    // если буква не в слове
    return 'absent'
  }

  // функция для начала новой игры
const startNewGame = () => {
     const randomIndex = Math.floor(Math.random() * WORDS.length);
    setSecretWord(WORDS[randomIndex]);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
}


  return (
  <div className='app'>
    <header>
      <h1>WORDLE - УГАДАЙ СЛОВО ИЗ 5 БУКВ</h1>
    </header>
    {/* Создаем игровую доску */}
    <div className='gameBoard'>
      {guesses.map((guess, guessIndex) => (
        <div key={guessIndex} className='word-row'>
          {Array.from({ length: 5 }).map((_, letterIndex) => (
            <div
              key={letterIndex}
              className={`letter-box ${getCellColor(guess[letterIndex], letterIndex, guess)}`}
            >
              {guess[letterIndex] || ""}
            </div>
          ))}
        </div>
      ))}

      {/*мы отображаем текущую попытку*/}
      {!gameOver && guesses.length<MAX_ATTEMPTS && (
        <div className='word-row current'>
          {Array.from({ length: 5}).map((_, index) => (
            <div key={index} className='letter-box'>
              {currentGuess[index] || ""}
            </div>
          ))}
        </div>
      )}

      {/* заполняем пустые строки */}
      {!gameOver && Array.from({length: MAX_ATTEMPTS - guesses.length - 1}).map((_,
        rowIndex) => (
          <div key={rowIndex} className='word-row current'>
            {Array.from({length: 5}).map((_, letterIndex) => (
              <div key={letterIndex} className='letter-box'></div>
            ))}
          </div>
        ))}

    </div>

    {/*добавляем сообщение для пользователя */}
    {message && <div className='message'>{message}</div>}

    {/*кнопка для начала новой игры */}
    {gameOver && (<button className='newGameButton' onClick={startNewGame}>Новая игра</button>)}

    {/*добавляем подсказки*/}

    {!gameOver && (
      <div>Enter ввод, BackSpace удалить</div>
    )}

    
  {/*мобила */}

  <div className='mobile-input'>
    <input
    type="text"
    value={currentGuess}
    onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
    maxLength={5}
    />
    <div className='mobile-buttons'>
      <button onClick={() => setCurrentGuess(prev => prev.slice(0, -1))}>
        Удалить
      </button>

      <button
      onClick={checkGuess}
      disabled={currentGuess.length !== 5}>
        Проверить
        </button>
    </div>
  </div>
  </div>

)
}

export default App
