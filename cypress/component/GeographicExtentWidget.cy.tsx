import React from 'react'
import { useForm } from 'react-hook-form'

import {
  GeographicExtentWidget,
  isSouthLessThanNorth,
  isWestLessThanEast,
  isWithinRange
} from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { getGeographicExtentWidgetConfiguration } from '../../__tests__/factories'

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

describe('<GeographicExtentWidget/>', () => {
  it('multiple geo extents', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <GeographicExtentWidget
          configuration={{
            ...getGeographicExtentWidgetConfiguration(),
            help: null
          }}
        />
        <GeographicExtentWidget
          configuration={{
            ...getGeographicExtentWidgetConfiguration(),
            help: null,
            label: 'Area 1',
            name: 'area_1'
          }}
        />
      </Form>
    )

    cy.findAllByLabelText('North').eq(0).clear().type('11')
    cy.findAllByLabelText('South').eq(0).clear().type('12')
    cy.findAllByLabelText('West').eq(0).clear().type('13')
    cy.findAllByLabelText('East').eq(0).clear().type('14')

    cy.findAllByLabelText('North').eq(1).clear().type('51')
    cy.findAllByLabelText('South').eq(1).clear().type('64')
    cy.findAllByLabelText('West').eq(1).clear().type('33')
    cy.findAllByLabelText('East').eq(1).clear().type('11')

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [
      ['area', '11'],
      ['area', '13'],
      ['area', '14'],
      ['area', '12'],
      ['area_1', '51'],
      ['area_1', '33'],
      ['area_1', '11'],
      ['area_1', '64']
    ])
  })

  it('applies validation - standard validation attributes', () => {
    const register = (name: string, rules: Record<string, any>) => {
      return rules
    }

    cy.mount(
      <TooltipProvider>
        <GeographicExtentWidget
          configuration={getGeographicExtentWidgetConfiguration()}
          validators={{
            n: () => register('n', { pattern: '\\d{4}', required: true }),
            s: () =>
              register('s', {
                pattern: '\\d{1}',
                required: true,
                maxLength: 33
              }),
            w: () =>
              register('w', {
                pattern: '\\d{1}',
                required: true,
                maxLength: 33
              }),
            e: () =>
              register('e', {
                pattern: '\\d{1}',
                required: true,
                maxLength: 33
              })
          }}
        />
      </TooltipProvider>
    )

    cy.findByLabelText('North').should('have.attr', 'required')
    cy.findByLabelText('North').should('have.attr', 'pattern')

    cy.findByLabelText('South').should('have.attr', 'required')
    cy.findByLabelText('South').should('have.attr', 'pattern')
    cy.findByLabelText('South').should('have.attr', 'maxlength', '33')
  })

  it('applies validation - West edge must be less than East edge', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    const Form = ({
      handleSubmit
    }: {
      handleSubmit: (...args: any) => void
    }) => {
      const {
        register,
        formState: { errors }
      } = useForm({
        mode: 'onChange'
      })

      return (
        <form
          onSubmit={ev => {
            ev.preventDefault()
            const formData = new FormData(ev.currentTarget)
            handleSubmit([...formData.entries()])
          }}
        >
          <TooltipProvider>
            <GeographicExtentWidget
              configuration={getGeographicExtentWidgetConfiguration()}
              validators={{
                n: (internalName, { details: { precision: _todo } }) =>
                  register(internalName, {
                    required: {
                      value: true,
                      message: 'Please insert North input'
                    }
                  }),
                s: (internalName, { details: { precision: _todo } }) =>
                  register(internalName, {
                    required: {
                      value: true,
                      message: 'Please insert South input'
                    }
                  }),
                w: (internalName, { details: { precision: _todo } }) =>
                  register(internalName, {
                    required: {
                      value: true,
                      message: 'Please insert West input'
                    }
                  }),
                e: (internalName, { details: { precision: _todo } }) =>
                  register(internalName, {
                    required: {
                      value: true,
                      message: 'Please insert East input'
                    }
                  })
              }}
              errors={errors}
            />
          </TooltipProvider>

          <button>submit</button>
        </form>
      )
    }

    cy.mount(<Form handleSubmit={stubbedHandleSubmit} />)

    cy.findByLabelText('North').clear()
    cy.findByLabelText('North').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please select coordinates within range')

    cy.findByLabelText('South').clear()
    cy.findByLabelText('South').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please select coordinates within range')

    cy.findByLabelText('West').clear()
    cy.findByLabelText('West').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please select coordinates within range')

    cy.findByLabelText('East').clear()
    cy.findByLabelText('East').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please select coordinates within range')

    cy.findByRole('alert')
  })

  it('applies validation - range, w/e, n/s validation', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    const Form = ({
      handleSubmit
    }: {
      handleSubmit: (...args: any) => void
    }) => {
      const {
        register,
        formState: { errors: ownErrors }
      } = useForm({
        mode: 'onChange'
      })

      return (
        <form
          onSubmit={ev => {
            ev.preventDefault()
            const formData = new FormData(ev.currentTarget)
            handleSubmit([...formData.entries()])
          }}
        >
          <TooltipProvider>
            <GeographicExtentWidget
              configuration={getGeographicExtentWidgetConfiguration()}
              validators={{
                n: (fieldName, { name, details: { range } }) =>
                  register(fieldName, {
                    required: {
                      value: true,
                      message: 'Please insert North input'
                    },
                    validate: {
                      southLessThanNorth: (value, fields) => {
                        return isSouthLessThanNorth({
                          name,
                          value,
                          fields,
                          fieldName
                        })
                      },
                      range: (value, fields) => {
                        return (
                          isWithinRange({
                            name,
                            value,
                            fields,
                            fieldName,
                            range
                          }) || 'Please select coordinates within range'
                        )
                      }
                    }
                  }),
                s: (fieldName, { name, details: { range } }) =>
                  register(fieldName, {
                    required: {
                      value: true,
                      message: 'Please insert South input'
                    },
                    validate: {
                      southLessThanNorth: (value, fields) => {
                        return isSouthLessThanNorth({
                          name,
                          value,
                          fields,
                          fieldName
                        })
                      },
                      range: (value, fields) => {
                        return (
                          isWithinRange({
                            name,
                            value,
                            fields,
                            fieldName,
                            range
                          }) || 'Please select coordinates within range'
                        )
                      }
                    }
                  }),
                w: (fieldName, { name, details: { range } }) =>
                  register(fieldName, {
                    required: {
                      value: true,
                      message: 'Please insert West input'
                    },
                    validate: {
                      westLessThanEast: (value, fields) => {
                        return isWestLessThanEast({
                          name,
                          value,
                          fields,
                          fieldName
                        })
                      },
                      range: (value, fields) => {
                        return (
                          isWithinRange({
                            name,
                            value,
                            fields,
                            fieldName,
                            range
                          }) || 'Please select coordinates within range'
                        )
                      }
                    }
                  }),
                e: (fieldName, { name, details: { range } }) =>
                  register(fieldName, {
                    required: {
                      value: true,
                      message: 'Please insert East input'
                    },
                    validate: {
                      westLessThanEast: (value, fields) => {
                        return isWestLessThanEast({
                          name,
                          value,
                          fields,
                          fieldName
                        })
                      },
                      range: (value, fields) => {
                        return (
                          isWithinRange({
                            name,
                            value,
                            fields,
                            fieldName,
                            range
                          }) || 'Please select coordinates within range'
                        )
                      }
                    }
                  })
              }}
              errors={{
                ...ownErrors,
                area_unrelated_widget: {
                  message: 'Not an own error of this widget 1'
                },
                area_another_unrelated_widget: {
                  message: 'Not an own error of this widget 2'
                }
              }}
            />
          </TooltipProvider>

          <button>submit</button>
        </form>
      )
    }

    cy.mount(<Form handleSubmit={stubbedHandleSubmit} />)

    cy.findByLabelText('North').clear().type('200')
    cy.findByRole('alert').should(
      'have.text',
      'Please select coordinates within range'
    )

    cy.findByLabelText('North').clear().type('89')
    cy.findByLabelText('South').clear().type('89')
    cy.findByRole('alert').should(
      'have.text',
      'South edge must be less than North edge'
    )
    cy.findByLabelText('North').clear().type('90')
    cy.findByRole('alert').should('not.exist')

    cy.findByLabelText('West').clear().type('180')
    cy.findByRole('alert').should(
      'have.text',
      'West edge must be less than East edge'
    )

    cy.findByLabelText('West').clear().type('-185')
    cy.findByRole('alert').should(
      'have.text',
      'Please select coordinates within range'
    )

    cy.findByLabelText('West').clear()
    cy.findByRole('alert').should('have.text', 'Please insert West input')

    cy.findByLabelText('West').type('15')

    cy.findByLabelText('East').clear().type('15')
    cy.findByRole('alert').should(
      'have.text',
      'West edge must be less than East edge'
    )

    cy.findByLabelText('South').clear().type('90')
    cy.findByRole('alert').should(
      'have.text',
      'South edge must be less than North edge'
    )

    cy.findByLabelText('North').clear()
    cy.findByRole('alert').should('have.text', 'Please insert North input')
  })
})
