import { IoReorderThreeOutline } from "react-icons/io5";
import { signIn, signOut, useSession } from "next-auth/react";

import { BsBell } from "react-icons/bs";
import { FiEdit, FiLogOut } from "react-icons/fi";


const MainLayout = ({ children }: React.PropsWithChildren) => {


  // https://next-auth.js.org/getting-started/client#usesession
  const { data: sessionData, status } = useSession()


  return (
    <div className="flex h-full w-full flex-col">

      {/* Header */}
      <header className="flex h-20 w-full flex-row items-center justify-around border-b-[1px] border-gray-300 bg-white">
        {/* Left More */}
        <div>
          <IoReorderThreeOutline className="text-2xl text-gray-600" />
        </div>

        {/* Center Title */}
        <div className="text-xl font-thin">denghua blog app</div>

        {/* 区分登陆态显示 */}
        {status === 'authenticated' ? (
          // 已登陆
          <div className="flex items-center space-x-4">
            {/* Notification */}
            <div>
              <BsBell className="text-2xl text-gray-600" />
            </div>
            {/* Account */}
            <div>
              <div className="h-5 w-5 rounded-full bg-gray-600"></div>
            </div>
            {/* Write */}
            <div>
              <button className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">
                <div>Write</div>
                <div>
                  <FiEdit className="text-gray-600" />
                </div>
              </button>
            </div>
            {/* SignOut */}
            <div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
              >
                <div>SignOut</div>
                <div>
                  <FiLogOut className="text-gray-600" />
                </div>
              </button>

            </div>
          </div>
        ) : (
          // 未登陆
          <div>
            <button
              onClick={() => signIn()}
              className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">
              Sign in
            </button>
          </div>
        )}

      </header>

      {children}
    </div>
  );
};

export default MainLayout;
