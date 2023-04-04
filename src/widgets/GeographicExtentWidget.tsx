import React from 'react'
import styled from 'styled-components'

import {
  Widget,
  WidgetHeader,
  WidgetTitle,
  Fieldset,
  Input,
  Legend
} from './Widget'
import { Label, WidgetTooltip } from '../index'

export interface GeographicExtentWidgetConfiguration {
  type: 'GeographicExtentWidget'
  name: string
  label: string
  help?: string | null
  details: {
    extentLabels?: Record<string, string> | null
    range: {
      e: number
      n: number
      s: number
      w: number
    }
    default?: {
      e: number
      n: number
      s: number
      w: number
    }
  }
}

export interface GeographicExtentWidgetProps {
  configuration: GeographicExtentWidgetConfiguration
}

/**
 * GeographicExtentWidget: select a geographic area by specifying a bounding box with North, West, South and East coordinates.
 */
const GeographicExtentWidget = ({
  configuration
}: GeographicExtentWidgetProps) => {
  if (!configuration) return null

  const { type, name, label, help, details } = configuration

  if (type !== 'GeographicExtentWidget') return null

  const getRange = () => {
    return details.range
  }

  const getDefault = () => {
    return details.default
  }

  const getFields = () => {
    const defaultMapping = {
      e: 'East',
      n: 'North',
      s: 'South',
      w: 'West'
    }

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
    <Widget>
      <WidgetHeader>
        <WidgetTitle htmlFor={name}>{label}</WidgetTitle>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help about ${label}`}
        />
      </WidgetHeader>
      <Fieldset>
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
    'n n n'
    'w w e'
    's s s';

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
    border: 2px solid #9599a6;
    border-radius: 4px;
    max-width: 100px;
    padding: 1em;
  }
`

export { GeographicExtentWidget }
