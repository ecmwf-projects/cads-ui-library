import './workaround-cypress-10-0-2-process-issue'
import { useState } from 'react'

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
        label: 'Spatial coverage',
        groups: {
          Global: 27,
          Europe: 12
        }
      },
      {
        label: 'Temporal coverage',
        groups: {
          Past: 18
        }
      },
      {
        label: 'Variable domain',
        groups: {
          'Atmosphere (composition)': 12,
          'Atmosphere (physical)': 22,
          'Land (cryosphere)': 12
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

    cy.findByText(/Global/i).click()
    cy.findByText(/Europe/i)
    cy.findByText(/Past/i)
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
        expect(searchParams.get('Spatial coverage')).to.equal('Global')
      })

    cy.get('@onKeywordSelection')
      .its('secondCall.args.0')
      .then(searchParams => {
        expect(searchParams.get('Spatial coverage')).to.equal('Global')
        expect(searchParams.get('Variable domain')).to.equal(
          'Atmosphere (composition)'
        )
        expect(searchParams.get('Temporal coverage')).to.be.null
      })

    cy.get('@onKeywordSelection')
      .its('thirdCall.args.0')
      .then(searchParams => {
        expect(searchParams.get('Spatial coverage')).to.equal('Global')
        expect(searchParams.getAll('Variable domain')).to.deep.equal([
          'Atmosphere (composition)',
          'Land (cryosphere)'
        ])
        expect(searchParams.get('Temporal coverage')).to.be.null
      })
  })

  it('handles selection restore and clean up', () => {
    cy.viewport('macbook-11')

    cy.mount(
      <KeywordSearchWidget
        categories={[
          {
            label: 'Spatial coverage',
            groups: {
              Global: 27,
              Europe: 12
            }
          },
          {
            label: 'Temporal coverage',
            groups: {
              Past: 18
            }
          },
          {
            label: 'Variable domain',
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
      cy.findByText(/Global/i).click()
      cy.findByText(/Atmosphere \(composition\)/i).click()
      cy.findByText('Land (cryosphere)').click()

      /**
       * Re-render with new props, removing 'Global' from the list of keywords.
       */
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              label: 'Spatial coverage',
              groups: {
                Europe: 12
              }
            },
            {
              label: 'Temporal coverage',
              groups: {
                Past: 18
              }
            },
            {
              label: 'Variable domain',
              groups: {
                'Atmosphere (composition)': 12,
                'Atmosphere (physical)': 22
              }
            }
          ]}
        />
      )

      /**
       * Re-render with new props, adding 'Global' again
       */
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              label: 'Spatial coverage',
              groups: {
                Global: 27,
                Europe: 12
              }
            },
            {
              label: 'Temporal coverage',
              groups: {
                Past: 18
              }
            },
            {
              label: 'Variable domain',
              groups: {
                'Atmosphere (composition)': 12,
                'Atmosphere (physical)': 22,
                'Land (cryosphere)': 12
              }
            }
          ]}
        />
      )

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

      /**
       * Re-render with new props, removing 'Variable domain' from the categories.
       */
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              label: 'Spatial coverage',
              groups: {
                Europe: 12
              }
            },
            {
              label: 'Temporal coverage',
              groups: {
                Past: 18
              }
            }
          ]}
        />
      )

      /**
       * Re-render with new props, restoring 'Variable domain'.
       */
      rerender(
        <KeywordSearchWidget
          categories={[
            {
              label: 'Spatial coverage',
              groups: {
                Global: 27,
                Europe: 12
              }
            },
            {
              label: 'Temporal coverage',
              groups: {
                Past: 18
              }
            },
            {
              label: 'Variable domain',
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
