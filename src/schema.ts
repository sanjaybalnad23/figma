import { object, string } from "zod"


export const signUpSchema = object({
    email: string({ required_error: "Email is required" }).email("Enter valid email"),
    password: string({ required_error: "Password is required" }).min(8, "Minimum 8 character is required").max(32, "Password must be at most 32 characters")
})

export const signInSchema = object({
    email: string({ required_error: "Email is required" }).email("Enter valid email"),
    password: string({ required_error: "Password is requires" })
})