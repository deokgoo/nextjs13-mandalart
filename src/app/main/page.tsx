'use client';

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const Main = () => {
  const { user, logout } = useAuth0();

  return (
    <main className="w-screen h-screen flex justify-center flex-col items-center">
      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">email: {user?.email}</li>
        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">name: {user?.name}</li>
      </ul>
      <div className="w-screen flex justify-center items-center mt-3">
        <button className="w-1/2 rounded-md border-2" onClick={() => logout()}>
          로그아웃
        </button>
      </div>
    </main>
  )
};

export default withAuthenticationRequired(Main, {
  onRedirecting: () => <main className="w-screen h-screen flex justify-center flex-col items-center">
    Loading...
  </main>,
});
