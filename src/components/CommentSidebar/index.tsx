import { Fragment } from "react";
import { z } from "zod";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from "@headlessui/react";

import { HiXMark } from "react-icons/hi2";
import { useForm } from "react-hook-form";

import type { Dispatch, SetStateAction } from 'react'
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);


export const CommentSchema = z.object({
  text: z.string().min(3),
  // postId: z.string()
})

type CommentSideBarProps = {
  isShowCommentBar: boolean;
  setIsShowCommentBar: Dispatch<SetStateAction<boolean>>,
  postId: string;
}


const CommentSidebar = ({ isShowCommentBar, setIsShowCommentBar, postId }: CommentSideBarProps) => {

  const utils = trpc.useUtils();

  const { register, handleSubmit, formState: { isValid }, reset } = useForm<{ text: string }>({
    resolver: zodResolver(
      CommentSchema
    )
  });

  /**
   * @desc tRPC远程过程调用'submitComment'
   */
  const submitComment = trpc.post.submitComment.useMutation({
    onSuccess: () => {
      reset();
      toast.success('comment submit successfully')
      utils.post.getComments.invalidate({ postId });
    },
    onError: (error) => {
      toast.error(error.message)
    }
  });


  /**
   * @desc tRPC远程过程调用'getComments'
   */
  const getComments = trpc.post.getComments.useQuery({
    postId
  })

  /**
   * @desc 评论表单onSubmit
   */
  const onSubmit = (data: { text: string }) => {
    submitComment.mutate({
      text: data.text,
      postId,
    });
  }


  return (
    <Transition.Root show={isShowCommentBar} as={Fragment}>
      {/* 关于使用Transition组件: https://headlessui.com/react/transition | https://www.skies.dev/headless-ui-transitions */}
      <Dialog as="div" onClose={() => setIsShowCommentBar(false)}>
        <div className="fixed right-0 top-0">
          <Transition.Child
            // 理解: 默认isShowCommentBar控制是否显示，enterFrom，enterTo增加了一个translate-x从(100% -> 0%)的动画，离开同理。
            enter="transition duration-700" // 在元素进入的整个过程中应用
            leave="transition duration-500" // 在元素离开的整个过程中应用
            enterFrom="translate-x-full"     // 输入的起点，这里指起始位置为 transform: translateX(100%)，并且此动画耗费1000ms
            enterTo="translate-x-0"          // 输入的结束点，这里指终点位置为 transform: translateX(0px);
            leaveFrom="translate-x-0"        // 离开的起点，dialog消失前位置为translateX(100%)
            leaveTo="translate-x-full"       // 离开的终点...
          >
            <Dialog.Panel className="relative h-screen shadow-md w-[200px] bg-white sm:w-[400px]">
              <div className="w-full h-full flex flex-col px-6 overflow-y-scroll">

                {/* comment title */}
                <div className="mt-10 mb-5 flex justify-between items-center text-xl">
                  <h2 className="font-medium">Response {4}</h2>
                  <div className="cursor-pointer">
                    <HiXMark strokeWidth={'1px'} onClick={() => setIsShowCommentBar(false)} />
                  </div>
                </div>

                {/* comment input */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-end space-y-5">
                  <textarea
                    {...register('text')}
                    id="comment"
                    rows={3}
                    placeholder="what are your thoughts?"
                    className="w-full rounded-lg border p-4 shadow-lg outline-none placeholder:text-sm focus:border-gray-600"
                  />

                  {isValid && (
                    <button
                      type="submit"
                      className="flex items-center space-x-3 rounded border border-gray-300 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
                    >
                      Comment
                    </button>
                  )}
                </form>

                {/* comment list */}
                <div className="space-y-6 flex flex-col justify-center items-center mt-6">
                  {/**
                 * 注意: justify-center: content不能与overflow:scroll一同使用，会导致无法滚动到顶部
                 * https://stackoverflow.com/questions/33454533/cant-scroll-to-top-of-flex-item-that-is-overflowing-container
                 * https://bhch.github.io/posts/2021/04/centring-flex-items-and-allowing-overflow-scroll/#future-solution
                 */}
                  {getComments.isSuccess && getComments.data.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex w-full flex-col space-y-2 border-b border-b-gray-300 last:border-none pb-4"
                    >
                      <div className="flex w-full items-center space-x-2 text-xs">
                        <div className="relative h-8 w-8 rounded-full bg-gray-400"></div>
                        <div>
                          <p className="font-semibold">{comment.user.name}</p>
                          <p className="font-semibold">{dayjs(comment.createdAt).fromNow()}</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        {comment.text}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>

  );
}

export default CommentSidebar;