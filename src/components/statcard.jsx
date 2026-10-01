function StatCard({ title, value, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        {value}
      </h2>

      {description && (
        <p className="text-sm text-gray-500 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;