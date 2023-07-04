import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { verifyToken } from '../../services/auth'
import { VerificationError } from '../../services/auth.error'
import { publicProcedure, router } from '../../trpc'

export const emailSessionRouter = router({
  // Generate OTP.
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input: { email } }) => {
      // TODO: instead of storing expires, store issuedAt to calculate when the next otp can be re-issued
      // TODO: rate limit this endpoint also
      const expires = new Date(Date.now() + useRuntimeConfig().otpExpiry * 1000)
      const token = createVfnToken()
      const hashedToken = createTokenHash(token, email)

      // May have one of them fail,
      // so users may get an email but not have the token saved, but that should be fine.
      await Promise.all([
        ctx.prisma.verificationToken.upsert({
          where: {
            identifier: email,
          },
          update: {
            token: hashedToken,
            expires,
            attempts: 0,
          },
          create: {
            identifier: email,
            token: hashedToken,
            expires,
          },
        }),
        resend.sendEmail({
          from: 'onboarding@resend.dev',
          to: 'delivered@resend.dev',
          subject: 'Login verification code',
          react: EmailVerification({
            code: token,
          }),
        }),
      ])
      return email
    }),
  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input: { email, otp } }) => {
      try {
        await verifyToken(ctx.prisma, {
          token: otp,
          email,
        })
      }
      catch (e) {
        if (e instanceof VerificationError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: e.message,
            cause: e,
          })
        }
        throw e
      }

      const user = await ctx.prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          emailVerified: new Date(),
          name: email.split('@')[0],
        },
        select: defaultUserSelect,
      })

      await ctx.session.update<SessionData>({
        id: user.id,
      })

      await ctx.session.seal()

      return user
    }),
})