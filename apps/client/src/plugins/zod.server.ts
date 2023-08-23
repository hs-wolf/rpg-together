import { z } from 'zod'

export default defineNuxtPlugin(({ hook, $i18n }) => {
  hook('app:created', () => {
    const { t } = $i18n

    z.setErrorMap((issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_type) {
        if (issue.expected === 'string' && issue.received === 'undefined')
          return { message: t('zod-errors.required') }

        if (issue.expected === 'number') {
          if (issue.received === 'undefined')
            return { message: t('zod-errors.required') }

          return { message: t('zod-errors.not-number') }
        }
        if (issue.expected === 'date') {
          if (issue.received === 'undefined')
            return { message: t('zod-errors.required') }

          return { message: t('zod-errors.not-date') }
        }
      }
      if (issue.code === z.ZodIssueCode.invalid_string) {
        if (issue.validation === 'email')
          return { message: t('zod-errors.email') }
      }
      if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.type === 'string') {
          if (issue.minimum > 1)
            return { message: t('zod-errors.min', { min: issue.minimum }) }

          return { message: t('zod-errors.required') }
        }
      }
      if (issue.code === z.ZodIssueCode.too_big) {
        if (issue.type === 'string')
          return { message: t('zod-errors.max', { min: issue.maximum }) }
      }
      if (issue.code === z.ZodIssueCode.invalid_date)
        return { message: t('zod-errors.not-date') }

      return { message: ctx.defaultError }
    })
  })
})
