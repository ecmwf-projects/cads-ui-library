import React from 'react'
import styled from 'styled-components'

import { Tooltip, TooltipArrow } from '../common/Tooltip'

import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'

type Props = {
  helpText: string | null
  triggerAriaLabel: string
}

const WidgetTooltip = ({ helpText, triggerAriaLabel }: Props) => {
  if (!helpText) return null
  return (
    <Tooltip
      triggerProps={{
        asChild: true,
        child: () => (
          <Trigger aria-label={triggerAriaLabel}>
            <StyledQuestionMarkCircledIcon
              focusable={false}
              aria-hidden={true}
            />
          </Trigger>
        )
      }}
      contentProps={{
        child: () => (
          <ContentWrapper>
            <span>{helpText}</span>
            <TooltipArrow />
          </ContentWrapper>
        )
      }}
    />
  )
}

const Trigger = styled.button`
  all: unset;
`

const ContentWrapper = styled.div`
  max-width: 18.75em;
`

const StyledQuestionMarkCircledIcon = styled(QuestionMarkCircledIcon)`
  color: #25408f;
  height: 1.5em;
  width: 1.5em;
  cursor: pointer;
`

export { WidgetTooltip }
