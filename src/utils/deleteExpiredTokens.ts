import cron from 'node-cron';
import prisma from '../prisma.js';

const task = cron.schedule('0 2 * * *', async () => {
    try{
        console.log("Running cron job: deleting expired tokens")

        await prisma.refreshToken.deleteMany({
            where: {
                yaratilganVaqt: {
                    lte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        })

        console.log("Expired refresh tokens are cleaned");

        await prisma.emailVerificationToken.deleteMany({
            where: {
                muddati: {
                    lte: new Date()
                }
            }
        })

        console.log("Email Verification tokens are cleaned");
    } catch(err){
        console.error("Cron job error while deleting expired tokens", err)
    }
}, {
    timezone: 'Asia/Tashkent',
})

task.stop()

export default task;