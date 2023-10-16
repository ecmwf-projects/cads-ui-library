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

  it('test', () => {
    const stubbedHandleSubmit = cy.stub().as('stubbedHandleSubmit')

    cy.viewport(700, 600)

    localStorage.setItem(
      'formSelection',
      JSON.stringify({
        dataset: 'fake',
        inputs: {
          date_range_start: '2023-09-30',
          date_range_end: '2023-10-10'
        }
      })
    )

    const configuration = getDateRangeWidgetConfiguration()

    cy.mount(
      <Form handleSubmit={stubbedHandleSubmit}>
        <DateRangeWidget
          configuration={configuration}
          constraints={['2023-10-05', '2023-10-11', '2023-10-30']}
          error='Start date and End date are required'
        />
      </Form>
    )
    // cy.get('[data-trigger="true"]').first().click()
    // cy.findByText('15').trigger('pointerdown', {
    //   pointerId: 0,
    //   force: true
    // })
    // cy.findByText('submit').click({ force: true })

    // cy.get('@stubbedHandleSubmit').should('have.been.calledWith', [
    //   ['date_range_start', '2023-09-30'],
    //   ['date_range_end', '2023-10-10']
    // ])
  })
})
