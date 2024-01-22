import Link from "next/link";
import Image from 'next/image';
import dayjs from 'dayjs';

import { trpc } from "../../utils/trpc";

const Side = () => {

  /**
   * @desc tRPC调用‘getReadingList’过程
   */
  const readingList = trpc.post.getReadingList.useQuery();

  /**
   * @desc ‘getSuggestions’过程调用
   */
  const suggestions = trpc.user.getSuggestions.useQuery();

  return (
    <aside className="col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      {/* 可能感兴趣的用户 */}
      <div>
        <h3 className="my-6 text-lg font-semibold">
          People you might be interested
        </h3>
        <div className="flex flex-col space-y-4">
          {suggestions.isSuccess && suggestions.data.map((user) => (
            <div key={user.id} className="flex flex-row items-center space-x-5">
              {/* Avatar */}
              <div className="relative h-10 w-10 flex-none rounded-full bg-gray-300">
                {user.image && (
                  <Image
                    fill
                    src={user.image}
                    alt={user.username}
                    className="rounded-full"
                  />
                )}
              </div>

              <div>
                {/* name */}
                <div className="text-sm font-bold text-gray-900">{user.name}</div>
                {/* username */}
                <div className="text-xs">{user.username}</div>
              </div>

              <div>
                <button
                  className="
                    flex
                    items-center
                    space-x-3
                    rounded
                    border
                    border-gray-400/50
                    px-4
                    py-2
                    transition
                    hover:border-gray-900
                    hover:text-gray-900"
                >
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 阅读列表 */}
      <div className="sticky top-2">
        <h3 className="my-6 text-lg font-semibold">Your reading list</h3>
        <div className="flex flex-col space-y-8">
          {readingList.isSuccess && readingList.data.map((bookmark) => (
            <Link
              href={`/posts/${bookmark.post.id}`}
              key={bookmark.id}
              className="group flex items-center space-x-6"
            >
              {/* article cover */}
              <div className="relative aspect-video w-2/5 rounded-xl bg-gray-300">
                {bookmark.post.featuredImage && (
                  <Image
                    fill
                    src={bookmark.post.featuredImage}
                    alt={bookmark.post.title}
                    className="rounded-xl"
                  />
                )}
              </div>
              <div className="flex w-3/5 flex-col space-y-2">
                {/* title */}
                <div className="text-lg font-semibold decoration-gray-800 group-hover:underline">
                  {bookmark.post.title}
                </div>
                {/* description */}
                <div className="truncate">{bookmark.post.description}</div>
                <div className="flex w-full items-center space-x-4">
                  {/* Avatar */}
                  <div className="relative h-8 w-8 rounded-full ">
                    {bookmark.post.author.image && (
                      <Image
                        fill
                        className="rounded-full"
                        src={bookmark.post.author.image}
                        alt={bookmark.post.author.name ?? ''}
                      />
                    )}
                  </div>
                  {/* username */}
                  <div>{bookmark.post.author.name} &#x2022;</div>
                  {/* created time */}
                  <div>{dayjs(bookmark.post.createdAt).format('YYYY-MM-DD')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Side;
