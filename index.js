import moment from "moment";
import express from "express";
import svg2png from "./svg2png.js";
import { id2svg, props2svg, rand2svg, id2json, props2json, rand2json } from "./avataaar/tool.js";
import compression from "compression";
import fs from "fs";
import { argv } from "process";

function log(msg) {
   console.log(moment().format("DD.MM. HH:mm:ss.SSS") + ":", msg);
}

async function sendAsSvg(req, res, svg) {
   log(req.url);
   res.contentType("image/svg+xml");
   res.send(svg);
}

async function sendAsPng(req, res, svg, size) {
   log(req.url);
   let png = await svg2png(svg, +size, +size);
   res.contentType("image/png");
   res.send(png);
}

const app = express();

app.use(compression());

app.get("/json", (req, res) => {
   let json = false;
   if (req.query.id) {
      json = id2json(req.query.id);
   } else {
      json = props2json(req.query);
   }
   res.contentType("application/json");
   res.send(JSON.stringify(json));
});

app.get("/svg", (req, res) => {
   let svg = false;
   if (req.query.id) {
      svg = id2svg(req.query.id);
   } else {
      svg = props2svg(req.query);
   }
   sendAsSvg(req, res, svg);
});

app.get("/(:size([0-9]+)).png", (req, res) => {
   let svg = false;
   if (req.query.id) {
      svg = id2svg(req.query.id);
   } else {
      svg = props2svg(req.query);
   }
   sendAsPng(req, res, svg, +req.params.size);
});

app.get("/random/json", (req, res) => {
   let json = rand2json();
   res.contentType("application/json");
   res.send(JSON.stringify(json));
});

app.get("/random/svg", (req, res) => {
   let svg = rand2svg();
   sendAsSvg(req, res, svg);
});

app.get("/random/(:size([0-9]+)).png", (req, res) => {
   let svg = rand2svg();
   sendAsPng(req, res, svg, +req.params.size);
});

app.get("/test", (req, res) => {
   fs.readFile("./test.html", null, (err, data) => {
      res.contentType("text/html");
      res.send(data);
   });
});

const port = +argv[2];
app.listen(port, () => {
   log(`Waiting to serve avataars on port ${port}`);
});
