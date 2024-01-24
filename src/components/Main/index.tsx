import InfiniteScroll from 'react-infinite-scroll-component';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";

import { trpc } from "../../utils/trpc";
import Post from "../Post";
import { BiLoaderCircle } from 'react-icons/bi';


const Main = () => {
  // tRPC https://trpc.io/docs/client/react/useInfiniteQuery
  const getPosts = trpc.post.getPosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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


        <InfiniteScroll
          dataLength={getPosts.data?.pages.flatMap((page) => page.posts).length ?? 0}
          next={getPosts.fetchNextPage }
          hasMore={Boolean(getPosts.hasNextPage)}
          loader={(
            <div className='flex h-full w-full items-center justify-center'>
              <BiLoaderCircle className='animate-spin' />
            </div>
          )}
          endMessage={
            <p className='text-center'>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {getPosts.isSuccess && getPosts.data.pages.flatMap((page) => page.posts).map((post) => (
            <Post
              key={post.id}
              {...post}
            />
          ))}
        </InfiniteScroll>

      </div>
    </main>
  );
}

export default Main;