import { useState, useRef, useEffect, RefObject } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'

const useReadOnlyPersistedSelection = (fieldset: string) => {
  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string[] }
  }>('formSelection')

  if (!persistedSelection) return null

  if (fieldset in persistedSelection.inputs)
    return persistedSelection.inputs[fieldset]

  return null
}

const useWidgetSelection = (fieldset: string) => {
  const [selection, setSelection] = useState<Record<string, string[]>>({
    [fieldset]: []
  })

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string[] }
  }>('formSelection')

  /**
   * Cache persisted selection, so we don't need to pass it as an effect dependency.
   */
  const persistedSelectionRef = useRef(persistedSelection)

  /**
   * Hydrate the widget selection from local storage, if present.
   * useEffect is necessary to prevent SSR hydration mismatches.
   */
  useEffect(() => {
    const getInitialSelection = () => {
      if (
        persistedSelectionRef.current &&
        'inputs' in persistedSelectionRef.current
      ) {
        return persistedSelectionRef.current.inputs[fieldset]
      }
    }

    setSelection({
      [fieldset]: getInitialSelection() || []
    })
  }, [fieldset])

  return { selection, setSelection }
}

type UseBypassRequired = <TElement extends HTMLFieldSetElement>(
  elementRef: RefObject<TElement>,
  bypass?: boolean,
  constraints?: string[]
) => boolean
/**
 * Bypass the required attribute if all options are made unavailable by constraints.
 */
const useBypassRequired: UseBypassRequired = (
  elementRef,
  bypass = false,
  constraints
) => {
  if (!constraints) return false

  return !constraints.length && bypass
}

export { useWidgetSelection, useReadOnlyPersistedSelection, useBypassRequired }
