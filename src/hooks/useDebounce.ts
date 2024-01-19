import { useEffect, useState } from "react";

const useDebounce = (query: string, delay: number) => {
  const [val, setVal] = useState(query);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVal(query);
    }, delay);

    return () => {
      clearTimeout(timeoutId)
    }

  }, [delay, query]);


  return val;
}

export default useDebounce;