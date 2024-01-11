import { useCallback, useState } from "react";
import { useRouter } from "next/router";

import { BsChat } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

import { trpc } from "../../utils/trpc";
import MainLayout from "../../layouts/MainLayout";
import CommentSidebar from "../../components/CommentSidebar";

const PostPage = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [isShowCommentBar, setIsShowCommentBar] = useState(false);

  /**
   * @desc 获取Post
   */
  const { data: postData, isSuccess, isLoading } = trpc.post.getPost.useQuery(
    { id: router.query.postId as string },
    {
      enabled: Boolean(router.query.postId),
    } // 此查询只有当router.query.postId为有效值的时候才进行
  )

  /**
   * @desc 点赞
   */
  const likePost = trpc.post.likePost.useMutation({
    onSuccess: () => {
      console.log('like success')
      invalidateCurrentPage()
    }
  })

  /**
   * @desc 取消点赞
   */
  const disLikePost = trpc.post.disLikePost.useMutation({
    onSuccess: () => {
      console.log('dislike success')
      invalidateCurrentPage()
    }
  })

  /**
   * @desc 点赞或取消点赞后立即获取Post
   */
  const invalidateCurrentPage = useCallback(() => {
    utils.post.getPost.invalidate({
      id: router.query.postId as string
    });
  }, [router.query.postId, utils.post.getPost])


  return (
    <MainLayout>

      {/* 评论侧栏 */}
      {postData?.id && (
        // 类型缩小
        <CommentSidebar
          isShowCommentBar={isShowCommentBar}
          setIsShowCommentBar={setIsShowCommentBar}
          postId={postData?.id}
        />
      )}

      {/* Loaning */}
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center space-x-4">
          <div><AiOutlineLoading3Quarters className="animate-spin" /></div>
          <div>loading...</div>
        </div>
      )}

      {/* getPost接口成功后显示"点赞评论”组件 */}
      {isSuccess && (
        <div className="fixed bottom-10 flex justify-center items-center w-full">
          <div className="bg-white shadow-xl rounded-full px-4 py-2 border border-gray-300 hover:border-gray-900 flex justify-center items-center space-x-4 group transition duration-300">
            <div className="border-r pr-4 group-hover:border-gray-900 transition duration-300">

              {postData?.likes?.length && postData.likes.length > 0 ? (
                <FcLike
                  className="text-2xl cursor-pointer"
                  onClick={() => postData?.id && disLikePost.mutate({ postId: postData?.id })}
                />
              ) : (
                <FcLikePlaceholder
                  className="text-2xl cursor-pointer"
                  /**
                   * 只有此postId有效时才能进行点赞操作,但由于点击前需要进行getPost查询，
                   * 在getPost查询中增加select。具体见getPost接口
                   */
                  onClick={() => postData?.id && likePost.mutate({ postId: postData?.id })}
                />
              )}

            </div>
            {/* 评论icon */}
            <div>
              <BsChat
                className="text-xl cursor-pointer"
                onClick={() => setIsShowCommentBar(true)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full w-full flex-col items-center justify-center p-10">
        <div className="w-full max-w-screen-lg flex flex-col space-y-6">
          <div className="relative h-[60vh] w-full rounded-xl bg-gray-300 shadow-lg">
            {/* here we will render our image */}
            <div className="absolute w-full h-full flex items-center justify-center">
              <div className="bg-black bg-opacity-50 p-4 rounded-xl text-white text-3xl">{postData?.title}</div>
            </div>
          </div>
          <div className="border-l-4 pl-6 border-gray-800">
            {postData?.description}
          </div>
          <div>
            {postData?.text}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;
