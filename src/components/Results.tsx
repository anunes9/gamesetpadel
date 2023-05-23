import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import { useContext } from 'react'
import { GamesContext, letters, sortTeams } from '../context/GameContext'
import { Game } from '../logic/games-engine'

export const ResultsComponent = () => {
  const { teams, numberOfGroups, round4Games, round5Games } = useContext(GamesContext)

  const cardStyle = {
    body: { className: 'p-0' },
    content: { className: 'p-0' }
  }

  if (teams.length === 0) return <p className="font-bold">Set teams first to generate the results</p>

  const labelTemplate = (game: Game) => (
    <div className="flex flex-column">
      <p className={`${game.winner === 'home' ? 'font-bold' : ''} m-0`}>{game.homeTeam.name}</p>
      <p className="m-2">vs</p>
      <p className={`${game.winner === 'away' ? 'font-bold' : ''} m-0`}>{game.awayTeam.name}</p>
    </div>
  )

  return (
    <div className="flex-1">
      {[...Array(numberOfGroups).keys()].map(i => (
        <Card key={i} pt={cardStyle}>
          <p className="font-bold m-0 ml-3 mb-3 pt-3">{`Group ${letters[i]}`}</p>

          <DataTable
            className="mb-3"
            stripedRows
            value={teams.filter(team => team.group === letters[i]).sort(sortTeams)}
          >
            <Column field="name" header="Name" />
            <Column field="points" header="Points" />
            <Column field="diff" header="Diff" />
          </DataTable>
        </Card>
      ))}

      {numberOfGroups > 1 && (
        <>
          <Card pt={cardStyle}>
            <p className="font-bold m-0 ml-3 mb-3 pt-3">Semi-Finals</p>

            <DataTable className="mb-3" value={round4Games} stripedRows>
              <Column field="group" header="Group" />
              <Column body={labelTemplate} header="Game" />
              <Column field="score" header="Score" />
            </DataTable>
          </Card>

          <Card pt={cardStyle}>
            <p className="font-bold m-0 ml-3 mb-3 pt-3">Finals</p>

            <DataTable className="mb-3" value={round5Games} stripedRows>
              <Column field="group" header="Group" />
              <Column body={labelTemplate} header="Game" />
              <Column field="score" header="Score" />
            </DataTable>
          </Card>
        </>
      )}
    </div>
  )
}
