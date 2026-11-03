import { Link } from "react-router-dom";
import useCurrentUser from "./hooks/useCurrentUser";
import BrandMark from "./components/BrandMark";
import {
  FaArrowRight,
  FaBolt,
  FaCheck,
  FaCloudArrowUp,
  FaFolder,
  FaLock,
  FaShieldHalved,
  FaShareNodes,
} from "react-icons/fa6";
import { FaFileArchive, FaFileImage, FaFilePdf, FaUpload } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const features = [
  {
    icon: <FaCloudArrowUp />,
    title: "Upload your important files",
    copy: "Add documents, images, archives, videos, and code files to your personal storage.",
  },
  {
    icon: <FaFolder />,
    title: "Keep folders organised",
    copy: "Create folders and give every file a clear name, so your workspace stays easy to browse.",
  },
  {
    icon: <FaShieldHalved />,
    title: "Manage files your way",
    copy: "View file details, download when needed, rename items, or remove files you no longer need.",
  },
];

export default function Home() {
  const { user, isLoading } = useCurrentUser();
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-160 bg-[radial-gradient(circle_at_80%_8%,rgba(191,219,254,.9),transparent_30%),radial-gradient(circle_at_10%_28%,rgba(224,231,255,.95),transparent_32%)]" />
        <div className="absolute right-[8%] top-28 -z-10 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight"
            aria-label="StorageApp home"
          >
            <BrandMark />
            <span>
              Storage<span className="text-blue-600">App</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium" aria-label="Main navigation">
            <Link
              to="/plans"
              className="hidden text-slate-600 transition hover:text-slate-950 sm:block"
            >
              Plans
            </Link>
            {isLoading ? (
              <div
                className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200"
                role="status"
                aria-live="polite"
              >
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                Loading…
              </div>
            ) : user ? (
              <Link
                to="/drive"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"
              >
                <FaLock className="text-[11px]" /> Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-white/70 hover:text-slate-950"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-white shadow-sm transition hover:bg-slate-700"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </header>

        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1fr_.95fr] lg:px-0 lg:pb-32">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <FaBolt aria-hidden="true" />
              {isLoading
                ? "Checking your workspace"
                : user
                  ? `Signed in as ${user.name}`
                  : "Your personal file workspace"}
            </div>
            <h1 className="text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Your files, organised and ready when you are.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Upload documents, create folders, and keep every important file in one easy-to-manage
              workspace. Upgrade your storage whenever you need more space.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />{" "}
                  Loading your account
                </span>
              ) : user ? (
                <Link
                  to="/drive"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                >
                  Open my storage <FaArrowRight aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                >
                  Create your account <FaArrowRight aria-hidden="true" />
                </Link>
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <FaCheck className="text-blue-600" /> Email and Google sign-in
              </span>
              <span className="flex items-center gap-2">
                <FaCheck className="text-blue-600" /> Flexible storage plans
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-blue-400/20 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-blue-950/15">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div className="ml-3 rounded-md bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-500">
                  My Storage
                </div>
              </div>
              <div className="bg-linear-to-b from-white to-slate-50 p-5 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">My storage</p>
                    <p className="mt-1 text-xs text-slate-500">Files you upload and manage</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
                    <FaUpload /> Upload
                  </button>
                </div>
                <div className="mb-5 rounded-xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Storage used</span>
                    <span className="text-slate-500">300 MB of 1 GB</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[30%] rounded-full bg-blue-600" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    ["Project files", <FaFolder />, "bg-amber-100 text-amber-600"],
                    ["project-plan.pdf", <FaFilePdf />, "bg-blue-100 text-blue-600"],
                    ["product-image.png", <FaFileImage />, "bg-blue-100 text-blue-600"],
                    ["backup.zip", <FaFileArchive />, "bg-blue-100 text-blue-600"],
                  ].map(([name, icon, color]) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3"
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-lg ${color}`}>
                        {icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{name}</p>
                      </div>
                      <BsThreeDotsVertical className="text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:-left-8">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <FaLock className="text-sm" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800">Account access required</p>
                <p className="text-[11px] text-slate-500">Sign in to manage storage</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-0">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-blue-600">
              Built around your files
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              The essentials for keeping storage under control.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map(({ icon, title, copy }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-600">
                  {icon}
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-0">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-slate-900 px-7 py-10 text-white sm:px-10 sm:py-12 md:flex-row md:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-blue-300">
              <FaShareNodes /> Start with the storage you need
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Ready to organise your files?
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Create an account, upload your first file, and upgrade storage whenever you need it.
            </p>
          </div>
          <Link
            to={user ? "/drive" : "/register"}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
          >
            {user ? "Open my storage" : "Create account"} <FaArrowRight />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} StorageApp. Your files, simply stored.
      </footer>
    </main>
  );
}
