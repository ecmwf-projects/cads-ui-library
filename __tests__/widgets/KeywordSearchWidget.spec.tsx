import React from 'react'
import { render, screen } from '@testing-library/react'

import { KeywordSearchWidget } from '../../src'

describe('<KeywordSearchWidget/>', () => {
  it('renders from configuration', () => {
    render(
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
            label: 'Variable domain',
            groups: {
              'Atmosphere (composition)': 12,
              'Atmosphere (physical)': 22,
              'Land (cryosphere)': 12
            }
          }
        ]}
        onKeywordSelection={jest.fn()}
      />
    )

    screen.getByLabelText('Spatial coverage')
    screen.getByLabelText('Variable domain')
    screen.getByText('Global')
    screen.getByText('Europe')
    screen.getByText('Atmosphere (composition)')
  })
})
