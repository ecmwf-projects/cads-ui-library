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
}

/**
 * TextWidget, also known as FreeEditionWidget.
 * Widget to display a block of text. Markdown supported.
 */
const TextWidget = ({
  configuration,
  markdownParsingOptions
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
    <Widget id={name}>
      <WidgetHeader>
        <WidgetTitle>{label}</WidgetTitle>
      </WidgetHeader>
      <Markdown options={markdownParsingOptions}>{text}</Markdown>
    </Widget>
  )
}

export { TextWidget }
