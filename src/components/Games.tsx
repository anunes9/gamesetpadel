import { Game } from '../logic/games-engine'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import { Form, Formik } from 'formik'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'

export const GamesComponent = () => {
  const { games, gamesPerRound, handleUpdateScore, numberOfRounds } = useContext(GamesContext)

  if (games.length === 0)
    return <p>Set the teams name's first to generate the games</p>

  return (
    <div className="flex-1">
      <h1>Games</h1>

      {[...Array(numberOfRounds).keys()].map(r => (
        <Panel key={r} className="mb-2" header={`Round ${r+1}`} toggleable collapsed>
          {gamesPerRound(r+1).map((game, idx) => (
            <GameForm
              key={idx}
              game={game}
              handleSubmit={(score) => handleUpdateScore(idx, score)}
            />
          ))}
        </Panel>
      ))}
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

            <InputText
              placeholder="Result"
              className="w-8rem"
              style={{ paddingLeft: '3rem'}}
              value={values.score}
              onChange={(e) => setFieldValue('score', e.target.value!)}
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


// {games.length > 0 &&
//   <Formik
//     initialValues={{
//       games: games
//     }}
//     onSubmit={(values) => handleSubmit(values)}
//   >
//     {({ values, setFieldValue }) => (
//       <Form>
//         <FieldArray
//           name="games"
//           render={() => (
//             <>
//               {values.games.map((game, index) => (
//                 <div className="flex gap-2 align-items-center" key={index}>
//                   {index % 4 === 0 ? <p className="font-bold">Round {game.round}</p> : null}

//                   <p>{game.label}</p>

//                   <InputText
//                     value={game.score}
//                     onChange={(e) => setFieldValue(`games.${index}.score`, e.target.value!)}
//                   />
//                 </div>
//               ))}
//             </>
//           )}
//         />

//         <Button className="mt-3" type="submit" label="Save" />
//       </Form>
//     )}
//   </Formik>
// }