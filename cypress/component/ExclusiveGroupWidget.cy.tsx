import './workaround-cypress-10-0-2-process-issue'

import { ExclusiveGroupWidget } from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

describe('<ExclusiveGroupWidget/>', () => {
  it('renders', () => {
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
        <ExclusiveGroupWidget configuration={configuration} />
      </TooltipProvider>
    )
  })
})
