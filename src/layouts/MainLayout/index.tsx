import { useContext } from "react";

import Header from "../../components/Header";
import WriteFormModal from "../../components/WriteFormModal";
import { GlobalContext } from "../../components/contexts/GlobalContextProvider";

const MainLayout = ({ children }: React.PropsWithChildren) => {

  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);

  return (
    <div className="flex h-full w-full flex-col">
      <Header />

      {children}

      {/* Create Post Modal */}
      <WriteFormModal
        isWriteModalOpen={isWriteModalOpen}
        setIsWriteModalOpen={setIsWriteModalOpen}
      />
    </div>
  );
};

export default MainLayout;
