import React from 'react';
// import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_FA } from 'mantine-react-table/locales/fa';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import IconDownload from '../icon/IconDownload';
import { downloadExcel } from 'react-export-table-to-excel';



const Example = (props) => {
    const { data, columns, header } = props.init;




    const handleDownloadExcel = (rowData) => {
        const data = rowData.map(row => {

            return Object.values(row.original).slice(0, header.length)
        })
        console.log(Object.values(rowData[0].original));
        downloadExcel({
            fileName: props.fileName || 'exported-data',
            sheet: props.sheet || 'exported-data',
            tablePayload: {
                header,
                body: data,
            },
        });
    };



    const table = useMantineReactTable({
        columns,
        data,
        enableRowSelection: true,
        localization: MRT_Localization_FA,
        enableSelectAll: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: ({ table }) => (
            <>

                <Box
                    style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '8px',
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        disabled={table.getPrePaginationRowModel().rows.length === 0}
                        onClick={() =>
                            handleDownloadExcel(table.getPrePaginationRowModel().rows)
                        }
                        sx={{ m: 1, mb: 0, backgroundColor: '#2aa358' }}
                        color="success"
                        variant="contained"
                        disableElevation
                        endIcon={<IconDownload />}
                    >
                        دانلود همه داده ها
                    </Button>
                    <Button
                        disabled={
                            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                        }
                        onClick={() => handleDownloadExcel(table.getSelectedRowModel().rows)}
                        sx={{ m: 1, mb: 0, backgroundColor: '#2aa358' }}
                        color="success"
                        variant="contained"
                        disableElevation
                        endIcon={<IconDownload />}
                    >
                        دانلود سطرهای انتخاب شده
                    </Button>
                </Box>
            </>

        ),
    });

    return <MantineReactTable table={table} />;
};

export default Example;