import React from 'react'

import { StringListArrayWidget } from '../../src'

import { getStringListArrayWidgetConfiguration } from '../../__tests__/factories'

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

describe('<StringListArrayWidget/>', () => {
  it('appends current selection for closed accordions - select all/clear all', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringListArrayWidget
          configuration={{
            ...getStringListArrayWidgetConfiguration(),
            details: {
              ...getStringListArrayWidgetConfiguration().details,
              accordionOptions: {
                openGroups: ['Lakes'],
                searchable: false
              }
            }
          }}
        />
      </Form>
    )

    cy.findByText(/select all/i).click()
    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['variable', 'lake_bottom_temperature'],
      ['variable', 'lake_ice_depth'],
      ['variable', 'lake_ice_temperature'],
      ['variable', 'lake_mix_layer_depth'],
      ['variable', 'lake_mix_layer_temperature'],
      ['variable', 'lake_shape_factor'],
      ['variable', 'lake_total_layer_temperature'],
      ['variable', '2m_dewpoint_temperature'],
      ['variable', '2m_temperature'],
      ['variable', 'skin_temperature'],
      ['variable', 'soil_temperature_level_1'],
      ['variable', 'soil_temperature_level_2'],
      ['variable', 'soil_temperature_level_3'],
      ['variable', 'soil_temperature_level_4']
    ])
  })

  it('appends current selection for closed accordions - clear all', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringListArrayWidget
          configuration={{
            ...getStringListArrayWidgetConfiguration(),
            details: {
              ...getStringListArrayWidgetConfiguration().details,
              accordionOptions: {
                openGroups: ['Lakes'],
                searchable: false
              }
            }
          }}
        />
      </Form>
    )

    cy.findByText(/select all/i).click()

    cy.findByText(/clear all/i).click()
    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [])
  })

  it('appends current selection for closed accordions - submit', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringListArrayWidget
          configuration={{
            ...getStringListArrayWidgetConfiguration(),
            details: {
              ...getStringListArrayWidgetConfiguration().details,
              accordionOptions: {
                openGroups: ['Lakes', 'Temperature'],
                searchable: false
              }
            }
          }}
        />
      </Form>
    )

    cy.findByText('Soil temperature level 4').click()
    cy.findByText('Temperature').click()

    cy.findByText('Lake mix-layer temperature').click()
    cy.findByText('Lakes').click()

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['variable', 'soil_temperature_level_4'],
      ['variable', 'lake_mix_layer_temperature']
    ])
  })

  it('bypasses the required attribute if all options are made unavailable by constraints', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringListArrayWidget
          bypassRequiredForConstraints={true}
          constraints={[]}
          configuration={getStringListArrayWidgetConfiguration()}
        />
      </Form>
    )

    cy.findByText('submit').click()

    cy.findByText(/at least one selection must be made/i).should('not.exist')
  })

  it('shows active selection count', () => {
    cy.viewport(600, 1200)

    cy.mount(
      <StringListArrayWidget
        configuration={{
          ...getStringListArrayWidgetConfiguration(),
          details: {
            ...getStringListArrayWidgetConfiguration().details,
            accordionOptions: {
              openGroups: ['Lakes'],
              searchable: false
            }
          }
        }}
        renderActiveSelectionsCount={true}
      />
    ).then(({ rerender }) => {
      cy.findByText('Select all').click()
      cy.findByText('Lake total layer temperature').click()
      cy.findAllByText('7 selected items')
      cy.findAllByText('6 selected items')

      cy.log('Re-render with constraints')
      rerender(
        <StringListArrayWidget
          constraints={['2m_dewpoint_temperature', '2m_temperature']}
          configuration={{
            ...getStringListArrayWidgetConfiguration(),
            details: {
              ...getStringListArrayWidgetConfiguration().details,
              accordionOptions: {
                openGroups: ['Lakes'],
                searchable: false
              }
            }
          }}
          renderActiveSelectionsCount={true}
        />
      )

      cy.findAllByText('2 selected items')
    })
  })
})
