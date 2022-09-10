import React from 'react'
import styled from 'styled-components'

import { Root, List, Trigger, Content } from '@radix-ui/react-tabs'

import type {
  TabsProps as RootTabsProps,
  TabsListProps
} from '@radix-ui/react-tabs'

export type TabsProps = {
  rootProps?: RootTabsProps
  listProps?: TabsListProps
  triggers: () => React.ReactNode
  contents: () => React.ReactNode
}

const Tabs = ({ rootProps, listProps, triggers, contents }: TabsProps) => {
  return (
    <StyledTabRoot {...rootProps}>
      <StyledTabList {...listProps}>{triggers()}</StyledTabList>
      {contents()}
    </StyledTabRoot>
  )
}

const StyledTabRoot = styled(Root)`
  display: flex;
  flex-flow: column;
`

const StyledTabList = styled(List)`
  background-color: white;
  width: fit-content;
`

const StyledTabTrigger = styled(Trigger)`
  all: unset;
`

const StyledTabContent = styled(Content)``

/**
 * We also export for convenience the set of baseline styled primitives that can be further customized in portals.
 */
export { Tabs, StyledTabTrigger, StyledTabContent }
