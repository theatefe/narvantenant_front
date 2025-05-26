import React from 'react';
import Skeleton from '@mui/material/Skeleton';

export const TotalGrid = () => {
  const row = (
    <div className="row">
      <div className="col-1 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={34}
        />
      </div>
      <div className="col-3 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={34}
        />
      </div>
      <div className="col-2 p-1 ">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={34}
        />
      </div>
      <div className="col-1 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={34}
        />
      </div>
      <div className="col-1 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={34}
        />
      </div>
      <div className="col-2 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={34}
        />
      </div>
      <div className="col-2 p-1">
        <Skeleton
          sx={{ marginTop: '0px' }}
          animation="wave"
          variant="rounded"
          width={'100%'}
          height={34}
        />
      </div>
    </div>
  );
  const rows = [];
  for (let i = 0; i < 7; i++) {
    rows.push(row);
  }
  return (
    <div className="row  justify-content-center">
      <div className="col-12 col-md-12  col-lg-12 col-xl-11">
        <div className="row  mb-5 justify-content-center">
          <div className="col-12  mt-3 mb-2 p-2">
            <Skeleton
              sx={{ marginTop: '0px' }}
              animation="wave"
              variant="rounded"
              width={'100%'}
              height={34}
            />
          </div>
          <div className="col-12 text-center col-md-6 rounded mb-2 p-2 bg-secondary">
            <h4 className="text-white">تانکر های بارگیری نشده</h4>
          </div>
          {rows.map((row, index) => (
            <div key={index}>{row}</div>
          ))}
          <div className="col-12 text-center col-md-6 rounded  mt-5 mb-2 p-2 bg-secondary">
            <h4 className="text-white">تانکر های بارگیری شده</h4>
          </div>
          {rows.map((row, index) => (
            <div key={index}>{row}</div>
          ))}
          <div className="col-12 text-center col-md-6 rounded mt-5 mb-2 p-2 bg-secondary">
            <h4 className="text-white"> ورودی مواد </h4>
          </div>
          {rows.map((row, index) => (
            <div key={index}>{row}</div>
          ))}
          <div>
            <div className="row">
              <div className="col-1 p-1"></div>
              <div className="col-7 p-1"></div>
              <div className="col-2 p-1">
                <h6 className=" text-white p-2 text-left rounded bg-secondary">
                  مجموع
                </h6>
              </div>
              <div className="col-2 p-1">
                  <Skeleton
                    sx={{ marginTop: '0px' }}
                    animation="wave"
                    variant="rounded"
                    width={'100%'}
                    height={34}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TotalGrid;
