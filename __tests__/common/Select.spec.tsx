import React from 'react'
import { render, screen } from '@testing-library/react'

import { SingleSelect } from '../../src'

describe('Select components', () => {
  describe('<SingleSelect />', () => {
    it('renders', () => {
      render(
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
          onChange={() => void 0}
        />
      )

      screen.getByLabelText('Thematic activity')
    })

    it('fails gracefully', () => {
      render(
        // @ts-expect-error
        <SingleSelect
          ariaLabel='Thematic activity'
          placeholder='Select an option ...'
        />
      )
    })
  })
})
