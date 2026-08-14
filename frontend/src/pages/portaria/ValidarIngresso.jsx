import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, ScanLine, Camera, Keyboard, CameraOff } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../services/api";

export default function ValidarIngresso() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [erroCamera, setErroCamera] = useState("");
  const [validandoCodigo, setValidandoCodigo] = useState("");
  const html5QrCodeRef = useRef(null);
  const scannerRegionId = "reader";

  async function validarCodigo(valor) {
    if (!valor.trim() || carregando) return;

    setCarregando(true);
    setResultado(null);

    try {
      const response = await api.post("/checkin", { qrCode: valor.trim() });
      setResultado({
        sucesso: true,
        mensagem: "Acesso liberado",
        ticket: response.data.ticket,
      });
    } catch (error) {
      setResultado({
        sucesso: false,
        mensagem: error.response?.data?.message || "Acesso negado",
      });
    } finally {
      setCodigo("");
      setValidandoCodigo("");
      setCarregando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await validarCodigo(codigo);
  }

  async function pararScanner() {
    try {
      const scanner = html5QrCodeRef.current;
      if (scanner && scanner.isScanning) {
        await scanner.stop();
        await scanner.clear();
      }
    } catch (error) {
      console.error("Erro ao parar scanner:", error);
    } finally {
      html5QrCodeRef.current = null;
    }
  }

  useEffect(() => {
    if (!scannerAtivo) {
      pararScanner();
      return;
    }

    let ignorar = false;

    async function iniciarScanner() {
      try {
        setErroCamera("");

        const elemento = document.getElementById(scannerRegionId);
        if (!elemento) return;

        const scanner = new Html5Qrcode(scannerRegionId);
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1,
          },
          async (decodedText) => {
            if (ignorar) return;
            if (decodedText === validandoCodigo || carregando) return;

            ignorar = true;
            setValidandoCodigo(decodedText);
            setCodigo(decodedText);
            setScannerAtivo(false);
            await validarCodigo(decodedText);
          },
          () => {}
        );
      } catch (error) {
        setErroCamera(error, "Não foi possível acessar a câmera. Use a digitação manual.");
        setScannerAtivo(false);
      }
    }

    const timer = setTimeout(() => {
      iniciarScanner();
    }, 100);

    return () => {
      clearTimeout(timer);
      pararScanner();
    };
  }, [scannerAtivo]);

  const resultadoClasses = resultado?.sucesso
    ? {
        box: "border-green-500/20 bg-green-500/10",
        icon: "text-green-600 dark:text-green-400",
        text: "text-green-700 dark:text-green-300",
      }
    : {
        box: "border-destructive/20 bg-destructive/10",
        icon: "text-destructive",
        text: "text-destructive",
      };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card shadow-sm">
        <ScanLine className="h-8 w-8 text-primary" />
      </div>

      <h1 className="mt-3 text-2xl font-black text-foreground">
        Validar ingresso
      </h1>

      <p className="mt-1 text-center text-sm text-muted-foreground">
        Leia o QR code pela câmera ou digite o código manualmente.
      </p>

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setScannerAtivo(true)}
          disabled={scannerAtivo}
          className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
        >
          <Camera className="h-4 w-4" />
          Abrir câmera
        </button>

        <button
          type="button"
          onClick={() => setScannerAtivo(false)}
          disabled={!scannerAtivo}
          className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
        >
          <CameraOff className="h-4 w-4" />
          Fechar câmera
        </button>
      </div>

      {scannerAtivo && (
        <div className="mt-4 w-full rounded-3xl border border-border bg-card p-3 shadow-sm">
          <div id="reader" className="min-h-80 overflow-hidden rounded-2xl" />
        </div>
      )}

      {erroCamera && (
        <p className="mt-4 w-full rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {erroCamera}
        </p>
      )}

      <div className="mt-5 flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <Keyboard className="h-4 w-4" />
        Alternativa manual
      </div>

      <form onSubmit={handleSubmit} className="mt-3 w-full">
        <input
          autoFocus
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código do ingresso"
          className="w-full rounded-2xl border border-input bg-background p-4 text-center text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
        />

        <button
          type="submit"
          disabled={carregando}
          className="mt-3 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
        >
          {carregando ? "Verificando..." : "Validar manualmente"}
        </button>
      </form>

      {resultado && (
        <div
          role="alert"
          className={`mt-8 flex w-full flex-col items-center gap-2 rounded-3xl border p-6 text-center ${resultadoClasses.box}`}
        >
          {resultado.sucesso ? (
            <CheckCircle2 className={`h-12 w-12 ${resultadoClasses.icon}`} />
          ) : (
            <XCircle className={`h-12 w-12 ${resultadoClasses.icon}`} />
          )}

          <p className={`text-lg font-black ${resultadoClasses.text}`}>
            {resultado.mensagem}
          </p>

          {resultado.sucesso && resultado.ticket && (
            <p className="text-sm text-muted-foreground">
              Assento {resultado.ticket.assento}
            </p>
          )}
        </div>
      )}
    </div>
  );
}