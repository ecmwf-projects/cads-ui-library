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
  })
  it('Handle individual date contraints', () => {
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
  })
  it('Handle range constraints - pass', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          constraints={['2023-10-11/2023-10-25']}
          configuration={configuration}
        />
      </Form>
    )
  })
  it('Handle range constraints - failed end date', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          constraints={['2023-10-11/2023-10-18']}
          configuration={configuration}
        />
      </Form>
    )
  }),
    it('Handle range constraints - failed start date', () => {
      const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

      cy.viewport(1000, 600)

      const configuration = getDateRangeWidgetConfiguration()

      cy.mount(
        <Form handleSubmit={stubbedHandleSubmit}>
          <DateRangeWidget
            constraints={['2023-10-15/2023-10-24']}
            configuration={configuration}
          />
        </Form>
      )
    }),
    it('Handle mixed constraints - pass', () => {
      const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

      cy.viewport(1000, 600)

      const configuration = getDateRangeWidgetConfiguration()

      cy.mount(
        <Form handleSubmit={stubbedHandleSubmit}>
          <DateRangeWidget
            constraints={['2023-10-17/2023-10-21', '2023-10-12', '2023-10-24']}
            configuration={configuration}
          />
        </Form>
      )
    }),
    it('Handle mixed constraints - failed end date', () => {
      const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

      cy.viewport(1000, 600)

      const configuration = getDateRangeWidgetConfiguration()

      cy.mount(
        <Form handleSubmit={stubbedHandleSubmit}>
          <DateRangeWidget
            constraints={['2023-10-17/2023-10-21', '2023-10-12', '2023-10-30']}
            configuration={configuration}
          />
        </Form>
      )
    }),
    it('Handle mixed constraints - failed start date', () => {
      const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

      cy.viewport(1000, 600)

      const configuration = getDateRangeWidgetConfiguration()

      cy.mount(
        <Form handleSubmit={stubbedHandleSubmit}>
          <DateRangeWidget
            constraints={['2023-10-17/2023-10-21', '2023-10-07', '2023-10-24']}
            configuration={configuration}
          />
        </Form>
      )
    })
  it('Handle multiple range constraints - pass', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(1000, 600)

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          constraints={['2023-10-10/2023-10-25', '2023-11-07/2023-11-24']}
          configuration={configuration}
        />
      </Form>
    )
  })
})
