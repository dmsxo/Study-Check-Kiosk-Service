// Home.jsx
import { useState, useEffect } from "react";
import QRView from "./HomePages/QRView";
import StudyView from "./HomePages/StudyView";
import { getStatus, getCode } from "../../api/AttendanceAPI";
import { useAuth } from "../../contexts/AuthContext";

function Home() {
  const [code, setCode] = useState("");
  const [isStudying, setIsStudying] = useState(false);

  const { user } = useAuth();

  const getAuthCode = async () => {
    const code = await getCode(user.student_id);
    setCode(code);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getStatus("night");
      setIsStudying(!!status);
    };
    fetchStatus();
  }, []);

  if (isStudying) {
    // console.log(isStudying);
    return <StudyView />;
  } else {
    // console.log(isStudying);
    // return <CheckoutModal />;
    return <QRView code={code} getAuthCode={getAuthCode} />;
  }
}

export default Home;
