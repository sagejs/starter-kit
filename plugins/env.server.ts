import { z } from 'zod'
import { useLogger } from '@nuxt/kit'

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const client = z.object({
  public: z.object({
    enableStorage: z.boolean(),
    enableSgid: z.boolean(),
    appName: z.string().optional(),
  }),
})

/** Feature flags */
const baseR2Schema = z.object({
  r2: z.object({
    accessKeyId: z.string().optional(),
    accountId: z.string().optional(),
    secretAccessKey: z.string().optional(),
    publicHostname: z.string().optional(),
    avatarsBucketName: z.string().optional(),
  }),
})

const r2ServerSchema = z.object({
  r2: z.object({
    accessKeyId: z.string().min(1),
    accountId: z.string().min(1),
    secretAccessKey: z.string().min(1),
    publicHostname: z.string().min(1),
    avatarsBucketName: z.string().min(1),
  }),
})

const baseSgidSchema = z.object({
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  redirectUri: z.union([z.string().url(), z.string()]).optional(),
  privateKey: z.string().optional(),
})

const sgidServerSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  redirectUri: z.string().url(),
  privateKey: z.string().min(1),
})

const sendgridSchema = z.object({
  sendgrid: z.object({
    apiKey: z.string().optional(),
    fromAddress: z.union([
      z.string().email().optional(),
      z.string().length(0),
    ]),
  }),
})

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z
  .object({
    databaseUrl: z.string().url(),
    otpExpiry: z.coerce.number().positive().optional().default(600),
    postmanApiKey: z.string().optional(),
    sessionSecret: z.string().min(32),
  })
  // Add on schemas as needed that requires conditional validation.
  .merge(baseR2Schema)
  .merge(baseSgidSchema)
  .merge(sendgridSchema)
  .merge(client)
  // Add on refinements as needed for conditional environment variables
  // .superRefine((val, ctx) => ...)
  .superRefine((val, ctx) => {
    if (!val.public.enableStorage)
      return

    const parse = r2ServerSchema.safeParse(val)
    if (!parse.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['public.enableStorage'],
        message: 'R2 environment variables are missing',
      })
      parse.error.issues.forEach((issue) => {
        ctx.addIssue(issue)
      })
    }
  })
  .superRefine((val, ctx) => {
    if (!val.public.enableSgid)
      return

    const parse = sgidServerSchema.safeParse(val)
    if (!parse.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['public.enableSgid'],
        message: 'SGID environment variables are missing',
      })
      parse.error.issues.forEach((issue) => {
        ctx.addIssue(issue)
      })
    }
  })
  .refine(val => !(val.sendgrid.apiKey && !val.sendgrid.fromAddress), {
    message: 'sendgrid.fromAddress is required when sendgrid.apiKey is set',
    path: ['sendgrid.fromAddress'],
  })

let init = false
export default defineNuxtPlugin(() => {
  if (init)
    return

  const logger = useLogger('plugins/env.server.ts')
  const config = useRuntimeConfig()

  if (config.skipEnvValidation) {
    logger.info('skipping env validation')
    return
  }

  logger.info('running env validation')

  const parsed = server.safeParse(config)
  if (!parsed.success) {
    logger.error('invalid environment variables: \n', parsed.error.flatten().fieldErrors)
    return
  }

  logger.info('passed env validation')
  init = true
})
