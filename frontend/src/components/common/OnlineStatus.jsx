import useOnlineStatus from "../../Utills/useOnlineStatus";

const OnlineStatus = () => {
  const isOnline = useOnlineStatus();

  return(
    <div
      style={{
        padding: "10px",
        backgroundColor: isOnline ? "#e6fffa" : "#ffe6e6",
        color: isOnline ? "green" : "red",
        textAlign: "center",
        fontWeight: "bold",
      }}>
      {isOnline ? "🟢 You are Online" : "🔴 You are Offline"}
    </div>
  );
};

export default OnlineStatus;
