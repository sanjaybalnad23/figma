"use server"

import {  ZodError } from "zod"
import { signUpSchema } from "~/schema"

export async function register(prevState:string|undefined, form:FormData) {

   try {
     const {email, password} = await signUpSchema.parseAsync({
         email:form.get("email"),
         password:form.get("password")
     }) 
   } catch (error) {
    if(error instanceof ZodError){
        return error.errors.map(error=>error.message).join(",")
    }
    return "ERROR"
   }
    
}