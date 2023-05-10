import React from 'react'

import { StringChoiceWidget } from '../../src'

import { getStringChoiceWidgetConfiguration } from '../../__tests__/factories'

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

describe('<StringChoiceWidget/>', () => {
  it('handles selection', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringChoiceWidget
          configuration={getStringChoiceWidgetConfiguration()}
        />
      </Form>
    )

    cy.findByLabelText('NetCDF (experimental)').click()
    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['format', 'netcdf']
    ])
  })

  it('bypasses the required attribute if all options are made unavailable by constraints', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringChoiceWidget
          bypassRequiredForConstraints={true}
          constraints={[]}
          configuration={getStringChoiceWidgetConfiguration()}
        />
      </Form>
    )
  })

  it('renders with missing default', () => {
    /**
     * Note: rendering without a default is not a requirement. The default is always enforced in Gecko JSON configuration level in Gecko.
     */
    cy.mount(
      <StringChoiceWidget
        configuration={{
          name: 'period',
          label: 'Period',
          help: null,
          required: true,
          type: 'StringChoiceWidget',
          // @ts-expect-error
          details: {
            values: ['summer', 'winter', 'year'],
            columns: 3,
            labels: {
              summer: 'Summer',
              winter: 'Winter',
              year: 'Year'
            }
          }
        }}
      />
    )
  })
})
