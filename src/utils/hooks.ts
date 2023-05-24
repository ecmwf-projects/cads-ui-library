import { useState, useRef, useEffect, RefObject } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'

/**
 * Read and return the persisted selection of the given widget, or the entire selection if no name is provided.
 */
const useReadOnlyPersistedSelection = <
  TDefault extends string[] | Record<string, string[]>
>(
  defaultSelection?: TDefault,
  fieldset?: string | null
) => {
  const [selection, setSelection] = useState<
    string[] | Record<string, string[]>
  >()

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs?: Record<string, string[]>
  }>('formSelection')
  const persistedSelectionRef = useRef(persistedSelection)

  /**
   * Hydrate the widget selection from local storage, if present.
   * useEffect is necessary to prevent SSR hydration mismatches.
   */
  useEffect(() => {
    const getInitialSelection = () => {
      if (persistedSelectionRef.current) {
        if (!persistedSelectionRef.current?.inputs) {
          if (!fieldset) return {}

          return defaultSelection
        }

        if (!fieldset) return persistedSelectionRef.current.inputs

        return (
          persistedSelectionRef.current.inputs[fieldset] || defaultSelection
        )
      }

      return defaultSelection
    }

    setSelection(getInitialSelection())
  }, [fieldset])

  return selection
}

const useWidgetSelection = (fieldset: string) => {
  const [selection, setSelection] = useState<Record<string, string[]>>({
    [fieldset]: []
  })

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: Record<string, string[]>
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
