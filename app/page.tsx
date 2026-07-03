import { DashboardClient } from "@/components/DashboardClient";
import { Lobster } from "next/font/google";
const logoFont = Lobster({
  weight: "400",
  subsets: ["latin"],
});
export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 overflow-x-hidden px-3 py-5 sm:gap-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="px-6 py-6 text-center">
        <div className="relative mx-auto flex max-w-xl flex-col items-center">
          <h1
            className={`${logoFont.className} rotate-[-4deg] text-7xl leading-none text-white drop-shadow-[0_6px_0_rgba(15,23,42,0.85)] sm:text-8xl`}
          >
            Skill Map
          </h1>

          <p className="mt-5 text-sm font-semibold tracking-wide text-blue-100/80 sm:text-base">
            Stats Tracker cho lịch công việc &amp; học tập hằng ngày
          </p>
        </div>
      </header>

      <DashboardClient />
    </div>
  );
}