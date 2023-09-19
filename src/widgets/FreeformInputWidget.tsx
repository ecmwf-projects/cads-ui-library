/* istanbul ignore file */
/* See cypress/component/FreeformInputWidget.cy.tsx */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  Fieldset,
  Legend,
  ReservedSpace,
  Widget,
  WidgetHeader,
  WidgetTitle,
  Error
} from './Widget'
import { useBypassRequired } from '../utils'
import { WidgetTooltip } from '..'
import { useReadLocalStorage } from 'usehooks-ts'

interface FreeformInputWidgetDetailsCommon {
  comment?: string
}

interface FreeformInputWidgetDetailsFloat {
  dtype: 'float'
  default?: number
}

interface FreeformInputWidgetDetailsInteger {
  dtype: 'int'
  default?: number
}

interface FreeformInputWidgetDetailsString {
  dtype: 'string'
  default?: string
}

export type FreeformInputWidgetDetails = FreeformInputWidgetDetailsCommon &
  (
    | FreeformInputWidgetDetailsFloat
    | FreeformInputWidgetDetailsInteger
    | FreeformInputWidgetDetailsString
  )

export interface FreeformInputWidgetConfiguration {
  type: 'FreeformInputWidget'
  name: string
  label: string
  help?: string | null
  required: boolean
  details: FreeformInputWidgetDetails
}

interface FreeformInputWidgetProps {
  configuration: FreeformInputWidgetConfiguration
  /**
   * Permitted selections for the widget.
   */
  constraints?: string[]
  /**
   * Whether the underlying fieldset should be functionally and visually disabled.
   */
  fieldsetDisabled?: boolean
  /**
   * Whether to hide the widget label from ARIA.
   */
  labelAriaHidden?: boolean
  /**
   * When true, bypass the required attribute if all options are made unavailable by constraints.
   */
  bypassRequiredForConstraints?: boolean
}

const FreeformInputWidget = ({
  configuration,
  labelAriaHidden = true,
  constraints,
  fieldsetDisabled,
  bypassRequiredForConstraints
}: FreeformInputWidgetProps) => {
  const [value, setValue] = useState<string>()

  const persistedSelection = useReadLocalStorage<{
    dataset: { id: string }
    inputs: { [k: string]: string | number }
  }>('formSelection')

  const { type, help, label, name, required, details } = configuration

  /**
   * Cache persisted selection, so we don't need to pass it as an effect dependency.
   */
  const persistedSelectionRef = useRef(persistedSelection)

  useEffect(() => {
    const getInitialSelection = (): string => {
      if (
        persistedSelectionRef.current &&
        'inputs' in persistedSelectionRef.current
      ) {
        if (
          typeof persistedSelectionRef.current.inputs[name] === 'string' &&
          details.dtype === 'string'
        ) {
          return persistedSelectionRef.current.inputs[name] as string
        } else if (
          typeof persistedSelectionRef.current.inputs[name] === 'number' &&
          (details.dtype === 'float' || details.dtype === 'int')
        ) {
          return persistedSelectionRef.current.inputs[name].toString()
        }
      }

      return (details?.default ?? '').toString()
    }

    setValue(getInitialSelection())
  }, [name, details])

  if (!configuration) return null

  if (type !== 'FreeformInputWidget') return null

  const inputRef = useRef<HTMLInputElement>(null)
  const fieldSetRef = useRef<HTMLFieldSetElement>(null)

  const bypassed = useBypassRequired(
    fieldSetRef,
    bypassRequiredForConstraints,
    constraints
  )

  const {
    dtype,
    default: defaultValue,
    comment
  } = configuration.details as FreeformInputWidgetDetails

  const { inputType, otherProps } = useInputType(dtype)

  const initialValue = value ?? defaultValue ?? ''

  return (
    <Widget data-stylizable='widget freeform-input-widget'>
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
      <ReservedSpace data-stylizable='widget freeform-input reserved-error-space'>
        {!bypassed && required && value?.length ? (
          <Error>The field is required.</Error>
        ) : null}
      </ReservedSpace>
      <Fieldset name={name} ref={fieldSetRef} disabled={fieldsetDisabled}>
        <Wrapper>
          <Legend>{label}</Legend>
          <div data-stylizable='widget freeform-input-widget-input'>
            <input
              ref={inputRef}
              type={inputType}
              name={name}
              defaultValue={initialValue}
              {...otherProps}
            />
            {comment ?? ''}
          </div>
        </Wrapper>
      </Fieldset>
    </Widget>
  )
}

/**
 * Prevents some keys from being entered into an input of type integer, so no dot, comma, etc.
 * Only allowed:
 * + / - / e
 * @param ev The keydown event.
 */
const ALLOWED_KEYS = [
  'e',
  'E',
  '+',
  '-',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Backspace',
  'Delete',
  'Tab',
  'Enter'
]

/**
 * Prevents some keys from being entered into an input of type float, so only integer like, comma and dot.
 */
const ALLOWED_FLOAT_KEYS = [',', '.']

/**
 * This method is used to check whether a key is a digit.
 * @param value The value to check.
 * @returns Whether the value is a digit.
 */
const isDigitKey = (value: string) => {
  return value >= '0' && value <= '9'
}

/**
 * @param value The value to check.
 * @returns Whether the value is an integer.
 */
const isInteger = (value: string) =>
  isDigitKey(value) || ALLOWED_KEYS.includes(value)

/**
 * @param value The value to check.
 * @returns Whether the value is a float.
 */
const isFloat = (value: string) =>
  isDigitKey(value) ||
  ALLOWED_KEYS.includes(value) ||
  ALLOWED_FLOAT_KEYS.includes(value)

/**
 * A wrapper around keyDownHandler that takes a function that returns a boolean.
 * @param func The function to call.
 * @returns A function that takes a keydown event and calls func with the key. If func returns true, the event is not prevented.
 */
const keyDownHandler =
  (func: (value: string) => boolean) =>
  (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (func(ev.key)) {
      return
    }
    ev.preventDefault()
    ev.stopPropagation()
  }

const useInputType = (dtype: string) => {
  return useMemo(() => {
    if (dtype === 'float' || dtype === 'int') {
      const typeFloat = dtype === 'float'

      return {
        inputType: 'number',
        otherProps: {
          step: typeFloat ? undefined : '1',
          onKeyDown: typeFloat
            ? keyDownHandler(isFloat)
            : keyDownHandler(isInteger)
        }
      }
    }
    return {
      inputType: 'text',
      otherProps: {}
    }
  }, [dtype])
}

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  margin: auto;

  label {
    margin-bottom: 0.5em;
  }

  input {
    all: unset;
    color: #9599a6;
    border: 2px solid #9599a6;
    border-radius: 4px;
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

export { FreeformInputWidget }
export { isDigitKey, isInteger, isFloat, keyDownHandler }
