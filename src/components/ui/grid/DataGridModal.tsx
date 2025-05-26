import React from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_FA } from 'mantine-react-table/locales/fa';

const Example = (props) => {
    const { data, columns, handleSelect } = props.init;
    const [rowSelection, setRowSelection] = React.useState({}); // Row selection state

    // Function to handle row selection changes
    const handleRowSelectionChange = (newRowSelection) => {
        setRowSelection(newRowSelection);
    };

    // Configure the table
    const table = useMantineReactTable({
        columns,
        data,
        enableRowSelection: true,
        localization: MRT_Localization_FA,
        enableSelectAll: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        onRowSelectionChange: handleRowSelectionChange, // Pass the handler
        state: {
            rowSelection, // Bind the row selection state
        },
    });
    React.useEffect(() => {
        // Filter the selected rows based on the rowSelection state
        const selectedRows = data.filter((row, index) => rowSelection[index]);
        // Pass the selected rows to the parent component
        handleSelect(selectedRows);
    }, [rowSelection]);

    return (
        <div>
            <MantineReactTable table={table} />
        </div>
    );
};

export default Example;