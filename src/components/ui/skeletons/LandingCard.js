import React from "react";
import Skeleton from "@mui/material/Skeleton";

export const LandingCard = () => {
  return (
    <div className="row  mb-5">
      <div className="col-12 col-md-10 p-2 mb-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={30}
        />
      </div>
      <div className="col-6 col-md-4 p-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={200}
        />
      </div>
      <div className="col-6 col-md-4 p-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={200}
        />
      </div>
      <div className="col-6 col-md-4 p-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={200}
        />
      </div>
      <div className="col-6 col-md-4 p-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={200}
        />
      </div>
      <div className="col-6 col-md-4 p-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={200}
        />
      </div>
      <div className="col-6 col-md-4 p-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={200}
        />
      </div>
    </div>
  );
};
export default LandingCard;
