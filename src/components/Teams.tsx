import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { FieldArray, Form, Formik, FormikTouched, getIn } from 'formik'
import { useContext } from 'react'
import { GamesContext } from '../context/GameContext'
import { FormikPersist } from './FormikPersist'
import './Teams.css'

type FormType = {
  numberOfTeams: number;
  numberOfGroups: number;
  numberOfGames: number;
  teams: string[];
}

export const TeamsComponent = ({ handleSuccess }: { handleSuccess: (detail: string) => void }) => {
  const { games, handleSetTeams, handleResetGames } = useContext(GamesContext)
  const disabled = games.length > 0

  const InputError = ({ value, touched, field }:
    { value: string, touched: FormikTouched<FormType>, field: string }) =>
  {
    if (value === '' && getIn(touched, field)) return <small className="p-error">Team cannot be empty</small>
    return null
  }

  return (
    <Formik
      initialValues={{
        numberOfTeams: 4,
        numberOfGroups: 1,
        numberOfGames: 3, // or 5 for more than 4 teams
        teams: ['', '', '', '']
      }}
      onSubmit={(values) => {
        handleSetTeams(values.teams, values.numberOfGames, values.numberOfGroups)
        handleSuccess('Teams saved!')
      }}
      validate={(values) => {
        let teamError = undefined

        values.teams.map(t => {
          if (t === '') teamError = true
        })

        return teamError ? { teams: teamError } : {}
      }}
    >
      {({ values, touched, setFieldValue, handleReset }) => (
        <Form>
          <FormikPersist name="formState" />

          <div
            className="flex flex-column md:flex-row gap-3 align-items-start justify-content-between"
          >
            <div>
              <label htmlFor="numberOfTeams" className="font-bold block mb-1">Number of teams</label>

              <InputNumber
                disabled={disabled}
                id="numberOfTeams"
                value={values.numberOfTeams}
                onValueChange={(e) => {
                  const oldTeams = values.teams
                  if (e.value! > values.numberOfTeams) setFieldValue('teams', [...oldTeams, '', '', '', ''])
                  else setFieldValue('teams', [...oldTeams.slice(0, e.value!)])


                  setFieldValue('numberOfTeams', e.value)
                  setFieldValue('numberOfGames', e.value === 4 ? 3 : 5)
                  setFieldValue('numberOfGroups', e.value! / 4)
                }}
                buttonLayout="horizontal"
                className="p-inputtext-sm w-full mt-1"
                decrementButtonClassName="p-button-danger"
                decrementButtonIcon="pi pi-minus"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                min={4}
                max={16}
                showButtons
                step={4}
              />

              <small className="block mt-2">Min: 4 - Max: 16</small>
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

          <p className="font-bold mb-2 mt-4 text-lg">Teams</p>

          <FieldArray
            name="teams"
            render={() => (
              <div>
                {values.teams.map((team, index) => (
                  <div key={index}>
                    {/* group label */}
                    {/* {index % 4 === 0 &&
                      <label className="font-bold block mb-1 mt-2">{`Group ${letters[index / 4]}`}</label>
                    } */}

                    <div className="flex gap-3 align-items-center justify-content-between" key={index}>
                      <p className="font-bold">{`#${index + 1}`}</p>

                      <InputText
                        disabled={disabled}
                        className="p-inputtext-sm w-11"
                        id={`teams.${index}`}
                        name={team}
                        value={team}
                        onChange={(e) => setFieldValue(`teams.${index}`, e.target.value)}
                        placeholder="Ex: Filipe / Joāo"
                      />
                    </div>

                    <InputError field={`teams.${index}`} touched={touched} value={team} />
                  </div>
                ))}
              </div>
            )}
          />

          <div className="flex flex-row justify-content-end gap-4 mt-4">
            {!disabled && <Button type="submit" label="Save teams" />}

            <Button
              type="button"
              onClick={() => {
                handleReset()
                handleResetGames()
              }}
              label="Reset teams"
              severity="danger"
            />
          </div>
        </Form>
      )}
    </Formik>
  )
}
