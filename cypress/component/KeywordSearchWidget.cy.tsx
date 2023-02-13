import './workaround-cypress-10-0-2-process-issue'

import styled from 'styled-components'

import { KeywordSearchWidget } from '../../src'

const StyledTestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <StyledWrapper>{children}</StyledWrapper>
}

const StyledWrapper = styled.div`
  font-family: 'Lato', sans-serif;

  [data-stylizable='accordion-single-trigger'] {
    padding: 0.5em;
    background-color: #e6e9f2;
  }
`

describe('<KeywordSearchWidget />', () => {
  it('handles keywords', () => {
    cy.viewport(312, 800)

    const categories = [
      {
        category: 'Spatial coverage',
        groups: {
          Global: null,
          Europe: 12
        }
      },
      {
        category: 'Temporal coverage',
        groups: {
          Past: null
        }
      },
      {
        category: 'Variable domain',
        groups: {
          'Atmosphere (composition)': 12,
          'Atmosphere (physical)': null,
          'Land (cryosphere)': null
        }
      }
    ]

    cy.mount(
      <StyledTestWrapper>
        <KeywordSearchWidget
          categories={categories}
          onKeywordSelection={cy.stub().as('onKeywordSelection')}
        />
      </StyledTestWrapper>
    )

    cy.findByText('Spatial coverage').click()
    cy.findByText(/Global/i).click()
    cy.findByText(/Europe/i)

    cy.findByText('Spatial coverage').click()
    cy.findByText('Temporal coverage').click()
    cy.findByText(/Past/i)

    cy.findByText('Variable domain').click()
    cy.findByText(/Atmosphere \(composition\)/i).click()
    cy.findByText('Land (cryosphere)').click()

    /**
     * Test selection persistence for closed/open accordion
     */

    cy.findByText('Variable domain').click().click()
    cy.findByLabelText(/Atmosphere \(composition\)/i).should(
      'have.attr',
      'aria-checked',
      'true'
    )
    cy.findByLabelText('Land (cryosphere)').should(
      'have.attr',
      'aria-checked',
      'true'
    )

    cy.get('@onKeywordSelection').should('have.been.calledThrice')

    cy.get('@onKeywordSelection')
      .its('firstCall.args.0')
      .then(searchParams => {
        expect(searchParams.getAll('kw')).to.deep.equal([
          'Spatial%20coverage%3A%20Global'
        ])
      })

    cy.get('@onKeywordSelection')
      .its('secondCall.args.0')
      .then(searchParams => {
        expect(searchParams.getAll('kw')).to.deep.equal([
          'Spatial%20coverage%3A%20Global',
          'Variable%20domain%3A%20Atmosphere%20(composition)'
        ])
      })

    cy.get('@onKeywordSelection')
      .its('thirdCall.args.0')
      .then(searchParams => {
        expect(searchParams.getAll('kw')).to.deep.equal([
          'Spatial%20coverage%3A%20Global',
          'Variable%20domain%3A%20Atmosphere%20(composition)',
          'Variable%20domain%3A%20Land%20(cryosphere)'
        ])
      })
  })

  it('handles selection restore and clean up', () => {
    cy.viewport('macbook-11')

    cy.mount(
      <KeywordSearchWidget
        categories={[
          {
            category: 'Spatial coverage',
            groups: {
              Global: 27,
              Europe: 12
            }
          },
          {
            category: 'Temporal coverage',
            groups: {
              Past: 18
            }
          },
          {
            category: 'Variable domain',
            groups: {
              'Atmosphere (composition)': 12,
              'Atmosphere (physical)': 22,
              'Land (cryosphere)': 12
            }
          }
        ]}
        onKeywordSelection={cy.stub().as('onKeywordSelection')}
      />
    ).then(({ rerender }) => {
      cy.findByText('Spatial coverage').click()
      cy.findByText(/Global/i).click()

      cy.findByText('Variable domain').click()
      cy.findByText(/Atmosphere \(composition\)/i).click()
      cy.findByText('Land (cryosphere)').click()

      cy.findByText('Variable domain').click()

      cy.log(
        "Re-render with new props, removing 'Global' and 'Land (cryosphere)' from the list of keywords"
      )
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              category: 'Spatial coverage',
              groups: {
                Europe: 12
              }
            },
            {
              category: 'Temporal coverage',
              groups: {
                Past: 18
              }
            },
            {
              category: 'Variable domain',
              groups: {
                'Atmosphere (composition)': 12,
                'Atmosphere (physical)': 22
              }
            }
          ]}
        />
      )

      cy.log(
        "Re-render with new props, adding 'Global' and 'Land (cryosphere)' again."
      )
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              category: 'Spatial coverage',
              groups: {
                Global: 27,
                Europe: 12
              }
            },
            {
              category: 'Temporal coverage',
              groups: {
                Past: 18
              }
            },
            {
              category: 'Variable domain',
              groups: {
                'Atmosphere (composition)': 12,
                'Atmosphere (physical)': 22,
                'Land (cryosphere)': 12
              }
            }
          ]}
        />
      )

      cy.get('@onKeywordSelection')
        .its('thirdCall.args.0')
        .then(searchParams => {
          expect(searchParams.getAll('kw')).to.deep.equal([
            'Spatial%20coverage%3A%20Global',
            'Variable%20domain%3A%20Atmosphere%20(composition)',
            'Variable%20domain%3A%20Land%20(cryosphere)'
          ])
        })

      cy.findByLabelText(/Europe/i).should('have.attr', 'aria-checked', 'false')

      cy.findByText('Variable domain').click()

      cy.findByLabelText(/Global/i).should('have.attr', 'aria-checked', 'false')

      cy.findByText('Variable domain').click().click()

      cy.findByLabelText('Land (cryosphere)').should(
        'have.attr',
        'aria-checked',
        'false'
      )

      cy.findByLabelText(/Atmosphere \(composition\)/i).should(
        'have.attr',
        'aria-checked',
        'true'
      )

      cy.findByText(/Europe/i).click()
      cy.findByText('Land (cryosphere)').click()
      cy.findByText('Atmosphere (physical)').click()

      cy.log(
        "Re-render with new props, removing 'Variable domain' from the categories."
      )
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              category: 'Spatial coverage',
              groups: {
                Europe: 12
              }
            },
            {
              category: 'Temporal coverage',
              groups: {
                Past: 18
              }
            }
          ]}
        />
      )

      cy.log("Re-render with new props, restoring 'Variable domain'.")
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              category: 'Spatial coverage',
              groups: {
                Global: 27,
                Europe: 12
              }
            },
            {
              category: 'Temporal coverage',
              groups: {
                Past: 18
              }
            },
            {
              category: 'Variable domain',
              groups: {
                'Atmosphere (composition)': 12,
                'Atmosphere (physical)': 22,
                'Land (cryosphere)': 12
              }
            }
          ]}
        />
      )

      cy.findByLabelText(/Europe/i).should('have.attr', 'aria-checked', 'true')

      cy.findByText('Variable domain').click()
      cy.findByLabelText('Land (cryosphere)').should(
        'have.attr',
        'aria-checked',
        'false'
      )
      cy.findByLabelText('Atmosphere (physical)').should(
        'have.attr',
        'aria-checked',
        'false'
      )
    })
  })
})
