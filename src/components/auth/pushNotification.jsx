import { sendTestPush } from "../../services/userApi";

function DebugPushButton() {
  const handleClick = async () => {
    try {
      const res = await sendTestPush();
      console.log("Test push response:", res);
      alert("Test push sent. Check your phone.");
    } catch (error) {
      console.error("Error sending test push:", error);
      alert(error.response?.data?.message || "Failed to send test push");
    }
  };

  return <button onClick={handleClick}>Send Test Push</button>;
}

export default DebugPushButton;
