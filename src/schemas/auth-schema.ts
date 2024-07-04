import {z} from 'zod'

export const RegisterSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
  // role_id: z.number()
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})