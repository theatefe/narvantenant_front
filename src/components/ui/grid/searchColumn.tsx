import React from 'react';
import { FromInt } from '../../helpers/NumberTools';

const searchColumn = (props) => {
  if (props.searchable) {
    return (
      <div className="col-md-11 col-12 form-group ml-0 pl-0 text-right">
        <label>{props.title}</label>

        <input
          type={props.type}
          className="mt-1 mb-2"
          onChange={(e) => {
            if (e.target.value) {
              props.setFilteredItems(
                props.data.filter(
                  (item) =>
                    item[props.name] &&
                    item[props.name].includes(FromInt(e.target.value)),
                ),
              );
            } else {
              props.setFilteredItems(props.data);
              props.setResetPaginationToggle(!props.resetPaginationToggle);
            }
          }}
          style={{ width: '100%' }}
        />
      </div>
    );
  } else {
    return <span className="align-top">{props.title}</span>;
  }
};
export default searchColumn;
