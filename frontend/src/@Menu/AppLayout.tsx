// components/AppLayout.tsx
import { Topbar } from "./Topbar";
import { Sidebar } from "./Slidebar";

//@ts-ignore
export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-white-25 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
