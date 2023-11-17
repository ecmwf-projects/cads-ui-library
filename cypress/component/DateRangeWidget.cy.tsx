import { getDateRangeWidgetConfiguration } from '../../__tests__/factories'
import { DateRangeWidget } from '../../src'

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
        const formData = new FormData(ev.currentTarget) ?? []
        handleSubmit([...formData.entries()])
      }}
      onChange={ev => {
        console.log('CHANGED')
        ev.preventDefault()
        const formData = new FormData(ev.currentTarget) ?? []
        handleSubmit([...formData.entries()])
      }}
    >
      {children}
      <button style={{ position: 'absolute', bottom: 0 }}>submit</button>
    </form>
  )
}

describe('<DateRangeWidget />', () => {
  afterEach(() => {
    cy.clearLocalStorage()
  })

  it('Renders date range widget', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget configuration={configuration} />
      </Form>
    )
  })
  it('Submits correct value format', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: {
          date_range: ['2023-09-30/2023-10-10']
        }
      })
    )

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget configuration={configuration} />
      </Form>
    )

    cy.findByText('submit').click()

    cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [
      ['date_range', '2023-09-30/2023-10-10']
    ])
  })
  it('Shows start and date date error for upper limit', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          configuration={{
            ...configuration,
            details: {
              ...configuration.details,
              defaultStart: '2024-06-10',
              defaultEnd: '2025-03-30'
            }
          }}
        />
      </Form>
    )

    cy.findByText('Start date cannot exceed the deadline (2024-03-20)').should(
      'exist'
    )
    cy.findByText('End date cannot exceed the deadline (2024-03-20)').should(
      'exist'
    )
  })
  it('Shows start and date date error for lower limit', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)
    cy.clearLocalStorage()

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          configuration={{
            ...configuration,
            details: {
              ...configuration.details,
              defaultStart: '2021-06-10',
              defaultEnd: '2022-03-30'
            }
          }}
        />
      </Form>
    )

    cy.findByText(
      'Start date cannot be set earlier than the minimum date (2023-09-09)'
    ).should('exist')
    cy.findByText(
      'End date cannot be set earlier than the deadline (2023-09-09)'
    ).should('exist')
  })
  it('Shows start date and end date error for order error', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          configuration={{
            ...configuration,
            details: {
              ...configuration.details,
              defaultStart: '2024-02-10'
            }
          }}
        />
      </Form>
    )

    cy.findByText('Start date should be later than End date').should('exist')
  })
  it('Shows invalid start and end date error', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          constraints={['2023-10-12', '2023-10-24']}
          configuration={configuration}
        />
      </Form>
    )

    cy.findAllByText('Date is not valid').should('have.length', 2)
  })
  it('Shows invalid start and end date error', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={console.log}>
        <DateRangeWidget
          error='Dates are required'
          configuration={configuration}
        />
        <input name='text' />
      </Form>
    )

    cy.findByText('Dates are required').should('exist')
  })
})
