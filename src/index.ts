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
    if (req.query.id !== null) {
        if (req.query.fecha !== null) {
        
        } else {
            const { profes } = await pool.query("SELECT id, nombre FROM usuarios LIMIT 500");
            const { grupos } = await pool.query("SELECT grupo FROM grupos LIMIT 500");
            const { horas } = await pool.query("SELECT hora FROM horas ORDER BY orden LIMIT 500");
            const { guardiasUser } = await pool.query("SELECT diaHora FROM horarioGuardias WHERE profesor='"+req.query.id+"' LIMIT 500");
            for (let i = 0; i < guardiasUser.length; i++) {
                const { compas } = await pool.query("SELECT profesor, horas, puntos FROM horarioGuardias WHERE diaHora='"+guardiasUser[i].diaHora+"' LIMIT 500");
                }
            res.status(200).json('"p":'+profes);
        }
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/fecha/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`PRIMOOOOOOOO. La hora de la BD: ${rows[0].now} `+req.query.id);
});

app.get("/hora/", async (req, res) => {
  var hora = new Date;
  hora.setHours(hora.getHours() + 2);
  res.send(`La hora del servidor es: ${hora}`);
});

// Consultas:
app.get("/users/", async (req, res) => {
  const { rows } = await pool.query("SELECT * from usuarios");  
  res.status(200).json(rows);
});
