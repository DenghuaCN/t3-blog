import { useCallback, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import { createClient } from '@supabase/supabase-js'

import { BiEdit } from "react-icons/bi";
import { SlShareAlt } from 'react-icons/sl'

import MainLayout from "../../layouts/MainLayout";
import { trpc } from "../../utils/trpc";
import Post from "../../components/Post";
import { env } from "../../env/client.mjs";

import type { ChangeEvent } from 'react';

// Create a single supabase client for interacting with your database
// const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY)


const UserProfilePage = () => {

  const router = useRouter();
  const currentUser = useSession();
  const utils = trpc.useUtils();


  /**
   * @desc 获取用户信息
   */
  const userProfile = trpc.user.getUserProfile.useQuery({
    username: router.query.username as string
  }, {
    enabled: Boolean(router.query.username) // 页面首 次加载时username为未定义，此时不发出请求
  });

  /**
   * @desc 获取用户所有post
   */
  const userPosts = trpc.user.getUserPosts.useQuery({
    username: router.query.username as string
  }, {
    enabled: Boolean(router.query.username)
  });

  const [objectImage, setObjectImage] = useState("");
  const uploadAvatar = trpc.user.uploadAvatar.useMutation({
    onSuccess: () => {
      if (userProfile.data?.username) {
        utils.user.getUserProfile.invalidate({
          username: router.query.username as string
        })
        toast.success('avatar updated!')
      }
    }
  });
  /**
   * @desc 使用FileReader读取文件并上传到Storage Bucket
   */
  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file: File = e.target.files[0];

    if (file.size > 2 * 1000000) {
      e.target.value = ""; // 需要重置e.target.value，否则重复上传同一个文件时，第二次不会触发此函数
      return toast.error('The picture size is limited to less than 2MB');
    }

    setObjectImage(URL.createObjectURL(file));

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
      if (fileReader.result) {
        uploadAvatar.mutate({
          imageAsDataUrl: fileReader.result as string,
          mimeType: file.type ?? '',
          username: userProfile.data?.username as string
        })
      }
    }
  }


  return (
    <MainLayout>
      <div className="flex h-full w-full items-center justify-center">
        <div className="lg:max-w-screen-md xl:max-w-screen-lg w-full h-full    my-10 flex flex-col justify-center items-center">
          <div className="bg-white rounded-3xl flex flex-col w-full shadow-lg">
            <div className="relative w-full h-44 rounded-3xl bg-gradient-to-r from-violet-200 to-pink-200">
              <div className="absolute -bottom-10 left-12">
                <div className="group w-28 h-28 rounded-full relative bg-gray-100 border-2 border-white">

                  {/* 如果当前登录用户 === 当前查看用户，则可以进行编辑操作 */}
                  {(currentUser.data?.user?.id === userProfile.data?.id) && (
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
                        multiple={false}
                        onChange={handleChangeImage}
                      />
                    </label>
                  )}

                  {/* User Avatar */}
                  {!objectImage && userProfile.data?.image && (
                    <Image
                      fill
                      src={userProfile.data?.image}
                      alt={userProfile.data?.name ?? ''}
                      className="rounded-full"
                    />
                  )}
                  {objectImage && (
                    <Image
                      fill
                      src={objectImage}
                      alt={userProfile.data?.name ?? ''}
                      className="rounded-full"
                    />
                  )}

                </div>
              </div>
            </div>
            <div className="mt-10 ml-12 flex flex-col space-y-0.5 rounded-b-3xl py-4">
              <div className="text-4xl font-semibold text-gray-800">{userProfile.data?.name}</div>
              <div className="text-gray-600">@{userProfile.data?.username}</div>
              <div className="text-gray-600">{userProfile.data?._count.posts} Posts</div>
              <div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('URL copied to clipboard');
                  }}
                  className="flex items-center space-x-3 mt-2 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900 active:scale-95"
                >
                  <div>Share</div>
                  <div>
                    <SlShareAlt className="text-gray-600" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="my-10 w-full">
            {userPosts.isSuccess && userPosts.data?.posts.map((post) => (
              <Post
                key={post.id}
                {...post}
              />
            ))}

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default UserProfilePage;