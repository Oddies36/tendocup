import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const password = await bcrypt.hash("ContractKiller69", 10);

await prisma.user.create({
  data: {
    userName: "Tendo",
    password,
  },
});

console.log("Utilisateur créé !");
process.exit(0);