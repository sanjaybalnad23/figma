import { auth } from "./server/auth";

export const proxy = auth(req => {
  if (!req.auth) {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

// export function middleware(r){
//     console.log(r)
// }
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
