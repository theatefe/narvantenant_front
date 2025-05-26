import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';

// redux setters
import { RootState } from '../../redux/reducers';

const Loading = () => {
  const { isLoading } = useSelector((state: RootState) => state.page);
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress sx={{ color: 'red' }} />
      </Backdrop>
    </div>
  );
};
export default Loading;
