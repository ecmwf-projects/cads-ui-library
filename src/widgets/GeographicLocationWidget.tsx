/* istanbul ignore file */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useBypassRequired } from '../utils'

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
  fieldsetDisabled?: boolean
  labelAriaHidden?: boolean
}

const GeographicLocationWidget = ({
  configuration,
  bypassRequiredForConstraints,
  constraints,
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

  const [valueX, setValueX] = useState<string>(defaultValue[0].toString())
  const [valueY, setValueY] = useState<string>(defaultValue[1].toString())

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

      setValueX(defaultValue[0].toString())
      setValueY(defaultValue[1].toString())
    },
    documentRef
  )

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string | number }
  }>('formSelection')

  const fieldSetRef = useRef<HTMLFieldSetElement>(null)

  const bypassed = useBypassRequired(
    fieldSetRef,
    bypassRequiredForConstraints,
    constraints
  )

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
    setValueX(initialSelection[0].toString())
    setValueY(initialSelection[1].toString())
  }, [name])

  const sanitize = (value: string): string => {
    if (value !== undefined && value !== null) {
      // Check if starts with a zero
      if (value.startsWith('0') && value.length > 1) {
        // Remove the leading zero
        return value.replace(/^0+/, '')
      }
    }
    return value
  }

  /*
   * X/Y constraints.
   */
  const [hasError, errorMessage, errorFields] = useMemo(() => {
    if (bypassed) {
      return [false, '', []]
    }

    if (!required) {
      return [false, '', []]
    }

    if (!valueX || !valueY) {
      return [true, 'This field is required.', ['x', 'y']]
    }

    // Check if the value is a number
    if (isNaN(Number(valueX)) || isNaN(Number(valueY))) {
      return [true, 'This field must be a number.', ['x', 'y']]
    }

    // Parse the value to a number
    const nValueX = Number(valueX)
    const nValueY = Number(valueY)

    const cummulative: [boolean, string, ('x' | 'y')[]] = [false, '', []]

    if (nValueX < defaultDetails.minX) {
      cummulative[0] = true || cummulative[0]
      cummulative[1] = `${defaultDetails.labelX} must be greater than ${defaultDetails.minX}.`
      cummulative[2].push('x')
    }

    if (nValueX > defaultDetails.maxX) {
      cummulative[0] = true || cummulative[0]
      cummulative[1] = `${defaultDetails.labelX} must be less than ${defaultDetails.maxX}.\n${cummulative[1]}`
      cummulative[2].push('x')
    }

    if (nValueY < defaultDetails.minY) {
      cummulative[0] = true || cummulative[0]
      cummulative[1] = `${defaultDetails.labelY} must be greater than ${defaultDetails.minY}.\n${cummulative[1]}`
      cummulative[2].push('y')
    }

    if (nValueY > defaultDetails.maxY) {
      cummulative[0] = true || cummulative[0]
      cummulative[1] = `${defaultDetails.labelY} must be less than ${defaultDetails.maxY}.\n${cummulative[1]}`
      cummulative[2].push('y')
    }

    return cummulative
  }, [bypassed, valueX, valueY])

  if (!configuration) return null

  if (type !== 'GeographicLocationWidget') return null

  const inputRefX = useRef<HTMLInputElement>(null)
  const inputRefY = useRef<HTMLInputElement>(null)

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
        {hasError ? <Error>{errorMessage}</Error> : null}
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
                  value={valueX}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    setValueX(sanitize(ev.target.value))
                  }}
                  aria-invalid={errorFields.includes('x')}
                />
              </InputWrapper>
              <InputWrapper>
                <label htmlFor={`${name}[1]`}>{defaultDetails.labelY}</label>
                <input
                  ref={inputRefY}
                  type='number'
                  name={`${name}[1]`}
                  step={defaultDetails.stepY}
                  value={valueY}
                  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    setValueY(sanitize(ev.target.value))
                  }}
                  aria-invalid={errorFields.includes('y')}
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
