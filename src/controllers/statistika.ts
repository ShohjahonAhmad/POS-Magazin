import { RequestHandler } from "express";
import prisma from "../prisma.js";

export const getMonthlyRasxodlar: RequestHandler = async (req, res) => {
    const year = parseInt(req.query.yil as string) || new Date().getFullYear();
  
    const rasxodlar = await prisma.$queryRaw`
      WITH oylar AS (
        SELECT generate_series(1, 12) AS oy
      )
      SELECT 
        CASE oylar.oy
          WHEN 1 THEN 'Yan'
          WHEN 2 THEN 'Fev'
          WHEN 3 THEN 'Mar'
          WHEN 4 THEN 'Apr'
          WHEN 5 THEN 'May'
          WHEN 6 THEN 'Iyun'
          WHEN 7 THEN 'Iyul'
          WHEN 8 THEN 'Avg'
          WHEN 9 THEN 'Sen'
          WHEN 10 THEN 'Okt'
          WHEN 11 THEN 'Noy'
          WHEN 12 THEN 'Dek'
        END AS oy_nomi,
        COALESCE(SUM(r.summa::numeric), 0) AS summa
      FROM oylar
      LEFT JOIN rasxodlar r
        ON EXTRACT(MONTH FROM r.kun) = oylar.oy
        AND EXTRACT(YEAR FROM r.kun) = ${year}
      GROUP BY oylar.oy
      ORDER BY oylar.oy;
    `;
  
    res.json({ rasxodlar });
  };

export const getMonthlyTushumlar: RequestHandler = async (req, res, next) => {
    const year = parseInt(req.query.yil as string) || new Date().getFullYear() 

    const tushumlar = await prisma.$queryRaw`
    WITH oylar AS (
      SELECT generate_series(1, 12) AS oy
    )
    SELECT 
      CASE oylar.oy
        WHEN 1 THEN 'Yan'
        WHEN 2 THEN 'Fev'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Apr'
        WHEN 5 THEN 'May'
        WHEN 6 THEN 'Iyun'
        WHEN 7 THEN 'Iyul'
        WHEN 8 THEN 'Avg'
        WHEN 9 THEN 'Sen'
        WHEN 10 THEN 'Okt'
        WHEN 11 THEN 'Noy'
        WHEN 12 THEN 'Dek'
      END AS oy_nomi,
      COALESCE(SUM(s.tushum::numeric), 0) AS tushum
    FROM oylar
    LEFT JOIN sotuvlar s
      ON EXTRACT(MONTH FROM s."yaratilganVaqt") = oylar.oy
      AND EXTRACT(YEAR FROM s."yaratilganVaqt") = ${year}
    GROUP BY oylar.oy
    ORDER BY oylar.oy;
  `;
    
    res.json({tushumlar})
}

export const getMonthlySavdolar: RequestHandler = async (req, res) => {
    const year = parseInt(req.query.yil as string) || new Date().getFullYear();
  
    const sotuvlar = await prisma.$queryRaw`
WITH oylar AS (
  SELECT generate_series(1,12) AS oy
)
SELECT 
  CASE oylar.oy
    WHEN 1 THEN 'Yan'
    WHEN 2 THEN 'Fev'
    WHEN 3 THEN 'Mar'
    WHEN 4 THEN 'Apr'
    WHEN 5 THEN 'May'
    WHEN 6 THEN 'Iyun'
    WHEN 7 THEN 'Iyul'
    WHEN 8 THEN 'Avg'
    WHEN 9 THEN 'Sen'
    WHEN 10 THEN 'Okt'
    WHEN 11 THEN 'Noy'
    WHEN 12 THEN 'Dek'
  END AS oy_nomi,
  COALESCE(SUM(s.miqdor)::numeric, 0) AS miqdor
FROM oylar
LEFT JOIN sotuvlar s
  ON EXTRACT(MONTH FROM s."yaratilganVaqt") = oylar.oy
  AND EXTRACT(YEAR FROM s."yaratilganVaqt") = ${year}
GROUP BY oylar.oy
ORDER BY oylar.oy;
`;
  
    res.json({ sotuvlar });
  };

export const getAnnualStats: RequestHandler = async (req, res) => {
  const year1 = parseInt(req.query.yil1 as string) || new Date().getFullYear();
  const year2 = parseInt(req.query.yil2 as string) || new Date().getFullYear() + 2;

  const sotuvAgg: any[] = await prisma.$queryRawUnsafe(`
    SELECT 
      EXTRACT(YEAR FROM "yaratilganVaqt")::int AS yil,
      SUM(tushum) AS tushumlar,
      SUM(miqdor) AS savdolar
    FROM sotuvlar
    WHERE EXTRACT(YEAR FROM "yaratilganVaqt")::int BETWEEN ${year1} AND ${year2}
    GROUP BY yil
    ORDER BY yil;
  `);

  // Aggregate Rasxodlar by year
  const rasxodAgg: any[] = await prisma.$queryRawUnsafe(`
    SELECT 
      EXTRACT(YEAR FROM kun)::int AS yil,
      SUM(summa) AS rasxodlar
    FROM rasxodlar
    WHERE EXTRACT(YEAR FROM kun)::int BETWEEN ${year1} AND ${year2}
    GROUP BY yil
    ORDER BY yil;
  `);

  // Merge both results into one array with default 0s
  const allYears = Array.from({ length: (year2 - year1 + 1) }, (_, i) => year1 + i);

  const stats = allYears.map(yil => {
    const s = sotuvAgg.find(r => Number(r.yil) === yil);
    const r = rasxodAgg.find(r => Number(r.yil) === yil);
    return {
      yil,
      tushumlar: Number(s?.tushumlar ?? 0),
      savdolar: Number(s?.savdolar ?? 0),
      rasxodlar: Number(r?.rasxodlar ?? 0)
    };
  });

  res.json({stats})
}