import React from 'react'
import styled from 'styled-components'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode
  isFullWidth?: boolean
}

const Base = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isFullWidth, ...props }, ref) => {
    return (
      <StyledBaseButton ref={ref} isFullWidth={isFullWidth} {...props}>
        {children}
      </StyledBaseButton>
    )
  }
)

const StyledBaseButton = styled.button<ButtonProps>`
  display: ${({ isFullWidth }) => (isFullWidth ? 'block' : 'inline-block')};
  width: ${({ isFullWidth }) => isFullWidth && '100%'};
  cursor: pointer;
`

Base.displayName = 'Button'

export { Base }
