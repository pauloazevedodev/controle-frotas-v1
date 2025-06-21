import MainDesktop from "./Components/MainDesktop";
import { isMobileOnly } from "react-device-detect";
import MainMobile from "./Components/MainMobile";

const Main = ({ children, setIsAuthenticated }) => {
  return (
    <>
      {!isMobileOnly ? (
        <MainDesktop setIsAuthenticated={setIsAuthenticated}>
          {children}
        </MainDesktop>
      ) : (
        <MainMobile setIsAuthenticated={setIsAuthenticated}>
          {children}
        </MainMobile>
      )}
    </>
  );
};

export default Main;
