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
})
