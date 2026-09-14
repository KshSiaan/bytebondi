"use client";

import { Button } from "@/components/ui/button";
import { DiscordIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, type Variants } from "motion/react";
import Image from "next/image";
import Login from "./login";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Page() {
  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center gap-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col items-center gap-12"
      >
        <motion.div variants={itemVariants}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={128}
            height={128}
            className="size-18"
          />
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-6xl">
          Get started with Us
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex w-1/2 items-center justify-between"
        >
          <Button variant="outline">
            <HugeiconsIcon icon={GoogleIcon} />
            Continue with Google
          </Button>

          <Button variant="outline">
            <HugeiconsIcon icon={DiscordIcon} />
            Continue with Discord
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex w-1/3 items-center justify-center gap-4 text-sm"
        >
          <div className="h-0.5 flex-1 bg-muted" />

          <span>or</span>

          <div className="h-0.5 flex-1 bg-muted" />
        </motion.div>

        <motion.div variants={itemVariants} className="w-1/3">
          <Login />
        </motion.div>
      </motion.div>
    </main>
  );
}
