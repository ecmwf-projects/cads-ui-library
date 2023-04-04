import { GeographicExtentWidget } from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

describe('<GeographicExtentWidget/>', () => {
  it('renders', () => {
    const configuration = {
      type: 'GeographicExtentWidget' as const,
      label: 'Area',
      name: 'area_group',
      help: 'Select a sub-region of the available area by providing its latitude and longitude',
      details: {
        extentLabels: {
          n: 'North',
          w: 'West',
          e: 'East',
          s: 'South'
        },
        range: {
          e: 180,
          n: 90,
          s: -90,
          w: -180
        },
        default: {
          e: 180,
          n: 90,
          s: -90,
          w: -180
        }
      }
    }

    cy.mount(
      <TooltipProvider>
        <GeographicExtentWidget configuration={configuration} />
      </TooltipProvider>
    )

    cy.findByLabelText('North').type('89')
    cy.findByLabelText('West').type('-120')
    cy.findByLabelText('East').type('170')
    cy.findByLabelText('South').type('-89')
  })
})
