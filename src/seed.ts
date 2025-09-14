import prisma from "./prisma.js";

// const user = await prisma.foydalanuvchi.create({
//     data: {
//         ism: 'Lionel',
//         familiya: 'Messi',
//         parol: '12345678',
//         email: 'leomessi@gmail.com'
//     }
// })

// console.log(user)

const emailToken = await prisma.emailVerificationToken.findFirst()

console.log(emailToken)