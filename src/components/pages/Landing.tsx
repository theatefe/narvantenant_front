import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from "@mui/material";
// import APIs

// redux seters
import { RootState } from './../redux/reducers';
import { setIsLoading, setMetaData } from '../redux/reducers/page';

//import skeletons
import LandingCardSkeleton from '../ui/skeletons/LandingCard';

// images ***************************************************
import landingPic from '../../assets/image/narvan_logoWithText_small_login.svg';

const Landing = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // redux
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const token = auth.token;


  React.useEffect(() => {
    dispatch(setIsLoading(false));
    dispatch(
      setMetaData({
        title: 'نارون : صفحه اصلی',
        description: 'نارون:  صفحه اصلی',
      }),
    );
    setIsLoaded(true);
  }, []);

  return (
    <>
      <div className="col-12 col-lg-12 col-xl-8 justify-content-center mt-4">
        {/* محتوای اصلی */}
        <Box className="d-flex align-items-center justify-content-center min-vh-75 px-4">
          <div className="position-relative w-100 d-flex flex-column flex-md-row align-items-center gap-4">

            {/* تصویر (فقط در دسکتاپ نمایش داده شود) */}
            <div className="d-none d-md-block w-100 position-relative">
              <div className="position-absolute"></div>
              <img
                src={landingPic}
                alt="Dashboard Preview"
                className="img-fluid "
                style={{ "width": '300px', "height": '300px', "marginTop": '150px', "marginRight": '350px' }}
              />
            </div>
          </div>
        </Box>

        {/* وضعیت بارگذاری */}
        {isLoaded ? (
          <div className="row mb-5">
            {/* محتوای دلخواه شما */}
          </div>
        ) : (
          <LandingCardSkeleton />
        )}
      </div>
    </>
  );
};

export default Landing;
