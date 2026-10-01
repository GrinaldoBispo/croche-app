var TABELAS_PADRAO = {
  LINHAS: ["id","marca","nome_linha","cor","peso_novelo_g","preco_pago","preco_por_g"],
  DIFICULDADES: ["id","nome","fator_multiplicador","descricao"],
  RECEITAS: ["id","nome_item","linha_usada","peso_necessario_g","dificuldade_id","valor_base_g","margem_pct"]
};

function doGet(e) {
  var p = e ? e.parameter : {};
  try {
    if (p.action === "seed") {
      var ss = p.url ? SpreadsheetApp.openById(extrairIdDaUrl(p.url)) : SpreadsheetApp.getActiveSpreadsheet();
      return json({ status: "success", seed: seedTabelas(ss), planilha: ss.getName() });
    }
    if (p.table_name) {
      var ss2 = p.url ? SpreadsheetApp.openById(extrairIdDaUrl(p.url)) : SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss2.getSheetByName(p.table_name);
      if (!sheet) return json({ status: "error", message: "aba " + p.table_name + " nao encontrada" });
      var dados = extrairDados(sheet, Number(p.limit || 200), Number(p.offset || 0));
      return json({ status: "success", table: p.table_name, total: dados.length, data: dados });
    }
    var ss0 = SpreadsheetApp.getActiveSpreadsheet();
    return json({ status: "success", planilha: ss0.getName(), abas: ss0.getSheets().map(function(s){return s.getName();}) });
  } catch (err) { return json({ status: "error", message: err.toString() }); }
}

function doPost(e) {
  var body = e && e.postData ? JSON.parse(e.postData.contents || "{}") : {};
  var p = e ? e.parameter : {};
  var action = p.action || body.action;
  var tableName = p.table_name || body.table_name;
  var url = p.url || body.url;
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) { return json({ status: "error", message: "ocupado, tente de novo" }); }
  try {
    var ss = url ? SpreadsheetApp.openById(extrairIdDaUrl(url)) : SpreadsheetApp.getActiveSpreadsheet();
    if (action === "create_table") return json(criarTabela(ss, body, p));
    var sheet = ss.getSheetByName(tableName);
    if (!sheet) return json({ status: "error", message: "aba " + tableName + " nao encontrada" });
    if (action === "create") return json(criarRegistro(sheet, body));
    if (action === "update") return json(atualizarPorId(sheet, body));
    if (action === "delete") return json(deletarPorId(sheet, body, p));
    return json({ status: "error", message: "acao invalida: create, update, delete, create_table" });
  } catch (err) { return json({ status: "error", message: err.toString() }); }
  finally { lock.releaseLock(); }
}

function criarRegistro(sheet, body) {
  var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  var obj = body.data || body;
  if (!obj.id) obj.id = "id_" + new Date().getTime();
  if (acharLinhaPorId(sheet, obj.id)) return { status: "error", message: "id ja existe" };
  var linha = headers.map(function(h){
    if (h === "preco_por_g" && sheet.getName() === "LINHAS") {
      var peso = Number(obj.peso_novelo_g || 0), pago = Number(obj.preco_pago || 0);
      return peso > 0 ? pago / peso : 0;
    }
    return obj[h] !== undefined ? obj[h] : "";
  });
  sheet.appendRow(linha);
  return { status: "success", id: obj.id };
}

function atualizarPorId(sheet, body) {
  var id = body.id || body.data && body.data.id;
  if (!id) return { status: "error", message: "id obrigatorio p/ update" };
  var n = acharLinhaPorId(sheet, id);
  if (n <= 1) return { status: "error", message: "id nao encontrado / cabecalho bloqueado" };
  var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  var obj = body.data || body;
  var atual = sheet.getRange(n,1,1,headers.length).getValues()[0];
  var nova = headers.map(function(h, i){
    if (h === "id") return id;
    if (obj[h] !== undefined) return obj[h];
    return atual[i];
  });
  if (sheet.getName() === "LINHAS") {
    var ip = headers.indexOf("peso_novelo_g"), iv = headers.indexOf("preco_pago"), io = headers.indexOf("preco_por_g");
    if (ip >= 0 && iv >= 0 && io >= 0 && Number(nova[ip]) > 0) nova[io] = Number(nova[iv]) / Number(nova[ip]);
  }
  sheet.getRange(n,1,1,headers.length).setValues([nova]);
  return { status: "success", id: id, _lineIndex: n };
}

function deletarPorId(sheet, body, p) {
  var id = body.id || p.id;
  if (!id) return { status: "error", message: "id obrigatorio p/ delete" };
  var n = acharLinhaPorId(sheet, id);
  if (n <= 1) return { status: "error", message: "id nao encontrado / cabecalho bloqueado" };
  sheet.deleteRow(n);
  return { status: "success", deleted: id };
}

function acharLinhaPorId(sheet, id) {
  var vals = sheet.getDataRange().getValues();
  if (vals.length <= 1) return 0;
  var hi = vals[0].indexOf("id");
  if (hi < 0) return 0;
  for (var i = 1; i < vals.length; i++) {
    if (String(vals[i][hi]) === String(id)) return i + 1;
  }
  return 0;
}

function criarTabela(ss, body, p) {
  var nome = body.table_name || p.table_name;
  var cols = body.columns || TABELAS_PADRAO[nome];
  if (!nome || !cols) return { status: "error", message: "table_name/columns obrigatorios" };
  if (ss.getSheetByName(nome)) return { status: "error", message: "aba " + nome + " ja existe" };
  var aba = ss.insertSheet(nome);
  aba.getRange(1,1,1,cols.length).setValues([cols]);
  aba.getRange(1,1,1,cols.length).setFontWeight("bold");
  return { status: "success", table: nome };
}

function seedTabelas(ss) {
  var out = [];
  Object.keys(TABELAS_PADRAO).forEach(function(n){
    if (!ss.getSheetByName(n)) {
      var aba = ss.insertSheet(n);
      aba.getRange(1,1,1,TABELAS_PADRAO[n].length).setValues([TABELAS_PADRAO[n]]);
      aba.getRange(1,1,1,TABELAS_PADRAO[n].length).setFontWeight("bold");
      out.push(n + ":criada");
    } else out.push(n + ":ja_existia");
  });
  return out;
}

function extrairIdDaUrl(url) {
  url = url.trim();
  var m = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(url)) return url;
  throw new Error("URL invalida");
}

function extrairDados(sheet, limit, offset) {
  var vals = sheet.getDataRange().getValues();
  if (vals.length <= 1) return [];
  var headers = vals[0];
  return vals.slice(1).slice(offset, offset + limit).map(function(r, i){
    var o = { _lineIndex: offset + i + 2 };
    headers.forEach(function(h, ci){ if (h) o[h] = r[ci]; });
    return o;
  });
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
