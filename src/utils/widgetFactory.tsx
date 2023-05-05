import React from 'react'
import {
  GeographicExtentWidget,
  StringListArrayWidget,
  StringListWidget,
  StringChoiceWidget,
  TextWidget
} from '../index'

import type { FormConfiguration } from '../types/Form'
import type { GeographicExtentWidgetProps } from '../widgets/GeographicExtentWidget'

export type CreateWidgetOpts = {
  /**
   * When true, bypass the required attribute if all options are made unavailable by constraints.
   */
  bypassRequiredForConstraints?: boolean

  /**
   * When true, shows the active selection count for closed accordions.
   */
  renderActiveSelectionsCount?: boolean

  /**
   * An object of key/validator pairs to apply to each child.
   */
  validators?: {
    geographicExtentWidgetValidators?: GeographicExtentWidgetProps['validators']
  }
}
/**
 * A widget factory for exclusive group children.
 */
type CreateWidget = (
  configuration: FormConfiguration,
  constraints?: string[],
  opts?: CreateWidgetOpts
) => (...props: any) => JSX.Element | null
const createWidget: CreateWidget = (configuration, constraints, opts) => {
  switch (configuration.type) {
    case 'GeographicExtentWidget':
      // eslint-disable-next-line react/display-name
      return props => (
        <GeographicExtentWidget
          configuration={configuration}
          validators={opts?.validators?.geographicExtentWidgetValidators}
          {...props}
        />
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
