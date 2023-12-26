import React from 'react'

import { Widget, WidgetHeader, WidgetTitle } from './Widget'

/**
 * BlankWidget.
 * Widget to display a block of any element.
 */
const BlankWidget = ({
  name,
  label,
  children,
  labelAriaHidden = true
}: {
  name?: string
  label?: string
  children: React.ReactNode
  labelAriaHidden?: boolean
}) => {
  return (
    <Widget data-stylizable='widget'>
      {label && (
        <WidgetHeader>
          <WidgetTitle
            data-stylizable='widget-title'
            htmlFor={name}
            aria-hidden={labelAriaHidden}
          >
            {label}
          </WidgetTitle>
        </WidgetHeader>
      )}
      <div data-stylizable='widget blank-widget-text'>{children}</div>
    </Widget>
  )
}

export { BlankWidget }
