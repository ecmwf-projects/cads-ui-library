import './workaround-cypress-10-0-2-process-issue'

import { SingleSelect } from '../../src'

describe('<Select/>', () => {
  it('handles select', () => {
    cy.mount(
      <SingleSelect
        options={[
          {
            value: '1',
            label:
              'Policy support - support to EU policy or EU national or regional policy'
          },
          {
            value: '2',
            label: 'A'
          },
          {
            value: '3',
            label: 'BA'
          }
        ]}
        ariaLabel='Thematic activity'
        placeholder='Select an option ...'
        onChange={cy.stub().as('onChange')}
      />
    )

    cy.findByLabelText('Thematic activity').click()
    cy.findByText('BA').click()

    cy.findByLabelText('Thematic activity').click()
    cy.findByText(
      'Policy support - support to EU policy or EU national or regional policy'
    ).click()

    cy.get('@onChange').should('have.been.calledTwice')

    cy.get('@onChange').its('firstCall.args.0').should('eq', '3')
    cy.get('@onChange').its('secondCall.args.0').should('eq', '1')
  })
})
