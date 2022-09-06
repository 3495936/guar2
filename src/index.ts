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

//Permitir hacer fetch:
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

// URLs GET, POST

app.get("/", async (req, res) => {
    if (req.query.id !== undefined) {
        if (req.query.fecha !== undefined) {
          let filas = await pool.query("SELECT profTitular, tarea FROM guardias WHERE fecha='"+req.query.fecha+"' AND diaHora='"+req.query.diaHora+"' LIMIT 500");
          let guardias = new Array;
          for (let i = 0; i < filas.rows.length; i++) {
            let tarea = filas.rows[i].tarea;
            let fila2 = await pool.query("SELECT grupo, aula, dificultad FROM horario WHERE diaHora='"+req.query.diaHora+"' AND profTitular='"+filas.rows[i].profTitular+"' LIMIT 500");
            let clase = JSON.stringify(fila2.rows);
            let fila3 = await pool.query("SELECT id, nombre FROM usuarios WHERE id='"+filas.rows[i].profTitular+"' LIMIT 500");
            let profe = JSON.stringify(fila3.rows);
            guardias.push('{"clase":' +clase+ ', "profesor":' +profe+ ', "tarea":' +tarea+ '}');
          }
          res.status(200).json(guardias);
        } else {
          let filas = await pool.query("SELECT id, nombre FROM usuarios LIMIT 500");
          let profes = JSON.stringify(filas.rows);
          filas  = await pool.query("SELECT grupo FROM grupos LIMIT 500");
          let grupos = JSON.stringify(filas.rows);
          filas = await pool.query("SELECT hora FROM horas ORDER BY orden LIMIT 500");
          let horas = JSON.stringify(filas.rows);
          filas = await pool.query("SELECT diahora FROM horarioguardias WHERE profesor='"+req.query.id+"' LIMIT 500");
          let guardiasUser = (filas.rows);
          let compas = "";
          let guardiasU = new Array;
            for (let i = 0; i < guardiasUser.length; i++) {
              let filas = await pool.query("SELECT profesor, horas, puntos FROM horarioguardias WHERE diahora='"+guardiasUser[i].diahora+"' LIMIT 500");
              compas = JSON.stringify(filas.rows);
              guardiasU.push('{"diaHora":' +guardiasUser[i].diahora+ ', "compas":' +JSON.stringify(compas)+ '}');
            }
            res.send(`{"p": ${profes}, "g": ${grupos}, "h": ${horas}, "guardiasUser": ${JSON.stringify(guardiasU)} }`);
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

app.get("/test/", async (req, res) => {
  let filas = await pool.query("select diahora from horarioguardias where profesor='"+req.query.id+"' limit 500");
          let guardiasuser = (filas.rows);
          let compas = "";
          let guardiasu = new Array;
            for (let i = 0; i < guardiasuser.length; i++) {
              let filas = await pool.query("select profesor, horas, puntos from horarioguardias where diahora='"+guardiasuser[i].diahora+"' limit 500");
              compas = JSON.stringify(filas.rows);
              guardiasu.push('{"diahora":' +guardiasuser[i].diahora+ ', "compas":' +JSON.stringify(compas)+ '}');
            }
            res.send(`{"guardiasuser": ${JSON.stringify(guardiasu)} }`);
});
