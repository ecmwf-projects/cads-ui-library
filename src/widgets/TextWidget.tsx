import React from 'react'

import { Markdown } from '../internal/markdown'

import { Widget, WidgetHeader, WidgetTitle } from '../widgets/Widget'

import type { TMarkdownToJSX } from '../internal/markdown'

export interface TextWidgetConfiguration {
  details: {
    id: number
    text: string
  }
  label: string
  name: string
  type: 'FreeEditionWidget'
}

interface TextWidgetProps {
  configuration: TextWidgetConfiguration
  /**
   * Pass-through configuration parameters for Markdown parser.
   */
  markdownParsingOptions?: TMarkdownToJSX.Options
  /**
   * Whether the widget should be functionally and visually disabled.
   */
  inert?: boolean
  /**
   * Whether to hide the widget label from ARIA.
   */
  labelAriaHidden?: boolean
}

/**
 * TextWidget, also known as FreeEditionWidget.
 * Widget to display a block of text. Supports markdown.
 */
const TextWidget = ({
  configuration,
  markdownParsingOptions,
  inert,
  labelAriaHidden = true
}: TextWidgetProps) => {
  if (!configuration) return null

  const {
    details: { text },
    label,
    name,
    type
  } = configuration

  if (type !== 'FreeEditionWidget') return null

  return (
    <Widget data-stylizable='widget'>
      <WidgetHeader>
        <WidgetTitle
          data-stylizable='widget-title'
          htmlFor={name}
          aria-hidden={labelAriaHidden}
        >
          {label}
        </WidgetTitle>
      </WidgetHeader>
      <div data-stylizable='widget text-widget-text'>
        <Markdown
          options={markdownParsingOptions}
          {...(inert && { inert: '' })}
        >
          {text}
        </Markdown>
      </div>
    </Widget>
  )
}

export { TextWidget }
