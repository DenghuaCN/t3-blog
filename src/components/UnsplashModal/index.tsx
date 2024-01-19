import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../Modal";
import useUnsplashModal from "../../hooks/useUnsplashModal";
import { trpc } from "../../utils/trpc";
import { unsplashSchema } from "../../schema/unsplash";
import useDebounce from "../../hooks/useDebounce";
import { BiLoaderAlt } from "react-icons/bi";
import { useState } from "react";
import toast from "react-hot-toast";

type UnsplashModalProps = {
  postId: string;
  refreshPost: () => void;
}

const UnsplashModal = ({ postId, refreshPost }: UnsplashModalProps) => {

  const modal = useUnsplashModal();
  const [selectedImg, setSelectedImg] = useState('');

  const { register, watch, reset } = useForm<{ searchQuery: string }>({
    resolver: zodResolver(unsplashSchema)
  })

  const watchSearchQuery = watch('searchQuery'); // 使用useForm提供的watch，优化传统onChange等逻辑
  const debounceSearchQuery = useDebounce(watchSearchQuery, 2000);

  /**
   * @desc 搜索unsplash图片
   */
  const fetchUnsplashImages = trpc.unsplash.getImages.useQuery({
    searchQuery: debounceSearchQuery,
  }, {
    enabled: Boolean(debounceSearchQuery?.trim())
  });

  /**
   * @desc 更新post背景图片 过程调用
   */
  const updateFeaturedImage = trpc.post.updatePostFeaturedImage.useMutation({
    onSuccess: () => {
      modal.onClose();
      reset();
      toast.success('featured image updated');
      refreshPost();
    }
  });


  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={modal.onClose}
    >
      <div>
        <div className="flex flex-col space-y-4 justify-center items-center w-full">
          <input
            {...register("searchQuery", { required: true })}
            id="search"
            type="text"
            placeholder="search unsplash photo..."
            className="w-full h-full border border-gray-300 focus:border-gray-600 outline-none p-4 rounded-xl"
          />

          {/* 图片展示 */}
          <div className="relative h-96 w-full grid grid-cols-3 place-items-center gap-4 overflow-y-scroll">
            {/* Loading */}
            {(debounceSearchQuery && fetchUnsplashImages.isLoading) && (
              <div className="absolute top-[45%] left-[50%]">
                <BiLoaderAlt className="animate-spin" />
              </div>
            )}

            {fetchUnsplashImages.isSuccess && fetchUnsplashImages.data?.results.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImg(image.urls.full)}
                className='aspect-video relative h-full w-full cursor-pointer rounded-md'
              >
                <div className={`absolute rounded-md group-hover:bg-black/40 z-10 w-full h-full inset-0 ${selectedImg === image.urls.full && 'bg-black/40'}`}></div>
                <Image
                  fill
                  src={image.urls.regular}
                  alt={image.alt_description ?? ''}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-md"
                />
              </div>
            ))}
          </div>

          {/* button */}
          {selectedImg && (
            <button
              onClick={() => {
                updateFeaturedImage.mutate({
                  imageUrl: selectedImg,
                  postId,
                })
              }}
              disabled={updateFeaturedImage.isLoading}
              className="space-x-3 text-sm rounded border border-gray-200 px-4 whitespace-nowrap py-2 transition hover:border-gray-900 hover:text-gray-900"
            >
              {updateFeaturedImage.isLoading ? "Loading..." : "Confirm"}
            </button>
          )}

        </div>
      </div>
    </Modal>
  );
}

export default UnsplashModal;