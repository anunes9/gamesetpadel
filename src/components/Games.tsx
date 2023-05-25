import { Game } from '../logic/games-engine'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import { InputMask } from "primereact/inputmask"
import { FieldArray, Form, Formik, FormikTouched, getIn } from 'formik'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'
import { useTranslation } from 'react-i18next'

export const GamesComponent = ({ showToast }: { showToast: (detail: string) => void}) => {
  const { t } = useTranslation()
  const {
    games,
    gamesPerRound,
    generateRound4,
    generateRound5,
    handleUpdateScore,
    numberOfGroups,
    round4Games,
    round5Games
  } = useContext(GamesContext)

  const updateScore = (games: Game[], round?: number) => {
    games.forEach(game => handleUpdateScore(game.id, game.score || '', round))
    showToast(t('games.results-saved'))
  }

  if (games.length === 0) return <p className="font-bold">{t('games.games-empty')}</p>

  return (
    <div className="flex-1">
      {[...Array(3).keys()].map(r => (
        <Panel
          key={r}
          className="mb-2"
          header={t('games.round', {round: r+1})}
          toggleable
          collapsed={r !== 0}
        >
          <GameForm games={gamesPerRound(r+1)} handleSubmit={(games) => updateScore(games)} />
        </Panel>
      ))}

      {numberOfGroups > 1 && (
        <>
          <Panel className="mb-2" header={t('games.semi-finals')} toggleable collapsed>
            <Button className="mb-3" onClick={generateRound4} label={t('games.generate-games')!} />

            {round4Games.length !== 0 &&
              <GameForm games={round4Games} handleSubmit={(games) => updateScore(games, 4)} />
            }
          </Panel>

          <Panel className="mb-2" header={t('games.finals')} toggleable collapsed>
            <Button className="mb-3" onClick={generateRound5} label={t('games.generate-games')!} />

            {round5Games.length !== 0 &&
            <GameForm games={round5Games} handleSubmit={(games) => updateScore(games, 5)} />
            }
          </Panel>
        </>
      )}
    </div>
  )
}

const InputError = ({ value, touched, field }: { value?: string, touched: FormikTouched<any>, field: string }) => {
  const { t } = useTranslation()
  let errorMessage = ''

  if (value === '') errorMessage = t('games.score-empty-error')
  else if (value && value?.length < 3) errorMessage = t('games.score-wrong-error')
  else if (value?.length === 3) {
    const [a, b] = value.split('-')

    if (a === b) errorMessage = t('games.score-wrong-error')
    else errorMessage = ''
  }

  if (getIn(touched, field)) return <small className="p-error mt-1">{errorMessage}</small>
  return null
}

const GameForm = ({ games, handleSubmit }: { games: Game[], handleSubmit: (games: Game[]) => void }) => {
  const { t } = useTranslation()

  return (
    <Formik
      initialValues={{ games }}
      onSubmit={(values) => handleSubmit(values.games)}
      validate={(values) => {
        let error = false

        values.games.every((game: Game) => {
          if (game.score === '') {
            error = true
            return false
          }

          return true
        })

        return error ? { games: true } : {}
      }}
    >
      {({ values, touched, setFieldValue }) => (
        <Form className="flex flex-column">
          <FieldArray
            name="games"
            render={() => (
              <div className="flex-1">
                {values.games.map((game: Game, index: number) => (
                  <div key={index} className="surface-100 border-50 border-1 border-round-sm mb-2 p-2">
                    <p className="font-bold m-0 mb-1">
                      {t('games.group-id', { letter: game.group })}
                    </p>

                    <div className="flex flex-column md:flex-row align-items-center justify-content-center mb-2">
                      <p className="font-bold m-0">{game.homeTeam.name}</p>
                      <p className="m-2">{t('games.vs')}</p>
                      <p className="font-bold m-0">{game.awayTeam.name}</p>
                    </div>

                    <div className="flex flex-column align-items-center">
                      <span className="p-input-icon-left">
                        <i className="material-symbols-outlined" style={{ marginTop: '-0.8rem'}}>sports_baseball</i>

                        <InputMask
                          id={`games.${index}.id`}
                          style={{ paddingLeft: '4rem'}}
                          className="w-8rem"
                          value={game.score}
                          onChange={(e) => setFieldValue(`games.${index}.score`, e.target.value!)}
                          mask="9-9"
                        />
                      </span>

                      <InputError field={`games.${index}.score`} touched={touched} value={game.score} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          />

          <Button
            style={{ padding: '0.6rem'}}
            className="mt-2"
            size="small"
            type="submit"
            label={t('games.save-results')!}
          />
        </Form>
      )}
    </Formik>
  )
}
