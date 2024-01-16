import React from "react";
import { createContext, useState } from "react";

type GlobalContextType = {
  isWriteModalOpen: boolean;
  setIsWriteModalOpen: (isOpen: boolean) => void;
};


const GlobalContextProvider = ({ children }: React.PropsWithChildren) => {

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        isWriteModalOpen,
        setIsWriteModalOpen
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}


export const GlobalContext = createContext<GlobalContextType>(null as unknown as GlobalContextType) // 类型断言 神操作
export default GlobalContextProvider;