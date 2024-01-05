import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";

import MainLayout from "../layouts/MainLayout";
import WriteFormModal from "../components/WriteFormModal";


const HomePage = () => {

  return (
    <MainLayout>
      {/* 左栏 Main Screen */}
      <section className="grid h-full w-full grid-cols-12">
        {/* 主内容 */}
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
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="group flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
              >
                {/* 博文简介 */}
                <div className="flex w-full items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-gray-400"></div>
                  <div>
                    <p className="font-semibold">
                      John Soni &#x2022; 22 Dec. 2022
                    </p>
                    <p className="text-sm">Founder, teacher & developer</p>
                  </div>
                </div>

                {/* 博文内容 */}
                <div className="grid w-full grid-cols-12 gap-4">
                  <div className="col-span-8 flex flex-col space-y-4">
                    {/* 标题 */}
                    <p className="text-2xl font-bold text-gray-800 decoration-gray-800 group-hover:underline">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Nisi, quaerat.
                    </p>
                    {/* 主内容 */}
                    <p className="break-words text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia molestias at adipisci dolore necessitatibus amet sapiente, consequuntur iure cum, molestiae explicabo cupiditate corrupti beatae vel, corporis harum dolor laborum ab tempora quis aut accusamus voluptatem porro! Nemo incidunt ipsa ea error unde, ullam, officia reprehenderit quisquam iste id veniam aspernatur iusto libero, velit quos alias quae corrupti quod? Odit, excepturi.
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
              </div>
            ))}
          </div>
        </main>

        {/* 右栏 */}
        <aside className="col-span-4 flex h-full w-full flex-col space-y-4 p-6">
          {/* 可能感兴趣的用户 */}
          <div>
            <h3 className="my-6 text-lg font-semibold">
              People you might be interested
            </h3>
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-row items-center space-x-5">
                  <div className="h-10 w-10 flex-none rounded-full bg-gray-300"></div>

                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      John Doe
                    </div>
                    <div className="text-xs">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Repellat, itaque ea. Tenetur, dolore?
                    </div>
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
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group flex items-center space-x-6">
                  <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
                  <div className="flex w-3/5 flex-col space-y-2">
                    <div className="text-lg font-semibold decoration-gray-800 group-hover:underline">
                      Lorem ipsum dolor sit amet consectetur.
                    </div>
                    <div className="break-words">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, aut.
                    </div>
                    <div className="flex w-full items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                      <div className="">John Doe &#x2022;</div>
                      <div>Dec 22, 2022</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Modal弹窗 */}
      <WriteFormModal>

      </WriteFormModal>

    </MainLayout>
  );
};

export default HomePage;
