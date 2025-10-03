export default function Spinner() {
  return (
    <div style={{ padding: 16, display: "flex", justifyContent: "center" }}>
      <div
        aria-label="Загрузка"
        style={{
          width: 24,
          height: 24,
          border: "3px solid #e5e7eb",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}
