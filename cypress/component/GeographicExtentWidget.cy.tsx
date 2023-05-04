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

  it('WIP: applies validation', () => {
    const register = (name: string, rules: Record<string, any>) => {
      return rules
    }

    cy.mount(
      <TooltipProvider>
        <GeographicExtentWidget
          configuration={getGeographicExtentWidgetConfiguration()}
          validators={{
            n: () => register('n', { pattern: /\d{4}/, required: true }),
            s: () =>
              register('n', {
                pattern: /\d{1}/,
                required: true,
                maxlength: 33
              }),
            w: () =>
              register('n', {
                pattern: /\d{1}/,
                required: true,
                maxlength: 33
              }),
            e: () =>
              register('n', { pattern: /\d{1}/, required: true, maxlength: 33 })
          }}
        />
      </TooltipProvider>
    )

    cy.findByLabelText('North').should('have.attr', 'required')
    cy.findByLabelText('North').should('have.attr', 'pattern')

    cy.findByLabelText('South').should('have.attr', 'required')
    cy.findByLabelText('South').should('have.attr', 'pattern')
    cy.findByLabelText('South').should('have.attr', 'maxlength', '33')
  })
})
