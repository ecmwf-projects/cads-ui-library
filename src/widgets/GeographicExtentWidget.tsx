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

import { useReadOnlyPersistedSelection } from '../utils'

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
    string,
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
  const { type, name, label, help, details } = configuration

  /**
   * The default payload order expected by the adaptor is: North, West, South, East.
   * We might make this configurable in the near future.
   */
  const defaultOrder = [`${name}_n`, `${name}_w`, `${name}_s`, `${name}_e`]

  const selection = useReadOnlyPersistedSelection(name)

  const injectWidgetPayload = (ev: FormDataEvent) => {
    const { formData } = ev

    /**
     * Remove the original keys from the form data object, and replace them with the fieldset name.
     * This is required for the request payload utils to properly assemble the request object.
     */

    for (const field of defaultOrder) {
      if (formData.has(field)) {
        const value = formData.get(field) as unknown as string
        formData.delete(field)
        formData.append(name, value)
      }
    }
  }

  useEventListener('formdata', injectWidgetPayload)

  if (type !== 'GeographicExtentWidget') return null

  const getRange = () => {
    return details.range
  }

  const getLabel = (key: string) => {
    if (!details.extentLabels) return defaultMapping[key]
    return details.extentLabels[key]
  }

  const getDefaultValue = <TSelection extends string[] | null>(
    selection: TSelection,
    defaultValueIndex: number,
    key: string
  ) => {
    if (!selection && !details.default) return ''
    if (!selection && details.default) return details.default[key]
    if (!selection) return ''
    return selection[defaultValueIndex]
  }

  const getFields = (errors: GeographicExtentWidgetProps['errors'] = {}) => {
    const areas = ['top', 'left', 'right', 'bottom']

    return ['n', 'w', 'e', 's'].map((key, index) => {
      const _name = `${name}_${key}`

      const validator = validators ? validators[key] : null

      const isInvalid = _name in errors

      const defaultValueIndex = defaultOrder.findIndex(item => item === _name)

      return (
        <Wrap key={key} area={areas[index]}>
          <Label htmlFor={_name}>{getLabel(key)}</Label>
          <input
            type='text'
            name={_name}
            id={_name}
            defaultValue={getDefaultValue(selection, defaultValueIndex, key)}
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

    const ownFields = Object.keys(getRange()).map(key => `${name}_${key}`)

    const { error } = Object.keys(errors).reduce<{ error: string | null }>(
      (acc, key) => {
        if (ownFields.includes(key)) {
          acc['error'] = errors[key].message || null
          return acc
        }

        return acc
      },
      { error: null }
    )

    return error ? <Error>{error}</Error> : null
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
  fieldName,
  value,
  range
}: {
  name: string
  fieldName: string
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

  if (`${name}_n` === fieldName) {
    const _value = Number(value)

    if (_value > _range[`${name}_n`]) return false

    if (_value < _range[`${name}_s`]) return false
  }

  if (`${name}_s` === fieldName) {
    const _value = Number(value)

    if (_value >= _range[`${name}_n`]) return false

    if (_value < _range[`${name}_s`]) return false
  }

  if (`${name}_w` === fieldName) {
    const _value = Number(value)

    if (_value > _range[`${name}_e`]) return false

    if (_value < _range[`${name}_w`]) return false
  }

  if (`${name}_e` === fieldName) {
    const _value = Number(value)

    if (_value < _range[`${name}_w`]) return false

    if (_value > _range[`${name}_e`]) return false
  }

  return true
}

const isWestLessThanEast = ({
  name,
  fieldName,
  fields,
  value
}: {
  name: string
  fieldName: string
  fields: Record<string, string>
  value: string
}) => {
  if (`${name}_e` === fieldName) {
    const _value = Number(value)

    if (_value <= Number(fields[`${name}_w`])) {
      return false
    }
  }

  if (`${name}_w` === fieldName) {
    const _value = Number(value)

    if (_value >= Number(fields[`${name}_e`])) {
      return false
    }
  }

  return true
}

const isSouthLessThanNorth = ({
  name,
  fieldName,
  fields,
  value
}: {
  name: string
  fieldName: string
  fields: Record<string, string>
  value: string
}) => {
  if (`${name}_n` === fieldName) {
    const _value = Number(value)
    if (_value <= Number(fields[`${name}_s`])) {
      return false
    }
  }

  if (`${name}_s` === fieldName) {
    const _value = Number(value)
    if (_value >= Number(fields[`${name}_n`])) {
      return false
    }
  }

  return true
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
export { isWithinRange, isWestLessThanEast, isSouthLessThanNorth }
