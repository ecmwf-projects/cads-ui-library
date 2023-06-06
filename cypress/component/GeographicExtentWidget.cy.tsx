import React from 'react'
import { useForm } from 'react-hook-form'

import {
  GeographicExtentWidget,
  isSouthLessThanNorth,
  isWestLessThanEast,
  isWithinRange,
  getGeoExtentFieldValue
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
  it('renders', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: { id: 'cems-glofas-seasonal-reforecast' }
      })
    )

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <GeographicExtentWidget
          configuration={{
            ...getGeographicExtentWidgetConfiguration(),
            help: null
          }}
        />
      </Form>
    )

    cy.findAllByLabelText('North').should('have.value', '90')
    cy.findAllByLabelText('South').should('have.value', '-90')
    cy.findAllByLabelText('West').should('have.value', '-180')
    cy.findAllByLabelText('East').should('have.value', '180')
  })

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

    cy.findAllByLabelText('North').eq(0).should('have.value', '90')
    cy.findAllByLabelText('South').eq(0).should('have.value', '-90')
    cy.findAllByLabelText('West').eq(0).should('have.value', '-180')
    cy.findAllByLabelText('East').eq(0).should('have.value', '180')

    cy.findAllByLabelText('North').eq(0).clear().type('11')
    cy.findAllByLabelText('South').eq(0).clear().type('12')
    cy.findAllByLabelText('West').eq(0).clear().type('13')
    cy.findAllByLabelText('East').eq(0).clear().type('14')

    cy.findAllByLabelText('North').eq(1).clear().type('51')
    cy.findAllByLabelText('South').eq(1).clear().type('64')
    cy.findAllByLabelText('West').eq(1).clear().type('33')
    cy.findAllByLabelText('East').eq(1).clear().type('11')

    cy.findByText('submit').click()

    /**
     * Testing the default payload order expected by the adaptor: North, West, South, East.
     */
    cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [
      ['area', '11'],
      ['area', '13'],
      ['area', '12'],
      ['area', '14'],
      ['area_1', '51'],
      ['area_1', '33'],
      ['area_1', '64'],
      ['area_1', '11']
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
          <GeographicExtentWidget
            configuration={{
              ...getGeographicExtentWidgetConfiguration(),
              help: null
            }}
            validators={{
              n: internalName =>
                register(internalName, {
                  required: {
                    value: true,
                    message: 'Please insert North input'
                  }
                }),
              s: internalName =>
                register(internalName, {
                  required: {
                    value: true,
                    message: 'Please insert South input'
                  }
                }),
              w: internalName =>
                register(internalName, {
                  required: {
                    value: true,
                    message: 'Please insert West input'
                  }
                }),
              e: internalName =>
                register(internalName, {
                  required: {
                    value: true,
                    message: 'Please insert East input'
                  }
                })
            }}
            errors={errors}
          />

          <button>submit</button>
        </form>
      )
    }

    cy.mount(<Form handleSubmit={stubbedHandleSubmit} />)

    cy.findByLabelText('North').should('have.value', '90')
    cy.findByLabelText('North').clear()
    cy.findByLabelText('North').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please insert North input')

    cy.findByLabelText('South').clear()
    cy.findByLabelText('South').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please insert South input')

    cy.findByLabelText('West').clear()
    cy.findByLabelText('West').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please insert West input')

    cy.findByLabelText('East').clear()
    cy.findByLabelText('East').should('have.attr', 'aria-invalid', 'true')
    cy.findByText('Please insert East input')
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
              configuration={{
                details: {
                  default: {
                    n: 90,
                    w: -180,
                    e: 180,
                    s: -90
                  },
                  extentLabels: {
                    n: 'North',
                    w: 'West',
                    e: 'East',
                    s: 'South'
                  },
                  precision: 2,
                  range: {
                    e: 180,
                    n: 90,
                    s: -90,
                    w: -180
                  }
                },
                help: null,
                label: 'Sub-region extraction',
                name: 'area',
                type: 'GeographicExtentWidget' as const
              }}
              validators={{
                n: (fieldName, { name, details: { range } }) =>
                  register(fieldName, {
                    required: {
                      value: true,
                      message: 'Please insert North input'
                    },
                    validate: {
                      range: value => {
                        return (
                          isWithinRange({
                            name,
                            value,
                            fieldName,
                            range
                          }) || 'Please select coordinates within range'
                        )
                      },
                      southLessThanNorth: (value, fields) => {
                        return (
                          isSouthLessThanNorth({
                            name,
                            value,
                            fields,
                            fieldName
                          }) || 'South edge must be less than North edge'
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
                        return (
                          isSouthLessThanNorth({
                            name,
                            value,
                            fields,
                            fieldName
                          }) || 'South edge must be less than North edge'
                        )
                      },
                      range: value => {
                        return (
                          isWithinRange({
                            name,
                            value,
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
                        return (
                          isWestLessThanEast({
                            name,
                            value,
                            fields,
                            fieldName
                          }) || 'West edge must be less than East edge'
                        )
                      },
                      range: value => {
                        return (
                          isWithinRange({
                            name,
                            value,
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
                        return (
                          isWestLessThanEast({
                            name,
                            value,
                            fields,
                            fieldName
                          }) || 'West edge must be less than East edge'
                        )
                      },
                      range: value => {
                        return (
                          isWithinRange({
                            name,
                            value,
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

  it('applies validation - minus, dot, precision, special keys', () => {
    const Form = ({
      handleSubmit
    }: {
      handleSubmit: (...args: any) => void
    }) => {
      const {
        register,
        setValue,
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
          <GeographicExtentWidget
            configuration={{
              details: {
                default: {
                  n: 90,
                  w: -180,
                  e: 180,
                  s: -90
                },
                extentLabels: {
                  n: 'North',
                  w: 'West',
                  e: 'East',
                  s: 'South'
                },
                precision: 3,
                range: {
                  e: 180,
                  n: 90,
                  s: -90,
                  w: -180
                }
              },
              help: null,
              label: 'Sub-region extraction',
              name: 'area',
              type: 'GeographicExtentWidget' as const
            }}
            validators={{
              n: (fieldName, { name, details: { precision } }) =>
                register(fieldName, {
                  onChange: ev => {
                    if ('nativeEvent' in ev) {
                      if (ev.nativeEvent instanceof InputEvent) {
                        const value = ev.nativeEvent.target.value
                        const nextValue = getGeoExtentFieldValue(
                          value,
                          precision
                        )

                        setValue(fieldName, nextValue)
                      }
                    }
                  }
                })
            }}
          />

          <button>submit</button>
        </form>
      )
    }

    cy.mount(<Form handleSubmit={() => void 0} />)

    /**
     * Meta key
     */

    cy.findByLabelText('South').type('{command}', { release: false }).type('A')

    /**
     * Minus and dot
     */
    cy.findByLabelText('North')
      .clear()
      .type('9')
      .should('have.value', '9')
      .type('{leftArrow}-')
      .should('have.value', '-9')

    cy.findByLabelText('North').clear().type('-99').should('have.value', '-99')
    cy.findByLabelText('North').clear().type('.99-').should('have.value', '.99')
    cy.findByLabelText('North').clear().type('-').should('have.value', '-')
    cy.findByLabelText('North').clear().type('..').should('have.value', '.')

    /**
     * Precision
     */
    cy.findByLabelText('North')
      .clear()
      .type('99.171')
      .should('have.value', '99.171')

    cy.findByLabelText('North')
      .clear()
      .type('99.1234567')
      .should('have.value', '99.123')

    cy.findByLabelText('North')
      .clear()
      .type('8.12345678')
      .should('have.value', '8.123')

    /**
     * Letters
     */
    cy.findByLabelText('South')
      .clear()
      .type('gibberish')
      .should('have.value', '')
  })
})
