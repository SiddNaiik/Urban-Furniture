import UserCreateForm from '@/components/users/UserCreateForm';

export default function CreateUserPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
      <UserCreateForm />
    </div>
  );
}
