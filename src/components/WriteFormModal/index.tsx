import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';

import Modal from "../Modal";
import { GlobalContext } from "../contexts/GlobalContextProvider";

type WriteFormType = {
  title: string;
  description: string;
  body: string;
}

const writeFormSchema = z.object({
  title: z.string().min(20),
  description: z.string().min(60),
  body: z.string().min(100)
})

const WriteFormModal = () => {

  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);

  // errors为二次解构
  const { register, handleSubmit, formState: { errors } } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema)
  });



  /**
   * @description handleSubmit回调函数，从参数中获取表单输入对象
   * @param data
   */
  const onSubmit = (data: WriteFormType) => {
    console.log(data);
  }


  return (
    <Modal
      isOpen={isWriteModalOpen}
      onClose={() => setIsWriteModalOpen(false)}
    >

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 justify-center items-center"
      >
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
          {...register('body')}
          name="body"
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
        <p className="w-full text-left text-sm text-red-500 pb-2">{errors.body?.message}</p>


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