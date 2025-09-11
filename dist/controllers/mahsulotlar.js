import prisma from "../prisma.js";
export const getMahsulotlar = async (req, res) => {
    const categoryQuery = req.query.kategoriya;
    console.log(categoryQuery);
    const mahsulotlar = await prisma.mahsulot.findMany({
        where: categoryQuery ? { kategoriya: { nomi: categoryQuery } } : undefined,
        orderBy: {
            yaratilganVaqt: 'desc'
        },
        include: {
            kategoriya: true
        },
        omit: {
            kategoriyaId: true
        }
    });
    const response = mahsulotlar.map((mahsulot) => ({
        ...mahsulot,
        kategoriya: mahsulot.kategoriya.nomi
    }));
    res.json({ mahsulotlar: response });
};
export const createMahsulot = async (req, res) => {
    const { kategoriya, ...rest } = req.body;
    const mahsulot = await prisma.mahsulot.create({
        data: {
            ...rest,
            kategoriya: {
                connectOrCreate: {
                    where: {
                        nomi: kategoriya
                    },
                    create: {
                        nomi: kategoriya
                    }
                }
            }
        },
        include: {
            kategoriya: true
        },
        omit: {
            kategoriyaId: true
        }
    });
    const response = {
        ...mahsulot,
        kategoriya: mahsulot.kategoriya.nomi
    };
    res.status(201).json({ mahsulot: response });
};
export const getMahsulot = async (req, res) => {
    const mahsulotId = req.params.id;
    const mahsulot = await prisma.mahsulot.findUnique({
        where: {
            id: mahsulotId
        },
        omit: {
            kategoriyaId: true
        },
        include: {
            kategoriya: true
        }
    });
    if (!mahsulot) {
        res.status(404).json({ error: "Mahsulot topilmadi" });
        return;
    }
    const response = {
        ...mahsulot,
        kategoriya: mahsulot.kategoriya.nomi
    };
    res.json({ mahsulot: response });
};
export const updateMahsulot = async (req, res) => {
    const mahsulotId = req.params.id;
    const { kategoriya, ...rest } = req.body;
    const mahsulot = await prisma.mahsulot.update({
        where: {
            id: mahsulotId
        },
        data: {
            ...rest,
            ...(kategoriya && {
                kategoriya: {
                    connectOrCreate: {
                        where: { nomi: kategoriya },
                        create: { nomi: kategoriya }
                    }
                }
            })
        },
        omit: {
            kategoriyaId: true
        },
        include: {
            kategoriya: true
        }
    });
    const response = {
        ...mahsulot,
        kategoriya: mahsulot.kategoriya.nomi
    };
    res.json({ mahsulot: response });
};
export const deleteMahsulot = async (req, res) => {
    const mahsulotId = req.params.id;
    await prisma.mahsulot.delete({
        where: {
            id: mahsulotId
        }
    });
    res.sendStatus(204);
};
