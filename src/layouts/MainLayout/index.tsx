import Header from "../../components/Header";
import WriteFormModal from "../../components/WriteFormModal";

const MainLayout = ({ children }: React.PropsWithChildren) => {

  return (
    <div className="flex h-full w-full flex-col">
      <Header />

      {children}

      {/* Modal表单 */}
      <WriteFormModal />
    </div>
  );
};

export default MainLayout;
