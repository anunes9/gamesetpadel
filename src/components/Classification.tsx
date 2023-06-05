import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'
import { useTranslation } from 'react-i18next'
import { Team, sortTeams } from '../logic/engine'

export const ClassificationCard = () => {
  const { t } = useTranslation()
  const { classification } = useContext(GamesContext)

  const cardStyle = {
    body: { className: 'p-0 mt-8' },
    content: { className: 'p-0' }
  }

  const positionTemplate = (team: Team) => <p className="font-bold">{t('games.place', { place: team.index! +1})}</p>

  return (
    <Card pt={cardStyle}>
      <p className="font-bold text-xl m-0 ml-3 mb-3 pt-3">
        {t('games.final-classification')}
      </p>

      <DataTable
        className="mb-3"
        stripedRows
        value={classification.sort(sortTeams).map((t, index) => ({...t, index}))}
      >
        <Column
          field="index"
          header={t('games.position')}
          body={positionTemplate}
        />
        <Column field="name" header={t('games.name')} />
        <Column field="points" header={t('games.points')} />
        <Column field="diff" header={t('games.diff')} />
      </DataTable>
    </Card>
  )
}
