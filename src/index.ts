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

// URLs GET, POST

app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`PRIMOOOOOOOO. La hora de la BD: ${rows[0].now} `+req.query.id);
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
  var hora = new Date;
  res.send(`La hora del servidor es: ${(hora.getHours()+2) + ":" + hora.getMinutes()+ ":" + hora.getSeconds()}`);
});

// Consultas:
app.get("/users/", async (request, response) => {
  await pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  })
}
