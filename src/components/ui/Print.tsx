import React, { useRef } from 'react';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import Button from '@mui/material/Button';

const PrintableComponent = ({ contentToPrint }) => {
  const printRef = useRef(null);
  const { findFilter } = contentToPrint;
  const handlePrint = () => {
    const printContents = printRef.current;

    // const originalContents = window.document.body.innerHTML;

    window.document.body.innerHTML = printContents.innerHTML;
    window.print();
    window.location.reload();
  };

  return (
    <>
      <Button
        onClick={() => {
          handlePrint();
        }}
        sx={{ m: 1, mb: 0 }}
        variant="contained"
        color="secondary"
        startIcon={<LocalPrintshopIcon />}
      >
        {'  چاپ گزارش  '}{' '}
      </Button>
      <div style={{ display: 'none' }}>
        <div ref={printRef}>{contentToPrint}</div>
      </div>
    </>
  );
};

export default PrintableComponent;
