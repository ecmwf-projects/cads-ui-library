import React from 'react'
import {
  GeographicExtentWidget,
  StringListArrayWidget,
  StringListWidget,
  StringChoiceWidget,
  TextWidget
} from '../index'

import type { GeographicExtentWidgetConfiguration } from '../widgets/GeographicExtentWidget'
import type { StringListArrayWidgetConfiguration } from '../widgets/StringListArrayWidget'
import type { StringListWidgetConfiguration } from '../widgets/StringListWidget'
import type { StringChoiceWidgetConfiguration } from '../widgets/StringChoiceWidget'
import type { TextWidgetConfiguration } from '../widgets/TextWidget'

/**
 * A widget factory for exclusive group children
 */
type CreateWidget = <TConfiguration extends Record<string | 'type', unknown>>(
  configuration: TConfiguration,
  constraints?: string[]
) => JSX.Element | null
const createWidget: CreateWidget = (configuration, constraints) => {
  switch (configuration.type) {
    case 'GeographicExtentWidget':
      return (
        <GeographicExtentWidget
          configuration={
            configuration as unknown as GeographicExtentWidgetConfiguration
          }
        />
      )
    case 'StringListArrayWidget':
      return (
        <StringListArrayWidget
          configuration={
            configuration as unknown as StringListArrayWidgetConfiguration
          }
          constraints={constraints}
        />
      )
    case 'StringListWidget':
      return (
        <StringListWidget
          configuration={
            configuration as unknown as StringListWidgetConfiguration
          }
          constraints={constraints}
        />
      )
    case 'StringChoiceWidget':
      return (
        <StringChoiceWidget
          configuration={
            configuration as unknown as StringChoiceWidgetConfiguration
          }
          constraints={constraints}
        />
      )
    case 'FreeEditionWidget':
      return (
        <TextWidget
          configuration={configuration as unknown as TextWidgetConfiguration}
        />
      )
    default:
      return null
  }
}

export { createWidget }
