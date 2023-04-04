import { useState, useRef, useEffect } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'

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

export { useWidgetSelection }
