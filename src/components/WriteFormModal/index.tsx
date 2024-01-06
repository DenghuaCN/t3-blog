import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Modal from "../Modal";
import { GlobalContext } from "../contexts/GlobalContextProvider";
import { trpc } from "../../utils/trpc";

type WriteFormType = {
  title: string;
  description: string;
  text: string;
}

/**
 * @desc 使用zod进行运行时的类型检查
 * https://dev.to/jareechang/zod-the-next-biggest-thing-after-typescript-4phh
 */
export const writeFormSchema = z.object({
  title: z.string().min(20),
  description: z.string().min(50),
  text: z.string().min(100)
})

const WriteFormModal = () => {

  // Modal Context
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);

  // react-hook-form (errors为二次解构)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema)
  });


  const utils = trpc.useUtils();

  /**
   * @desc 创建tRPC方法
   */
  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success('post created successfully!')
      setIsWriteModalOpen(false);
      reset();
      // Invalidating a single query，立即获取最新数据
      utils.post.getPosts.invalidate();
    }
  })

  /**
   * @description handleSubmit回调函数，从参数中获取表单输入对象
   * @param data
   */
  const onSubmit = (data: WriteFormType) => {
    createPost.mutate(data)
  }


  return (
    <Modal
      isOpen={isWriteModalOpen}
      onClose={() => setIsWriteModalOpen(false)}
    >

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex relative flex-col space-y-4 justify-center items-center"
      >

        {/* loading */}
        {createPost.isLoading && (
          <div className="absolute w-full h-full flex items-center justify-center">
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          </div>
        )}

        <input
          {...register('title')}
          type="text"
          placeholder="Title of the blog"
          className="
            w-full
            h-full
            border
            border-gray-300
            focus:border-gray-600
            outline-none
            p-4
            rounded-xl
          "
        />
        <p className="w-full text-left text-sm text-red-500 pb-2">{errors.title?.message}</p>

        <input
          {...register('description')}
          type="text"
          placeholder="short description"
          className="
            w-full
            h-full
            border
            border-gray-300
            focus:border-gray-600
            outline-none
            p-4
            rounded-xl
          "
        />
        <p className="w-full text-left text-sm text-red-500 pb-2">{errors.description?.message}</p>

        <textarea
          {...register('text')}
          name="text"
          placeholder="blog main body..."
          cols={10}
          rows={10}
          className="
            w-full
            h-full
            border
            border-gray-300
            focus:border-gray-600
            outline-none
            p-4
            rounded-xl
          "
        />
        <p className="w-full text-left text-sm text-red-500 pb-2">{errors.text?.message}</p>


        <div className="flex justify-end w-full">
          <button
            type="submit"
            className="flex items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
          >
            Publish
          </button>
        </div>

      </form>
    </Modal>
  );
}

export default WriteFormModal;