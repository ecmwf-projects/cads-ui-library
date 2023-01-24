import './workaround-cypress-10-0-2-process-issue'

import styled from 'styled-components'

import { SingleSelect, Label } from '../../src'

const StyledTestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <StyledWrapper>{children}</StyledWrapper>
}

const StyledWrapper = styled.div`
  font-family: 'Lato', sans-serif;

  [role='combobox'] {
    width: 400px;

    margin-top: 10px;

    &:hover,
    &:focus {
      background-color: #dadada;
    }
  }

  [role='option'] {
    &:hover,
    &:focus {
      background-color: #dadada;
    }
  }
`

describe('<Select/>', () => {
  it('handles select', () => {
    cy.mount(
      <StyledTestWrapper>
        <Label htmlFor='thematic-activity'>Thematic activity</Label>
        <SingleSelect
          options={[
            {
              id: 8,
              label: 'Air quality and atmospheric composition'
            },
            {
              id: 3,
              label: 'Arctic policy, polar areas'
            },
            {
              id: 11,
              label: 'Climate change'
            },
            {
              id: 5,
              label: 'Energy'
            },
            {
              id: 6,
              label: 'Environmental compliance'
            },
            {
              id: 12,
              label: 'European Civil Protection and Humanitarian Aid Operations'
            },
            {
              id: 9,
              label: 'Health'
            },
            {
              id: 13,
              label: 'International development and cooperation'
            },
            {
              id: 1,
              label: 'Land'
            },
            {
              id: 2,
              label: 'Marine environment, maritime affairs, fisheries'
            },
            {
              id: 14,
              label: 'Migration/home affairs'
            },
            {
              id: 17,
              label: 'Other'
            },
            {
              id: 7,
              label: 'Raw materials'
            },
            {
              id: 16,
              label: 'Research/innovation'
            },
            {
              id: 15,
              label: 'Security'
            },
            {
              id: 10,
              label: 'Tourism'
            },
            {
              id: 4,
              label: 'Transport'
            }
          ]}
          ariaLabel='Thematic activity'
          placeholder='Select an option ...'
          onChange={cy.stub().as('onChange')}
          scrollDownOn={true}
          scrollUpOn={true}
          name='thematic-activity'
          id='thematic-activity'
        />
      </StyledTestWrapper>
    )

    cy.findByLabelText('Thematic activity').click()
    cy.findByText('Air quality and atmospheric composition').click()

    cy.findByLabelText('Thematic activity').click()
    cy.findByText(
      'European Civil Protection and Humanitarian Aid Operations'
    ).click()

    cy.get('@onChange').should('have.been.calledTwice')

    cy.get('@onChange').its('firstCall.args.0').should('eq', '8')
    cy.get('@onChange').its('secondCall.args.0').should('eq', '12')
  })
})
