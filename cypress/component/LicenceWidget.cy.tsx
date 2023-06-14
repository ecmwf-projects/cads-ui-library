import { LicenceWidget } from '../../src'
import { TooltipProvider } from '@radix-ui/react-tooltip'

describe('<LicenceWidget />', () => {
  it('handles accept', () => {
    const configuration = {
      type: 'LicenceWidget' as const,
      name: 'licences',
      label: 'Terms of use',
      help: 'Terms of use',
      details: {
        licences: [
          {
            id: 'licence-xyz',
            revision: 2,
            label: 'Licence to use Copernicus products',
            contents_url: '',
            attachment_url: '',
            accepted: true
          },
          {
            id: 'licence-abc',
            revision: 3,
            label: 'Additional licence to use non European contributions',
            contents_url: '',
            attachment_url: '',
            accepted: false
          }
        ]
      }
    }

    cy.mount(
      <TooltipProvider>
        <LicenceWidget
          configuration={configuration}
          onLicenceAccept={cy.stub().as('onLicenceAccept')}
        />
      </TooltipProvider>
    )
    cy.findByText(/accept terms/i).click()

    cy.get('@onLicenceAccept')
      .should('have.been.calledOnce')
      .its('firstCall.args.0')
      .should('deep.equal', {
        id: 'licence-abc',
        label: 'Additional licence to use non European contributions',
        accepted: false,
        revision: 3,
        contents_url: '',
        attachment_url: ''
      })
  })

  it('handles licence click', () => {
    const configuration = {
      type: 'LicenceWidget' as const,
      name: 'licences',
      label: 'Terms of use',
      help: 'Terms of use',
      details: {
        licences: [
          {
            id: 'licence-xyz',
            revision: 3,
            label: 'Licence to use Copernicus products',
            contents_url: '',
            attachment_url: '',
            accepted: true
          },
          {
            id: 'licence-abc',
            revision: 3,
            label: 'Additional licence to use non European contributions',
            contents_url: '',
            attachment_url: '',
            accepted: false
          }
        ]
      }
    }

    cy.mount(
      <TooltipProvider>
        <LicenceWidget
          configuration={configuration}
          onLicenceClick={cy.stub().as('onLicenceClick')}
        />
      </TooltipProvider>
    )
    cy.findByText('Licence to use Copernicus products').click()

    cy.get('@onLicenceClick')
      .should('have.been.calledOnce')
      .its('firstCall.args.0')
      .should('deep.equal', {
        id: 'licence-xyz',
        revision: 3,
        label: 'Licence to use Copernicus products',
        contents_url: '',
        attachment_url: '',
        accepted: true
      })
  })
})
