import { setCurrentStack } from 'three/tsl';
import './App.css'
import { useState, useEffect,
     View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  StyleSheet 
 } from 'react';

// список слов для игры
  const WORDS = [
    "ЖОПКА",
    "КНИГА",
    "ПИСЕН",
    "ТОПОР",
    "МЫШКА",
    "РАДИО",
    "ДИВАН",
    "ЛАМПА",
    "РУБКА",
    "ИНТИМ",
    "ТУСИМ",
    "ШКОЛА"
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
  <View className='app'>
    <header>
      <h1>Супер крутая игра</h1>
    </header>
    {/* Создаем игровую доску */}
    <View className='gameBoard'>
      {guesses.map((guess, guessIndex) => (
        <View key={guessIndex} className='word-row'>
          {Array.from({ length: 5 }).map((_, letterIndex) => (
            <View
              key={letterIndex}
              className={`letter-box ${getCellColor(guess[letterIndex], letterIndex, guess)}`}
            >
              {guess[letterIndex] || ""}
            </View>
          ))}
        </View>
      ))}

      {/*мы отображаем текущую попытку*/}
      {!gameOver && guesses.length<MAX_ATTEMPTS && (
        <View className='word-row current'>
          {Array.from({ length: 5}).map((_, index) => (
            <View key={index} className='letter-box'>
              {currentGuess[index] || ""}
            </View>
          ))}
        </View>
      )}

      {/* заполняем пустые строки */}
      {!gameOver && Array.from({length: MAX_ATTEMPTS - guesses.length - 1}).map((_,
        rowIndex) => (
          <View key={rowIndex} className='word-row current'>
            {Array.from({length: 5}).map((_, letterIndex) => (
              <View key={letterIndex} className='letter-box'></View>
            ))}
          </View>
        ))}

    </View>

    {/*добавляем сообщение для пользователя */}
    {message && <View className='message'>{message}</View>}

    {/*кнопка для начала новой игры */}
    {gameOver && (<button className='newGameButton' onClick={startNewGame}>Новая игра</button>)}

    {/*добавляем подсказки*/}

    {!gameOver && (
      <View>Enter ввод, BackSpace удалить</View>
    )}

    
  {/*мобила */}

  <View className='mobile-input'>
    <input
    type="text"
    value={currentGuess}
    onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
    maxLength={5}
    />
    <View className='mobile-buttons'>
      <buttton onClick={() => setCurrentGuess("")}>Очистить</buttton>
      <button onClick={() => setCurrentGuess(prev => prev.slice(0, -1))}>
        Удалить
      </button>

      <button
      onClick={checkGuess}
      disabled={currentGuess.length !== 5}>
        Проверить
        </button>
    </View>
  </View>
  </View>

)
}

export default App
