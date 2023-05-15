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
  it('no default, required selection', () => {
    cy.mount(
      <StringChoiceWidget
        configuration={{
          name: 'period',
          label: 'Period',
          help: null,
          required: true,
          type: 'StringChoiceWidget',
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

    cy.findByRole('alert').should(
      'have.text',
      'At least one selection must be made'
    )
  })

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
          configuration={{
            details: {
              columns: 2,
              labels: {
                grib: 'GRIB',
                netcdf: 'NetCDF (experimental)'
              },
              values: ['grib', 'netcdf']
            },
            required: true,
            help: null,
            label: 'Format',
            name: 'format',
            type: 'StringChoiceWidget' as const
          }}
        />
      </Form>
    )

    cy.findByRole('alert').should('not.exist')
  })
})
