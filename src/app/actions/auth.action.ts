"use server";

import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { signUpSchema } from "~/schema";
import { signIn, signOut } from "~/server/auth";
import { db } from "~/server/db";

export async function signout() {
  await signOut();
}

export async function authenticate(prevState: string | undefined, form: FormData) {
  try {
    await signIn("credentials", form);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";

        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

export async function register(prevState: string | undefined, form: FormData) {
  try {
    const { email, password } = await signUpSchema.parseAsync({
      email: form.get("email"),
      password: form.get("password"),
    });
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return "User already exists";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        password: hashedPassword,
        email,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors.map(error => error.message).join(",");
    }
    console.log(error);
    return "ERROR";
  }
  redirect("/signin");
}
