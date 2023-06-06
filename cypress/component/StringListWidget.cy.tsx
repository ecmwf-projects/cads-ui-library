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

    cy.findByRole('alert').should(
      'have.text',
      'At least one selection must be made'
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

    cy.findByRole('alert').should('not.exist')
  })

  it('select all / clear all behaviour', () => {
    cy.viewport(400, 1300)

    cy.mount(
      <StringListWidget configuration={getStringListWidgetConfiguration()} />
    )

    cy.findByLabelText('Select all Product type').click()

    cy.findByLabelText('Monthly averaged reanalysis').should(
      'have.attr',
      'aria-checked',
      'true'
    )

    cy.findByLabelText('Monthly averaged reanalysis by hour of day').should(
      'have.attr',
      'aria-checked',
      'true'
    )

    cy.findByLabelText('Select all Product type').should('not.exist')

    cy.findByLabelText('Clear all Product type').click()

    cy.findByLabelText('Monthly averaged reanalysis').should(
      'have.attr',
      'aria-checked',
      'false'
    )

    cy.findByLabelText('Monthly averaged reanalysis by hour of day').should(
      'have.attr',
      'aria-checked',
      'false'
    )

    cy.findByLabelText('Clear all Product type').should('not.exist')

    cy.findByLabelText('Monthly averaged reanalysis').click()
    cy.findByLabelText('Select all Product type')
    cy.findByLabelText('Clear all Product type')
  })
})
