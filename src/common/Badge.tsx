import React from 'react'
import styled from 'styled-components'
import { variant } from 'styled-system'

const Circle = styled.span<{ variant?: string }>`
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  width: 8px;

  ${variant({
    variants: {
      accepted: {
        backgroundColor: 'secondary'
      },
      running: {
        backgroundColor: 'warning'
      },
      failed: {
        backgroundColor: 'error'
      },
      successful: { backgroundColor: 'success' }
    }
  })}
`

type StatusBadgeProps = {
  children: React.ReactNode
  styledVariant: string
}
const StatusBadge = ({ children, styledVariant }: StatusBadgeProps) => {
  return (
    <Badge variant={styledVariant}>
      <Circle variant={styledVariant} />
      {children}
    </Badge>
  )
}

const Badge = styled.span<{ variant?: string }>`
  align-items: center;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid transparent;
  display: flex;
  font-size: 14px;
  gap: 4px;
  line-height: 21px;
  padding: 0.25em 1em 0.25em 1em;
  width: fit-content;

  ${variant({
    variants: {
      accepted: {
        borderColor: 'secondary'
      },
      running: {
        borderColor: 'warning'
      },
      failed: {
        borderColor: 'error'
      },
      successful: { borderColor: 'success' }
    }
  })}
`

export { Badge, StatusBadge, Circle }
