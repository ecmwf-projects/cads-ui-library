import React from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { WidgetTooltip } from '../../src'

describe('<WidgetTooltip/>', () => {
  it('should not submit the parent form', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <form
        onSubmit={ev => {
          ev.preventDefault()
          stubbedHandleSubmit()
        }}
      >
        <TooltipProvider>
          <WidgetTooltip helpText='the help text' triggerAriaLabel='get help' />
        </TooltipProvider>
      </form>
    )

    cy.findByLabelText('get help').click()

    cy.get('@stubbedHandleSubmit').should('not.have.been.called')
  })
})
