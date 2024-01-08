
import { useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";


import { CiBookmarkPlus } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";

import { trpc } from "../../utils/trpc";

import type { RouterOutputs } from "../../utils/trpc";

type PostProps = RouterOutputs['post']['getPosts'][number]


const Post = ({ ...post }: PostProps) => {
  const [isBookMarked, setIsBookMarked] = useState(Boolean(post.bookmarks?.length));

  const addBookmarkRPC = trpc.post.bookmarkPost.useMutation();
  const removeBookmarkRPC = trpc.post.removeBookmark.useMutation();


  /**
   * @desc 添加书签
   */
  const handleAddBookmark = () => {
    const addBookmarkPromise = addBookmarkRPC.mutateAsync({ postId: post.id });

    toast.promise(addBookmarkPromise, {
      loading: 'Loading...',
      success: () => {
        setIsBookMarked((prev) => !prev)
        return '书签已添加'
      },
      error: 'add bookmark fail',
    })
  }

  /**
   * @desc 移除书签
   */
  const handleRemoveBookmark = () => {
    const removeBookmarkPromise = removeBookmarkRPC.mutateAsync({ postId: post.id })

    toast.promise(removeBookmarkPromise, {
      loading: 'Loading...',
      success: () => {
        setIsBookMarked((prev) => !prev)
        return '书签已移除'
      },
      error: 'remove bookmark fail',
    })
  }


  return (
    <div
      key={post.id}
      className="group flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
    >
      {/* 博文简介 */}
      <div className="flex w-full items-center space-x-2">
        <div className="relative h-10 w-10 rounded-full bg-gray-400">
          {post.author.image && (
            <Image
              fill
              className="rounded-full"
              src={post.author.image}
              alt={post.author.name ?? ''}
            />
          )}
        </div>
        <div>
          <p className="font-semibold">
            {post.author.name} &#x2022;
            <span className="mx-1">{dayjs(post.createdAt).format('YYYY-MM-DD')}</span>
          </p>
          <p className="text-sm">Founder, teacher & developer</p>
        </div>
      </div>

      {/* 博文内容 */}
      <Link
        // href={`/${post.slug}`} 由于存在中文，不使用slug作为路由导航和查询
        href={`/${post.id}`}
        className="grid w-full grid-cols-12 gap-4"
      >
        <div className="col-span-8 flex flex-col space-y-4">
          {/* 标题 */}
          <p className="text-2xl font-bold text-gray-800 decoration-gray-800 group-hover:underline">
            {post.title}
          </p>
          {/* 主内容 */}
          <p className="break-words text-sm text-gray-500">
            {post.text}
          </p>
        </div>
        {/* 标题图 */}
        <div className="col-span-4">
          <div className="h-full w-full transform rounded-xl bg-gray-300 transition duration-300 hover:scale-105 hover:shadow-xl"></div>
        </div>
      </Link>

      {/* 博文标签 */}
      <div>
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-gray-200/50 px-5 py-2"
              >
                tag {i}
              </div>
            ))}
          </div>
          {/* 书签 */}
          <div>
            {isBookMarked ? (
              <CiBookmarkCheck
                className="text-2xl cursor-pointer text-indigo-600"
                onClick={handleRemoveBookmark}
              />
            ) : (
              <CiBookmarkPlus
                className="text-2xl cursor-pointer"
                onClick={handleAddBookmark}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;