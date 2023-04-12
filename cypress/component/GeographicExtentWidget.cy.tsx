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

    cy.findByLabelText('North').clear().type('89')
    cy.findByLabelText('West').clear().type('-120')
    cy.findByLabelText('East').clear().type('170')
    cy.findByLabelText('South').clear().type('-89')
  })
})
