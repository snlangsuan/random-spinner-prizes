import * as zod from 'zod'

export const prizeItemValidatorSchema = zod.object({
  label: zod
    .string({ required_error: 'จำเป็นต้องระบุชื่อ' })
    .min(1, { message: 'ต้องมีความยาว 1 ตัวอักษรขึ้นไป' })
    .max(20, { message: 'ต้องมีความยาวไม่เกิน 20 ตัวอักษร' })
    .trim(),
  id: zod
    .string({ required_error: 'จำเป็นต้องระบุไอดี' })
    .regex(/^[a-z0-9\\_]+$/, 'ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษตัวเล็ก, ตัวเลข และขีดเส้นใต้ (_)')
    .min(5, { message: 'ต้องมีความยาว 5 ตัวอักษรขึ้นไป' })
    .max(50, { message: 'ต้องมีความยาวไม่เกิน 50 ตัวอักษร' })
    .trim(),
  qty: zod.coerce.number({ required_error: 'จำเป็นต้องระบุจำนวนของรางวัล' }),
  weight: zod.coerce.number({ required_error: 'จำเป็นต้องระบุเรทออกรางวัล' }),
  image: zod
    .string({ required_error: 'จำเป็นต้องระบุภาพของรางวัล' })
    .min(1, { message: 'จำเป็นต้องระบุภาพของรางวัล' })
    .trim(),
  color: zod
    .string()
    .regex(/^#([a-fA-F0-9]){3}$|[a-fA-F0-9]{6}$/, 'ข้อมูลไม่ถูกต้อง')
    .optional(),
  bg_color: zod
    .string()
    .regex(/^#([a-fA-F0-9]){3}$|[a-fA-F0-9]{6}$/, 'ข้อมูลไม่ถูกต้อง')
    .optional(),
})
