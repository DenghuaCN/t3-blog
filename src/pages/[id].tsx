import { useRouter } from "next/router";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { trpc } from "../utils/trpc";
import MainLayout from "../layouts/MainLayout";


const PostPage = () => {
  const router = useRouter();

  const postId = router.query.id as string;

  const getPost = trpc.post.getPost.useQuery({
    id: postId
  }, {
    // 此查询只有当router.query.id为有效值的时候才进行
    enabled: Boolean(router.query.id)
  })


  return (
    <MainLayout>

        {/* Loaning */}
        {getPost.isLoading && (
          <div className="w-full h-full flex items-center justify-center space-x-4">
            <div><AiOutlineLoading3Quarters className="animate-spin" /></div>
            <div>loading...</div>
          </div>
        )}

      <div className="flex h-full w-full flex-col items-center justify-center p-10">
        <div className="w-full max-w-screen-lg flex flex-col space-y-6">
          <div className="relative h-[60vh] w-full rounded-xl bg-gray-300 shadow-lg">
            {/* here we will render our image */}
            <div className="absolute w-full h-full flex items-center justify-center">
              <div className="bg-black bg-opacity-50 p-4 rounded-xl text-white text-3xl">{getPost.data?.title}</div>
            </div>
          </div>
          <div className="border-l-4 pl-6 border-gray-800">
            {getPost.data?.description}
          </div>
          <div>
            {getPost.data?.text}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;
