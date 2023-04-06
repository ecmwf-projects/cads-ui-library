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
) => (...props: any) => JSX.Element | null
const createWidget: CreateWidget = (configuration, constraints) => {
  switch (configuration.type) {
    case 'GeographicExtentWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <GeographicExtentWidget
          configuration={
            configuration as unknown as GeographicExtentWidgetConfiguration
          }
          {...props}
        />
      )
    case 'StringListArrayWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringListArrayWidget
          configuration={
            configuration as unknown as StringListArrayWidgetConfiguration
          }
          constraints={constraints}
          {...props}
        />
      )
    case 'StringListWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringListWidget
          configuration={
            configuration as unknown as StringListWidgetConfiguration
          }
          constraints={constraints}
          {...props}
        />
      )
    case 'StringChoiceWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringChoiceWidget
          configuration={
            configuration as unknown as StringChoiceWidgetConfiguration
          }
          constraints={constraints}
          {...props}
        />
      )
    case 'FreeEditionWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <TextWidget
          configuration={configuration as unknown as TextWidgetConfiguration}
          {...props}
        />
      )
    default:
      return _props => null
  }
}

export { createWidget }
