import React from 'react'
import { render, screen } from '@testing-library/react'

import { Tabs, StyledTabTrigger as TabTrigger } from '../../src'
import { TabsContent } from '@radix-ui/react-tabs'

describe('<Tabs/>', () => {
  it('renders', () => {
    const tabs = [
      {
        value: 'first tab',
        trigger: 'first trigger',
        content: () => <p>first content</p>
      },
      {
        value: 'second tab',
        trigger: 'second trigger',
        content: () => <p>second content</p>
      }
    ]

    render(
      <Tabs
        rootProps={{ defaultValue: 'first tab' }}
        triggers={() =>
          tabs.map(({ value, trigger }) => {
            return (
              <TabTrigger value={value} key={`trigger_${value}`}>
                {trigger}
              </TabTrigger>
            )
          })
        }
        contents={() =>
          tabs.map(({ value, content }) => {
            return (
              <TabsContent value={value} key={`content_${value}`}>
                {content()}
              </TabsContent>
            )
          })
        }
      />
    )

    screen.getByText('first content')
  })
})
