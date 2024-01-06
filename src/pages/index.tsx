import Main from "../components/Main";
import MainLayout from "../layouts/MainLayout";
import WriteFormModal from "../components/WriteFormModal";
import Side from "../components/Side";

const HomePage = () => {

  return (
    <MainLayout>
      {/* 左栏 Main Screen */}
      <section className="grid h-full w-full grid-cols-12">
        {/* 主内容 */}
        <Main />

        {/* 右栏 */}
        <Side />
      </section>
      {/* Modal表单 */}
      <WriteFormModal />
    </MainLayout>
  );
};

export default HomePage;
