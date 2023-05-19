import { Game } from '../logic/games-engine'
import { Button } from 'primereact/button'
import { Panel } from 'primereact/panel'
import { InputMask } from "primereact/inputmask"
import { Form, Formik } from 'formik'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'

export const GamesComponent = () => {
  const { games, gamesPerRound, handleUpdateScore, generateRound4, round4Games } = useContext(GamesContext)

  if (games.length === 0) return <p className="font-bold">Set teams first to generate the games</p>

  return (
    <div className="flex-1" style={{ marginBottom: '24rem'}}>
      {[...Array(3).keys()].map(r => (
        <Panel key={r} className="mb-2" header={`Round ${r+1}`} toggleable collapsed>
          {gamesPerRound(r+1).map((game, index) => (
            <>
              <p className="font-bold m-0 mb-3">{`Group ${game.group}`}</p>
              <GameForm
                key={index}
                game={game}
                handleSubmit={(score) => handleUpdateScore(game.id, score)}
              />
            </>
          ))}
        </Panel>
      ))}

      <Panel className="mb-2" header={`Round 4`} toggleable collapsed>
        {round4Games.length === 0 && <Button onClick={generateRound4} label="Generate Games" />}

        {round4Games.map((game, index) => (
          <>
            <p className="font-bold m-0 mb-3">{`Semi Finals ${game.group}`}</p>
            <GameForm
              key={index}
              game={game}
              handleSubmit={(score) => handleUpdateScore(game.id, score)}
            />
          </>
        ))}
      </Panel>
    </div>
  )
}

interface GameFormType {
  game: Game
  handleSubmit: (score: string) => void
}

const GameForm = ({ game, handleSubmit }: GameFormType ) => (
  <Formik
    initialValues={{ score: game.score || '' }}
    onSubmit={(values) => handleSubmit(values.score)}
  >
    {({ values, setFieldValue }) => (
      <Form>
        <div className="flex flex-column align-items-center mb-3">
          <p className="font-bold m-0">{game.homeTeam.name}</p>
          <p className="m-2">vs</p>
          <p className="font-bold m-0">{game.awayTeam.name}</p>
        </div>

        <div className="flex align-items-center justify-content-between mb-6">
          <span className="p-input-icon-left">
            <i className="material-symbols-outlined" style={{ marginTop: '-0.8rem'}}>sports_baseball</i>

            {/* <InputText
              style={{ paddingLeft: '4rem'}}
              className="w-8rem"
              placeholder="Result"
              value={values.score}
              onChange={(e) => setFieldValue('score', e.target.value!)}
            /> */}

            <InputMask
              style={{ paddingLeft: '4rem'}}
              className="w-8rem"
              value={values.score}
              onChange={(e) => setFieldValue('score', e.target.value!)}
              mask="9-9"
            />
          </span>

          <Button
            style={{ padding: '0.6rem'}}
            outlined={!game.winner}
            size="small"
            type="submit"
            label="Save"
            severity={game.winner ? "success" : undefined}
          />
        </div>
      </Form>
    )}
  </Formik>
)
