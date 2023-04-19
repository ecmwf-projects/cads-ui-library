import React, { useRef } from 'react'
import styled from 'styled-components'

import { useEventListener } from 'usehooks-ts'

import { Widget, WidgetHeader, WidgetTitle, Fieldset, Legend } from './Widget'
import { Label, WidgetTooltip } from '../index'

export interface GeographicExtentWidgetConfiguration {
  type: 'GeographicExtentWidget'
  name: string
  label: string
  help?: string | null
  details: {
    extentLabels?: Record<string, string> | null
    range: {
      n: number
      w: number
      e: number
      s: number
      [key: string]: number
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

export interface GeographicExtentWidgetProps {
  configuration: GeographicExtentWidgetConfiguration
  /**
   * Whether the underlying fieldset should be functionally and visually disabled.
   */
  fieldsetDisabled?: boolean
  /**
   * Whether to hide the widget label from ARIA.
   */
  labelAriaHidden?: boolean
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
const GeographicExtentWidget = ({
  configuration,
  fieldsetDisabled,
  labelAriaHidden = true
}: GeographicExtentWidgetProps) => {
  const injectWidgetPayload = (ev: FormDataEvent) => {
    const { formData } = ev
    /**
     * Remove the original keys from the form data object, that is, any n, s, o, w, and replace them with the fieldset name.
     * This is required for the request payload utils to properly assemble the request object.
     */

    for (const extent of Object.keys(getRange())) {
      if (formData.has(extent)) {
        const value = formData.get(extent) as unknown as string
        formData.delete(extent)
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

  const getFields = () => {
    const areas = ['top', 'left', 'right', 'bottom']

    return Object.keys(getRange()).map((key, index) => {
      const k = key as unknown as keyof ReturnType<typeof getRange>

      return (
        <Wrap key={key} area={areas[index]}>
          <Label htmlFor={key}>{getLabel(key)}</Label>
          <input
            type='number'
            name={key}
            id={key}
            defaultValue={getDefault(key)}
          />
        </Wrap>
      )
    })
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
      <Fieldset disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        <Inputs data-stylizable='geographic-extent-widget-grid'>
          {getFields()}
        </Inputs>
      </Fieldset>
    </Widget>
  )
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

export { GeographicExtentWidget }
