import React from 'react'

import { GeographicLocationWidget, TooltipProvider } from '../../src'

const Form = ({
  children,
  handleSubmit
}: {
  children: React.ReactNode
  handleSubmit?: (...args: any) => void
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

const Wrapper = ({
  children,
  handleSubmit
}: {
  children: React.ReactNode
  handleSubmit?: (...args: any) => void
}) => {
  return (
    <TooltipProvider>
      <Form>{children}</Form>
    </TooltipProvider>
  )
}

describe('<GeographicLocationWidget />', () => {
  afterEach(() => {
    cy.clearLocalStorage()
  })

  it('renders a GeographicLocationWidget', () => {
    cy.mount(
      <Wrapper>
        <GeographicLocationWidget
          configuration={{
            type: 'GeographicLocationWidget',
            name: 'name',
            label: 'The label',
            required: true,
            details: {},
            help: 'The help'
          }}
        />
      </Wrapper>
    )
  })

  it('can write', () => {
    cy.mount(
      <Wrapper>
        <GeographicLocationWidget
          configuration={{
            type: 'GeographicLocationWidget',
            name: 'dataposition',
            label: 'The label',
            required: true,
            details: {},
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    // Get input with name 'dataposition[0]'
    cy.get('input[name="dataposition[0]"]').type('1')
    cy.get('input[name="dataposition[0]"]').should('have.value', '1')

    // Get input with name 'dataposition[1]'
    cy.get('input[name="dataposition[1]"]').type('2')
    cy.get('input[name="dataposition[1]"]').should('have.value', '2')
  })

  /*
   * hydration tests
   */

  it('hydrates its selection (string)', () => {
    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: { dataposition: [10, 20] }
      })
    )

    cy.mount(
      <Wrapper>
        <GeographicLocationWidget
          configuration={{
            type: 'GeographicLocationWidget',
            name: 'dataposition',
            label: 'The label',
            required: true,
            details: {},
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input[name="dataposition[0]"]').should('have.value', '10')
    cy.get('input[name="dataposition[1]"]').should('have.value', '20')
  })

  /*
   * Test to prevent setting values outside of the range
   *  < -180 or > 180 for X
   * < -90 or > 90 for Y
   */

  /*
   * Test to prevent setting values outside the custom range
   */
})
