import React from 'react'
import styled from 'styled-components'

import { CheckIcon } from '@radix-ui/react-icons'

import { BaseButton } from '../index'

import { TMarkdownToJSX } from '../internal'
import { Widget, WidgetHeader, WidgetTitle } from './Widget'

export type Licence = {
  /**
   * The licence id.
   */
  id: string
  /**
   * The licence revision.
   */
  revision: string
  /**
   * The licence label.
   */
  label: string
  /**
   * URL to get Licence markdown content.
   */
  contents_url?: string
  /**
   * URL to get Licence PDF content.
   */
  attachment_url?: string
  /**
   * The licence status. For internal usage.
   */
  accepted?: boolean
}
export interface LicenceWidgetConfiguration {
  type: 'LicenceWidget'
  name: string
  label: string
  help?: string
  details: {
    licences: Licence[]
  }
}

export interface LicenceWidgetProps {
  configuration: LicenceWidgetConfiguration
  /**
   * Pass-through configuration parameters for Markdown parser.
   * TODO: this will change in the future. The licence content is handled externally from the widget.
   */
  markdownParsingOptions?: TMarkdownToJSX.Options
  /**
   * Permitted selections for the widget.
   */
  constraints?: string[]
  /**
   * Licence accept handler. Invoked when the user clicks "Accept terms" for the given licence.
   */
  onLicenceAccept?: (id: string) => void
  /**
   * Licence click handler. Invoked when the user clicks the licence title.
   */
  onLicenceClick?: (licence: Licence) => void
}

/**
 * LicenceWidget. Widget to see and accept Licences.
 */
const LicenceWidget = ({
  configuration,
  markdownParsingOptions: _markdownParsingOptions,
  constraints: _constraints,
  onLicenceAccept,
  onLicenceClick
}: LicenceWidgetProps) => {
  if (!configuration) return null

  const {
    type,
    name,
    label,
    details: { licences }
  } = configuration

  if (type !== 'LicenceWidget') return null

  const handleAccept = (licence: Licence) => {
    const { id } = licence

    onLicenceAccept && onLicenceAccept(id)
  }

  const getLicence = (licence: Licence) => {
    const { id, accepted } = licence
    if (typeof accepted === 'undefined') return null

    return accepted ? (
      <Accepted>
        <AcceptedIcon>
          <CheckIcon />
        </AcceptedIcon>{' '}
        <span>Accepted</span>
      </Accepted>
    ) : (
      <div>
        <NotAccepted>
          You must accept the terms before submitting this request.
        </NotAccepted>
        <AcceptTerms
          id={id}
          onClick={ev => {
            ev.stopPropagation()
            handleAccept(licence)
          }}
        >
          Accept terms
        </AcceptTerms>
      </div>
    )
  }

  return (
    <Widget id={name}>
      <WidgetHeader>
        <WidgetTitle>{label}</WidgetTitle>
      </WidgetHeader>
      {licences.map((licence, index) => {
        const { id, label, accepted, revision, contents_url, attachment_url } =
          licence
        return (
          <div key={id}>
            <Licence key={id}>
              <Label
                onClick={ev => {
                  ev.stopPropagation()
                  onLicenceClick && onLicenceClick(licence)
                }}
              >
                {label}
              </Label>
              {getLicence({
                id,
                label,
                accepted,
                revision,
                contents_url,
                attachment_url
              })}
            </Licence>
            {index + 1 === licences.length ? null : <Separator />}
          </div>
        )
      })}
    </Widget>
  )
}

const Label = styled.button`
  all: unset;
  color: #25408f;
  text-decoration: underline;
  margin-bottom: 0.5em;
`

const Licence = styled.div`
  display: flex;
  flex-flow: column;
  margin-bottom: 2em;
`

const AcceptedIcon = styled.span`
  color: #4caf50;
`

const Accepted = styled.span`
  display: flex;
  flex-flow: row;
  gap: 0.75em;
  align-items: center;
  font-weight: 700;
`

const NotAccepted = styled.span`
  display: block;
  color: #f44336;
  margin-bottom: 0.5em;
`

const AcceptTerms = styled(BaseButton)`
  background: #720d26;
  padding: 0.75em 1em;
  color: #ffff;
  cursor: pointer;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  transition: background 0.3s;
  &:hover {
    background: #941333;
  }
`

const Separator = styled.hr`
  height: 1px;
  background-color: #bcc0cc;
  border: unset;
  margin-bottom: 2em;
`

export { LicenceWidget }
