import React from 'react'
import {
  GeographicExtentWidget,
  StringListArrayWidget,
  StringListWidget,
  StringChoiceWidget,
  TextWidget
} from '../index'

import type { FormConfiguration } from '../widgets/ExclusiveGroupWidget'

/**
 * A widget factory for exclusive group children
 */
type CreateWidget = (
  configuration: FormConfiguration,
  constraints?: string[]
) => (...props: any) => JSX.Element | null
const createWidget: CreateWidget = (configuration, constraints) => {
  switch (configuration.type) {
    case 'GeographicExtentWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <GeographicExtentWidget configuration={configuration} {...props} />
      )
    case 'StringListArrayWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringListArrayWidget
          configuration={configuration}
          constraints={constraints}
          {...props}
        />
      )
    case 'StringListWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringListWidget
          configuration={configuration}
          constraints={constraints}
          {...props}
        />
      )
    case 'StringChoiceWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringChoiceWidget
          configuration={configuration}
          constraints={constraints}
          {...props}
        />
      )
    case 'FreeEditionWidget':
      // eslint-disable-next-line react/display-name
      return props => <TextWidget configuration={configuration} {...props} />
    default:
      return _props => null
  }
}

export { createWidget }
