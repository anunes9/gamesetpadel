import { Game } from '../logic/games-engine'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import { InputMask } from "primereact/inputmask"
import { FieldArray, Form, Formik, FormikTouched, getIn } from 'formik'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'

export const GamesComponent = ({ showToast }: { showToast: (detail: string) => void}) => {
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
    showToast('Games Results Saved!')
  }

  if (games.length === 0) return <p className="font-bold">Set teams first to generate the games</p>

  return (
    <div className="flex-1" style={{ marginBottom: '24rem'}}>
      {[...Array(3).keys()].map(r => (
        <Panel key={r} className="mb-2" header={`Round ${r+1}`} toggleable collapsed>
          <GameForm games={gamesPerRound(r+1)} handleSubmit={(games) => updateScore(games)} />
        </Panel>
      ))}

      {numberOfGroups > 1 && (
        <>
          <Panel className="mb-2" header={`Semi-Finals`} toggleable collapsed>
            {round4Games.length === 0
              ? <Button onClick={generateRound4} label="Generate Games" />
              : <GameForm games={round4Games} handleSubmit={(games) => updateScore(games, 4)} />
            }
          </Panel>

          <Panel className="mb-2" header={`Finals`} toggleable collapsed>
            {round5Games.length === 0
              ?<Button onClick={generateRound5} label="Generate Games" />
              : <GameForm games={round5Games} handleSubmit={(games) => updateScore(games, 5)} />
            }
          </Panel>
        </>
      )}
    </div>
  )
}

const InputError = ({ value, touched, field }: { value?: string, touched: FormikTouched<any>, field: string }) => {
  let errorMessage = ''

  if (value === '') errorMessage = 'Score cannot be empty'
  else if (value && value?.length < 3) errorMessage = 'Score is wrong'
  else if (value?.length === 3) {
    const [a, b] = value.split('-')

    if (a === b) errorMessage = 'Score is wrong'
    else errorMessage = ''
  }

  if (getIn(touched, field)) return <small className="p-error mt-1">{errorMessage}</small>
  return null
}

const GameForm = ({ games, handleSubmit }: { games: Game[], handleSubmit: (games: Game[]) => void }) => (
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
                  <p className="font-bold m-0 mb-1">{`Group ${game.group}`}</p>

                  <div className="flex flex-column md:flex-row align-items-center justify-content-center mb-2">
                    <p className="font-bold m-0">{game.homeTeam.name}</p>
                    <p className="m-2">vs</p>
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
          label="Save Results"
        />
      </Form>
    )}
  </Formik>
)
