import TaskManager from "@/components/TaskManager";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Task Manager
        </h1>
        <TaskManager />
      </div>
    </main>
  );
}
