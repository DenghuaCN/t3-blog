import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";

import { trpc } from "../../utils/trpc";


const Main = () => {

  const getPosts = trpc.post.getPosts.useQuery();

  return (
    <main className="col-span-8 h-full w-full border-r border-gray-300 px-24">
      {/* 主内容header（搜索，筛选...） */}
      <div className="| flex w-full flex-col space-y-4 py-10">
        {/* 搜索栏 */}
        <div className="flex w-full items-center space-x-4">
          {/* 输入框 */}
          <label
            htmlFor="search"
            className="relative w-full rounded-3xl border border-gray-800"
          >
            <div className="absolute left-2 flex h-full items-center">
              <CiSearch />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
              className="
                w-full
                rounded-3xl
                px-4
                py-1
                pl-7
                text-sm
                outline-none
                placeholder:text-xs
                placeholder:text-gray-300
              "
            />
          </label>
          {/* Tag */}
          <div className="flex w-full items-center justify-end space-x-4">
            <div>My topics:</div>
            <div className="flex items-center space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-gray-200/50 px-4 py-3"
                >
                  tag {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Follow 筛选 */}
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-8">
          <div>Articles</div>
          <div>
            <button
              className="
                flex
                items-center
                space-x-2
                rounded-3xl
                border
                border-gray-800
                px-4
                py-1.5
                font-semibold"
            >
              <div>Following</div>
              <div>
                <HiChevronDown className="text-xl" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 博文内容 ExcelRow */}
      <div className="flex w-full flex-col justify-center space-y-8">

        {/* Loaning */}
        {getPosts.isLoading && (
          <div className="w-full h-full flex items-center justify-center space-x-4">
            <div><AiOutlineLoading3Quarters className="animate-spin" /></div>
            <div>loading...</div>
          </div>
        )}

        {getPosts.isSuccess && getPosts.data.map((post) => (
          <Link
            // href={`/${post.slug}`} 由于存在中文，不使用slug作为路由导航和查询
            href={`/${post.id}`}
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
            <div className="grid w-full grid-cols-12 gap-4">
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
            </div>

            {/* 博文标签 */}
            <div>
              <div className="flex w-full items-center justify-start space-x-4">
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Main;