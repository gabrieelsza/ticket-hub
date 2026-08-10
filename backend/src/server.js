import "dotenv/config";
import createApp from "./app.js";


const app = createApp();
const PORT = Number(process.env.PORT);


app.listen(PORT, () => {
    console.log(`\n🍞 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação: http://localhost:${PORT}`);
}); 