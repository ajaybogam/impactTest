import * as React from "react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<FoodRecipeNS.IAPIResponse>();

const columns = [
  columnHelper.accessor("name", {
    footer: (props) => props.column.id,
    enableSorting: true,
    cell: (info) => info.renderValue(),
    enableGrouping: false,
  }),
  columnHelper.accessor("price", {
    footer: (props) => props.column.id,
    enableSorting: true,
    sortingFn: "alphanumeric",
    aggregatedCell: ({ getValue }) =>
      Math.round(getValue<number>() * 100) / 100,
    aggregationFn: "sum",
    enableGrouping: false,
  }),
  columnHelper.accessor("category", {
    cell: (info) => info.renderValue(),
    footer: (props) => props.column.id,
    enableSorting: false,
    enableGrouping: true,
  }),
];

const FoodRecipeTable: React.FC<FoodRecipeNS.IProps> = ({
  apiResponse,
  handleClickOnSave,
  handleClickOnReset,
}) => {
  const [data, setData] = React.useState<FoodRecipeNS.IAPIResponse>([]);
  const [modifiedResponse, setModifiedResponseIds] = React.useState<
    string,
    FoodRecipeNS.IAPIResponse
  >({});
  const [sorting, setSorting] = React.useState<FoodRecipeNS.IAPIResponse>([]);
  const [grouping, setGrouping] = React.useState<FoodRecipeNS.IAPIResponse>([]);

  React.useEffect(() => {
    setData(apiResponse);
    setSorting([]);
  }, [apiResponse]);

  // Give our default column cell renderer editing superpowers!
  const defaultColumn: Partial<ColumnDef<FoodRecipeNS.IAPIResponse>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = React.useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      );
    },
  };

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    state: {
      sorting,
      grouping,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              const response = {
                ...old[rowIndex]!,
                [columnId]: value,
              };
              const copy = { ...modifiedResponse };
              copy[rowIndex] = response;
              setModifiedResponseIds(Object.values(copy));
              return response;
            }
            return row;
          })
        );
      },
    },
    getGroupedRowModel: getGroupedRowModel(),
    onGroupingChange: setGrouping,
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <>
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.column.getCanGroup() ? (
                      <button
                        className={"buttonStyles"}
                        {...{
                          onClick: header.column.getToggleGroupingHandler(),
                          style: {
                            cursor: "pointer",
                            fontSize: "14px",
                            border: "none",
                          },
                        }}
                      >
                        {header.column.getIsGrouped()
                          ? `UnGroup (${header.column.getGroupedIndex()}) `
                          : `Group `}
                      </button>
                    ) : null}
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                </>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      {...{
                        key: cell.id,
                        style: {
                          background: cell.getIsGrouped()
                            ? "#0aff0082"
                            : cell.getIsAggregated()
                            ? "#ffa50078"
                            : cell.getIsPlaceholder()
                            ? "#ff000042"
                            : "white",
                        },
                      }}
                    >
                      {cell.getIsGrouped() ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <button
                            {...{
                              onClick: row.getToggleExpandedHandler(),
                              style: {
                                cursor: row.getCanExpand()
                                  ? "pointer"
                                  : "normal",
                              },
                            }}
                          >
                            {row.getIsExpanded() ? "👇" : "👉"}{" "}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}{" "}
                            ({row.subRows.length})
                          </button>
                        </>
                      ) : cell.getIsAggregated() ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        flexRender(
                          cell.column.columnDef.aggregatedCell ??
                            cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => handleClickOnSave(modifiedResponse)}
        className={"buttonStyles"}
      >
        Save
      </button>
      <button
        onClick={() => {
          handleClickOnReset();
          setModifiedResponseIds({});
        }}
        className={"buttonStyles"}
      >
        Reset
      </button>
    </div>
  );
};

export default FoodRecipeTable;
