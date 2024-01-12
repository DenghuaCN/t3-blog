import Image from "next/image";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";

import MainLayout from "../../layouts/MainLayout";
import { trpc } from "../../utils/trpc";



const UserProfilePage = () => {

  const router = useRouter();

  /**
   * @desc 获取用户信息
   */
  const userProfile = trpc.user.getUserProfile.useQuery({
    username: router.query.username as string
  }, {
    enabled: Boolean(router.query.username) // 页面首次加载时username为未定义，此时不发出请求
  });

  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="lg:max-w-screen-md xl:max-w-screen-lg w-full h-full my-10 flex flex-col justify-center items-center">
          <div className="relative w-full h-44 rounded-3xl bg-gradient-to-r from-violet-200 to-pink-200">
            <div className="absolute -bottom-10 left-12">
              <div className="group w-28 h-28 rounded-full relative bg-gray-100 border-2 border-white cursor-pointer">
                <label
                  htmlFor="avatarFile"
                  className="absolute flex items-center justify-center w-full h-full group-hover:bg-black/40 z-10 rounded-full transition cursor-pointer"
                >
                  <BiEdit className="text-3xl text-white hidden group-hover:block" />
                  <input
                    type="file"
                    name="avatarFile"
                    id="avatarFile"
                    className="sr-only"
                    accept="image/*"
                  />
                </label>
                {userProfile.data?.image && (
                  <Image
                    fill
                    src={userProfile.data?.image}
                    alt={userProfile.data?.name ?? ''}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, magni?
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserProfilePage;