import './workaround-cypress-10-0-2-process-issue'

import styled from 'styled-components'

import { SingleSelect } from '../../src'

const StyledTestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <StyledWrapper>{children}</StyledWrapper>
}

const StyledWrapper = styled.div`
  font-family: 'Lato', sans-serif;
`

describe('<Select/>', () => {
  it('handles select', () => {
    cy.mount(
      <StyledTestWrapper>
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
            },
            {
              value: '4',
              label:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus sapien sit amet velit egestas, eu consectetur lacus rhoncus. Donec ut turpis et ex congue ornare sed a ligula. Nullam eu rhoncus eros.'
            }
          ]}
          ariaLabel='Thematic activity'
          placeholder='Select an option ...'
          onChange={cy.stub().as('onChange')}
          scrollDownOn={true}
          scrollUpOn={true}
        />
      </StyledTestWrapper>
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
