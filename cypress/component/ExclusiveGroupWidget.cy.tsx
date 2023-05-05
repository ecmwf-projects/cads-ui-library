import React from 'react'

import { ExclusiveGroupWidget, getExclusiveGroupChildren } from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import {
  getStringListWidgetConfiguration,
  getStringListArrayWidgetConfiguration,
  getGeographicExtentWidgetConfiguration,
  getTextWidgetConfiguration,
  getStringChoiceWidgetConfiguration
} from '../../__tests__/factories'

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

describe('<ExclusiveGroupWidget/>', () => {
  it('with StringListArrayWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: null,
      name: 'checkbox_groups',
      children: ['variable', 'surface_help'],
      details: {
        default: 'variable'
      }
    }

    const formConfiguration = [
      configuration,
      getStringListArrayWidgetConfiguration(),
      getTextWidgetConfiguration()
    ]

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(800, 600)
    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <ExclusiveGroupWidget
          configuration={configuration}
          childrenGetter={getExclusiveGroupChildren(
            formConfiguration,
            'checkbox_groups',
            null,
            {
              renderActiveSelectionsCount: true
            }
          )}
        />
      </Form>
    ).then(({ rerender }) => {
      cy.findByLabelText('Lake shape factor').click()
      cy.findByLabelText('Soil temperature level 3').click()

      cy.findByText('submit').click()

      cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
        ['variable', 'soil_temperature_level_3'],
        ['variable', 'lake_shape_factor']
      ])

      cy.log('Re-render with constraints.')
      rerender(
        <TooltipProvider>
          <Form handleSubmit={stubbedHandleSubmit}>
            <ExclusiveGroupWidget
              configuration={configuration}
              childrenGetter={getExclusiveGroupChildren(
                formConfiguration,
                'checkbox_groups',
                {
                  variable: [
                    'lake_bottom_temperature',
                    'lake_ice_depth',
                    'lake_ice_temperature'
                  ]
                },
                {
                  renderActiveSelectionsCount: true
                }
              )}
            />
          </Form>
        </TooltipProvider>
      )

      cy.findByLabelText('2m dewpoint temperature').should('be.disabled')
      cy.findByLabelText('Lake bottom temperature').should('not.be.disabled')

      cy.findByLabelText('Lake ice depth').click()
      cy.findByText('Lakes').click()
      cy.findByText('1 selected item')
    })
  })

  it('with StringListWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: null,
      name: 'checkbox_groups',
      children: ['product_type', 'surface_help'],
      details: {
        default: 'product_type'
      }
    }

    const formConfiguration = [
      {
        type: 'ExclusiveGroupWidget' as const,
        label: 'Generic selections',
        help: 'Select one choice from the widgets below',
        name: 'checkbox_groups',
        children: ['product_type', 'surface_help'],
        details: {
          default: 'product_type',
          information: 'Select something ...'
        }
      },
      getStringListWidgetConfiguration(),
      getTextWidgetConfiguration()
    ]

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(984, 597)
    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <ExclusiveGroupWidget
          configuration={configuration}
          childrenGetter={getExclusiveGroupChildren(
            formConfiguration,
            'checkbox_groups'
          )}
        />
      </Form>
    )

    cy.findByLabelText('Monthly averaged reanalysis').click()

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['product_type', 'monthly_averaged_reanalysis']
    ])
  })

  it('with StringListWidget and StringListArrayWidget', () => {
    cy.viewport(1200, 900)
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: null,
      name: 'checkbox_groups',
      children: ['product_type', 'variable'],
      details: {
        default: 'variable'
      }
    }

    const formConfiguration = [
      configuration,
      getStringListWidgetConfiguration(),
      getStringListArrayWidgetConfiguration()
    ]

    cy.mount(
      <ExclusiveGroupWidget
        configuration={configuration}
        childrenGetter={getExclusiveGroupChildren(
          formConfiguration,
          'checkbox_groups'
        )}
      />
    )

    cy.findByLabelText('Skin temperature')
  })

  it('with GeographicExtentWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Geographical area',
      help: null,
      name: 'area_group',
      children: ['global', 'area'],
      details: {
        default: 'area'
      }
    }

    const formConfiguration = [
      configuration,
      {
        details: {
          id: 1,
          text: '<p>With this option selected the entire available area will be provided</p>'
        },
        label: 'Whole available region',
        name: 'global',
        type: 'FreeEditionWidget' as const
      },
      {
        ...getGeographicExtentWidgetConfiguration(),
        help: null,
        label: 'Sub-region extraction'
      }
    ]

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    const register = (name: string, rules: Record<string, any>) => {
      return rules
    }

    cy.viewport(1200, 900)
    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <ExclusiveGroupWidget
          configuration={configuration}
          childrenGetter={getExclusiveGroupChildren(
            formConfiguration,
            'area_group',
            null,
            {
              validators: {
                geographicExtentWidgetValidators: {
                  n: () => register('n', { pattern: '\\d{2}', required: true }),
                  s: () =>
                    register('s', {
                      pattern: '\\d{2}',
                      required: true,
                      maxLength: 33
                    }),
                  w: () =>
                    register('w', {
                      pattern: '\\d{2}',
                      required: true,
                      maxLength: 33
                    }),
                  e: () =>
                    register('e', {
                      pattern: '\\d{2}',
                      required: true,
                      maxLength: 33
                    })
                }
              }
            }
          )}
        />
      </Form>
    )

    cy.findByLabelText('Sub-region extraction').should(
      'have.attr',
      'aria-checked',
      'true'
    )

    cy.findByLabelText('North').clear().type('11')
    cy.findByLabelText('West').clear().type('90')
    cy.findByLabelText('East').clear().type('14')
    cy.findByLabelText('South').clear().type('44')

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [
      ['area', '11'],
      ['area', '90'],
      ['area', '14'],
      ['area', '44']
    ])

    cy.findByLabelText('Whole available region').click()
    cy.findByText('submit').click()
    cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [])

    /**
     * Test GeographicExtentWidget validation as a child of ExclusiveGroupWidget
     */
    cy.findByLabelText('North').should('have.attr', 'required')
    cy.findByLabelText('North').should('have.attr', 'pattern')

    cy.findByLabelText('South').should('have.attr', 'required')
    cy.findByLabelText('South').should('have.attr', 'pattern')
    cy.findByLabelText('South').should('have.attr', 'maxlength', '33')
  })

  it('with StringChoiceWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: null,
      name: 'checkbox_groups',
      children: ['format', 'surface_help'],
      details: {
        default: 'format'
      }
    }

    const formConfiguration = [
      configuration,
      getStringChoiceWidgetConfiguration(),
      getTextWidgetConfiguration()
    ]

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(800, 600)
    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <ExclusiveGroupWidget
          configuration={configuration}
          childrenGetter={getExclusiveGroupChildren(
            formConfiguration,
            'checkbox_groups'
          )}
        />
      </Form>
    )

    cy.findByLabelText('NetCDF (experimental)').click()

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['format', 'netcdf']
    ])
  })

  it('multiple ExclusiveGroupWidget', () => {
    const thisExclusive = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'This exclusive',
      help: null,
      name: 'this_exclusive',
      children: ['format', 'surface_help'],
      details: {
        default: 'format'
      }
    }

    const otherExclusive = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Other exclusive',
      help: null,
      name: 'other_exclusive',
      children: ['product_type'],
      details: {
        default: 'product_type'
      }
    }

    const formConfiguration = [
      thisExclusive,
      otherExclusive,
      getStringChoiceWidgetConfiguration(),
      getTextWidgetConfiguration(),
      getStringListWidgetConfiguration(),
      getGeographicExtentWidgetConfiguration(),
      {
        details: {
          id: 1,
          text: '<p>To obtain something completely different ...</p>'
        },
        label: 'I have nothing to do here',
        name: 'useless',
        type: 'FreeEditionWidget' as const
      },
      {
        details: {
          columns: 2,
          id: 0,
          labels: {
            ['1']: '1',
            ['2']: '2'
          },
          values: ['1', '1']
        },
        help: null,
        label: 'Me neither',
        name: 'me_neither',
        required: true,
        type: 'StringListWidget' as const
      }
    ]

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(800, 600)
    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <ExclusiveGroupWidget
          configuration={thisExclusive}
          childrenGetter={getExclusiveGroupChildren(
            formConfiguration,
            'this_exclusive'
          )}
        />

        <ExclusiveGroupWidget
          configuration={otherExclusive}
          childrenGetter={getExclusiveGroupChildren(
            formConfiguration,
            'other_exclusive'
          )}
        />
      </Form>
    )

    cy.findByLabelText(/netcdf/i)
    cy.findByLabelText('Surface data')
    cy.findByLabelText('Monthly averaged reanalysis').click()

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['format', 'grib'],
      ['product_type', 'monthly_averaged_reanalysis']
    ])
  })

  it('bypasses the required attribute if all options are made unavailable by constraints', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: null,
      name: 'checkbox_groups',
      children: ['product_type', 'variable', 'format'],
      details: {
        default: 'product_type'
      }
    }

    const formConfiguration = [
      configuration,
      getStringListWidgetConfiguration(),
      getStringListArrayWidgetConfiguration(),
      getStringChoiceWidgetConfiguration()
    ]

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <ExclusiveGroupWidget
          configuration={configuration}
          childrenGetter={getExclusiveGroupChildren(
            formConfiguration,
            'checkbox_groups',
            { product_type: [], variable: [], format: [] },
            { bypassRequiredForConstraints: true }
          )}
        />
      </Form>
    )

    cy.findByText('At least one selection must be made').should('not.exist')
  })
})
