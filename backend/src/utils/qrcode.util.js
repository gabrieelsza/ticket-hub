import crypto from "crypto";

// Gera um código único assinado: <uuid>.<assinatura>
// A assinatura garante que o código só pode ter sido emitido por este servidor
export function gerarCodigoSeguro() {
  const identificador = crypto.randomUUID();
  const assinatura = assinar(identificador);
  return `${identificador}.${assinatura}`;
}

export function codigoEhValido(codigo) {
  if (!codigo || !codigo.includes(".")) return false;

  const [identificador, assinaturaRecebida] = codigo.split(".");
  const assinaturaEsperada = assinar(identificador);

  // timingSafeEqual evita "timing attack" (comparar string por string vaza informação)
  const bufferRecebido = Buffer.from(assinaturaRecebida);
  const bufferEsperado = Buffer.from(assinaturaEsperada);

  if (bufferRecebido.length !== bufferEsperado.length) return false;

  return crypto.timingSafeEqual(bufferRecebido, bufferEsperado);
}

function assinar(identificador) {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET) // reaproveita o segredo que já existe no .env
    .update(identificador)
    .digest("hex")
    .slice(0, 16); // 16 caracteres já são suficientes, deixa o código mais curto
}