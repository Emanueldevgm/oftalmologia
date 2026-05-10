const DoctorForm = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Adicionar/Editar Médico</h3>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nome</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Especialidade</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">CRM</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;