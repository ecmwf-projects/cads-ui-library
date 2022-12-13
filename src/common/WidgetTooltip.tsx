import React from 'react'
import styled from 'styled-components'

import { Tooltip, TooltipArrow } from '../common/Tooltip'

import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'

type Props = {
  helpText: string | null
}

const WidgetTooltip = ({ helpText }: Props) => {
  if (!helpText) return null
  return (
    <Tooltip
      triggerProps={{
        asChild: true,
        child: () => <StyledQuestionMarkCircledIcon />
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
