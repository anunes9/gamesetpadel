import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Messages } from 'primereact/messages'
import { FieldArray, Form, Formik, FormikTouched, getIn } from 'formik'
import { useContext, useRef } from 'react'
import { GamesContext } from '../context/GameContext'
import { FormikPersist } from './FormikPersist'
import './Teams.css'
import { useTranslation } from 'react-i18next'

const NumberOfGroupsList = {
  4: 1,
  6: 1,
  8: 2,
  10: 2,
  12: 3,
  14: 3,
  16: 4
}

type FormType = {
  numberOfTeams: number;
  numberOfGroups: number;
  numberOfGames: number;
  teams: string[];
}

interface TeamsComponentProps {
  handleSuccess: (detail: string) => void
  handleInfoMessage: () => void
}

export const TeamsComponent = ({ handleSuccess, handleInfoMessage }: TeamsComponentProps) => {
  const { t } = useTranslation()
  const { round1Games, handleSetTeams, handleResetGames } = useContext(GamesContext)
  const disabled = round1Games.length > 0
  const msgs = useRef(null)

  const InputError = (
    { value, touched, field }:
    { value: string, touched: FormikTouched<FormType>, field: string }
  ) => {
    if (value === '' && getIn(touched, field)) return <small className="p-error">{t('teams.empty-error')}</small>
    return null
  }

  return (
    <Formik
      initialValues={{
        numberOfTeams: 4,
        numberOfGroups: 1,
        numberOfGames: 3, // or 5 for more than 4 teams
        teams: ['', '', '', ''],
        courts: [undefined, undefined],
      }}
      onSubmit={({ numberOfTeams, numberOfGroups, numberOfGames, teams, courts }) => {
        if (numberOfTeams === 10 || numberOfTeams === 14) handleInfoMessage()

        const availableCourts = courts.filter(Number).length === numberOfTeams / 2
          ? courts as unknown as number[]
          : [...Array(teams.length).keys()]

        handleSetTeams(teams, numberOfGames, numberOfGroups, availableCourts)
        handleSuccess(t('teams.team-saved'))
      }}
      validate={(values) => values.teams.filter(Boolean).length === values.numberOfTeams ? {} : { teams: true }}
    >
      {({ values, touched, setFieldValue, handleReset }) => (
        <Form>
          <FormikPersist name="formState" />

          <Messages ref={msgs} />

          <div className="flex flex-column md:flex-row gap-3 align-items-start justify-content-between">
            <div>
              <label htmlFor="numberOfTeams" className="font-bold block mb-1">
                {t('teams.number-of-teams')}
              </label>

              <InputNumber
                disabled={disabled}
                id="numberOfTeams"
                value={values.numberOfTeams}
                onValueChange={(e) => {
                  const oldTeams = values.teams
                  const oldCourts = values.courts

                  if (e.value! > values.numberOfTeams) {
                    setFieldValue('teams', [...oldTeams, '', ''])
                    setFieldValue('courts', [...oldCourts, ''])
                  }
                  else {
                    setFieldValue('teams', [...oldTeams.slice(0, e.value!)])
                    setFieldValue('courts', [...oldCourts.slice(0, e.value! / 2)])
                  }

                  setFieldValue('numberOfTeams', e.value)
                  setFieldValue('numberOfGames', e.value === 4 ? 3 : 5)
                  setFieldValue('numberOfGroups', NumberOfGroupsList[e.value! as keyof typeof NumberOfGroupsList])
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
                step={2}
              />

              <small className="block mt-2">
                {t('teams.number-of-teams-description')}
              </small>
            </div>

            <div>
              <label htmlFor="numberOfGames" className="font-bold block mb-2">
                {t('teams.number-of-games')}
              </label>

              <InputNumber
                disabled
                id="numberOfGames"
                value={values.numberOfGames}
                onValueChange={(e) => setFieldValue('numberOfGames', e.value)}
                className="p-inputtext-sm"
                min={3}
              />
            </div>

            <div>
              <label htmlFor="numberOfGroups" className="font-bold block mb-2">
                {t('teams.number-of-groups')}
              </label>

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

          <p className="font-bold mb-2 mt-4 text-lg">
            {t('teams.teams')}
          </p>

          <FieldArray
            name="teams"
            render={() => (
              <div>
                {values.teams.map((team, index) => (
                  <div key={index}>
                    <div className="flex gap-3 align-items-center justify-content-between">
                      <p className="font-bold">{`#${index + 1}`}</p>

                      <InputText
                        disabled={disabled}
                        className="p-inputtext-sm w-11"
                        id={`teams.${index}`}
                        name={team}
                        value={team}
                        onChange={(e) => setFieldValue(`teams.${index}`, e.target.value)}
                        placeholder={t('teams.example')!}
                      />
                    </div>

                    <InputError field={`teams.${index}`} touched={touched} value={team} />
                  </div>
                ))}
              </div>
            )}
          />

          <p className="font-bold mb-2 mt-4 text-lg">
            {t('teams.courts')}
          </p>

          <FieldArray
            name="courts"
            render={() => (
              <div className="grid">
                {values.courts?.map((court, index) => (
                  <div className="col-4 sm:col-3" key={index}>
                    <div className="flex gap-2 align-items-center">
                      <p className="font-bold">{`${index + 1}`}</p>

                      <InputNumber
                        disabled={disabled}
                        className="p-inputtext-sm mb-2 court-field"
                        id={`courts.${index}`}
                        value={court}
                        onChange={(e) => setFieldValue(`courts.${index}`, e.value)}
                        placeholder={t('teams.courts-example')!}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          />

          <div className="flex flex-row justify-content-end gap-4 mt-4">
            <Button disabled={disabled} type="submit" label={t('teams.save-teams')!} />

            <Button
              type="button"
              onClick={() => {
                handleReset()
                handleResetGames()
              }}
              label={t('teams.reset-teams')!}
              severity="danger"
            />
          </div>
        </Form>
      )}
    </Formik>
  )
}
