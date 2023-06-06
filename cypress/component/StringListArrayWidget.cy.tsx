import React from 'react'

import { StringListArrayWidget } from '../../src'

import { getStringListArrayWidgetConfiguration } from '../../__tests__/factories'

const Form = ({
  children,
  handleSubmit,
  handleChange
}: {
  children: React.ReactNode
  handleSubmit: (...args: any) => void
  handleChange?: (...args: any) => void
}) => {
  return (
    <form
      onSubmit={ev => {
        ev.preventDefault()
        const formData = new FormData(ev.currentTarget)
        handleSubmit([...formData.entries()])
      }}
      onChange={ev => {
        if (!handleChange) return
        const formData = new FormData(ev.currentTarget)

        handleChange([...formData.entries()])
      }}
    >
      {children}
      <button>submit</button>
    </form>
  )
}

describe('<StringListArrayWidget/>', () => {
  it('handles selection', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <StringListArrayWidget
          configuration={getStringListArrayWidgetConfiguration()}
        />
      </Form>
    )

    cy.findByRole('alert').should(
      'have.text',
      'At least one selection must be made'
    )

    cy.findByText('2m dewpoint temperature').click()
    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['variable', '2m_dewpoint_temperature']
    ])
  })

  it('appends current selection for closed accordions - select all/clear all', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')
    const stubbedHandleChange = cy.stub().as('stubbedHandleChange')

    cy.mount(
      <Form
        handleSubmit={stubbedHandleSubmit}
        handleChange={stubbedHandleChange}
      >
        <StringListArrayWidget
          configuration={{
            ...getStringListArrayWidgetConfiguration(),
            details: {
              ...getStringListArrayWidgetConfiguration().details,
              accordionOptions: {
                openGroups: [],
                searchable: false
              }
            }
          }}
        />
      </Form>
    )

    cy.findByLabelText('Select all Variable').click()

    cy.get('@stubbedHandleChange')
      .its('lastCall')
      .its('lastArg')
      .should('deep.equal', [
        ['variable', '2m_dewpoint_temperature'],
        ['variable', '2m_temperature'],
        ['variable', 'skin_temperature'],
        ['variable', 'soil_temperature_level_1'],
        ['variable', 'soil_temperature_level_2'],
        ['variable', 'soil_temperature_level_3'],
        ['variable', 'soil_temperature_level_4'],
        ['variable', 'lake_bottom_temperature'],
        ['variable', 'lake_ice_depth'],
        ['variable', 'lake_ice_temperature'],
        ['variable', 'lake_mix_layer_depth'],
        ['variable', 'lake_mix_layer_temperature'],
        ['variable', 'lake_shape_factor'],
        ['variable', 'lake_total_layer_temperature']
      ])

    cy.findByText('submit')
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

    cy.findByLabelText('Select all Variable').click()

    cy.findByLabelText('Clear all Variable').click()
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

    cy.findByRole('alert').should('not.exist')
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
      cy.findByLabelText('Select all Variable').click()
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

  it('select all / clear all behaviour', () => {
    cy.viewport(800, 1300)

    cy.mount(
      <StringListArrayWidget
        configuration={{
          details: {
            accordionGroups: true,
            accordionOptions: {
              openGroups: ['Temperature', 'Lakes'],
              searchable: false
            },
            displayaslist: false,
            groups: [
              {
                columns: 2,
                label: 'Temperature',
                labels: {
                  soil_temperature_level_2: 'Soil temperature level 2',
                  soil_temperature_level_3: 'Soil temperature level 3',
                  soil_temperature_level_4: 'Soil temperature level 4'
                },
                values: [
                  'soil_temperature_level_2',
                  'soil_temperature_level_3',
                  'soil_temperature_level_4'
                ]
              },
              {
                columns: 2,
                label: 'Lakes',
                labels: {
                  lake_shape_factor: 'Lake shape factor',
                  lake_total_layer_temperature: 'Lake total layer temperature'
                },
                values: ['lake_shape_factor', 'lake_total_layer_temperature']
              }
            ],
            id: 1
          },
          help: null,
          label: 'Variable',
          name: 'variable',
          required: true,
          type: 'StringListArrayWidget' as const
        }}
        renderActiveSelectionsCount={true}
      />
    ).then(({ rerender }) => {
      /**
       * Parent-level select all
       */
      cy.findByLabelText('Select all Variable')

      /**
       * Sub-widget-level select all
       */
      cy.findByLabelText('Select all Temperature').click()

      cy.findByLabelText('Soil temperature level 2').should(
        'have.attr',
        'aria-checked',
        'true'
      )
      cy.findByLabelText('Soil temperature level 3').should(
        'have.attr',
        'aria-checked',
        'true'
      )
      cy.findByLabelText('Soil temperature level 4').should(
        'have.attr',
        'aria-checked',
        'true'
      )

      cy.findByLabelText('Lake total layer temperature').should(
        'have.attr',
        'aria-checked',
        'false'
      )
      cy.findByLabelText('Lake shape factor').should(
        'have.attr',
        'aria-checked',
        'false'
      )

      /**
       * Sub-widget-level select all
       */
      cy.findByLabelText('Select all Lakes').click()

      cy.findByLabelText('Lake total layer temperature').should(
        'have.attr',
        'aria-checked',
        'true'
      )
      cy.findByLabelText('Lake shape factor').should(
        'have.attr',
        'aria-checked',
        'true'
      )

      /**
       * Parent-level clear all
       */
      cy.findByLabelText('Lake shape factor').click()
      cy.findByLabelText('Clear all Variable')

      /**
       * Sub-widget-level clear all
       */
      cy.findAllByText('Clear all').eq(1)
      cy.findAllByText('Clear all').eq(2)
      cy.findByLabelText('Lake shape factor').click()

      cy.findByLabelText('Clear all Temperature').click()
      cy.findByLabelText('Soil temperature level 2').should(
        'have.attr',
        'aria-checked',
        'false'
      )
      cy.findByLabelText('Soil temperature level 3').should(
        'have.attr',
        'aria-checked',
        'false'
      )
      cy.findByLabelText('Soil temperature level 4').should(
        'have.attr',
        'aria-checked',
        'false'
      )

      cy.findByLabelText('Clear all Temperature').should('not.exist')

      cy.findByLabelText('Select all Temperature').click()

      cy.findByLabelText('Select all Temperature').should('not.exist')

      rerender(
        <StringListArrayWidget
          configuration={{
            details: {
              accordionGroups: true,
              accordionOptions: {
                openGroups: ['Temperature', 'Lakes'],
                searchable: false
              },
              displayaslist: false,
              groups: [
                {
                  columns: 2,
                  label: 'Temperature',
                  labels: {
                    soil_temperature_level_2: 'Soil temperature level 2',
                    soil_temperature_level_3: 'Soil temperature level 3',
                    soil_temperature_level_4: 'Soil temperature level 4'
                  },
                  values: [
                    'soil_temperature_level_2',
                    'soil_temperature_level_3',
                    'soil_temperature_level_4'
                  ]
                },
                {
                  columns: 2,
                  label: 'Lakes',
                  labels: {
                    lake_shape_factor: 'Lake shape factor',
                    lake_total_layer_temperature: 'Lake total layer temperature'
                  },
                  values: ['lake_shape_factor', 'lake_total_layer_temperature']
                }
              ],
              id: 1
            },
            help: null,
            label: 'Variable',
            name: 'variable',
            required: true,
            type: 'StringListArrayWidget' as const
          }}
          constraints={['lake_shape_factor']}
          renderActiveSelectionsCount={true}
        />
      )

      cy.findByLabelText('Clear all Lakes').click()
      cy.findByLabelText('Select all Lakes').click()

      cy.findByLabelText('Lake shape factor').should(
        'have.attr',
        'aria-checked',
        'true'
      )
      cy.findByLabelText('Lake total layer temperature').should(
        'have.attr',
        'aria-checked',
        'false'
      )
    })
  })

  it('reacts to form Clear all', () => {
    cy.mount(
      <StringListArrayWidget
        configuration={getStringListArrayWidgetConfiguration()}
      />
    )

    cy.findByLabelText('Select all Lakes').click()
    cy.document().trigger('formAction', {
      eventConstructor: 'CustomEvent',
      detail: { type: 'clearAll' }
    })

    cy.findByLabelText('Lake shape factor').should(
      'have.attr',
      'aria-checked',
      'false'
    )
    cy.findByLabelText('Lake total layer temperature').should(
      'have.attr',
      'aria-checked',
      'false'
    )
  })
})
