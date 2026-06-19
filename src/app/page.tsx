import Link from "next/link";
import {
  IoEllipseOutline,
  IoPeopleOutline,
  IoPencilOutline,
  IoShareSocialOutline,
  IoSquareOutline,
  IoTextOutline,
} from "react-icons/io5";
import { auth } from "~/server/auth";

const features = [
  {
    icon: IoPeopleOutline,
    title: "Real-time collaboration",
    description: "Design together with live cursors, presence, and instant sync across every layer.",
  },
  {
    icon: IoSquareOutline,
    title: "Shapes & text",
    description: "Add rectangles, ellipses, and text. Resize, move, and style everything on the canvas.",
  },
  {
    icon: IoPencilOutline,
    title: "Freehand drawing",
    description: "Sketch ideas quickly with the pencil tool and smooth path rendering.",
  },
  {
    icon: IoShareSocialOutline,
    title: "Share rooms",
    description: "Invite teammates by email and collaborate in shared design rooms.",
  },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-200">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
            F
          </div>
          <span className="text-lg font-semibold text-gray-900">Figma Clone</span>
        </div>
        <nav className="flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:text-black"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-blue-600">
              Collaborative design
            </p>
            <h1 className="mb-6 text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
              Design together, in real time.
            </h1>
            <p className="mb-8 max-w-lg text-lg text-gray-600">
              A lightweight canvas for teams. Create rooms, draw shapes, add text, and collaborate
              live with shared layers and multiplayer editing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={session ? "/dashboard" : "/signup"}
                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                {session ? "Go to your files" : "Start for free"}
              </Link>
              {!session && (
                <Link
                  href="/signin"
                  className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:border-gray-400"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">Untitled — Live</span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#f5f5f5]">
                <div className="absolute left-8 top-10 h-24 w-32 rounded-md bg-blue-400/80" />
                <div className="absolute right-10 top-16 h-20 w-20 rounded-full bg-purple-400/80" />
                <div className="absolute bottom-12 left-16 flex items-center gap-1 text-sm font-medium text-gray-700">
                  <IoTextOutline className="size-4" />
                  Hello team
                </div>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300">
                  <path
                    d="M 40 220 Q 120 180 200 200 T 360 160"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute right-16 top-24 flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[10px] shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  2 online
                </div>
              </div>
              <div className="mt-4 flex gap-2 text-gray-400">
                <IoSquareOutline className="size-5" />
                <IoEllipseOutline className="size-5" />
                <IoTextOutline className="size-5" />
                <IoPencilOutline className="size-5" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="mb-10 text-center text-2xl font-semibold text-gray-900">
            Everything you need to collaborate
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white/60 py-8 text-center text-sm text-gray-500">
        Built for real-time collaborative design.
      </footer>
    </div>
  );
}
