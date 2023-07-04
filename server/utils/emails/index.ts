import { createElement } from 'react'
import { Html } from '@react-email/html'
import { Heading } from '@react-email/heading'
import { Text } from '@react-email/text'
import { Tailwind } from '@react-email/tailwind'
import { Head } from '@react-email/head'
import { Hr } from '@react-email/hr'
import { Font } from '@react-email/font'

const h = createElement

export function EmailVerification({
  appName = '@sagejs/starter-kit',
  code = '',
}: {
  appName?: string
  code: string
}) {
  return (
    h(
      Tailwind,
      null,
      h(
        Html,
        {
          lang: 'en',
        },
        h(
          Head,
          null,
          h(Font, {
            fontFamily: 'Inter',
            fallbackFontFamily: 'Arial',
            webFont: {
              url: 'https://fonts.bunny.net/inter/files/inter-latin-700-normal.woff2',
              format: 'woff2',
            },
            fontWeight: 700,
            fontStyle: 'semibold',
          }),
          h(Font, {
            fontFamily: 'Inter',
            fallbackFontFamily: 'Arial',
            webFont: {
              url: 'https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff2',
              format: 'woff2',
            },
            fontWeight: 400,
            fontStyle: 'normal',
          }),
        ),
        h(
          'div',
          {
            className: 'p-3',
          },
          h(
            'span',
            null,
            h(
              Heading,
              {
                as: 'h1',
                className: 'my-4 text-sm',
              },
              appName,
              h(
                'span',
                {
                  className: 'font-normal',
                },
                ' ',
                'Verification Code',
              ),
            ),
          ),
          h(Hr, null),
          h(
            Text,
            null,
            'Your verification code is: ',
            code,
          ),
        ),
      ),
    )
  )
}
