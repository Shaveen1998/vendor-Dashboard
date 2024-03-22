import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={80}
        cardInfo={{
          title: "Current Bookings",
          value: "22",
          text: "Currently 22 rooms are booked",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={50}
        cardInfo={{
          title: "Available Rooms",
          value: "12",
          text: "Available for bookings",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={40}
        cardInfo={{
          title: "Total Revenue",
          value: "$18.2K",
          text: "Available to payout",
        }}
      />
    </section>
  );
};

export default AreaCards;
