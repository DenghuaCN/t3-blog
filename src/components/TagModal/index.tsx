import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../Modal";
import useTagModal from '../../hooks/useTagModal';
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";

type tagForm = {
  name: string;
  description: string;
}

export const tagFormSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10)
})


const TagModal = () => {
  const tagModal = useTagModal();
  const utils = trpc.useUtils();

  const createTag = trpc.tag.createTag.useMutation({
    onSuccess: () => {
      toast.success('tag successfully created.🥳')
      // 重置并关闭
      reset();
      tagModal.onClose();
      utils.tag.getTags.invalidate();
    }
  });

  /**
   * @desc 创建标签表单
   */
  const { register, handleSubmit, formState: { errors }, reset } = useForm<tagForm>({
    resolver: zodResolver(tagFormSchema)
  });

  const onSubmit = (data: tagForm) => {
    createTag.mutate(data)
  }

  return (
    <Modal
      isOpen={tagModal.isOpen}
      onClose={tagModal.onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex relative flex-col space-y-4 justify-center items-center"
      >
        {/* Tag Name */}
        <input
          {...register('name')}
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
        <p className="w-full text-left text-sm text-red-500 pb-2">{errors.name?.message}</p>
        {/* Tag Description */}
        <input
          {...register('description')}
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
        <p className="w-full text-left text-sm text-red-500 pb-2">{errors.description?.message}</p>

        <div className="w-full flex justify-end">
          {/* Submit Button */}
          <button
            type="submit"
            className="w-fit flex items-center space-x-3 rounded-xl border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
          >
            Create Tag
          </button>

        </div>

      </form>
    </Modal>
  );
}

export default TagModal;