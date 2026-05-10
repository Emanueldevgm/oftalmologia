const DoctorsList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Lista de Médicos</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Nome</th>
            <th className="text-left">Especialidade</th>
            <th className="text-left">CRM</th>
            <th className="text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Implementar lista */}
          <tr>
            <td>Dr. João Silva</td>
            <td>Oftalmologia Geral</td>
            <td>12345</td>
            <td>
              <button className="text-blue-600">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsList;