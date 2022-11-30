import React from 'react'
import { render, screen } from '@testing-library/react'

import { LicenceWidget } from '../../src'

describe('<LicenceWidget/>', () => {
  it('renders from configuration', () => {
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
            attachment_url: ''
          }
        ]
      }
    }

    render(<LicenceWidget configuration={configuration} />)
    screen.getByText('Terms of use')
    screen.getByText('Licence to use Copernicus products')
  })

  it('renders from configuration w licence status', () => {
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

    render(<LicenceWidget configuration={configuration} />)
    screen.getByText('Terms of use')
    screen.getByText('Licence to use Copernicus products')
    screen.getByText(/accepted/i)
    screen.getByText('Additional licence to use non European contributions')
    screen.getByText(
      /you must accept the terms before submitting this request/i
    )
    screen.getByText(/accept terms/i)
  })

  it.todo('enforces constraints')
})
