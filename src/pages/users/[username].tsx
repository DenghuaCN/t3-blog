import { useRouter } from "next/router";

import MainLayout from "../../layouts/MainLayout";


const UserProfilePage = () => {

  const router = useRouter();

  return (
    <MainLayout>
      this is our user page
    </MainLayout>
  );
}

export default UserProfilePage;