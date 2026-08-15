import "dotenv/config";

import bcrypt from "bcrypt";
import readline from "node:readline";

import { prisma } from "../app/lib/prisma";

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    if (!stdin.isTTY) {
      reject(
        new Error(
          "Password input requires an interactive terminal.",
        ),
      );
      return;
    }

    stdout.write(question);

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let value = "";

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      stdout.write("\n");
    };

    const onData = (key: string) => {
      if (key === "\u0003") {
        cleanup();
        process.exit(1);
      }

      if (key === "\r" || key === "\n") {
        cleanup();
        resolve(value);
        return;
      }

      if (
        key === "\u007f" ||
        key === "\b" ||
        key === "\u0008"
      ) {
        if (value.length > 0) {
          value = value.slice(0, -1);
        }

        return;
      }

      value += key;
    };

    stdin.on("data", onData);
  });
}

async function main() {
  const email = (
    await askQuestion("Admin email: ")
  ).toLowerCase();

  if (!email) {
    throw new Error("Admin email is required.");
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      active: true,
    },
  });

  if (!admin) {
    throw new Error(
      "No admin account was found with that email.",
    );
  }

  if (!admin.active) {
    throw new Error(
      "This admin account is currently inactive.",
    );
  }

  const password = await askHidden(
    "New password: ",
  );

  const confirmation = await askHidden(
    "Confirm new password: ",
  );

  if (password !== confirmation) {
    throw new Error("Passwords do not match.");
  }

  if (password.length < 12) {
    throw new Error(
      "Password must contain at least 12 characters.",
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    12,
  );

  await prisma.adminUser.update({
    where: {
      id: admin.id,
    },
    data: {
      passwordHash,
    },
  });

  console.log(
    `Password successfully reset for ${admin.email}.`,
  );
}

main()
  .catch((error) => {
    console.error(
      error instanceof Error
        ? error.message
        : "Password reset failed.",
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });