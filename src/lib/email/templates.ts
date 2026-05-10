// ============================================
// Templates de Email - HGU Oftalmologia
// RN11, RN24, RN29
// ============================================

interface BookingConfirmationData {
  nome: string
  data: string
  hora: string
  cancelToken: string
  accessPassword: string
}

interface ReminderData {
  nome: string
  data: string
  hora: string
}

export function getBookingConfirmationTemplate(data: BookingConfirmationData): string {
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cancelar?token=${data.cancelToken}`
  
  return `
<!DOCTYPE html>
<html lang="pt-AO">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f4f7fa;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1a4f7e 0%, #0d3b5e 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      margin-bottom: 5px;
    }
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 16px;
      color: #2d3748;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .info-box {
      background: #f0f7ff;
      border-left: 4px solid #1a4f7e;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 8px 0;
      color: #2d3748;
      font-size: 15px;
    }
    .info-box strong {
      color: #1a4f7e;
    }
    .password-box {
      background: #fefcbf;
      border: 2px dashed #d69e2e;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 25px 0;
    }
    .password {
      font-size: 36px;
      font-weight: bold;
      color: #1a4f7e;
      letter-spacing: 12px;
      font-family: 'Courier New', monospace;
    }
    .password-label {
      font-size: 13px;
      color: #718096;
      margin-bottom: 10px;
    }
    .warning {
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #c53030;
    }
    .warning strong {
      display: block;
      margin-bottom: 5px;
    }
    .btn {
      display: inline-block;
      background: #e53e3e;
      color: white !important;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 10px 0;
      text-align: center;
    }
    .btn:hover {
      background: #c53030;
    }
    .divider {
      border-top: 1px solid #e2e8f0;
      margin: 25px 0;
    }
    .footer {
      background: #f7fafc;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #718096;
    }
    .footer p {
      margin: 5px 0;
    }
    .contact-info {
      font-size: 13px;
      color: #4a5568;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 Hospital Geral do Uíge</h1>
      <p>Serviço de Oftalmologia</p>
    </div>
    
    <div class="content">
      <p class="greeting">
        Olá, <strong>${data.nome}</strong>!<br>
        A sua consulta de Oftalmologia foi <strong>confirmada com sucesso</strong>.
      </p>
      
      <div class="info-box">
        <p><strong>📅 Data:</strong> ${data.data}</p>
        <p><strong>⏰ Horário:</strong> ${data.hora}</p>
        <p><strong>📍 Local:</strong> Hospital Geral do Uíge - Ala de Oftalmologia</p>
        <p><strong>🏥 Endereço:</strong> Bairro Popular, Rua Principal, Uíge, Angola</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Importante:</strong>
        • Chegue com <strong>15 minutos de antecedência</strong><br>
        • Atraso superior a 10 minutos pode resultar na perda da vaga<br>
        • Traga o seu <strong>Bilhete de Identidade (BI)</strong>
      </div>
      
      <div class="password-box">
        <div class="password-label">🔑 SUA SENHA DE ACESSO</div>
        <div class="password">${data.accessPassword}</div>
        <div style="margin-top: 10px; font-size: 13px; color: #4a5568;">
          Guarde esta senha! Use-a com o seu BI para consultar ou cancelar consultas
        </div>
      </div>
      
      <div style="text-align: center;">
        <p style="margin-bottom: 10px; color: #4a5568;">Para cancelar esta consulta:</p>
        <a href="${cancelUrl}" class="btn">🗑️ Cancelar Consulta</a>
        <p style="font-size: 12px; color: #718096; margin-top: 10px;">
          Ou acesse <strong>${process.env.NEXT_PUBLIC_APP_URL}/consultar</strong><br>
          e faça login com o seu BI + senha
        </p>
      </div>
      
      <div class="divider"></div>
      
      <div class="contact-info">
        <strong>📞 Contactos do Hospital:</strong><br>
        Telefone: +244 934 567 890<br>
        Email: oftalmologia@hgu.gov.ao<br>
        Horário: Seg-Sex, 08:00 - 16:00
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Hospital Geral do Uíge</strong> - Serviço Nacional de Saúde</p>
      <p>Este é um email automático. Por favor, não responda a este endereço.</p>
      <p style="margin-top: 10px;">© ${new Date().getFullYear()} HGU - Todos os direitos reservados</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function getReminderTemplate(data: ReminderData): string {
  return `
<!DOCTYPE html>
<html lang="pt-AO">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f4f7fa;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      margin-bottom: 5px;
    }
    .content {
      padding: 30px;
    }
    .info-box {
      background: #f0f7ff;
      border-left: 4px solid #e67e22;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 8px 0;
      color: #2d3748;
      font-size: 15px;
    }
    .footer {
      background: #f7fafc;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #718096;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Lembrete de Consulta</h1>
      <p>Hospital Geral do Uíge - Oftalmologia</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; color: #2d3748; margin-bottom: 20px;">
        Olá, <strong>${data.nome}</strong>!
      </p>
      <p style="color: #4a5568; margin-bottom: 20px;">
        A sua consulta de Oftalmologia está marcada para <strong>amanhã</strong>. Confira os detalhes:
      </p>
      
      <div class="info-box">
        <p><strong>📅 Data:</strong> ${data.data}</p>
        <p><strong>⏰ Horário:</strong> ${data.hora}</p>
        <p><strong>📍 Local:</strong> Hospital Geral do Uíge - Ala de Oftalmologia</p>
      </div>
      
      <div style="background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <strong style="color: #c53030;">⚠️ Não se esqueça:</strong>
        <ul style="margin: 10px 0 0 20px; color: #4a5568;">
          <li>Chegue com 15 minutos de antecedência</li>
          <li>Traga o seu Bilhete de Identidade (BI)</li>
          <li>Atrasos podem resultar na perda da vaga</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Hospital Geral do Uíge</strong> - Serviço Nacional de Saúde</p>
      <p>Este é um email automático.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}