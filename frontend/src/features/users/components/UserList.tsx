"use client";

type User = {
  id: number | string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  is_active?: boolean;
};

type UserListProps = {
  users: User[];
};

export default function UserList({
  users,
}: UserListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          {/* Header */}
          <thead className="border-b border-gray-200 bg-[#F8F6F1]">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-medium text-[#737373]">
                Name
              </th>

              <th className="px-5 py-4 text-left text-sm font-medium text-[#737373]">
                Email
              </th>

              <th className="px-5 py-4 text-left text-sm font-medium text-[#737373]">
                Role
              </th>

              <th className="px-5 py-4 text-left text-sm font-medium text-[#737373]">
                Status
              </th>
            </tr>
          </thead>

          {/* Users */}
          <tbody>
            {users.map((user) => {
              const active =
                user.isActive ??
                user.is_active ??
                true;

              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 transition last:border-0 hover:bg-[#F8F6F1]/50"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A5A58D] text-sm font-medium text-white">
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <span className="text-sm font-medium text-[#2C2C2C]">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-sm text-[#737373]">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#A5A58D]/20 px-3 py-1 text-xs font-medium capitalize text-[#5c604f]">
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ₹{
                        active
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty */}
      {users.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-sm font-medium text-[#2C2C2C]">
            No users found
          </p>

          <p className="mt-1 text-sm text-[#737373]">
            Add a user to get started.
          </p>
        </div>
      )}
    </div>
  );
}