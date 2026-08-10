import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(320),

    name: z
      .string()
      .trim()
      .min(1)
      .max(200),
  })
  .strict();

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .optional(),
  })
  .strict();

export const userIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128);

export const userListQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    status: z
      .enum(["active", "suspended", "deactivated"])
      .optional(),

    search: z
      .string()
      .trim()
      .max(200)
      .optional(),
  })
  .strict();

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserListQueryRequest = z.infer<
  typeof userListQuerySchema
>;
