import prisma from "../prisma.js";
const isAdmin = async (req, res, next) => {
    const userId = req.user?.id;
    const user = await prisma.foydalanuvchi.findUnique({
        where: { id: userId }
    });
    if (!user) {
        res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        return;
    }
    if (user.role !== 'ADMIN') {
        res.status(403).json({ error: "Foydalanuvchi imkoyati cheklangan" });
        return;
    }
    next();
};
export default isAdmin;
