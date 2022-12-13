import './workaround-cypress-10-0-2-process-issue'

import { LicenceWidget } from '../../src'

describe('<LicenceWidget />', () => {
  it('handles accept', () => {
    const configuration = {
      type: 'LicenceWidget' as const,
      name: 'licences',
      label: 'Terms of use',
      details: {
        licences: [
          {
            id: 'licence-xyz',
            revision: '3',
            label: 'Licence to use Copernicus products',
            contents_url: '',
            attachment_url: '',
            accepted: true
          },
          {
            id: 'licence-abc',
            revision: '3',
            label: 'Additional licence to use non European contributions',
            contents_url: '',
            attachment_url: '',
            accepted: false
          }
        ]
      }
    }

    cy.mount(
      <LicenceWidget
        configuration={configuration}
        onLicenceAccept={cy.stub().as('onLicenceAccept')}
      />
    )
    cy.findByText(/accept terms/i).click()

    cy.get('@onLicenceAccept')
      .should('have.been.calledOnce')
      .its('firstCall.args.0')
      .should('eq', 'licence-abc')
  })

  it('handles licence click', () => {
    const configuration = {
      type: 'LicenceWidget' as const,
      name: 'licences',
      label: 'Terms of use',
      details: {
        licences: [
          {
            id: 'licence-xyz',
            revision: '3',
            label: 'Licence to use Copernicus products',
            contents_url: '',
            attachment_url: '',
            accepted: true
          },
          {
            id: 'licence-abc',
            revision: '3',
            label: 'Additional licence to use non European contributions',
            contents_url: '',
            attachment_url: '',
            accepted: false
          }
        ]
      }
    }

    cy.mount(
      <LicenceWidget
        configuration={configuration}
        onLicenceClick={cy.stub().as('onLicenceClick')}
      />
    )
    cy.findByText('Licence to use Copernicus products').click()

    cy.get('@onLicenceClick')
      .should('have.been.calledOnce')
      .its('firstCall.args.0')
      .should('deep.equal', {
        id: 'licence-xyz',
        revision: '3',
        label: 'Licence to use Copernicus products',
        contents_url: '',
        attachment_url: '',
        accepted: true
      })
  })
})
