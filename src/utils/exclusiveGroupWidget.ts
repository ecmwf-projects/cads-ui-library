import type { FormConfiguration } from '../types/Form'
import type { ExclusiveGroupWidgetConfiguration } from '../widgets/ExclusiveGroupWidget'

/**
 * ExclusiveGroupWidget utils.
 */
type IsChildOfExclusiveGroup = (
  widgetConfiguration: Exclude<
    FormConfiguration,
    ExclusiveGroupWidgetConfiguration
  >,
  formConfiguration: FormConfiguration[]
) => boolean
const isChildOfExclusiveGroup: IsChildOfExclusiveGroup = (
  widgetConfiguration,
  formConfiguration
) => {
  if (
    formConfiguration.find(configuration => {
      if (!Object.hasOwn(configuration, 'children')) return

      return (
        configuration.type === 'ExclusiveGroupWidget' &&
        configuration.children.includes(widgetConfiguration.name)
      )
    })
  ) {
    return true
  }

  return false
}

export { isChildOfExclusiveGroup }
