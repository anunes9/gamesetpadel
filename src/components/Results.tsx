import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import { useContext } from 'react'
import { GamesContext, letters, sortTeams } from '../context/GameContext'

export const ResultsComponent = () => {
  const { teams, numberOfGroups } = useContext(GamesContext)

  if (teams.length === 0) return <p className="font-bold">Set teams first to generate the games</p>

  return (
    <div className="flex-1">
      {[...Array(numberOfGroups).keys()].map(i => (
        <Card
          pt={{
            body: { className: 'p-0' },
            content: { className: 'p-0' }
          }}>
          <p className="font-bold m-0 ml-3 mb-3 pt-3">{`Group ${letters[i]}`}</p>

          <DataTable
            className="mb-3"
            value={teams.filter(team => team.group === letters[i]).sort(sortTeams)}
          >
            <Column field="name" header="Name"></Column>
            <Column field="points" header="Points"></Column>
            <Column field="diff" header="Diff"></Column>
          </DataTable>
        </Card>
      ))}
    </div>
  )
}
