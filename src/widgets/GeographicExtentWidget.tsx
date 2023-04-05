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
    }
    default?: {
      n: number
      w: number
      e: number
      s: number
    }
  }
}

export interface GeographicExtentWidgetProps {
  configuration: GeographicExtentWidgetConfiguration
  /**
   * Whether the underlying fieldset should be functionally and visually disabled.
   */
  fieldsetDisabled?: boolean
}

/**
 * A default mapping to use in case the configuration is missing a default extentLabels.
 */
const defaultMapping = {
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
  fieldsetDisabled
}: GeographicExtentWidgetProps) => {
  const fieldSetRef = useRef<HTMLFieldSetElement>(null)

  const getRange = () => {
    return details.range
  }

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

  useEventListener('formdata', injectWidgetPayload, fieldSetRef)

  if (!configuration) return null

  const { type, name, label, help, details } = configuration

  if (type !== 'GeographicExtentWidget') return null

  const getDefault = () => {
    return details.default
  }

  const getFields = () => {
    if (!details.extentLabels)
      return Object.keys(getRange()).map(key => {
        const k = key as unknown as keyof ReturnType<typeof getRange>

        return (
          <Wrap key={key} area={key}>
            <Label htmlFor={k}>{defaultMapping[k]}</Label>
            <input type='text' name={k} id={k} />
          </Wrap>
        )
      })

    return Object.entries(details.extentLabels).map(([key, label]) => {
      return (
        <Wrap key={key} area={key}>
          <Label htmlFor={key}>{label}</Label>
          <input type='text' name={key} id={key} />
        </Wrap>
      )
    })
  }

  return (
    <Widget data-stylizable='widget geographic-extent-widget'>
      <WidgetHeader>
        <WidgetTitle htmlFor={name}>{label}</WidgetTitle>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help about ${label}`}
        />
      </WidgetHeader>
      <Fieldset disabled={fieldsetDisabled}>
        <Legend>{label}</Legend>
        <Inputs>{getFields()}</Inputs>
      </Fieldset>
    </Widget>
  )
}

const Inputs = styled.div`
  display: grid;
  grid-template-columns: repeat(4);
  grid-template-rows: repeat(3);
  column-gap: 4.375em;
  row-gap: 1em;
  grid-template-areas:
    'n n n n'
    'w w e e'
    's s s s';

  @media (min-width: 984px) {
    column-gap: 9.375em;
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