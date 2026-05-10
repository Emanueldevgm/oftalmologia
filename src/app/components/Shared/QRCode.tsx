const QRCode = ({ value }: { value: string }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h4 className="text-sm font-medium mb-2">QR Code da Consulta</h4>
      {/* TODO: Implementar QR Code real */}
      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
        <span className="text-xs text-gray-500">QR Code</span>
      </div>
    </div>
  );
};

export default QRCode;