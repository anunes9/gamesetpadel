import { useEffect, useRef } from 'react'
import { useFormikContext } from 'formik'
import isEqual from 'react-fast-compare'
import { useDebouncedCallback } from 'use-debounce'

export const FormikPersist = ({ name }: { name: string }) => {
  const { values, setValues } = useFormikContext()
  const prefValuesRef = useRef<any>()

  const onSave = (values: any) => window.localStorage.setItem(name, JSON.stringify(values))

  const debouncedOnSave = useDebouncedCallback(onSave, 300)

  useEffect(() => {
    const savedForm = window.localStorage.getItem(name)

    if (savedForm) {
      const parsedForm = JSON.parse(savedForm)

      prefValuesRef.current = parsedForm
      setValues(parsedForm)
    }
  }, [name, setValues])

  useEffect(() => {
    if (!isEqual(prefValuesRef.current, values)) debouncedOnSave(values)
  })

  useEffect(() => {
    prefValuesRef.current = values
  })

  return null
}
