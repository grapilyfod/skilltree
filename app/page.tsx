import { DashboardClient } from "@/components/DashboardClient";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <div>
          <h1 className="text-lg font-medium tracking-tight text-white">
            Skill Tree
          </h1>
          <p className="text-sm text-zinc-500">
            Stats Tracker cho lịch công việc &amp; học tập hàng ngày
          </p>
        </div>
      </header>

      <DashboardClient />
    </div>
  );
}