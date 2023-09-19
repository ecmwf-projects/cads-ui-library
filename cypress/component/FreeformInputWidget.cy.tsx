import React from 'react'

import { FreeformInputWidget, TooltipProvider } from '../../src'

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

describe('<FreeformInputWidget />', () => {
  afterEach(() => {
    cy.clearLocalStorage()
  })

  it('renders a FreeformInputWidget', () => {
    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'name',
            label: 'The label',
            required: true,
            details: {
              dtype: 'string'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )
  })

  it('can write a string', () => {
    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'string'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').type('a value')
    cy.get('input').should('have.value', 'a value')
  })

  it('can write a float', () => {
    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'float'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').type('a value')
    cy.get('input').should('have.value', '')

    cy.get('input').clear().type('3.14')
    cy.get('input').should('have.value', '3.14')

    cy.get('input').clear().type('3.14e-2')
    cy.get('input').should('have.value', '3.14e-2')
  })

  it('can write an integer', () => {
    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'int'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').type('a value')
    cy.get('input').should('have.value', '')

    cy.get('input').clear().type('3.14')
    cy.get('input').should('have.value', '314')

    cy.get('input').clear().type('3e10')
    cy.get('input').should('have.value', '3e10')

    cy.get('input').clear().type('2')
    cy.get('input').should('have.value', '2')

    /* Check with Up/Down arrows */
    cy.get('input').clear().type('2')
    cy.get('input').should('have.value', '2')
    cy.get('input').type('{uparrow}')
    cy.get('input').should('have.value', '3')
    cy.get('input').type('{downarrow}')
    cy.get('input').type('{downarrow}')
    cy.get('input').should('have.value', '1')
  })

  it('can write a string', () => {
    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'string'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').type('a value')
    cy.get('input').should('have.value', 'a value')

    /* Check with Up/Down arrows */
    cy.get('input').clear().type('a value')
    cy.get('input').should('have.value', 'a value')
    cy.get('input').type('{uparrow}')
    cy.get('input').should('have.value', 'a value')
    cy.get('input').type('{downarrow}')
    cy.get('input').type('{downarrow}')
    cy.get('input').should('have.value', 'a value')
  })

  /*
   * hydration tests
   */

  it('hydrates its selection (string)', () => {
    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: { freeform: 'a value' }
      })
    )

    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'string'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').should('have.value', 'a value')
  })

  it('hydrates its selection (float)', () => {
    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: { freeform: 3.14 }
      })
    )

    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'float'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').should('have.value', '3.14')
  })

  it('hydrates its selection (int)', () => {
    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: { freeform: 3 }
      })
    )

    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'int'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').should('have.value', '3')
  })

  /*
   * Test to prevent different types from being hydrated.
   */

  it('hydrates its selection - but failed due to different types (string > float)', () => {
    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: { freeform: 'a value' }
      })
    )

    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'float'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').should('have.value', '')
  })

  it('hydrates its selection - but failed due to different types (float > string)', () => {
    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: { freeform: 3.14 }
      })
    )

    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'string'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').should('have.value', '')
  })

  it('hydrates its selection - but failed due to different types (int > string)', () => {
    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: { freeform: 3 }
      })
    )

    cy.mount(
      <Wrapper>
        <FreeformInputWidget
          configuration={{
            type: 'FreeformInputWidget',
            name: 'freeform',
            label: 'The label',
            required: true,
            details: {
              dtype: 'string'
            },
            help: 'The help'
          }}
        />
      </Wrapper>
    )

    cy.get('input').should('have.value', '')
  })
})
