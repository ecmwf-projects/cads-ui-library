import React from 'react'

import { StringListWidget } from '../../src'

import { getStringListWidgetConfiguration } from '../../__tests__/factories'

const Form = ({
  children,
  handleSubmit
}: {
  children: React.ReactNode
  handleSubmit: (...args: any) => void
}) => {
  return (
    <form
      onSubmit={ev => {
        ev.preventDefault()
        const formData = new FormData(ev.currentTarget)
        handleSubmit([...formData.entries()])
      }}
    >
      {children}
      <button>submit</button>
    </form>
  )
}

describe('<StringListWidget/>', () => {
  it('handles selection', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringListWidget configuration={getStringListWidgetConfiguration()} />
      </Form>
    )

    cy.findByLabelText('Monthly averaged reanalysis').click()

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['product_type', 'monthly_averaged_reanalysis']
    ])
  })

  it('bypasses the required attribute if all options are made unavailable by constraints', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringListWidget
          configuration={getStringListWidgetConfiguration()}
          bypassRequiredForConstraints={true}
          constraints={[]}
        />
      </Form>
    )

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['bypassRequired', 'product_type']
    ])

    cy.findByText(/at least one selection must be made/i).should('not.exist')
  })
})
