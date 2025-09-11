import { Prisma, Valyuta } from '@prisma/client';
import z, { ZodLazy } from 'zod';

const MahsulotLazy: ZodLazy<any> = z.lazy(() => MahsulotSchema) 

export const MahsulotSchema = z.object({
    id: z.string(),
    nomi: z.string().min(2, `Mahsulot nomi kamida 2 ta belgi bo'lishi kerak`),
    olinganNarx: z.number().nonnegative(),
    sotishNarx: z.number().nonnegative(),
    miqdor: z.number().int().nonnegative(),
    razmer: z.string().optional(),
    yaratilganVaqt: z.coerce.date().optional(),
    yangilanganVaqt: z.coerce.date().optional(),
    kategoriya: z.string().min(1, `Kategoriya kiritilishi shart`)
});

export const MahsulotCreate = MahsulotSchema.pick({
    id: true, 
    nomi: true, 
    olinganNarx: true, 
    sotishNarx: true, 
    miqdor: true, 
    kategoriya: true, 
    razmer: true
}).strict();

export const MahsulotUpdate = MahsulotCreate.partial().strict();


export const RasxodSchema = z.object({
    id: z.number().int().nonnegative().optional(),
    summa: z.number().nonnegative(),
    izoh: z.string().min(3, `Izoh kamida 3 belgidan iborat bo'lishi shart`),
    kun: z.coerce.date(),
    valyuta: z.enum(Valyuta).optional()
})

export const RasxodCreate = RasxodSchema.pick({
    summa: true, izoh: true, kun: true, valyuta: true
}).strict();

export const RasxodUpdate = RasxodCreate.partial().strict();

export const RasxodQuerySchema = z
  .object({
    oy: z
      .string()
      .regex(/^\d+$/, "Oy raqami noto'g'ri")
      .refine((val) => {
        const n = Number(val);
        return n >= 1 && n <= 12;
      }, "Oy 1 dan 12 gacha bo'lishi kerak")
      .optional(),
    yil: z
      .string()
      .regex(/^\d+$/, "Yil raqami noto'g'ri")
      .optional(),
  })
  .transform((data) => {
    // default year if month exists but year is missing
    if (data.oy && !data.yil) {
      return { ...data, yil: "2025" };
    }
    return data;
  });

export const SavdoSchema = z.object({
  id: z.number().nonnegative().int().optional(),
  mahsulotId: z.string(),
  mahsulotNomi: z.string(),
  miqdor: z.number().nonnegative().int(),
  tushum: z.number().nonnegative().optional().transform((val) => new Prisma.Decimal(val ?? 0)),
  valyuta: z.enum(Valyuta).optional(),
  yaratilganVaqt: z.coerce.date().optional(),
  mahsulot: MahsulotLazy
}) 

export const SavdoCreate = SavdoSchema.pick({
  mahsulotId: true, mahsulotNomi: true, miqdor: true, tushum: true, valyuta: true, yaratilganVaqt: true
}).strict()

export const SavdoUpdate = SavdoCreate.partial().strict();