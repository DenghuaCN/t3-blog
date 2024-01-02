import { IoReorderThreeOutline } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";

const HomePage = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      {/* Header */}
      <header className="flex h-20 w-full flex-row items-center justify-around border-b-[1px] border-gray-300 bg-white">
        {/* Left More */}
        <div>
          <IoReorderThreeOutline className="text-2xl text-gray-600" />
        </div>

        {/* Center Title */}
        <div className="text-xl font-thin">denghua blog app</div>

        {/* Right Operator */}
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
            <button
              className="
                flex
                items-center
                space-x-3
                rounded
                border
                border-gray-200
                px-4
                py-2
                transition
                hover:border-gray-900
                hover:text-gray-900
              "
            >
              <div>Write</div>
              <div>
                <FiEdit className="text-gray-600" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Screen */}
      <section className="grid h-full w-full grid-cols-12 place-items-center">
        {/* 主内容 */}
        <main className="col-span-8 h-full w-full border-r border-gray-300">
          {/* 主内容header（搜索，筛选...） */}
          <div className="flex w-full flex-col space-y-4 px-24 py-10">
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

          {/* ? */}
          <div></div>
        </main>

        {/* 右栏 */}
        <aside className="col-span-4 h-full w-full">
          this is used for side bar
        </aside>
      </section>
    </div>
  );
};

export default HomePage;
