import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'
import { useTranslation } from 'react-i18next'
import { Game, letters, sortTeams } from '../logic/engine'
import { ClassificationCard } from './Classification'

export const ResultsComponent = () => {
  const { t } = useTranslation()
  const { teams, numberOfGroups, round4Games, round5Games } = useContext(GamesContext)

  const cardStyle = {
    body: { className: 'p-0' },
    content: { className: 'p-0' }
  }

  if (teams.length === 0) return <p className="font-bold">{t('games.result-empty')}</p>

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
          <p className="font-bold m-0 ml-3 mb-3 pt-3">{t('games.group-id', { letter: letters[i] })}</p>

          <DataTable
            className="mb-3"
            stripedRows
            value={teams.filter(team => team.group === letters[i]).sort(sortTeams)}
          >
            <Column field="name" header={t('games.name')} />
            <Column field="points" header={t('games.points')} />
            <Column field="diff" header={t('games.diff')} />
          </DataTable>
        </Card>
      ))}

      {numberOfGroups > 1 && (
        <>
          <Card pt={cardStyle}>
            <p className="font-bold m-0 ml-3 mb-3 pt-3">
              {t('games.round', {round: 4})}
            </p>

            <DataTable className="mb-3" value={round4Games} stripedRows>
              <Column field="group" header={t('games.group')} />
              <Column body={labelTemplate} header={t('games.game')} />
              <Column field="score" header={t('games.score')} />
            </DataTable>
          </Card>

          <Card pt={cardStyle}>
            <p className="font-bold m-0 ml-3 mb-3 pt-3">
              {t('games.round', {round: 5})}
            </p>

            <DataTable className="mb-3" value={round5Games} stripedRows>
              <Column field="group" header={t('games.group')}/>
              <Column body={labelTemplate} header={t('games.game')}/>
              <Column field="score" header={t('games.score')}/>
            </DataTable>
          </Card>

          <ClassificationCard />
        </>
      )}
    </div>
  )
}
