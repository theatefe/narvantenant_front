import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export const TotalGrid = () => {
  const row = (
    <div className="row">
      <div className="col-1 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={40}
        />
      </div>
      <div className="col-5 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={40}
        />
      </div>
      <div className="col-4 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={40}
        />
      </div>
      <div className="col-1 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={40}
        />
      </div>
      <div className="col-1 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rectangular"
          width={'100%'}
          height={40}
        />
      </div>
    </div>
  );
  const rows = [];
  for (let i = 0; i < 12; i++) {
    rows.push(row);
  }
  return (
    <div className="row  mb-5">
      <div className="col-12 col-md-11 p-2 mb-2">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={30}
        />
      </div>
      {rows.map((row, index) => (
        <div key={index}>{row}</div>
      ))}
      <div>
        <div className="row">
          <div className="col-1 p-1">
            <Skeleton
              sx={{ marginTop: '0px' }}
              animation="wave"
              variant="rectangular"
              width={'0%'}
              height={0}
            />
          </div>
          <div className="col-5 p-1">
            <Skeleton
              sx={{ marginTop: '0px' }}
              animation="wave"
              variant="rectangular"
              width={'0%'}
              height={0}
            />
          </div>
          <div className="col-5 p-1">
            <Skeleton
              sx={{ marginTop: '0px' }}
              animation="wave"
              variant="rectangular"
              width={'100%'}
              height={40}
            />
          </div>
          <div className="col-1 p-1">
            <Skeleton
              sx={{ marginTop: '0px' }}
              animation="wave"
              variant="rectangular"
              width={'100%'}
              height={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TotalGrid;
