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
          <div key={k}>
            <Label htmlFor={k}>{defaultMapping[k]}</Label>
            <input type='text' name={k} id={k} />
          </div>
        )
      })

    return Object.entries(details.extentLabels).map(([key, label]) => {
      return (
        <div key={key}>
          <Label htmlFor={key}>{label}</Label>
          <input type='text' name={key} id={key} />
        </div>
      )
    })
  }

  return (
    <Widget id={name}>
      <WidgetHeader>
        <WidgetTitle>{label}</WidgetTitle>
        <WidgetTooltip
          helpText={help || null}
          triggerAriaLabel={`Get help about ${label}`}
        />
      </WidgetHeader>
      <Fieldset>
        <Legend>{label}</Legend>
        {getFields()}
      </Fieldset>
    </Widget>
  )
}

export { GeographicExtentWidget }
