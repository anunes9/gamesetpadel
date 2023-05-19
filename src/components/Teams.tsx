import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { FieldArray, Form, Formik } from 'formik'
import { useContext } from 'react'
import { GamesContext, letters } from '../context/GameContext'
import './Teams.css'

export const TeamsComponent = () => {
  const { handleSetTeams } = useContext(GamesContext)

  return (
    <Formik
      initialValues={{
        numberOfTeams: 8,
        numberOfGroups: 2,
        numberOfGames: 5,
        teams: [
          'Andre Nunes / Tiago Coelho',
          'Joao Goncalves / Marco Costa',
          'Hugo Condenso / Nuno Correia',
          'Pedro Silva / Jorge Costa',
          'Goncalo Ferreira / Joao Pedro',
          'Tiago Marques / Jorge Fernando',
          'Francisco Perreira / Miguel Torres',
          'Vitor Fonseca / Filipe Marques'
        ]
      }}
      onSubmit={(values) => handleSetTeams(values.teams, values.numberOfGames, values.numberOfGroups)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div
            className="flex flex-column md:flex-row gap-3 align-items-start md:align-items-end justify-content-between"
          >
            <div>
              <label htmlFor="numberOfTeams" className="font-bold block mb-2">Number of teams</label>

              <InputNumber
                id="numberOfTeams"
                value={values.numberOfTeams}
                onValueChange={(e) => {
                  setFieldValue('numberOfTeams', e.value)
                  const oldTeams = values.teams
                  if (e.value! > values.numberOfTeams) {
                    setFieldValue('teams', [...oldTeams, '', '', '', ''])
                    setFieldValue('numberOfGroups', (oldTeams.length + 4) / 4)
                  }
                  else {
                    setFieldValue('teams', [...oldTeams.slice(0, e.value!)])
                    setFieldValue('numberOfGroups', (oldTeams.length - 4) / 4)
                  }
                }}
                buttonLayout="horizontal"
                className="p-inputtext-sm w-full"
                decrementButtonClassName="p-button-danger"
                decrementButtonIcon="pi pi-minus"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                min={4}
                showButtons
                step={4}
              />
            </div>

            <div>
              <label htmlFor="numberOfGames" className="font-bold block mb-2">Number of Games</label>

              <InputNumber
                disabled
                id="numberOfGames"
                value={values.numberOfGames}
                onValueChange={(e) => {
                  setFieldValue('numberOfGames', e.value)
                }}
                className="p-inputtext-sm"
                min={3}
              />
            </div>

            <div>
              <label htmlFor="numberOfGroups" className="font-bold block mb-2">Number of Groups</label>

              <InputNumber
                disabled
                id="numberOfGroups"
                value={values.numberOfGroups}
                onValueChange={(e) => setFieldValue('numberOfGroups', e.value)}
                className="p-inputtext-sm"
                min={1}
              />
            </div>
          </div>

          <label htmlFor="numberOfTeams" className="font-bold block mb-2 mt-4">
            Teams
          </label>

          <FieldArray
            name="teams"
            render={() => (
              <>
                {values.teams.map((team, index) => (
                  <div key={index}>
                    {index % 4 === 0 && <p className="font-bold">{`Group ${letters[index / 4]}`}</p>}

                    <div className="flex gap-3 align-items-center justify-content-between" key={index}>
                      <p className="font-bold">{`#${index + 1}`}</p>

                      <InputText
                        className="p-inputtext-sm w-11"
                        id={`teams.${index}`}
                        name={team}
                        value={team}
                        onChange={(e) => setFieldValue(`teams.${index}`, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          />

          <Button className="mt-3" type="submit" label="Save teams" />
        </Form>
      )}
    </Formik>
  )
}
