import React, { useState, useEffect } from 'react'
import { calculateWinner } from '../winner'
import Axios from 'axios'
import Board from './Boards'
import Plot from 'react-plotly.js';

const styles = {
  width: '200px',
  margin: '20px auto'
}
const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXisNext] = useState(true)
  const winner = calculateWinner(history[stepNumber])
  const [playerNames, setPlayerNames] = useState([null, null, null])
  const [playerIDs, setPlayerIDs] =useState([null,null])
  const [playerScores, setPlayerScores] = useState([0,0])
  const [playerTotlaGame, setPlayerTotalGame] = useState([0,0])
  const [players, setPlayers] = useState([])
  const [nameSet, setNameSet]= useState(false)
  const [createNewPlayer, setCreateNewPlayer] = useState(false)

  useEffect(() => {
    Axios
        .get("/api/users/")
        .then((res) => setPlayers(res.data))
        .catch(err => console.log(err))
    if (winner) {
      switch (winner) {
        case 'X':
        const newWinnerPlayerData = {
            "username": playerNames[0],
            'score': parseInt(playerScores[0])+1,
            "total_game_play":parseInt(playerTotlaGame[0])+1
        }
        const loserData = {
            "username": playerNames[1],
            'score': parseInt(playerScores[1]),
            "total_game_play": parseInt(playerTotlaGame[1])+1
        }
        Axios
            .put(`/api/users/${playerIDs[1]}/`,loserData)
            .then((res)=>{
                console.log("Loser Saved")
            })
        Axios
            .put(`/api/users/${playerIDs[0]}/`,newWinnerPlayerData)
            .then((res)=>{
                alert("Game recorded...starting new game")
                window.location.reload()
            })
          break
        case 'O':
            const newWinnerPlayerData2 = {
                "username": playerNames[1],
                'score': parseInt(playerScores[1])+1,
                "total_game_play": parseInt(playerTotlaGame[1])+1
            }
            const loserData2 = {
                "username": playerNames[0],
                'score': parseInt(playerScores[0]),
                "total_game_play": parseInt(playerTotlaGame[0])+1
            }
            Axios
                .put(`/api/users/${playerIDs[1]}/`,loserData2)
                .then((res)=>{
                    console.log("Loser Saved")
                })
            Axios
                .put(`/api/users/${playerIDs[0]}/`,newWinnerPlayerData2)
                .then((res)=>{
                    alert("Game recorded...starting new game")
                    window.location.reload()
                })
          break
        default:
          break

      }

    }
  }, [winner,playerIDs,playerNames,playerScores,playerTotlaGame])

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

  const submitNewPlayer = ()=>{
      const newPlayer = {'username':playerNames[2],'score':0,'total_game_play':0}
      Axios
        .post("/api/users/", newPlayer)
        .then((res)=>{alert("Player Created, refreshing game"); resetGame()})
  }

  const jumpTo = step => {
    setStepNumber(step)
    setXisNext(step % 2 === 0)
  }

  const checkNameSet = () =>{
      if (playerNames[0] && playerNames[1]) setNameSet(true)
      else alert("Please select both Players")
  }

  const onSelectPlayer =(e) =>{
      const tempPlayer = playerNames
      const tempID = playerIDs
      const tempScore= playerScores
      const tempGame = playerTotlaGame
      tempPlayer[parseInt(e.target.name)]= e.target.innerText
      tempID[parseInt(e.target.name)]= e.target.getAttribute('unique_id')
      tempScore[parseInt(e.target.name)]= e.target.getAttribute('score')
      tempGame[parseInt(e.target.name)]= e.target.getAttribute('total_game_play')
      setPlayerIDs(tempID)
      setPlayerNames(tempPlayer)
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
    <div style = {
      {
        backgroundColor: 'lightblue',
        }}>
      
      <h3>Select Player 1's name</h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '10px'
      }}> 
        {players.map((player)=>{
                return(
                    <button style={{margin:'5px', width: '40%'}} name='0' key={player.id} unique_id={player.id} score={player.score} total_game_play={player.total_game_play} onClick={(e)=>onSelectPlayer(e)}>
                        {player.username}
                    </button>
                  )
            })}
      </div>
            
      <h3>Select Player 2's name</h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '10px'
      }}> 
            {players.map((player)=>{
                return(
                    <button style={{margin:'5px', width:'40%'}}name='1' key={player.id} unique_id={player.id} score={player.score} total_game_play={player.total_game_play} onClick={(e)=>onSelectPlayer(e)}>
                        {player.username}
                    </button>
                  )
            })}
        </div>
      <br></br>
      <h3>Create New Player:</h3>
      <button onClick={()=> setCreateNewPlayer(true)}>Create new Player</button>
      {createNewPlayer? 
      <>
        <div>Enter new Player name</div>
        <input name='2' onChange={(e) => setPlayerName(e)} />
        <button onClick={submitNewPlayer}>Submit</button>
        
      </>
      :
      <></>}
      {
        nameSet? 
        <>
            <Board squares={history[stepNumber]} onClick={handleClick} />
            <div style={styles}>
            <p>{winner ? 'Winner: ' + (xIsNext ? playerNames[1] : playerNames[0]) : 'Next Player: ' + (xIsNext ? playerNames[0] : playerNames[1])}</p>
            {renderMoves()}
            </div>
            <button onClick={resetGame}>Reset Game</button>
            <div>Leaderboard</div>
      </>
        :
        <> 
            <div>
              <p>OR</p>
              <button onClick={checkNameSet}>Start Playing</button>
            </div>
            
        </>
    }
    <h3 style={{margin:'10px'}}>Leaderboard</h3>
      {players.map((player)=>{
                return(
                    <h4 style={{margin: '6px'}} key={player.id}>
                        {player.username} : {player.score}
                    </h4>
                  )
            })}
    </div>
  )
}

export default Game