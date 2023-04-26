import React from 'react'
import {
  GeographicExtentWidget,
  StringListArrayWidget,
  StringListWidget,
  StringChoiceWidget,
  TextWidget
} from '../index'

import type { FormConfiguration } from '../types/Form'

/**
 * A widget factory for exclusive group children
 */
type CreateWidget = (
  configuration: FormConfiguration,
  constraints?: string[],
  opts?: {
    /**
     * When true, bypass the required attribute if all options are made unavailable by constraints.
     */
    bypassRequiredForConstraints?: boolean

    /**
     * When true, shows the active selection count for closed accordions.
     */
    renderActiveSelectionsCount?: boolean
  }
) => (...props: any) => JSX.Element | null
const createWidget: CreateWidget = (configuration, constraints, opts) => {
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
          bypassRequiredForConstraints={opts?.bypassRequiredForConstraints}
          renderActiveSelectionsCount={opts?.renderActiveSelectionsCount}
          constraints={constraints}
          {...props}
        />
      )
    case 'StringListWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringListWidget
          configuration={configuration}
          bypassRequiredForConstraints={opts?.bypassRequiredForConstraints}
          constraints={constraints}
          {...props}
        />
      )
    case 'StringChoiceWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <StringChoiceWidget
          configuration={configuration}
          bypassRequiredForConstraints={opts?.bypassRequiredForConstraints}
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
