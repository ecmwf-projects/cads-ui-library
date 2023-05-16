import React from 'react'
import styled from 'styled-components'

import { useEventListener } from 'usehooks-ts'

import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  Fieldset,
  Legend,
  ReservedSpace,
  Error
} from './Widget'
import { Label, WidgetTooltip } from '../index'

export interface GeographicExtentWidgetConfiguration {
  type: 'GeographicExtentWidget'
  name: string
  label: string
  help?: string | null
  details: {
    extentLabels?: Record<string, string> | null
    precision: number
    range: {
      n: number
      w: number
      e: number
      s: number
    }
    default?: {
      n: number
      w: number
      e: number
      s: number
      [key: string]: number
    }
  }
}

export interface GeographicExtentWidgetProps<
  TErrors = Record<string, { message?: string }>
> {
  configuration: GeographicExtentWidgetConfiguration
  /**
   * Whether the underlying fieldset should be functionally and visually disabled.
   */
  fieldsetDisabled?: boolean
  /**
   * Whether to hide the widget label from ARIA.
   */
  labelAriaHidden?: boolean

  /**
   * An object of key/validator pairs to apply to each input.
   * Each validator gets passed the widget configuration, and the internal name of the field.
   */
  validators?: Record<
    keyof GeographicExtentWidgetConfiguration['details']['range'],
    (
      internalName: string,
      configuration: GeographicExtentWidgetConfiguration
    ) => any
  >

  /**
   * An object of field errors.
   */
  errors?: TErrors
}

/**
 * A default mapping to use in case the configuration is missing a default extentLabels.
 */
const defaultMapping: Record<string, string> = {
  n: 'North',
  w: 'West',
  e: 'East',
  s: 'South'
}

/**
 * GeographicExtentWidget: select a geographic area by specifying a bounding box with North, West, South and East coordinates.
 */
const GeographicExtentWidget = <TErrors,>({
  configuration,
  fieldsetDisabled,
  labelAriaHidden = true,
  validators,
  errors
}: GeographicExtentWidgetProps<TErrors>) => {
  const injectWidgetPayload = (ev: FormDataEvent) => {
    const { formData } = ev
    /**
     * Remove the original keys from the form data object, and replace them with the fieldset name.
     * This is required for the request payload utils to properly assemble the request object.
     */

    for (const extent of Object.keys(getRange())) {
      const _name = `${name}_${extent}`

      if (formData.has(_name)) {
        const value = formData.get(_name) as unknown as string
        formData.delete(_name)
        formData.append(name, value)
      }
    }
  }

  useEventListener('formdata', injectWidgetPayload)

  if (!configuration) return null

  const { type, name, label, help, details } = configuration

  if (type !== 'GeographicExtentWidget') return null

  const getDefault = (key: string) => {
    if (!details.default) return ''
    return details.default[key]
  }

  const getRange = () => {
    return details.range
  }

  const getLabel = (key: string) => {
    if (!details.extentLabels) return defaultMapping[key]
    return details.extentLabels[key]
  }

  const getFields = (errors: GeographicExtentWidgetProps['errors'] = {}) => {
    const areas = ['top', 'left', 'right', 'bottom']

    return Object.keys(getRange()).map((key, index) => {
      const k = key as unknown as keyof ReturnType<typeof getRange>

      const _name = `${name}_${key}`

      const validator = validators ? validators[k] : null

      const isInvalid = _name in errors

      return (
        <Wrap key={key} area={areas[index]}>
          <Label htmlFor={_name}>{getLabel(key)}</Label>
          <input
            type='text'
            name={_name}
            id={_name}
            defaultValue={getDefault(key)}
            aria-invalid={isInvalid ? 'true' : 'false'}
            {...(typeof validator === 'function'
              ? validator(_name, configuration)
              : {})}
          />
        </Wrap>
      )
    })
  }

  const getOwnErrors = (
    errors: GeographicExtentWidgetProps['errors'],
    range: GeographicExtentWidgetConfiguration['details']['range']
  ) => {
    if (!errors) return null

    const { error } = Object.keys(range).reduce(
      (acc, key) => {
        const _name = `${name}_${key}`
        if (_name in errors) {
          acc['error'] = 'Please select coordinates within range'

          return acc
        }
        return acc
      },
      { error: '' }
    )

    return <Error>{error}</Error>
  }

  return (
    <Widget data-stylizable='widget geographic-extent-widget'>
      <WidgetHeader>
        <WidgetTitle
          htmlFor={name}
          data-stylizable='widget-title'
          aria-hidden={labelAriaHidden}
        >
          {label}
        </WidgetTitle>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help about ${label}`}
        />
      </WidgetHeader>
      <Fieldset name={name} disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        <Inputs data-stylizable='geographic-extent-widget-grid'>
          {getFields(errors || {})}
        </Inputs>
        <ReservedErrorSpace data-stylizable='widget geographic-extent reserved-error-space'>
          {getOwnErrors(errors || {}, getRange())}
        </ReservedErrorSpace>
      </Fieldset>
    </Widget>
  )
}

const isWithinRange = ({
  name,
  field: _field,
  fields: _fields,
  value: _value,
  range
}: {
  name: string
  field: string
  fields: Record<string, string>
  value: string
  range: GeographicExtentWidgetConfiguration['details']['range']
}) => {
  const { n, s, w, e } = range
  const _range = {
    [`${name}_n`]: n,
    [`${name}_w`]: w,
    [`${name}_e`]: e,
    [`${name}_s`]: s
  }

  return false
}

const Inputs = styled.div`
  display: grid;

  column-gap: 4.375em;
  row-gap: 1em;
  grid-template-areas:
    'top top top top'
    'left left right right'
    'bottom bottom bottom bottom';

  @media (min-width: 984px) {
    column-gap: 9.375em;
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

const Wrap = styled.div<{ area: string }>`
  display: flex;
  flex-flow: column;
  grid-area: ${({ area }) => area};
  margin: auto;

  label {
    margin-bottom: 0.5em;
  }

  input {
    all: unset;
    color: #9599a6;
    border: 2px solid #9599a6;
    border-radius: 4px;
    max-width: 100px;
    padding: 1em;
  }
`

const ReservedErrorSpace = styled(ReservedSpace)`
  margin-bottom: unset;
  margin-top: 2em;
`

export { GeographicExtentWidget }
export { isWithinRange }
