import { z } from 'zod';
import toast from "react-hot-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { zodResolver } from "@hookform/resolvers/zod"

import Modal from "../Modal";
import TagForm from "../TagForm";
import { trpc } from "../../utils/trpc";
import TagModal from "../TagModal";
import useTagModal from "../../hooks/useTagModal";

import type { Tag } from '../TagForm';

type WriteFormType = {
  title: string;
  description: string;
  text: string;
}
type WriteFormModalProps = {
  isWriteModalOpen: boolean;
  setIsWriteModalOpen: (isOpen: boolean) => void;
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

const WriteFormModal = ({ isWriteModalOpen, setIsWriteModalOpen }: WriteFormModalProps) => {
  const utils = trpc.useUtils();
  const tagModal = useTagModal();


  /**
   * @desc 创建post表单
   */
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema)
  });

  /**
   * @desc 调用"创建Tag"过程
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
   * @desc 调用"获取所有tag"过程
   */
  const getTags = trpc.tag.getTags.useQuery();


  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  /**
   * @description handleSubmit回调函数，从参数中获取表单输入对象
   */
  const onSubmit = (data: WriteFormType) => {
    createPost.mutate(
      selectedTags.length > 0 ? { ...data, tagsIds: selectedTags } : data
    )
  }

  return (
    <Modal
      isOpen={isWriteModalOpen}
      onClose={() => setIsWriteModalOpen(false)}
    >

      {getTags.isSuccess && (
        <>
          {/* Tag Create Form Modal */}
          {/* 由于headless UI dialog设定，嵌套dialog要想获得正确的关闭顺序行为，需要嵌套Modal组件使用 */}
          <TagModal />

          {/* Tag Select */}
          <div className="flex w-full space-x-4 items-center my-4">
            <div className="w-4/5 z-10">
              <TagForm
                tags={getTags.data}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </div>
            <button
              onClick={() => tagModal.onOpen()}
              className="space-x-3 text-sm rounded border border-gray-200 px-4 whitespace-nowrap py-2 transition hover:border-gray-900 hover:text-gray-900">
              Create Tag
            </button>
          </div>
          <div className='w-full flex items-center flex-wrap my-4'>
            {selectedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="m-1 rounded-3xl bg-gray-200/50 px-5 py-2 whitespace-nowrap flex justify-center items-center space-x-2"
                >
                  <div>{tag.name}</div>
                  {/* 删除已选tag */}
                  <div
                    onClick={() => setSelectedTags((prev) => (
                      prev.filter((currentTag) => currentTag.id !== tag.id)
                    ))}
                    className='cursor-pointer text-xs'
                  >
                    <FaTimes />
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

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