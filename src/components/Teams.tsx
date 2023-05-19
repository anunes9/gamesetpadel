import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { FieldArray, Form, Formik } from 'formik'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'

export const TeamsComponent = () => {
  const { handleSetTeams } = useContext(GamesContext)

  return (
    <Formik
      initialValues={{
        numberOfTeams: 4,
        teams: [
          'Andre Nunes / Tiago Coelho',
          'Joao Goncalves / Marco Costa',
          'Hugo Condenso / Nuno Correia',
          'Pedro Silva / Jorge Costa'
        ]
      }}
      onSubmit={(values) => handleSetTeams(values.teams)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <label htmlFor="numberOfTeams" className="font-bold block mb-2">
            Number of teams
          </label>

          <InputNumber
            inputId="numberOfTeams"
            name="year"
            value={values.numberOfTeams}
            onValueChange={(e) => {
              setFieldValue('numberOfTeams', e.value)
              const oldTeams = values.teams
              if (e.value! > values.numberOfTeams) setFieldValue('teams', [...oldTeams, '', '', '', ''])
              else setFieldValue('teams', [...oldTeams.slice(0, e.value!)])
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

          <label htmlFor="numberOfTeams" className="font-bold block mb-2 mt-4">
            Teams
          </label>

          <FieldArray
            name="teams"
            render={() => (
              <>
                {values.teams.map((team, index) => (
                  <div className="flex gap-2 align-items-center" key={index}>
                    <p className="font-bold">{`#${index + 1}`}</p>

                    <InputText
                      className="p-inputtext-sm w-full"
                      id={`teams.${index}`}
                      name={team}
                      value={team}
                      onChange={(e) => setFieldValue(`teams.${index}`, e.target.value)}
                    />
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
