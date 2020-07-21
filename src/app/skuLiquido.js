const express = require("express");
const app = express();
const port = 3000;
const sql = require('mssql')
const connection = require('../config/client')
let idSkuOrigem

app.listen(port);
console.log("API Funcionando!");

sql.connect(connection, function(err) {
  if(err) console.log(err)
})

app.get('/', (req, res) => {
  let sqlRequest = new sql.Request();

  let sqlQuery = 'SELECT TOP(1) tt.Nome as tipotransporte, m.IdSkuOrigem FROM Inventario.SaldoEstoqueRestricao AS ser INNER JOIN Inventario.EstoqueRestricao as er ON(er.IdRestricao = ser.IdRestricao) LEFT JOIN Inventario.SaldoTipoEstoque AS ste ON(ste.IdSaldoTipoEstoque = ser.IdSaldoTipoEstoque) LEFT JOIN Inventario.SaldoSkuFilial AS sf ON(ste.IdSaldoSkuFilial = sf.IdSaldoSkuFilial) INNER JOIN Inventario.Modalidade m ON sf.IdSku = m.IdModalidadeSku left  join inventario.sku as s on m.IdModalidadeSku=s.id left join inventario.TipoTransporte as tt on tt.IdTipoTransporte=s.TipoTransporte where m.TipoModalidade=0 and ser.QuantidadeDisponivel>0 and tt.IdTipoTransporte=3 ORDER BY NewID()'

  sqlRequest.query(sqlQuery, function(err, data) {
    if(err) console.log(err)

    let idSku = data.recordset;

    idSkuOrigem = JSON.parse(idSku.map(e => e.IdSkuOrigem))
    console.log(idSkuOrigem)
    return res.json(idSkuOrigem)
  })
})
