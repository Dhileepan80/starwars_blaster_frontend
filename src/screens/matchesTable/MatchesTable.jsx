/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import styles from './scss/MatchesTable.module.scss';

export default function MatchesTable({ matchesDate, clearSelectedPlayerId, selectedPlayerId }) {
  const getClassName = useCallback((playerScore, rivalScore) => {
    if (playerScore > rivalScore) {
      return styles.green;
    } else if (playerScore < rivalScore) {
      return styles.red;
    } else if (playerScore === rivalScore) {
      return styles.white;
    }
  }, []);

  return (
    <div className={styles.matchesTableContainer}>
      <span>Matches</span>
      <div onClickCapture={() => clearSelectedPlayerId()}>Back</div>
      <table>
        <tbody>
          {matchesDate.map((ele) => {
            const selectedPlayerKey = ele.player1.id === selectedPlayerId ? 'player1' : 'player2';
            const rivalPlayerKey = selectedPlayerKey === 'player1' ? 'player2' : 'player1';
            return (
              <tr key={ele.id} className={getClassName(ele[selectedPlayerKey].score, ele[rivalPlayerKey].score)}>
                <td>
                  {ele[rivalPlayerKey].name}
                </td>
                <td>
                  {`${ele[rivalPlayerKey].score} - ${ele[selectedPlayerKey].score}`}
                </td>
                <td>
                  {ele[selectedPlayerKey].name}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
