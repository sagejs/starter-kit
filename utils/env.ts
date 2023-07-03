import { z } from 'zod'

// Coerces a string to true if it's "true", false if "false".
const coerceBoolean = z
  .string()
  // only allow "true" or "false" or empty string
  .refine(s => s === 'true' || s === 'false' || s === '')
  // transform to boolean
  .transform(s => s === 'true')
  // make sure tranform worked
  .pipe(z.boolean())

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NUXT_PUBLIC_`.
 */
const publicSchema = z.object({
  NUXT_PUBLIC_ENABLE_STORAGE: coerceBoolean.default('false'),
  NUXT_PUBLIC_ENABLE_SGID: coerceBoolean.default('false'),
  NUXT_PUBLIC_APP_NAME: z.string().default('@sagejs/starter-kit'),
})

/** Feature flags */
const baseR2Schema = z.object({
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_PUBLIC_HOSTNAME: z.string().optional(),
  R2_AVATARS_BUCKET_NAME: z.string().optional(),
})

const r2ServerSchema = z.discriminatedUnion('NUXT_PUBLIC_ENABLE_STORAGE', [
  baseR2Schema.extend({
    NUXT_PUBLIC_ENABLE_STORAGE: z.literal(true),
    // Add required keys if flag is enabled.
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_PUBLIC_HOSTNAME: z.string().min(1),
  }),
  baseR2Schema.extend({
    NUXT_PUBLIC_ENABLE_STORAGE: z.literal(false),
  }),
])

const baseSgidSchema = z.object({
  SGID_CLIENT_ID: z.string().optional(),
  SGID_CLIENT_SECRET: z.string().optional(),
  // Remember to set SGID redirect URI in SGID dev portal.
  SGID_REDIRECT_URI: z.union([z.string().url(), z.string()]).optional(),
  SGID_PRIVATE_KEY: z.string().optional(),
})

const sgidServerSchema = z.discriminatedUnion('NUXT_PUBLIC_ENABLE_SGID', [
  baseSgidSchema.extend({
    NUXT_PUBLIC_ENABLE_SGID: z.literal(true),
    // Add required keys if flag is enabled.
    SGID_CLIENT_ID: z.string().min(1),
    SGID_CLIENT_SECRET: z.string().min(1),
    SGID_PRIVATE_KEY: z.string().min(1),
    SGID_REDIRECT_URI: z.string().url(),
  }),
  baseSgidSchema.extend({
    NUXT_PUBLIC_ENABLE_SGID: z.literal(false),
  }),
])

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const build = z
  .object({
    // https://github.com/unjs/std-env/blob/main/src/index.ts#L32-L38
    NODE_ENV: z.enum(['test', 'development', 'dev', 'production']),

    DATABASE_URL: z.string().url(),
    OTP_EXPIRY: z.coerce.number().positive().optional().default(600),
    POSTMAN_API_KEY: z.string().optional(),
    SENDGRID_API_KEY: z.string().optional(),
    SENDGRID_FROM_ADDRESS: z.union([
      z.string().email().optional(),
      z.string().length(0),
    ]),
    SESSION_SECRET: z.string().min(32),
  })
  // Add on schemas as needed that requires conditional validation.
  .merge(baseR2Schema)
  .merge(baseSgidSchema)
  .merge(publicSchema)
  // Add on refinements as needed for conditional environment variables
  // .superRefine((val, ctx) => ...)
  .superRefine((val, ctx) => {
    const parse = r2ServerSchema.safeParse(val)
    if (!parse.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['NUXT_PUBLIC_ENABLE_STORAGE'],
        message: 'R2 environment variables are missing',
      })
      parse.error.issues.forEach((issue) => {
        ctx.addIssue(issue)
      })
    }
  })
  .superRefine((val, ctx) => {
    const parse = sgidServerSchema.safeParse(val)
    if (!parse.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['NUXT_PUBLIC_ENABLE_SGID'],
        message: 'SGID environment variables are missing',
      })
      parse.error.issues.forEach((issue) => {
        ctx.addIssue(issue)
      })
    }
  })
  .refine(val => !(val.SENDGRID_API_KEY && !val.SENDGRID_FROM_ADDRESS), {
    message: 'SENDGRID_FROM_ADDRESS is required when SENDGRID_API_KEY is set',
    path: ['SENDGRID_FROM_ADDRESS'],
  })

export function validateBuildEnv() {
  const parsed = build.safeParse(process.env)
  if (!parsed.success)
    throw new Error('Invalid environment variables', { cause: parsed.error.flatten().fieldErrors })
}
