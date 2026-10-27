import { useEffect } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUserProfileThunk } from "./store/slice/user/user.thunk";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
