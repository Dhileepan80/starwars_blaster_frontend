/* eslint-disable react/prop-types */
import styles from './scss/PointsTable.module.scss';

export default function PointsTable({ pointsTable, showMatchtable }) {
  console.log('points table', pointsTable)
  return (
    <div className={styles.pointsTableContainer}>
      <span>Points Table</span>

      <table>
        <tbody>
          {pointsTable.map((ele) => (
            <tr key={ele.id} onClickCapture={() => showMatchtable(ele.id)}>
              <td>
                <img src={ele.icon} alt='player_logo' />
              </td>
              <td>
                {ele.name}
              </td>
              <td>
                <span className={styles.boldTxt}>{ele.totalpoints}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
