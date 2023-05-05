import { useForm } from 'react-hook-form'

import { GeographicExtentWidget } from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { getGeographicExtentWidgetConfiguration } from '../../__tests__/factories'

describe('<GeographicExtentWidget/>', () => {
  it('renders', () => {
    cy.mount(
      <TooltipProvider>
        <GeographicExtentWidget
          configuration={getGeographicExtentWidgetConfiguration()}
        />
      </TooltipProvider>
    )

    cy.findByLabelText('North').clear().type('89')
    cy.findByLabelText('West').clear().type('-120')
    cy.findByLabelText('East').clear().type('170')
    cy.findByLabelText('South').clear().type('-89')
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

  it('applies validation - integration with react hook form', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    const Form = ({
      handleSubmit
    }: {
      handleSubmit: (...args: any) => void
    }) => {
      const {
        register,
        formState: { errors }
      } = useForm<{ n: string; s: string; w: string; e: string }>({
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
                n: () =>
                  register('n', {
                    required: {
                      value: true,
                      message: 'Please insert North input'
                    }
                  }),
                s: () =>
                  register('s', {
                    required: {
                      value: true,
                      message: 'Please insert South input'
                    }
                  }),
                w: () =>
                  register('w', {
                    required: {
                      value: true,
                      message: 'Please insert West input'
                    }
                  }),
                e: () =>
                  register('e', {
                    required: {
                      value: true,
                      message: 'Please insert East input'
                    }
                  })
              }}
            />
          </TooltipProvider>
          <p>{errors?.n?.message}</p>
          <p>{errors?.s?.message}</p>
          <p>{errors?.w?.message}</p>
          <p>{errors?.e?.message}</p>
          <button>submit</button>
        </form>
      )
    }

    cy.mount(<Form handleSubmit={stubbedHandleSubmit} />)

    cy.findByLabelText('North').should('have.attr', 'name', 'n')
    cy.findByLabelText('South').should('have.attr', 'name', 's')
    cy.findByLabelText('West').should('have.attr', 'name', 'w')
    cy.findByLabelText('East').should('have.attr', 'name', 'e')

    cy.findByLabelText('North').clear()
    cy.findByText('Please insert North input')

    cy.findByLabelText('South').clear()
    cy.findByText('Please insert South input')

    cy.findByLabelText('West').clear()
    cy.findByText('Please insert West input')

    cy.findByLabelText('East').clear()
    cy.findByText('Please insert East input')
  })
})
