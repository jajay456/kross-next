import { useState } from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";
import Badge from "../components/ui/Badge";
import { CURRENT_USER, STAFF, ROLES } from "../data/users";

export default function Admin() {
  const [staff, setStaff] = useState(STAFF);

  if (CURRENT_USER.role !== "admin") {
    return <Navigate to="/players" replace />;
  }

  const updateRole = (userId, role) => {
    setStaff((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  return (
    <AppLayout
      mobileView="list"
      sidebar={<Sidebar />}
      list={
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
            <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Coaches and staff with access to this academy.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
            <div className="flex flex-col divide-y divide-neutral-100">
              {staff.map((u) => (
                <div key={u.id} className="flex items-center gap-3 py-4">
                  <Avatar name={u.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{u.name}</p>
                    <p className="truncate text-xs text-neutral-500">{u.email}</p>
                  </div>

                  <Badge tone={u.role === "admin" ? "lime" : "outline"}>{u.role}</Badge>

                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                    className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm
                               outline-none focus:border-ink"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
