import { GeographicExtentWidget } from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { getGeographicExtentWidgetConfiguration } from '../../__tests__/factories'

describe('<GeographicExtentWidget/>', () => {
  it('renders', () => {
    cy.mount(
      <TooltipProvider>
        <GeographicExtentWidget
          configuration={getGeographicExtentWidgetConfiguration()}
        />
      </TooltipProvider>
    )

    cy.findByLabelText('North').type('89')
    cy.findByLabelText('West').type('-120')
    cy.findByLabelText('East').type('170')
    cy.findByLabelText('South').type('-89')
  })
})
