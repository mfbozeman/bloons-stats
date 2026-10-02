require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma/client.ts");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

exports.getTower = async (req, res) => {
  const { towerId } = req.params;

  //i think this should be "model"
  const tower = await prisma.tower.findUnique({ where: { id: towerId } });

  res.send(tower);
};

exports.getTowerFullInfo = async (req, res) => {
  const { towerId } = req.params;

  // i think this should be "model"
  const tower = await prisma.tower.findUnique({
    where: { id: towerId },
    include: {
      stats: {
        include: {
          attacks: {
            include: {
              projectiles: true,
            },
          },
        },
      },
      upgrades: true,
    },
  });

  res.send(tower);
};

exports.getAllTowers = async (req, res) => {
  // const towers = await prisma.tower.findMany({
  //   include: {
  //     stats: { include: { attacks: { include: { projectiles: true } } } },
  //     upgrades: true,
  //   },
  // });
  const towers = await prisma.tower.findMany();

  res.send(towers);
};

// get a stat block
// that will include projectiles and attacks
exports.getStatBlock = async (req, res) => {
  const { statId } = req.params;

  //i think this should be "model"
  const statBlock = await prisma.statBlock.findUnique({
    where: { id: statId },
    include: { attacks: { include: { projectiles: true } } },
  });

  res.send(statBlock);
};
