import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import sanitizeHtml from 'sanitize-html';

import { BiImageAdd } from "react-icons/bi";
import { BsChat } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

import { trpc } from "../../utils/trpc";
import MainLayout from "../../layouts/MainLayout";
import CommentSidebar from "../../components/CommentSidebar";
import UnsplashModal from "../../components/UnsplashModal";
import useUnsplashModal from "../../hooks/useUnsplashModal";

const PostPage = () => {

  const { data: sessionData } = useSession();
  const unSplashModal = useUnsplashModal();
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
          <div className="relative h-[50vh] w-full rounded-xl bg-gray-300 shadow-lg">

            {/* add unsplash image button */}
            {(sessionData?.user?.id === postData?.authorId) && (
              // 确保当前登陆用户为post的owner，才会显示更改背景图片按钮
              <div
                onClick={unSplashModal.onOpen}
                className="absolute top-2 left-2 bg-black/30 p-2 text-white rounded-lg hover:bg-black z-10 cursor-pointer"
              >
                <BiImageAdd className="text-2xl relative left-[1px] top-[0.5px]" />
              </div>
            )}

            {/* 标题封面 */}
            {isSuccess && postData?.featuredImage && (
              <Image
                fill
                src={postData?.featuredImage}
                alt={postData?.title}
                className="rounded-xl"
              />
            )}

            {/* 博文标题 */}
            <div className="absolute w-full h-full flex items-center justify-center">
              <div className="bg-black bg-opacity-50 p-4 rounded-xl text-white text-3xl">{postData?.title}</div>
            </div>
          </div>
          {/* 博文描述 */}
          <div className="border-l-4 pl-6 border-gray-800">
            {postData?.description}
          </div>

          {/* 正文 */}
          <div
            // https://tailwindcss.com/docs/typography-plugin#adding-custom-color-themes
            className="prose lg:prose"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(postData?.html as string)
            }}
          >
          </div>
        </div>
      </div>

      {/* Unsplash Modal */}
      {isSuccess && (
        <UnsplashModal postId={postData?.id as string} refreshPost={invalidateCurrentPage} />
      )}

    </MainLayout>
  );
};

export default PostPage;
