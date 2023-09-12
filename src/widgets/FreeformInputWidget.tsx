/* istanbul ignore file */
/* See cypress/component/FreeformInputWidget.cy.tsx */
import React, { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import {
  Fieldset,
  Legend,
  Error,
  ReservedSpace,
  Widget,
  WidgetHeader,
  WidgetTitle
} from './Widget'
import { useBypassRequired } from '../utils'
import { WidgetTooltip } from '..'

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
  if (!configuration) return null

  const { type, help, label, name, required } = configuration

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
      <Fieldset name={name} ref={fieldSetRef} disabled={fieldsetDisabled}>
        <Wrapper>
          <Legend>{label}</Legend>
          <div data-stylizable='widget freeform-input-widget-input'>
            <input
              ref={inputRef}
              type={inputType}
              name={name}
              defaultValue={defaultValue}
              {...otherProps}
            />
            {comment ?? ''}
          </div>
        </Wrapper>
      </Fieldset>
    </Widget>
  )
}

const useInputType = (dtype: string) => {
  return useMemo(() => {
    if (dtype === 'float' || dtype === 'int') {
      return {
        inputType: 'number',
        otherProps: {
          step: dtype === 'float' ? '' : '1'
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
