/* istanbul ignore file */
import React, { useEffect, useRef, useState } from 'react'

import styled from 'styled-components'

import {
  Error,
  Fieldset,
  Legend,
  ReservedSpace,
  Widget,
  WidgetHeader,
  WidgetTitle
} from './Widget'

import { WidgetTooltip } from '../common/WidgetTooltip'
import { useEventListener, useReadLocalStorage } from 'usehooks-ts'

const DEFAULTS = {
  stepX: 0.001,
  stepY: 0.001,
  minX: -180,
  maxX: 180,
  minY: -90,
  maxY: 90,
  defaultY: 0,
  defaultX: 0,
  labelX: 'Longitude',
  labelY: 'Latitude'
}

export interface GeographicLocationWidgetConfiguration {
  type: 'GeographicLocationWidget'
  help: string | null
  label: string
  name: string
  required: boolean
  details: {
    comment?: string
    minY?: number
    maxY?: number
    minX?: number
    maxX?: number
    stepY?: number
    stepX?: number
    defaultY?: number
    defaultX?: number
    labelX?: string
    labelY?: string
  }
}

interface GeographicLocationWidgetProps {
  configuration: GeographicLocationWidgetConfiguration
  bypassRequiredForConstraints?: boolean
  constraints?: string[]
  disabled?: boolean
  error?: string
  fieldsetDisabled?: boolean
  labelAriaHidden?: boolean
}

const GeographicLocationWidget = ({
  configuration,
  bypassRequiredForConstraints,
  constraints,
  disabled,
  error,
  fieldsetDisabled,
  labelAriaHidden
}: GeographicLocationWidgetProps) => {
  const defaultDetails = {
    ...DEFAULTS,
    ...configuration.details
  }

  const defaultValue: number[] = [
    defaultDetails.defaultY,
    defaultDetails.defaultX
  ]

  const [valueX, setValueX] = useState<number>(defaultValue[0])
  const [valueY, setValueY] = useState<number>(defaultValue[1])

  /**
   * Handle form Clear all
   */
  const documentRef = useRef<Document>(
    typeof window !== 'undefined' ? document : null
  )

  useEventListener(
    'formAction',
    ev => {
      if (!('detail' in ev)) return
      if (!('type' in ev.detail)) return
      if (ev.detail.type !== 'clearAll') return

      setValueX(defaultValue[0])
      setValueY(defaultValue[1])
    },
    documentRef
  )

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string | number }
  }>('formSelection')

  const { type, help, label, name, required } = configuration

  /**
   * Cache persisted selection, so we don't need to pass it as an effect dependency.
   */
  const persistedSelectionRef = useRef(persistedSelection)

  useEffect(() => {
    const getInitialSelection = (): number[] => {
      if (
        persistedSelectionRef.current &&
        'inputs' in persistedSelectionRef.current
      ) {
        const guessArray = persistedSelectionRef.current.inputs[
          name
        ] as unknown as number[]
        if (
          Array.isArray(persistedSelectionRef.current.inputs[name]) &&
          guessArray.length === 2 &&
          guessArray[0].constructor === Number &&
          guessArray[1].constructor === Number
        ) {
          return guessArray
        }
      }

      return defaultValue
    }

    const initialSelection = getInitialSelection()
    setValueX(initialSelection[0])
    setValueY(initialSelection[1])
  }, [name])

  if (!configuration) return null

  if (type !== 'GeographicLocationWidget') return null

  const inputRefX = useRef<HTMLInputElement>(null)
  const inputRefY = useRef<HTMLInputElement>(null)

  const fieldSetRef = useRef<HTMLFieldSetElement>(null)

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetTitle
          data-stylizable='widget-title'
          htmlFor={name}
          aria-hidden={labelAriaHidden}
        >
          {label}
        </WidgetTitle>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help about ${label}`}
        />
      </WidgetHeader>
      <ReservedSpace data-stylizable='widget geographic-location-widget-input reserved-error-space'>
        {required && valueX?.toString().length === 0 ? (
          <Error>This field is required.</Error>
        ) : null}
      </ReservedSpace>
      <Fieldset name={name} ref={fieldSetRef} disabled={fieldsetDisabled}>
        <Wrapper>
          <Legend>{label}</Legend>
          <div data-stylizable='widget geographic-location-widget-input-widget'>
            <InpustWrapper>
              <InputWrapper>
                <label htmlFor={`${name}[0]`}>{defaultDetails.labelX}</label>
                <input
                  ref={inputRefX}
                  type='number'
                  name={`${name}[0]`}
                  step={defaultDetails.stepX}
                  value={Number(valueX).toString()}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    setValueX(parseFloat(ev.target.value))
                  }}
                  aria-invalid={required && valueX.toString().length === 0}
                />
              </InputWrapper>
              <InputWrapper>
                <label htmlFor={`${name}[1]`}>{defaultDetails.labelY}</label>
                <input
                  ref={inputRefY}
                  type='number'
                  name={`${name}[1]`}
                  step={defaultDetails.stepY}
                  value={Number(valueY).toString()}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    setValueY(parseFloat(ev.target.value))
                  }}
                  aria-invalid={required && valueY.toString().length === 0}
                />
              </InputWrapper>
            </InpustWrapper>
            {defaultDetails?.comment ?? ''}
          </div>
        </Wrapper>
      </Fieldset>
    </Widget>
  )
}

GeographicLocationWidget.displayName = 'DateField'

const InpustWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
`

const InputWrapper = styled.div`
  display: flex;
  flex-flow: column;
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  margin: auto;

  label {
    margin-bottom: 0.5em;
  }

  margin: auto;

  label {
    margin-bottom: 0.5em;
  }

  input {
    all: unset;
    color: #9599a6;
    border: 2px solid #9599a6;
    border-radius: 4px;
    padding: 1em;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[aria-invalid='true'] {
    border: 2px solid #f44336;
  }
`

export { GeographicLocationWidget }
