import { useAppState } from "@/utils/AppState";

export const App = ({children}) => {
  const { currentItems } = useAppState();
  return (
    <>
    {children}
    </>
  )
}
