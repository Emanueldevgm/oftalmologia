const AppointmentList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Lista de Consultas</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Paciente</th>
            <th className="text-left">Data/Hora</th>
            <th className="text-left">Status</th>
            <th className="text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Implementar lista */}
          <tr>
            <td>João Silva</td>
            <td>2024-01-15 10:00</td>
            <td>Confirmado</td>
            <td>
              <button className="text-blue-600">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;