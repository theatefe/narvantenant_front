import React from 'react';

import DataTable, { Direction } from 'react-data-table-component';

import downloadCSV from './ScvTools';
import SearchColumn from './searchColumn';
// import Pdf from "react-to-pdf";

// const ref = React.createRef();
// const options = {
//   orientation: 'landscape',
// };
const customStyles = {
  headRow: {
    style: {
      border: 'none',
    },
  },
  headCells: {
    style: {
      color: '#202124',
      fontSize: '14px',
      paddingTop: '0px',
      paddingButtom: '0px',
      paddingRight: '2px',
      paddingLent: '2px',
      backgroundColor: '#D2D2D2',
    },
  },
  rows: {
    style: {},
  },
  cells: {
    style: {
      padding: '2px',
    },
    draggingStyle: {},
  },
  pagination: {
    style: {
      border: 'none',
    },
  },
};

const DataGrid = (props) => {
  const Export = ({ onExport }) => (
    <input
      type="button"
      className="btn btn-sm"
      onClick={(e) => onExport(e.target)}
      value="Export CSV"
    />
  );

  const [filteredItems, setFilteredItems] = React.useState(props.data);
  const [columns, setColumns] = React.useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [pending, setPending] = React.useState(true);
  React.useEffect(() => {
    const columns = props.columns.map((column) => {
      return {
        name: (
          <SearchColumn
            title={column.title}
            name={column.name}
            searchable={column.searchable}
            type={column.type}
            setFilteredItems={setFilteredItems}
            data={props.data}
            setResetPaginationToggle={setResetPaginationToggle}
          />
        ),
        selector: (row) =>
          row[
            typeof column.name === 'string'
              ? column.name.toLowerCase()
              : column.name
          ],
        sortable: column.sortable,
        width: column.width,
        // maxWidth: column.maxWidth,
      };
    });
    setColumns(columns);
    setFilteredItems(props.data);
    setTimeout(() => {
      setPending(false);
    }, 100);
  }, [props.data]);

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'همه',
    rowsPerPageText: 'تعداد در هر صفحه',
    rangeSeparatorText: 'از',
  };

  const actionsMemo = React.useMemo(
    () =>
      props.exportCsv ? (
        <Export onExport={() => downloadCSV(filteredItems, props.fileName)} />
      ) : null,
    [filteredItems],
  );
  return (
    <>
      {/* <Pdf targetRef={ref} filename="code-example.pdf" options={options}>
        {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
      </Pdf> */}
      <div
        style={{ maxWidth: '100%', overflowX: 'auto' }}
        className='scrollBar'
        //  ref={ref}
      >
        <DataTable
          direction={Direction.RTL}
          columns={columns}
          data={filteredItems}
          persistTableHead
          fixedHeader={props.fixedHeader}
          fixedHeaderScrollHeight={`${
            props.fixedHeaderScrollHeight || '440'
          }px`}
          highlightOnHover
          noContextMenu
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          paginationComponentOptions={paginationComponentOptions}
          responsive={true}
          striped={true}
          progressComponent="در حال آماده سازی داده ها"
          noDataComponent="موردی برای نمایش وجود ندارد"
          dense
          actions={actionsMemo}
          progressPending={pending}
          paginationPerPage={props.paginationPerPage || 10}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 200, 300, 500, 1000]}
          onRowClicked={(row, event) => {
            // console.log({ row });
            // console.log({ event });
          }}
          customStyles={customStyles}
        />
      </div>
    </>
  );
};

export default DataGrid;
