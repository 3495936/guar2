import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway
const pool = new pg.Pool();

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`PRIMOOOOOOOO. La hora de la BD: ${rows[0].now}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/coche/", async (req, res) => {
  const { rows } = await pool.query("SELECT * from prueba");
  var texto = "";
  for (let i = 0; i < rows.length; i++) {
    texto += rows[i].nombre + " ";    
  }
  res.send(`Resultado: ${texto}`);
});

app.get("/hora/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`La hora de la BD: ${rows[0].now}`);
  var hora = Date.now();
  res.send(`La hora del servidor es: ${hora}`);
});
