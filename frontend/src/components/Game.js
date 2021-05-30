import React, { useState, useEffect } from 'react'
import { calculateWinner } from '../winner'
import Board from './Boards'

const styles = {
  width: '200px',
  margin: '20px auto'
}

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXisNext] = useState(true)
  const winner = calculateWinner(history[stepNumber])
  const [playerNames, setPlayerNames] = useState([null, null])
  const [playerScores, setPlayerScores] = useState([0, 0])

  useEffect(() => {
    if (winner) {
      switch (winner) {
        case 'X':
          setPlayerScores([playerScores[0] + 1, playerScores[1]])
          break
        case 'O':
          setPlayerScores([playerScores[0], playerScores[1] + 1])
          break
        default:
          break
      }

    }
  }, [winner, playerScores])

  const handleClick = i => {
    console.log('Square is clicked')
    const timeInHistory = history.slice(0, stepNumber + 1)
    const current = timeInHistory[stepNumber]
    const squares = [...current]
    // If user click an occupied square or if game is won, return
    if (winner || squares[i]) {
      return
    }
    // Put an X or an O in the clicked square
    squares[i] = xIsNext ? 'X' : 'O'
    setHistory([...timeInHistory, squares])
    setStepNumber(timeInHistory.length)
    setXisNext(!xIsNext)
  }

  const resetGame = () => {
    window.location.reload()
  }

  const setPlayerName = (e) => {
    const tempData = playerNames
    tempData[parseInt(e.target.name)] = e.target.value
    setPlayerNames(tempData)
  }

  const jumpTo = step => {
    setStepNumber(step)
    setXisNext(step % 2 === 0)
  }

  const renderMoves = () => (
    history.map((_step, move) => {
        const destination = move ? `Go to move#${move}` : 'Go to start';

      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{destination}</button>
        </li>
      )
    })
  )

  return (
    <>
      <div>Player 1's name</div>
      <input name='0' placeholder="Enter player 1's name" onChange={(e) => setPlayerName(e)} />
      <div>Player 2's name</div>
      <input name='1' placeholder="Enter player 2's name" onChange={(e) => setPlayerName(e)} />
      <Board squares={history[stepNumber]} onClick={handleClick} />
      <div style={styles}>
        <p>{winner ? 'Winner: ' + (xIsNext ? playerNames[1] : playerNames[0]) : 'Next Player: ' + (xIsNext ? playerNames[0] : playerNames[1])}</p>
        {renderMoves()}
      </div>
      <button onClick={resetGame}>Reset Game</button>
    </>
  )
}

export default Game