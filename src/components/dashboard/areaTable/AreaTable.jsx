import "./AreaTable.scss";

const TABLE_HEADS = [
  "Room",
  "Booking ID",
  "Date",
  "Number of guests",
  "Status",
  "Price",
  "Category",
];

const TABLE_DATA = [
  {
    id: 100,
    name: "Superior Family suite",
    order_id: 11232,
    date: "Jun 29,2024",
    customer: "Afaq Karim",
    status: "Booked",
    amount: 500,
    category: "Superior",
  },
  {
    id: 101,
    name: "Sea View Room",
    order_id: 11232,
    date: "Jun 29,2022",
    customer: "Afaq Karim",
    status: "pending",
    amount: 288,
    category: "Superior",
  },
  {
    id: 102,
    name: "Business Suite",
    order_id: 11232,
    date: "Jun 29,2022",
    customer: "Afaq Karim",
    status: "canceled",
    amount: 500,
    category: "Superior",
  },
  {
    id: 103,
    name: "Mountain pine room",
    order_id: 11232,
    date: "Jun 29,2022",
    customer: "Afaq Karim",
    status: "delivered",
    amount: 100,
    category: "Superior",
  },
  {
    id: 104,
    name: "Double bed luxury",
    order_id: 11232,
    date: "Jun 29,2022",
    customer: "Afaq Karim",
    status: "delivered",
    amount: 60,
    category: "Superior",
  },
  {
    id: 105,
    name: "Family fiesta",
    order_id: 11232,
    date: "Jun 29,2022",
    customer: "Afaq Karim",
    status: "delivered",
    amount: 80,
    category: "Superior",
  },
];

const AreaTable = () => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Bookings</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA?.map((dataItem) => {
              return (
                <tr key={dataItem.id}>
                  <td>{dataItem.name}</td>
                  <td>{dataItem.order_id}</td>
                  <td>{dataItem.date}</td>
                  <td>{dataItem.customer}</td>
                  <td>
                    <div className="dt-status">
                      <span
                        className={`dt-status-dot dot-${dataItem.status}`}
                      ></span>
                      <span className="dt-status-text">{dataItem.status}</span>
                    </div>
                  </td>
                  <td>${dataItem.amount.toFixed(2)}</td>
                  <td>{dataItem.category}</td>
                  <td className="dt-cell-action"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
