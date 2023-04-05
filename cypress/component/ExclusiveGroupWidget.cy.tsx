import React from 'react'

import {
  ExclusiveGroupWidget,
  StringListWidget,
  StringListArrayWidget,
  GeographicExtentWidget,
  StringChoiceWidget,
  TextWidget,
  getExclusiveGroupChildren
} from '../../src'
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
      help: 'Select one choice from the widgets below',
      name: 'checkbox_groups',
      children: ['variable', 'surface_help'],
      details: {
        default: 'variable',
        information: 'Select something ...'
      }
    }

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(800, 600)
    cy.mount(
      <TooltipProvider>
        <Form handleSubmit={stubbedHandleSubmit}>
          <ExclusiveGroupWidget
            configuration={configuration}
            childrenGetter={{
              // TODO getExclusiveGroupChildren
              variable: ({ fieldsetDisabled }) => (
                <StringListArrayWidget
                  fieldsetDisabled={fieldsetDisabled}
                  configuration={getStringListArrayWidgetConfiguration()}
                />
              ),
              surface_help: () => (
                <TextWidget configuration={getTextWidgetConfiguration()} />
              )
            }}
          />
        </Form>
      </TooltipProvider>
    )

    cy.findByLabelText('Lake shape factor').click()
    cy.findByLabelText('Soil temperature level 3').click()

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['variable', 'soil_temperature_level_3'],
      ['variable', 'lake_shape_factor']
    ])
  })

  it('with StringListWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: 'Select one choice from the widgets below',
      name: 'checkbox_groups',
      children: ['product_type', 'surface_help'],
      details: {
        default: 'product_type',
        information: 'Select something ...'
      }
    }

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(984, 597)
    cy.mount(
      <TooltipProvider>
        <Form handleSubmit={stubbedHandleSubmit}>
          <ExclusiveGroupWidget
            configuration={configuration}
            childrenGetter={{
              product_type: ({ fieldsetDisabled }) => (
                <StringListWidget
                  fieldsetDisabled={fieldsetDisabled}
                  configuration={getStringListWidgetConfiguration()}
                />
              ),
              surface_help: () => (
                <TextWidget configuration={getTextWidgetConfiguration()} />
              )
            }}
          />
        </Form>
      </TooltipProvider>
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
      help: 'Select one choice from the widgets below',
      name: 'checkbox_groups',
      children: ['product_type', 'variable'],
      details: {
        default: 'variable',
        information: 'Select something ...'
      }
    }
    cy.mount(
      <TooltipProvider>
        <ExclusiveGroupWidget
          configuration={configuration}
          childrenGetter={{
            product_type: () => (
              <StringListWidget
                configuration={getStringListWidgetConfiguration()}
              />
            ),
            variable: () => (
              <StringListArrayWidget
                configuration={getStringListArrayWidgetConfiguration()}
              />
            )
          }}
        />
      </TooltipProvider>
    )
  })

  it('with GeographicExtentWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Geographical area',
      help: 'Select one choice from the widgets below',
      name: 'area_group',
      children: ['global', 'area'],
      details: {
        default: 'area',
        information:
          'Valid latitude and longitude values are multiples of 0.05 degree.'
      }
    }

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1200, 900)
    cy.mount(
      <TooltipProvider>
        <Form handleSubmit={stubbedHandleSubmit}>
          <ExclusiveGroupWidget
            configuration={configuration}
            childrenGetter={{
              global: () => (
                <TextWidget
                  configuration={{
                    details: {
                      id: 1,
                      text: '<p>With this option selected the entire available area will be provided</p>'
                    },
                    label: 'Whole available region',
                    name: 'global',
                    type: 'FreeEditionWidget' as const
                  }}
                />
              ),
              area: ({ fieldsetDisabled }) => (
                <GeographicExtentWidget
                  fieldsetDisabled={fieldsetDisabled}
                  configuration={{
                    ...getGeographicExtentWidgetConfiguration(),
                    label: 'Sub-region extraction'
                  }}
                />
              )
            }}
          />
        </Form>
      </TooltipProvider>
    )

    cy.findByLabelText('Sub-region extraction').should(
      'have.attr',
      'aria-checked',
      'true'
    )

    cy.findByLabelText('North').type('90')
    cy.findByLabelText('West').type('-90')
    cy.findByLabelText('East').type('144')
    cy.findByLabelText('South').type('44')

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [
      ['area', '90'],
      ['area', '-90'],
      ['area', '144'],
      ['area', '44']
    ])

    cy.findByLabelText('Whole available region').click()
    cy.findByText('submit').click()
    cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [])
  })

  it('with StringChoiceWidget and TextWidget', () => {
    const configuration = {
      type: 'ExclusiveGroupWidget' as const,
      label: 'Generic selections',
      help: 'Select one choice from the widgets below',
      name: 'checkbox_groups',
      children: ['format', 'surface_help'],
      details: {
        default: 'format',
        information: 'Select something ...'
      }
    }

    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(800, 600)
    cy.mount(
      <TooltipProvider>
        <Form handleSubmit={stubbedHandleSubmit}>
          <ExclusiveGroupWidget
            configuration={configuration}
            childrenGetter={{
              format: ({ fieldsetDisabled }) => (
                <StringChoiceWidget
                  fieldsetDisabled={fieldsetDisabled}
                  configuration={getStringChoiceWidgetConfiguration()}
                />
              ),
              surface_help: () => (
                <TextWidget configuration={getTextWidgetConfiguration()} />
              )
            }}
          />
        </Form>
      </TooltipProvider>
    )

    cy.findByLabelText('NetCDF (experimental)').click()

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledOnceWith', [
      ['format', 'netcdf']
    ])
  })
})
