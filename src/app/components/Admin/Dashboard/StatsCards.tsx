const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-blue-600">150</h3>
        <p className="text-gray-600">Consultas Hoje</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-green-600">25</h3>
        <p className="text-gray-600">Pacientes Novos</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-yellow-600">10</h3>
        <p className="text-gray-600">Cancelamentos</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-red-600">5</h3>
        <p className="text-gray-600">Faltas</p>
      </div>
    </div>
  );
};

export default StatsCards;