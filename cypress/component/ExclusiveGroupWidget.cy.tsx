import './workaround-cypress-10-0-2-process-issue'

import {
  ExclusiveGroupWidget,
  StringListArrayWidget,
  GeographicExtentWidget,
  TextWidget
} from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import {
  getStringListArrayWidgetConfiguration,
  getGeographicExtentWidgetConfiguration,
  getTextWidgetConfiguration
} from '../../__tests__/factories'

describe('<ExclusiveGroupWidget/>', () => {
  it('renders with GeographicExtentWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Geographical area',
      help: 'Select one choice from the widgets below',
      name: 'area_group',
      required: true,
      children: ['global', 'area'],
      details: {
        default: 'global',
        information:
          'Valid latitude and longitude values are multiples of 0.05 degree.'
      }
    }

    cy.mount(
      <TooltipProvider>
        <ExclusiveGroupWidget
          configuration={configuration}
          childGetter={{
            global: () => (
              <GeographicExtentWidget
                configuration={getGeographicExtentWidgetConfiguration()}
              />
            ),
            area: () => (
              <TextWidget configuration={getTextWidgetConfiguration()} />
            )
          }}
        />
      </TooltipProvider>
    )
  })

  it('renders with StringListArrayWidget and TextWidget', () => {
    cy.viewport(984, 597)
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: 'Select one choice from the widgets below',
      name: 'checkbox_groups',
      required: true,
      children: ['first', 'second'],
      details: {
        default: 'first',
        information: 'Select something ...'
      }
    }
    cy.mount(
      <TooltipProvider>
        <ExclusiveGroupWidget
          configuration={configuration}
          childGetter={{
            first: () => (
              <StringListArrayWidget
                configuration={getStringListArrayWidgetConfiguration()}
              />
            ),
            second: () => (
              <TextWidget configuration={getTextWidgetConfiguration()} />
            )
          }}
        />
      </TooltipProvider>
    )
  })
})
