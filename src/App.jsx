import { useCallback, useEffect, useState } from 'react'
import './App.css'
import PointsTable from './screens/pointsTable/PointsTable'
import axios from 'axios';
import MatchesTable from './screens/matchesTable/MatchesTable';

function App() {
  const [state, setState] = useState({
    isLoading: true,
    pointsTable: [],
    matchesTable: [],
    matchesDate: [],
    selectedPlayerId: null,
  });

  const { isLoading, pointsTable, matchesTable, matchesDate, selectedPlayerId } = state;

  useEffect(() => {
    const apis = ['https://www.jsonkeeper.com/b/IKQQ', 'https://www.jsonkeeper.com/b/JNYL'];
    const promises = apis.map((ele) => axios.get(`https://cors-anywhere.herokuapp.com/${ele}`));

    Promise.all(promises)
      .then((respData) => {
        let pointsList = respData[0].data;
        const matchesList = respData[1].data;
        
        pointsList = pointsList.map((ele) => {
          const matchesPalyedByP = matchesList.filter((match) => (match.player1.id === ele.id || match.player2.id === ele.id));
          const pointsInEachMatch = [];
          matchesPalyedByP.forEach((match) => {
            const playerKey = match.player1.id === ele.id ? 'player1' : 'player2';
            const rivalPlayerKey = playerKey === 'player1' ? 'player2' : 'player1';
            if (match[playerKey].score > match[rivalPlayerKey].score) {
              pointsInEachMatch.push(3);
            } else if (match[playerKey].score < match[rivalPlayerKey].score) {
              pointsInEachMatch.push(0);
            } else if (match[playerKey].score === match[rivalPlayerKey].score) {
              pointsInEachMatch.push(1);
            }
          });

          const scoreInEachMatchByP = [];
          matchesList.forEach((match) => {
            if (match.player1.id === ele.id) {
              scoreInEachMatchByP.push(match.player1.score);
            } else if (match.player2.id === ele.id) {
              scoreInEachMatchByP.push(match.player2.score);
            }
          });

          return {
            ...ele,
            totalpoints: pointsInEachMatch.reduce((acc, crr) => acc + crr, 0),
            totalscore: scoreInEachMatchByP.reduce((acc, crr) => acc + crr, 0),
          }
        });
        pointsList = pointsList.sort((a, b) => b.totalpoints - a.totalpoints === 0 ? b.totalscore - a.totalscore : b.totalpoints - a.totalpoints);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          pointsTable: pointsList,
          matchesTable: matchesList,
        }));
      })
      .catch((err) => {
        console.log('error ', err.response);
      })
  }, []);

  const showMatchtable = useCallback((playerId) => {
    let matchPlayedByP = matchesTable.filter((match) => (match.player1.id === playerId || match.player2.id === playerId));;
    matchPlayedByP = matchPlayedByP.map((ele) => {
      let tmpEle = { ...ele };
      const playerKey = ['player1', 'player2'];
      playerKey.forEach((key) => {
        const playerObj = pointsTable.find(({ id }) => id === ele[key].id)
        if (playerObj) {
          tmpEle = {
            ...tmpEle,
            [key]: {
              ...tmpEle[key],
              name: playerObj.name,
            },
          }
        }
      });
      return tmpEle;
    });
    setState((prevState) => ({
      ...prevState,
      selectedPlayerId: playerId,
      matchesDate: matchPlayedByP.sort((a, b) => b.match - a.match),
    }));
  }, [matchesTable, pointsTable]);

  const clearSelectedPlayerId = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      selectedPlayerId: null,
    }));
  }, []);

  if (isLoading) return <div>Loading...</div>

  const Component = selectedPlayerId ? MatchesTable : PointsTable;

  return (
    <>
      <h4 className="header">Star Wars Blaster Tournament</h4>
      <Component
        pointsTable={pointsTable}
        showMatchtable={showMatchtable}
        matchesDate={matchesDate}
        clearSelectedPlayerId={clearSelectedPlayerId}
        selectedPlayerId={selectedPlayerId}
      />
    </>
  )
}

export default App
