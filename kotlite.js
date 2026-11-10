/* A small Kotlin subset runner for the reading lab.
   It executes fun solution on sample inputs and can pause on a line.
   Integers without L wrap at 32 bits. Long stays a safe integer.
   It is not the Kotlin compiler. */
(function (root) {
  "use strict";

  function fail(line, message) {
    var error = new Error(message);
    error.line = line || 1;
    return error;
  }

  function lex(source) {
    var tokens = [];
    var i = 0;
    var line = 1;
    var n = source.length;

    function push(type, value, at) {
      tokens.push({ type: type, value: value, line: at });
    }

    while (i < n) {
      var c = source[i];
      if (c === "\n") { line += 1; i += 1; continue; }
      if (c === " " || c === "\t" || c === "\r") { i += 1; continue; }
      if (c === "/" && source[i + 1] === "/") {
        while (i < n && source[i] !== "\n") i += 1;
        continue;
      }
      if (c === "/" && source[i + 1] === "*") {
        i += 2;
        while (i < n && !(source[i] === "*" && source[i + 1] === "/")) {
          if (source[i] === "\n") line += 1;
          i += 1;
        }
        i += 2;
        continue;
      }
      var at = line;
      if (c === '"') {
        tokens.push(readString(at));
        continue;
      }
      if (c === "'") {
        i += 1;
        var ch = source[i] || "";
        if (ch === "\\") {
          i += 1;
          ch = source[i] === "n" ? "\n" : source[i];
        }
        i += 1;
        if (source[i] !== "'") throw fail(at, "文字リテラルが閉じていません");
        i += 1;
        push("char", ch, at);
        continue;
      }
      if (c >= "0" && c <= "9") {
        var start = i;
        while (i < n && /[0-9_]/.test(source[i])) i += 1;
        var isLong = source[i] === "L" || source[i] === "l";
        if (isLong) i += 1;
        push("num", { text: source.slice(start, i).replace(/[_Ll]/g, ""), long: isLong }, at);
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        var s = i;
        while (i < n && /[A-Za-z0-9_]/.test(source[i])) i += 1;
        var word = source.slice(s, i);
        var keywords = Object.create(null);
        ["fun", "val", "var", "if", "else", "while", "for", "in", "return", "break", "continue", "when", "true", "false", "null", "object", "class", "data", "private", "internal", "const", "import", "package", "typeof"].forEach(function (name) { keywords[name] = 1; });
        push(keywords[word] ? word : "id", word, at);
        continue;
      }
      var two = source.slice(i, i + 2);
      var doubles = Object.create(null);
        ["==", "!=", "<=", ">=", "&&", "||", "+=", "-=", "*=", "++", "--", "->", "..", "?.", "?:"].forEach(function (op) { doubles[op] = 1; });
      if (doubles[two]) { push(two, two, at); i += 2; continue; }
      if (c === "." || "(){}[],.;:=<>!+-*/%".indexOf(c) !== -1) { push(c, c, at); i += 1; continue; }
      throw fail(at, "この文字は練習実行では読めません: " + c);
    }
    tokens.push({ type: "eof", value: "", line: line });

    function readString(atLine) {
      i += 1;
      var parts = [];
      var buf = "";
      while (i < n && source[i] !== '"') {
        if (source[i] === "\n") throw fail(atLine, "文字列が閉じていません");
        if (source[i] === "\\") {
          i += 1;
          var esc = source[i] === "n" ? "\n" : source[i] === "t" ? "\t" : source[i];
          buf += esc;
          i += 1;
          continue;
        }
        if (source[i] === "$") {
          if (buf) parts.push({ t: "text", v: buf });
          buf = "";
          i += 1;
          if (source[i] === "{") {
            i += 1;
            var depth = 1;
            var expr = "";
            while (i < n && depth > 0) {
              if (source[i] === "{") depth += 1;
              if (source[i] === "}") { depth -= 1; if (depth === 0) break; }
              if (source[i] === "\n") line += 1;
              expr += source[i];
              i += 1;
            }
            i += 1;
            parts.push({ t: "expr", v: expr, line: atLine });
          } else {
            var id = "";
            while (i < n && /[A-Za-z0-9_]/.test(source[i])) { id += source[i]; i += 1; }
            parts.push({ t: "name", v: id, line: atLine });
          }
          continue;
        }
        buf += source[i];
        i += 1;
      }
      if (source[i] !== '"') throw fail(atLine, "文字列が閉じていません");
      i += 1;
      if (buf) parts.push({ t: "text", v: buf });
      if (!parts.length) parts.push({ t: "text", v: "" });
      return { type: "string", value: parts, line: atLine };
    }

    return tokens;
  }

  function parse(source) {
    var tokens = lex(source);
    var p = 0;
    function cur() { return tokens[p]; }
    function eat(type) {
      var token = cur();
      if (token.type !== type) throw fail(token.line, "ここで " + type + " が必要です");
      p += 1;
      return token;
    }
    function eatIf(type) {
      if (cur().type === type) { p += 1; return true; }
      return false;
    }

    function skipType() {
      if (cur().type === "id" || cur().type === "(") {
        if (cur().type === "(") {
          var depth = 0;
          while (cur().type !== "eof") {
            if (cur().type === "(") depth += 1;
            if (cur().type === ")") depth -= 1;
            p += 1;
            if (depth === 0) break;
          }
        } else {
          p += 1;
          while (eatIf(".")) eat("id");
          if (eatIf("<")) {
            var nest = 1;
            while (cur().type !== "eof" && nest > 0) {
              if (cur().type === "<") nest += 1;
              if (cur().type === ">") nest -= 1;
              p += 1;
            }
          }
          eatIf("?");
        }
      }
    }

    function parseProgram() {
      var funcs = [];
      var vals = [];
      while (cur().type !== "eof") {
        while (cur().type === "private" || cur().type === "internal" || cur().type === "const" || cur().type === "data") {
          if (cur().type === "data") throw fail(cur().line, "data class はこの練習実行では未対応です。配列と変数で書いてください");
          p += 1;
        }
        if (cur().type === "import" || cur().type === "package") {
          var skipLine = cur().line;
          while (cur().type !== "eof" && cur().line === skipLine) p += 1;
          continue;
        }
        if (cur().type === "fun") funcs.push(parseFun());
        else if (cur().type === "val" || cur().type === "var") vals.push(parseVal());
        else if (cur().type === "object" || cur().type === "class") {
          throw fail(cur().line, "class / object はこの練習実行では未対応です。fun solution に書いてください");
        } else if (cur().type === "eof") break;
        else throw fail(cur().line, "ここでは fun / val から書き始めてください");
      }
      return { funcs: funcs, vals: vals };
    }

    function parseFun() {
      var token = eat("fun");
      var name = eat("id").value;
      if (eatIf("<")) {
        var nest = 1;
        while (nest > 0 && cur().type !== "eof") {
          if (cur().type === "<") nest += 1;
          if (cur().type === ">") nest -= 1;
          p += 1;
        }
      }
      eat("(");
      var params = [];
      while (cur().type !== ")" && cur().type !== "eof") {
        var pname = eat("id").value;
        if (eatIf(":")) skipType();
        params.push(pname);
        if (!eatIf(",")) break;
      }
      eat(")");
      if (eatIf(":")) skipType();
      eat("{");
      var body = parseBlock();
      return { name: name, params: params, body: body, line: token.line };
    }

    function parseVal() {
      var reassign = cur().type === "var";
      var token = eat(cur().type);
      var name = eat("id").value;
      if (eatIf(":")) skipType();
      eat("=");
      var init = parseExpr();
      return { name: name, reassign: reassign, init: init, line: token.line };
    }

    function parseBlock() {
      var stmts = [];
      while (cur().type !== "}" && cur().type !== "eof") {
        if (eatIf(";")) continue;
        stmts.push(parseStmt());
      }
      eat("}");
      return stmts;
    }

    function parseStmt() {
      if (cur().type === "val" || cur().type === "var") {
        var decl = parseVal();
        return { kind: "val", decl: decl, line: decl.line };
      }
      if (cur().type === "fun") {
        var fn = parseFun();
        return { kind: "fun", fn: fn, line: fn.line };
      }
      if (cur().type === "return") {
        var token = eat("return");
        var expr = null;
        if (cur().type !== "}" && cur().type !== "eof" && cur().line === token.line) {
          if ("else ) ,".indexOf(cur().type) === -1) expr = parseExpr();
        }
        return { kind: "return", expr: expr, line: token.line };
      }
      if (cur().type === "break") { var b = eat("break"); return { kind: "break", line: b.line }; }
      if (cur().type === "continue") { var ctok = eat("continue"); return { kind: "continue", line: ctok.line }; }
      if (cur().type === "if") return parseIf();
      if (cur().type === "while") return parseWhile();
      if (cur().type === "for") return parseFor();
      if (cur().type === "when") {
        var w = parseWhen();
        return { kind: "expr", expr: w, line: w.line };
      }
      var line = cur().line;
      var expr = parseExpr();
      return { kind: "expr", expr: expr, line: line };
    }

    function parseIf() {
      var token = eat("if");
      eat("(");
      var cond = parseExpr();
      eat(")");
      var thenBranch = parseBranch();
      var elseBranch = null;
      if (eatIf("else")) elseBranch = parseBranch();
      return { kind: "if", cond: cond, then: thenBranch, else: elseBranch, line: token.line };
    }

    function parseBranch() {
      if (cur().type === "{") { eat("{"); return { kind: "block", body: parseBlock(), line: cur().line }; }
      var line = cur().line;
      if (cur().type === "if") return { kind: "stmt", stmt: parseIf(), line: line };
      if (cur().type === "return" || cur().type === "val" || cur().type === "var" || cur().type === "break" || cur().type === "continue") {
        return { kind: "stmt", stmt: parseStmt(), line: line };
      }
      var expr = parseExpr();
      return { kind: "expr", expr: expr, line: line };
    }

    function parseWhile() {
      var token = eat("while");
      eat("(");
      var cond = parseExpr();
      eat(")");
      var body = parseBranch();
      return { kind: "while", cond: cond, body: body, line: token.line };
    }

    function parseFor() {
      var token = eat("for");
      eat("(");
      var names = [];
      if (eatIf("(")) {
        names.push(eat("id").value);
        eat(",");
        names.push(eat("id").value);
        eat(")");
      } else names.push(eat("id").value);
      eat("in");
      var iter = parseExpr();
      eat(")");
      var body = parseBranch();
      return { kind: "for", names: names, iter: iter, body: body, line: token.line };
    }

    function parseWhen() {
      var token = eat("when");
      var subject = null;
      if (eatIf("(")) { subject = parseExpr(); eat(")"); }
      eat("{");
      var branches = [];
      while (cur().type !== "}" && cur().type !== "eof") {
        if (eatIf(";")) continue;
        if (eatIf("else")) {
          eat("->");
          branches.push({ else: true, body: parseBranch(), line: token.line });
          continue;
        }
        var conds = [];
        var line = cur().line;
        while (cur().type !== "->" && cur().type !== "eof") {
          if (cur().type === "in") {
            eat("in");
            conds.push({ kind: "in", expr: parseExpr() });
          } else conds.push({ kind: "eq", expr: parseExpr() });
          if (!eatIf(",")) break;
        }
        eat("->");
        branches.push({ else: false, conds: conds, body: parseBranch(), line: line });
      }
      eat("}");
      return { kind: "when", subject: subject, branches: branches, line: token.line };
    }

    function parseExpr() { return parseOr(); }

    function binary(higher, ops) {
      return function () {
        var left = higher();
        while (ops.indexOf(cur().type) !== -1) {
          var op = cur();
          p += 1;
          var right = higher();
          left = { kind: "binary", op: op.type, left: left, right: right, line: op.line };
        }
        return left;
      };
    }

    function parseOr() { return binary(parseAnd, ["||"])(); }
    function parseAnd() { return binary(parseEq, ["&&"])(); }
    function parseEq() { return binary(parseCmp, ["==", "!="])(); }
    function parseCmp() { return binary(parseIn, ["<", ">", "<=", ">="])(); }
    function parseIn() {
      var left = parseElvis();
      if (cur().type === "in" || (cur().type === "!" && tokens[p + 1] && tokens[p + 1].type === "in")) {
        var notIn = cur().type === "!";
        if (notIn) p += 1;
        var token = eat("in");
        var right = parseElvis();
        return { kind: "in", not: notIn, left: left, right: right, line: token.line };
      }
      return left;
    }
    function parseElvis() {
      var left = parseInfix();
      if (cur().type !== "?:") return left;
      var op = cur();
      p += 1;
      if (cur().type === "return") {
        var ret = parseStmt();
        return { kind: "elvisReturn", left: left, ret: ret, line: op.line };
      }
      var right = parseElvis();
      return { kind: "binary", op: "?:", left: left, right: right, line: op.line };
    }
    function parseInfix() {
      var left = parseRange();
      var words = Object.create(null);
        ["xor", "and", "or", "shl", "shr", "ushr", "until", "downTo", "step"].forEach(function (name) { words[name] = 1; });
      while (cur().type === "id" && words[cur().value]) {
        var op = cur();
        p += 1;
        var right = parseRange();
        left = { kind: "binary", op: op.value, left: left, right: right, line: op.line };
      }
      return left;
    }
    function parseRange() { return binary(parseAdd, [".."])(); }
    function parseAdd() { return binary(parseMul, ["+", "-"])(); }
    function parseMul() { return binary(parseUnary, ["*", "/", "%"])(); }

    function parseUnary() {
      if (cur().type === "!" || cur().type === "-" || cur().type === "+") {
        var token = cur();
        p += 1;
        var expr = parseUnary();
        return { kind: "unary", op: token.type, expr: expr, line: token.line };
      }
      if (cur().type === "++" || cur().type === "--") {
        var token2 = cur();
        p += 1;
        var target = parsePostfix();
        return { kind: "prefix", op: token2.type, target: target, line: token2.line };
      }
      return parsePostfix();
    }

    function skipCallTypeArgs() {
      if (cur().type !== "<") return false;
      var look = p;
      var nest = 0;
      while (look < tokens.length) {
        if (tokens[look].type === "<") nest += 1;
        else if (tokens[look].type === ">") {
          nest -= 1;
          if (nest === 0) {
            if (tokens[look + 1] && tokens[look + 1].type === "(") {
              p = look + 1;
              return true;
            }
            return false;
          }
        } else if (tokens[look].type === "eof") return false;
        look += 1;
      }
      return false;
    }

    function parsePostfix() {
      var expr = parsePrimary();
      while (true) {
        skipCallTypeArgs();
        if (eatIf(".")) {
          if (cur().type === "id") {
            var name = eat("id");
            if (eatIf("(")) {
              var args = parseArgList();
              eat(")");
              expr = { kind: "method", obj: expr, name: name.value, args: args, line: name.line };
              expr = attachLambda(expr);
            } else expr = { kind: "prop", obj: expr, name: name.value, line: name.line };
          } else throw fail(cur().line, "ピリオドのあとが読めません");
        } else if (eatIf("(")) {
          var callArgs = parseArgList();
          eat(")");
          expr = { kind: "call", callee: expr, args: callArgs, line: expr.line };
          expr = attachLambda(expr);
        } else if (eatIf("[")) {
          var index = parseExpr();
          eat("]");
          if (cur().type === "=" || cur().type === "+=" || cur().type === "-=") {
            var assign = cur();
            p += 1;
            var value = parseExpr();
            expr = { kind: "set", obj: expr, index: index, op: assign.type, value: value, line: assign.line };
          } else expr = { kind: "index", obj: expr, index: index, line: expr.line };
        } else if (cur().type === "++" || cur().type === "--") {
          var pop = cur();
          p += 1;
          expr = { kind: "postfix", op: pop.type, target: expr, line: pop.line };
        } else if (cur().type === "=" || cur().type === "+=" || cur().type === "-=" || cur().type === "*=") {
          var set = cur();
          p += 1;
          var right = parseExpr();
          expr = { kind: "assign", op: set.type, left: expr, right: right, line: set.line };
        } else break;
      }
      return expr;
    }

    function attachLambda(expr) {
      if (cur().type === "{") {
        var lambda = parseLambda();
        expr.args.push(lambda);
      }
      return expr;
    }

    function parseArgList() {
      var args = [];
      while (cur().type !== ")" && cur().type !== "eof") {
        args.push(parseExpr());
        if (!eatIf(",")) break;
      }
      return args;
    }

    function parseLambda() {
      var token = eat("{");
      var params = [];
      var look = p;
      var depth = 0;
      var arrow = -1;
      while (look < tokens.length && !(tokens[look].type === "}" && depth === 0)) {
        if (tokens[look].type === "{") depth += 1;
        if (tokens[look].type === "}") depth -= 1;
        if (depth === 0 && tokens[look].type === "->") { arrow = look; break; }
        look += 1;
      }
      if (arrow !== -1) {
        while (p < arrow) {
          if (cur().type === "id") params.push(eat("id").value);
          else p += 1;
          eatIf(",");
        }
        eat("->");
      } else params = ["it"];
      var body = [];
      if (cur().type !== "}") body = parseLambdaBody();
      eat("}");
      return { kind: "lambda", params: params, body: body, line: token.line };
    }

    function parseLambdaBody() {
      var stmts = [];
      while (cur().type !== "}" && cur().type !== "eof") {
        if (eatIf(";")) continue;
        stmts.push(parseStmt());
      }
      return stmts;
    }

    function parsePrimary() {
      var token = cur();
      if (token.type === "num") {
        p += 1;
        return { kind: "num", value: Number(token.value.text), long: token.value.long, line: token.line };
      }
      if (token.type === "string") {
        p += 1;
        return { kind: "string", parts: token.value, line: token.line };
      }
      if (token.type === "char") { p += 1; return { kind: "char", value: token.value, line: token.line }; }
      if (token.type === "true" || token.type === "false") { p += 1; return { kind: "bool", value: token.type === "true", line: token.line }; }
      if (token.type === "null") { p += 1; return { kind: "null", line: token.line }; }
      if (token.type === "if") return parseIf();
      if (token.type === "when") return parseWhen();
      if (token.type === "{") return parseLambda();
      if (token.type === "(") {
        p += 1;
        var inner = parseExpr();
        eat(")");
        return inner;
      }
      if (token.type === "id") {
        p += 1;
        return { kind: "name", name: token.value, line: token.line };
      }
      throw fail(token.line, "式が読めません: " + token.type);
    }

    return parseProgram();
  }

  function I(v) { return { t: "i", v: v | 0 }; }
  function L(v) { return { t: "l", v: Math.trunc(Number(v)) }; }
  function S(v) { return { t: "s", v: String(v) }; }
  function B(v) { return { t: "b", v: !!v }; }
  function C(v) { return { t: "c", v: String(v) }; }
  function N() { return { t: "n" }; }
  function num(v) {
    if (!v || (v.t !== "i" && v.t !== "l")) return NaN;
    return v.v;
  }
  function truth(v) { return !!(v && v.t === "b" && v.v); }
  function keyOf(v) {
    if (!v) return "u";
    if (v.t === "i" || v.t === "l") return "n:" + v.v;
    if (v.t === "s" || v.t === "c") return "s:" + v.v;
    if (v.t === "b") return "b:" + v.v;
    return "o:" + v;
  }
  function asText(v) {
    if (!v || v.t === "n") return "null";
    if (v.t === "s" || v.t === "c") return v.v;
    if (v.t === "b") return v.v ? "true" : "false";
    if (v.t === "i" || v.t === "l") return String(v.v);
    return formatValue(v);
  }

  function formatValue(v) {
    if (!v || v.t === "n") return "null";
    if (v.t === "i") return String(v.v);
    if (v.t === "l") return String(v.v);
    if (v.t === "b") return v.v ? "true" : "false";
    if (v.t === "s") return JSON.stringify(v.v);
    if (v.t === "c") return "'" + v.v + "'";
    if (v.t === "iarr" || v.t === "larr" || v.t === "list") {
      var shown = v.a.slice(0, 12).map(formatValue).join(", ");
      return "[" + shown + (v.a.length > 12 ? ", …" : "") + "]";
    }
    if (v.t === "map") return "map(size=" + v.m.size + ")";
    if (v.t === "deq") return "deque(size=" + v.a.length + ")";
    if (v.t === "fun" || v.t === "lambda") return "fun";
    if (v.t === "range") return v.from + (v.inclusive ? ".." : " until ") + v.to;
    return "?";
  }

  function lenOf(v) {
    if (!v) return 0;
    if (v.t === "iarr" || v.t === "larr" || v.t === "list" || v.t === "deq") return v.a.length;
    if (v.t === "s" || v.t === "sb") return v.v.length;
    if (v.t === "map") return v.m.size;
    return 0;
  }

  function itemsOf(v, line) {
    if (!v) throw fail(line, "繰り返す対象がありません");
    if (v.t === "range") {
      var out = [];
      var step = v.step || 1;
      if (step === 0) throw fail(line, "step が 0 です");
      if (step > 0) {
        for (var i = v.from; v.inclusive ? i <= v.to : i < v.to; i += step) out.push(I(i));
      } else {
        for (var j = v.from; v.inclusive ? j >= v.to : j > v.to; j += step) out.push(I(j));
      }
      if (out.length > 200000) throw fail(line, "範囲が広すぎます");
      return out;
    }
    if (v.t === "iarr" || v.t === "larr" || v.t === "list" || v.t === "deq") return v.a.slice();
    if (v.t === "s") return v.v.split("").map(C);
    if (v.t === "map") {
      var pairs = [];
      v.m.forEach(function (val, key) { pairs.push({ t: "pair", a: [key, val] }); });
      return pairs;
    }
    throw fail(line, "この値は for で繰り返せません");
  }

  function contains(container, value) {
    if (!container) return false;
    if (container.t === "range") {
      var n = num(value);
      var step = container.step || 1;
      if (step > 0) {
        if (n < container.from) return false;
        if (container.inclusive ? n > container.to : n >= container.to) return false;
      } else {
        if (n > container.from) return false;
        if (container.inclusive ? n < container.to : n <= container.to) return false;
      }
      return (n - container.from) % step === 0;
    }
    if (container.t === "map") return container.m.has(keyOf(value));
    if (container.t === "iarr" || container.t === "larr" || container.t === "list" || container.t === "deq") {
      return container.a.some(function (item) { return equals(item, value); });
    }
    if (container.t === "s") return container.v.indexOf(asText(value)) !== -1;
    return false;
  }

  function equals(a, b) {
    if (!a || !b) return a === b;
    if (a.t === "n" || b.t === "n") return a.t === "n" && b.t === "n";
    if ((a.t === "i" || a.t === "l") && (b.t === "i" || b.t === "l")) return a.v === b.v;
    if ((a.t === "s" || a.t === "c") && (b.t === "s" || b.t === "c")) return a.v === b.v;
    if (a.t === "b" && b.t === "b") return a.v === b.v;
    return a === b;
  }

  function lookup(env, name, line) {
    var curEnv = env;
    while (curEnv) {
      if (Object.prototype.hasOwnProperty.call(curEnv.vars, name)) return curEnv.vars[name];
      curEnv = curEnv.parent;
    }
    throw fail(line, "名前が見つかりません: " + name);
  }

  function assignName(env, name, value) {
    var curEnv = env;
    while (curEnv) {
      if (Object.prototype.hasOwnProperty.call(curEnv.vars, name)) {
        curEnv.vars[name] = value;
        return;
      }
      curEnv = curEnv.parent;
    }
    env.vars[name] = value;
  }

  function snapshot(env) {
    var rows = [];
    var seen = Object.create(null);
    var curEnv = env;
    while (curEnv && !curEnv.global) {
      Object.keys(curEnv.vars).forEach(function (name) {
        if (seen[name]) return;
        var value = curEnv.vars[name];
        if (value && (value.t === "fun" || value.t === "lambda" || value.t === "builtin")) return;
        seen[name] = true;
        rows.push({ name: name, value: formatValue(value) });
      });
      curEnv = curEnv.parent;
    }
    return rows;
  }

  function childEnv(parent) {
    return { vars: Object.create(null), parent: parent, global: false };
  }

  function makeGlobal(ctx) {
    var env = { vars: Object.create(null), parent: null, global: true };
    function builtin(name) { env.vars[name] = { t: "builtin", name: name }; }
    ["maxOf", "minOf", "max", "min", "abs", "IntArray", "LongArray", "BooleanArray", "Array",
      "intArrayOf", "arrayOf", "mutableListOf", "listOf", "arrayListOf",
      "mutableMapOf", "hashMapOf", "HashMap", "ArrayDeque", "StringBuilder", "println"].forEach(builtin);
    env.vars["true"] = B(true);
    env.vars["false"] = B(false);
    env.vars["null"] = N();
    env.ctx = ctx;
    return env;
  }

  function* callAny(callee, args, ctx, env) {
    if (!callee) throw fail(ctx.line, "呼び出す関数がありません");
    if (callee.t === "builtin") return yield* callBuiltin(callee.name, args, ctx, env);
    if (callee.t === "method") return yield* callMethod(callee.obj, callee.name, args, ctx);
    if (callee.t === "fun" || callee.t === "lambda") return yield* callUser(callee, args, ctx);
    throw fail(ctx.line, "この値は呼び出せません");
  }

  function* callUser(fn, args, ctx) {
    var env = childEnv(fn.env || fn.closed || null);
    var i;
    for (i = 0; i < fn.params.length; i += 1) env.vars[fn.params[i]] = args[i] == null ? N() : args[i];
    try {
      var result = yield* execBlock(fn.body, env, ctx);
      if (result.control === "return") return result.value == null ? N() : result.value;
      return result.value == null ? N() : result.value;
    } catch (error) {
      if (error && error.kind === "return-signal") return error.value;
      throw error;
    }
  }

  function* execBlock(stmts, env, ctx) {
    var last = N();
    var i;
    for (i = 0; i < stmts.length; i += 1) {
      var result = yield* execStmt(stmts[i], env, ctx);
      if (result.control && result.control !== "value") return result;
      last = result.value == null ? last : result.value;
    }
    return { control: "value", value: last };
  }

  function* execBranch(branch, env, ctx) {
    if (!branch) return { control: "value", value: N() };
    if (branch.kind === "block") return yield* execBlock(branch.body, env, ctx);
    if (branch.kind === "stmt") return yield* execStmt(branch.stmt, env, ctx);
    if (branch.kind === "expr") {
      var value = yield* evalExpr(branch.expr, env, ctx);
      return { control: "value", value: value };
    }
    return yield* execStmt(branch, env, ctx);
  }

  function* execStmt(stmt, env, ctx) {
    ctx.line = stmt.line;
    ctx.steps += 1;
    if (ctx.steps > ctx.max) throw fail(stmt.line, "ステップ上限です。ループが終わっていない可能性があります");
    yield { line: stmt.line, env: env };
    if (stmt.kind === "val") {
      env.vars[stmt.decl.name] = yield* evalExpr(stmt.decl.init, env, ctx);
      return { control: "value", value: N() };
    }
    if (stmt.kind === "fun") {
      env.vars[stmt.fn.name] = { t: "fun", params: stmt.fn.params, body: stmt.fn.body, env: env, line: stmt.fn.line };
      return { control: "value", value: N() };
    }
    if (stmt.kind === "return") {
      var value = stmt.expr ? yield* evalExpr(stmt.expr, env, ctx) : N();
      return { control: "return", value: value };
    }
    if (stmt.kind === "break") return { control: "break" };
    if (stmt.kind === "continue") return { control: "continue" };
    if (stmt.kind === "expr") {
      var exprValue = yield* evalExpr(stmt.expr, env, ctx);
      return { control: "value", value: exprValue };
    }
    if (stmt.kind === "if") return yield* execIf(stmt, env, ctx);
    if (stmt.kind === "while") {
      for (;;) {
        if (ctx.steps > 1) {
          ctx.steps += 1;
          if (ctx.steps > ctx.max) throw fail(stmt.line, "ステップ上限です。ループが終わっていない可能性があります");
          yield { line: stmt.line, env: env };
        }
        var cond = yield* evalExpr(stmt.cond, env, ctx);
        if (!truth(cond)) return { control: "value", value: N() };
        var body = yield* execBranch(stmt.body, env, ctx);
        if (body.control === "return") return body;
        if (body.control === "break") return { control: "value", value: N() };
      }
    }
    if (stmt.kind === "for") {
      var iter = yield* evalExpr(stmt.iter, env, ctx);
      var items = itemsOf(iter, stmt.line);
      var k;
      for (k = 0; k < items.length; k += 1) {
        if (k > 0) {
          ctx.steps += 1;
          if (ctx.steps > ctx.max) throw fail(stmt.line, "ステップ上限です。ループが終わっていない可能性があります");
          yield { line: stmt.line, env: env };
        }
        if (stmt.names.length === 2 && items[k] && items[k].t === "pair") {
          env.vars[stmt.names[0]] = items[k].a[0];
          env.vars[stmt.names[1]] = items[k].a[1];
        } else env.vars[stmt.names[0]] = items[k];
        var step = yield* execBranch(stmt.body, env, ctx);
        if (step.control === "return") return step;
        if (step.control === "break") break;
      }
      return { control: "value", value: N() };
    }
    throw fail(stmt.line, "この文は練習実行では未対応です");
  }

  function* execIf(stmt, env, ctx) {
    var cond = yield* evalExpr(stmt.cond, env, ctx);
    var branch = truth(cond) ? stmt.then : stmt.else;
    if (!branch) return { control: "value", value: N() };
    return yield* execBranch(branch, env, ctx);
  }

  function* evalExpr(expr, env, ctx) {
    if (!expr) return N();
    ctx.line = expr.line || ctx.line;
    if (expr.kind === "num") return expr.long ? L(expr.value) : I(expr.value);
    if (expr.kind === "bool") return B(expr.value);
    if (expr.kind === "char") return C(expr.value);
    if (expr.kind === "null") return N();
    if (expr.kind === "string") {
      var text = "";
      var i;
      for (i = 0; i < expr.parts.length; i += 1) {
        var part = expr.parts[i];
        if (part.t === "text") text += part.v;
        else if (part.t === "name") text += asText(lookup(env, part.v, expr.line));
        else {
          var innerExpr = parseExpressionOnly(part.v);
          text += asText(yield* evalExpr(innerExpr, env, ctx));
        }
      }
      return S(text);
    }
    if (expr.kind === "name") {
      if (expr.name === "true") return B(true);
      if (expr.name === "false") return B(false);
      if (expr.name === "null") return N();
      return lookup(env, expr.name, expr.line);
    }
    if (expr.kind === "lambda") return { t: "lambda", params: expr.params, body: expr.body, env: env, line: expr.line };
    if (expr.kind === "unary") {
      var inner = yield* evalExpr(expr.expr, env, ctx);
      if (expr.op === "!") return B(!truth(inner));
      if (expr.op === "-") return inner.t === "l" ? L(-inner.v) : I((-inner.v) | 0);
      return inner;
    }
    if (expr.kind === "elvisReturn") {
      var leftElvisRet = yield* evalExpr(expr.left, env, ctx);
      if (leftElvisRet && leftElvisRet.t !== "n") return leftElvisRet;
      var retStmt = yield* execStmt(expr.ret, env, ctx);
      var retValue = retStmt && retStmt.value != null ? retStmt.value : N();
      throw signalReturn(retValue);
    }
    if ((expr.kind === "prefix" || expr.kind === "postfix") && expr.target.kind === "index") {
      var box = yield* evalExpr(expr.target.obj, env, ctx);
      var at = yield* evalExpr(expr.target.index, env, ctx);
      var indexed = readIndex(box, at, expr.line);
      if (!indexed || indexed.t === "n") indexed = I(0);
      var indexedNext = indexed.t === "l" ? L(indexed.v + (expr.op === "++" ? 1 : -1)) : I((indexed.v + (expr.op === "++" ? 1 : -1)) | 0);
      writeIndex(box, at, indexedNext, expr.line);
      return expr.kind === "prefix" ? indexedNext : indexed;
    }
    if (expr.kind === "prefix" || expr.kind === "postfix") {
      var current = yield* evalExpr(expr.target, env, ctx);
      var delta = expr.op === "++" ? 1 : -1;
      var next = current.t === "l" ? L(current.v + delta) : I((current.v + delta) | 0);
      writeTarget(expr.target, next, env, ctx);
      return expr.kind === "prefix" ? next : current;
    }
    if (expr.kind === "binary") return yield* evalBinary(expr, env, ctx);
    if (expr.kind === "in") {
      var left = yield* evalExpr(expr.left, env, ctx);
      var right = yield* evalExpr(expr.right, env, ctx);
      var found = contains(right, left);
      return B(expr.not ? !found : found);
    }
    if (expr.kind === "if") {
      var result = yield* execIf(expr, env, ctx);
      if (result.control === "return" || result.control === "break" || result.control === "continue") {
        expr._control = result;
        return result.value == null ? N() : result.value;
      }
      return result.value == null ? N() : result.value;
    }
    if (expr.kind === "when") return yield* evalWhen(expr, env, ctx);
    if (expr.kind === "call") {
      var callee = yield* evalExpr(expr.callee, env, ctx);
      var args = [];
      var a;
      for (a = 0; a < expr.args.length; a += 1) args.push(yield* evalExpr(expr.args[a], env, ctx));
      return yield* callAny(callee, args, ctx, env);
    }
    if (expr.kind === "method") {
      var obj = yield* evalExpr(expr.obj, env, ctx);
      var margs = [];
      var m;
      for (m = 0; m < expr.args.length; m += 1) margs.push(yield* evalExpr(expr.args[m], env, ctx));
      return yield* callMethod(obj, expr.name, margs, ctx);
    }
    if (expr.kind === "prop") {
      var target = yield* evalExpr(expr.obj, env, ctx);
      return prop(target, expr.name, expr.line);
    }
    if (expr.kind === "index") {
      var box = yield* evalExpr(expr.obj, env, ctx);
      var index = yield* evalExpr(expr.index, env, ctx);
      return readIndex(box, index, expr.line);
    }
    if (expr.kind === "set") {
      var setObj = yield* evalExpr(expr.obj, env, ctx);
      var setIndex = yield* evalExpr(expr.index, env, ctx);
      var setValue = yield* evalExpr(expr.value, env, ctx);
      var previous = readIndex(setObj, setIndex, expr.line);
      var stored = setValue;
      if (expr.op === "+=") stored = add(previous, setValue, expr.line);
      if (expr.op === "-=") stored = sub(previous, setValue, expr.line);
      writeIndex(setObj, setIndex, stored, expr.line);
      return stored;
    }
    if (expr.kind === "assign") {
      var assigned = yield* evalExpr(expr.right, env, ctx);
      if (expr.op !== "=") {
        var old = yield* evalExpr(expr.left, env, ctx);
        if (expr.op === "+=") assigned = add(old, assigned, expr.line);
        if (expr.op === "-=") assigned = sub(old, assigned, expr.line);
        if (expr.op === "*=") assigned = mul(old, assigned, expr.line);
      }
      writeTarget(expr.left, assigned, env, ctx);
      return assigned;
    }
    throw fail(expr.line || ctx.line, "この式は練習実行では未対応です");
  }

  function signalReturn(value) {
    var error = new Error("return");
    error.kind = "return-signal";
    error.value = value == null ? N() : value;
    return error;
  }

  function writeTarget(target, value, env, ctx) {
    if (target.kind === "name") { assignName(env, target.name, value); return; }
    throw fail(target.line || ctx.line, "この場所へは代入できません");
  }

  function prop(obj, name, line) {
    if (name === "size" || name === "length") return I(lenOf(obj));
    if (name === "indices") return { t: "range", from: 0, to: lenOf(obj) - 1, inclusive: true, step: 1 };
    if (name === "lastIndex") return I(lenOf(obj) - 1);
    if (name === "code" && obj && obj.t === "c") return I(obj.v.charCodeAt(0));
    return { t: "method", obj: obj, name: name };
  }

  function readIndex(obj, index, line) {
    var at = num(index);
    if (obj && obj.t === "s") {
      if (at < 0 || at >= obj.v.length) throw fail(line, "文字列の範囲外です: " + at);
      return C(obj.v.charAt(at));
    }
    if (obj && (obj.t === "iarr" || obj.t === "larr" || obj.t === "list" || obj.t === "deq")) {
      if (at < 0 || at >= obj.a.length) throw fail(line, "配列の範囲外です: " + at);
      return obj.a[at];
    }
    if (obj && obj.t === "map") {
      var found = obj.m.get(keyOf(index));
      return found == null ? N() : found;
    }
    throw fail(line, "この値は [] で読めません");
  }

  function writeIndex(obj, index, value, line) {
    var at = num(index);
    if (obj && (obj.t === "iarr" || obj.t === "larr" || obj.t === "list" || obj.t === "deq")) {
      if (at < 0 || at >= obj.a.length) throw fail(line, "配列の範囲外です: " + at);
      obj.a[at] = obj.t === "iarr" && value.t === "l" ? I(value.v) : value;
      return;
    }
    if (obj && obj.t === "map") { obj.m.set(keyOf(index), value); return; }
    throw fail(line, "この場所へは代入できません");
  }

  function add(a, b, line) {
    if ((a && (a.t === "s" || a.t === "c")) || (b && (b.t === "s" || b.t === "c"))) return S(asText(a) + asText(b));
    if ((a && a.t === "l") || (b && b.t === "l")) return L(num(a) + num(b));
    if (a && b && a.t === "i" && b.t === "i") return I((a.v + b.v) | 0);
    throw fail(line, "足せない値です");
  }
  function sub(a, b) {
    if ((a && a.t === "l") || (b && b.t === "l")) return L(num(a) - num(b));
    return I((num(a) - num(b)) | 0);
  }
  function mul(a, b) {
    if ((a && a.t === "l") || (b && b.t === "l")) return L(num(a) * num(b));
    return I(Math.imul(num(a) | 0, num(b) | 0));
  }
  function div(a, b, line) {
    if (num(b) === 0) throw fail(line, "0 で割れません");
    var value = Math.trunc(num(a) / num(b));
    if ((a && a.t === "l") || (b && b.t === "l")) return L(value);
    return I(value | 0);
  }
  function mod(a, b, line) {
    if (num(b) === 0) throw fail(line, "0 で割れません");
    var value = num(a) % num(b);
    if ((a && a.t === "l") || (b && b.t === "l")) return L(value);
    return I(value | 0);
  }
  function bit(op, a, b) {
    var wide = (a && a.t === "l") || (b && b.t === "l");
    var value;
    if (wide) {
      var x = BigInt(num(a));
      var y = BigInt(num(b));
      if (op === "xor") value = x ^ y;
      if (op === "and") value = x & y;
      if (op === "or") value = x | y;
      if (op === "shl") value = x << y;
      if (op === "shr" || op === "ushr") value = x >> y;
      return L(Number(value));
    }
    var n = num(a) | 0;
    var m = num(b) | 0;
    if (op === "xor") return I(n ^ m);
    if (op === "and") return I(n & m);
    if (op === "or") return I(n | m);
    if (op === "shl") return I(n << m);
    if (op === "shr") return I(n >> m);
    if (op === "ushr") return I((n >>> m) | 0);
    return I(0);
  }

  function* evalBinary(expr, env, ctx) {
    if (expr.op === "&&") {
      var leftAnd = yield* evalExpr(expr.left, env, ctx);
      if (!truth(leftAnd)) return B(false);
      var rightAnd = yield* evalExpr(expr.right, env, ctx);
      return B(truth(rightAnd));
    }
    if (expr.op === "||") {
      var leftOr = yield* evalExpr(expr.left, env, ctx);
      if (truth(leftOr)) return B(true);
      var rightOr = yield* evalExpr(expr.right, env, ctx);
      return B(truth(rightOr));
    }
    if (expr.op === "?:") {
      var leftElvis = yield* evalExpr(expr.left, env, ctx);
      if (leftElvis && leftElvis.t !== "n") return leftElvis;
      return yield* evalExpr(expr.right, env, ctx);
    }
    var left = yield* evalExpr(expr.left, env, ctx);
    var right = yield* evalExpr(expr.right, env, ctx);
    if (expr.op === "+") return add(left, right, expr.line);
    if (expr.op === "-") return sub(left, right);
    if (expr.op === "*") return mul(left, right);
    if (expr.op === "/") return div(left, right, expr.line);
    if (expr.op === "%") return mod(left, right, expr.line);
    if (expr.op === "==") return B(equals(left, right));
    if (expr.op === "!=") return B(!equals(left, right));
    if (expr.op === "<") return B(num(left) < num(right));
    if (expr.op === ">") return B(num(left) > num(right));
    if (expr.op === "<=") return B(num(left) <= num(right));
    if (expr.op === ">=") return B(num(left) >= num(right));
    if (expr.op === "..") return { t: "range", from: num(left), to: num(right), inclusive: true, step: 1 };
    if (expr.op === "until") return { t: "range", from: num(left), to: num(right), inclusive: false, step: 1 };
    if (expr.op === "downTo") return { t: "range", from: num(left), to: num(right), inclusive: true, step: -1 };
    if (expr.op === "step") { right = right; left.step = num(right); return left; }
    if (expr.op === "xor" || expr.op === "and" || expr.op === "or" || expr.op === "shl" || expr.op === "shr" || expr.op === "ushr") return bit(expr.op, left, right);
    throw fail(expr.line, "この演算は練習実行では未対応です: " + expr.op);
  }

  function* evalWhen(expr, env, ctx) {
    var subject = expr.subject ? yield* evalExpr(expr.subject, env, ctx) : B(true);
    var i;
    for (i = 0; i < expr.branches.length; i += 1) {
      var branch = expr.branches[i];
      var ok = !!branch.else;
      if (!ok) {
        var c;
        for (c = 0; c < branch.conds.length; c += 1) {
          var cond = branch.conds[c];
          if (cond.kind === "in") {
            var range = yield* evalExpr(cond.expr, env, ctx);
            if (contains(range, subject)) ok = true;
          } else {
            var value = yield* evalExpr(cond.expr, env, ctx);
            if (equals(subject, value)) ok = true;
          }
        }
      }
      if (ok) {
        var result = yield* execBranch(branch.body, env, ctx);
        if (result.control === "return") throw signalReturn(result.value == null ? N() : result.value);
        return result.value == null ? N() : result.value;
      }
    }
    return N();
  }

  function* callBuiltin(name, args, ctx) {
    if (name === "println") { ctx.output.push(args.map(asText).join(" ")); return N(); }
    if (name === "maxOf" || name === "max") return args.reduce(function (a, b) { return num(a) >= num(b) ? a : b; });
    if (name === "minOf" || name === "min") return args.reduce(function (a, b) { return num(a) <= num(b) ? a : b; });
    if (name === "abs") return args[0].t === "l" ? L(Math.abs(args[0].v)) : I(Math.abs(args[0].v) | 0);
    if (name === "IntArray" || name === "LongArray" || name === "BooleanArray" || name === "Array") {
      var count = num(args[0]);
      if (count < 0 || count > 200000) throw fail(ctx.line, "配列の長さが不正です");
      var arr = [];
      var i;
      for (i = 0; i < count; i += 1) {
        if (args[1] && (args[1].t === "lambda" || args[1].t === "fun")) arr.push(yield* callUser(args[1], [I(i)], ctx));
        else if (name === "BooleanArray") arr.push(B(false));
        else arr.push(name === "LongArray" ? L(0) : I(0));
      }
      var type = name === "LongArray" ? "larr" : "iarr";
      if (name === "Array") type = "list";
      return { t: type, a: arr };
    }
    if (name === "intArrayOf" || name === "arrayOf" || name === "listOf" || name === "mutableListOf" || name === "arrayListOf") {
      return { t: name === "intArrayOf" ? "iarr" : "list", a: args.slice() };
    }
    if (name === "mutableMapOf" || name === "hashMapOf" || name === "HashMap") return { t: "map", m: new Map() };
    if (name === "ArrayDeque") return { t: "deq", a: [] };
    if (name === "StringBuilder") return { t: "sb", v: "" };
    throw fail(ctx.line, "この関数は練習実行では未対応です: " + name);
  }

  function* callMethod(obj, name, args, ctx) {
    if (!obj || obj.t === "n") throw fail(ctx.line, "null に " + name + " は使えません");
    if (obj.t === "sb") {
      if (name === "append") {
        var piece;
        for (piece = 0; piece < args.length; piece += 1) obj.v += asText(args[piece]);
        return obj;
      }
      if (name === "toString") return S(obj.v);
      if (name === "isEmpty") return B(obj.v.length === 0);
      if (name === "isNotEmpty") return B(obj.v.length !== 0);
    }
    if (name === "toInt") return I(num(obj));
    if (name === "toLong") return L(obj.t === "s" || obj.t === "c" ? Number(obj.v) : num(obj));
    if (name === "toString") return S(asText(obj));
    if (name === "toIntOrNull" || name === "toLongOrNull") {
      if (obj.t !== "s" && obj.t !== "c") return N();
      if (!/^-?\d+$/.test(obj.v)) return N();
      return name === "toLong" || name === "toLongOrNull" ? L(Number(obj.v)) : I(Number(obj.v));
    }
    if (name === "isEmpty") return B(lenOf(obj) === 0);
    if (name === "isNotEmpty") return B(lenOf(obj) !== 0);
    if (name === "first") return readIndex(obj.t === "deq" || obj.t === "list" || obj.t === "iarr" || obj.t === "larr" ? obj : obj, I(0), ctx.line);
    if (name === "last") return readIndex(obj, I(lenOf(obj) - 1), ctx.line);
    if (name === "substring") {
      var from = num(args[0]);
      var to = args[1] ? num(args[1]) : obj.v.length;
      return S(String(obj.v).substring(from, to));
    }
    if (name === "trim") return S(String(obj.v).trim());
    if (name === "isBlank") return B(String(obj.v).trim().length === 0);
    if (name === "indexOf") {
      var foundAt = String(obj.v).indexOf(asText(args[0]));
      return I(foundAt);
    }
    if (name === "split") {
      var sep = args[0] ? asText(args[0]) : "";
      return { t: "list", a: String(obj.v).split(sep).map(S) };
    }
    if (name === "containsKey" || name === "contains") return B(contains(obj, args[0]));
    if (name === "add" || name === "addLast") { obj.a.push(args[0]); return B(true); }
    if (name === "addFirst") { obj.a.unshift(args[0]); return N(); }
    if (name === "removeFirst" || name === "removeAt") {
      var at = name === "removeAt" ? num(args[0]) : 0;
      if (at < 0 || at >= obj.a.length) throw fail(ctx.line, "空の並びから取り出せません");
      return obj.a.splice(at, 1)[0];
    }
    if (name === "removeLast") {
      if (!obj.a.length) throw fail(ctx.line, "空の並びから取り出せません");
      return obj.a.pop();
    }
    if (name === "sort") {
      obj.a.sort(function (a, b) { return num(a) - num(b); });
      return N();
    }
    if (name === "getOrPut") {
      var key = keyOf(args[0]);
      if (obj.m.has(key)) return obj.m.get(key);
      var created = yield* callUser(args[1], [], ctx);
      obj.m.set(key, created);
      return created;
    }
    if (name === "get") return readIndex(obj, args[0], ctx.line);
    if (name === "fold") {
      var acc = args[0];
      var i;
      for (i = 0; i < obj.a.length; i += 1) acc = yield* callUser(args[1], [acc, obj.a[i]], ctx);
      return acc;
    }
    if (name === "xor" || name === "and" || name === "or" || name === "shl" || name === "shr") return bit(name, obj, args[0]);
    if (name === "coerceAtLeast") return num(obj) < num(args[0]) ? args[0] : obj;
    if (name === "coerceAtMost") return num(obj) > num(args[0]) ? args[0] : obj;
    throw fail(ctx.line, "この呼び出しは練習実行では未対応です: " + name);
  }

  function parseExpressionOnly(source) {
    var program = parse("fun __e(): Int { return (" + source + ") }");
    var body = program.funcs[0].body;
    var stmt = body[body.length - 1];
    return stmt.expr;
  }

  function decodeArg(spec) {
    if (Array.isArray(spec)) return { t: "iarr", a: spec.map(I) };
    if (spec && typeof spec === "object") {
      if (spec.ia) return { t: "iarr", a: spec.ia.map(I) };
      if (spec.la) return { t: "larr", a: spec.la.map(L) };
      if (spec.sa) return { t: "list", a: spec.sa.map(S) };
      if (spec.grid) return { t: "list", a: spec.grid.map(function (row) { return { t: "iarr", a: row.map(I) }; }) };
      if (Object.prototype.hasOwnProperty.call(spec, "n")) return I(spec.n);
      if (Object.prototype.hasOwnProperty.call(spec, "L")) return L(spec.L);
      if (Object.prototype.hasOwnProperty.call(spec, "s")) return S(spec.s);
      if (Object.prototype.hasOwnProperty.call(spec, "b")) return B(spec.b);
    }
    if (typeof spec === "number") return I(spec);
    if (typeof spec === "string") return S(spec);
    if (typeof spec === "boolean") return B(spec);
    return N();
  }

  function encode(v) {
    if (!v || v.t === "n") return null;
    if (v.t === "i" || v.t === "l") return v.v;
    if (v.t === "b") return v.v;
    if (v.t === "s" || v.t === "c") return v.v;
    if (v.t === "iarr" || v.t === "larr" || v.t === "list") return v.a.map(encode);
    return formatValue(v);
  }

  function sameExpect(actual, expect) {
    var value = encode(actual);
    return JSON.stringify(value) === JSON.stringify(expect);
  }

  function* drive(source, args, ctx) {
    var program = parse(source);
    var global = makeGlobal(ctx);
    var i;
    for (i = 0; i < program.funcs.length; i += 1) {
      var fn = program.funcs[i];
      global.vars[fn.name] = { t: "fun", params: fn.params, body: fn.body, env: global, line: fn.line };
    }
    for (i = 0; i < program.vals.length; i += 1) {
      global.vars[program.vals[i].name] = yield* evalExpr(program.vals[i].init, global, ctx);
    }
    var solution = global.vars.solution;
    if (!solution) throw fail(1, "fun solution がありません");
    return yield* callUser(solution, args.map(decodeArg), ctx);
  }

  function runTests(source, tests, options) {
    var opts = options || {};
    var results = [];
    var t;
    for (t = 0; t < tests.length; t += 1) {
      var test = tests[t];
      var ctx = { line: 1, steps: 0, max: opts.maxSteps || 1000000, output: [] };
      var gen = drive(source, test.args, ctx);
      var paused = null;
      var current = gen.next();
      while (!current.done) {
        var info = current.value;
        var hit = opts.breakpoints && opts.breakpoints[info.line];
        if (hit || opts.mode === "step") {
          paused = { line: info.line, vars: snapshot(info.env), output: ctx.output.slice(), test: test.name, steps: ctx.steps };
          break;
        }
        current = gen.next();
      }
      if (paused) return { ok: false, paused: paused, results: results, generator: gen, ctx: ctx, test: test };
      var actual = current.value;
      var ok = sameExpect(actual, test.expect);
      results.push({
        name: test.name,
        ok: ok,
        expected: test.expect,
        actual: encode(actual),
        message: ok ? "" : test.because || ""
      });
      if (!ok && opts.stopOnFail) break;
    }
    return { ok: results.every(function (row) { return row.ok; }), paused: null, results: results };
  }

  function resume(session, mode, breakpoints) {
    if (!session || !session.generator) return session;
    var gen = session.generator;
    var ctx = session.ctx;
    var current = gen.next();
    while (!current.done) {
      var line = current.value.line;
      if (mode === "step" || (breakpoints && breakpoints[line])) {
        session.paused = { line: line, vars: snapshot(current.value.env), output: ctx.output.slice(), test: session.test.name, steps: ctx.steps };
        return session;
      }
      current = gen.next();
    }
    var actual = current.value;
    var ok = sameExpect(actual, session.test.expect);
    session.paused = null;
    session.generator = null;
    session.results = (session.results || []).concat([{
      name: session.test.name,
      ok: ok,
      expected: session.test.expect,
      actual: encode(actual),
      message: ok ? "" : session.test.because || ""
    }]);
    session.ok = ok;
    return session;
  }

  function selfTest() {
    var errors = [];
    function check(name, source, args, expect) {
      try {
        var result = runTests(source, [{ name: name, args: args, expect: expect }]);
        if (!result.ok) errors.push(name + " => " + JSON.stringify(result.results));
      } catch (error) {
        errors.push(name + " threw " + error.message + " line " + error.line);
      }
    }
    check("sum", "fun solution(A: IntArray): Int {\n  var s = 0\n  for (x in A) s += x\n  return s\n}\n", [{ ia: [1, 2, 3] }], 6);
    check("xor", "fun solution(A: IntArray): Int {\n  var a = 0\n  for (x in A) a = a xor x\n  return a\n}\n", [{ ia: [9, 3, 9, 3, 9, 7, 9] }], 7);
    check("wrap", "fun solution(): Int { return 2000000000 + 2000000000 }\n", [], (2000000000 + 2000000000) | 0);
    check("long", "fun solution(): Int {\n  val x = 2000000000L + 2000000000L\n  return if (x > 3000000000L) 1 else 0\n}\n", [], 1);
    check("until", "fun solution(n: Int): Int {\n  var s = 0\n  for (i in 0 until n) s += i\n  return s\n}\n", [{ n: 4 }], 6);
    check("str", "fun solution(s: String, k: Int): String {\n  if (s.length <= k) return s\n  return s.substring(0, k)\n}\n", [{ s: "abcdef" }, { n: 3 }], "abc");
    check("map", "fun solution(A: IntArray): Int {\n  val m = HashMap<Int, Int>()\n  for (x in A) {\n    val c = if (m[x] == null) 0 else m[x]\n    m[x] = c + 1\n  }\n  return m[2]\n}\n", [{ ia: [2, 2, 3] }], 2);
    check("when", "fun solution(c: Int): Int {\n  return when (c) { 1 -> 10; else -> 0 }\n}\n", [{ n: 1 }], 10);
    check("ushr", "fun solution(): Int {\n  val m = (1 + 3) ushr 1\n  return m\n}\n", [], 2);
    check("max", "fun solution(a: Int, b: Int): Int { return max(a, b) }\n", [{ n: 2 }, { n: 9 }], 9);
    check("sb", "fun solution(): String {\n  val sb = StringBuilder()\n  return if (sb.isEmpty()) sb.append(\"...\").toString() else \"no\"\n}\n", [], "...");
    check("inc", "fun solution(A: IntArray): Int {\n  A[0]++\n  return A[0]\n}\n", [{ ia: [3] }], 4);
    check("elvis", "fun solution(s: String): Int {\n  val v = s.toIntOrNull() ?: return -1\n  return v\n}\n", [{ s: "x" }], -1);
    var paused = runTests("fun solution(A: IntArray): Int {\n  var s = 0\n  for (x in A) {\n    s += x\n  }\n  return s\n}\n", [{ name: "p", args: [{ ia: [1, 1] }], expect: 2 }], { breakpoints: { 3: true } });
    if (!paused.paused || paused.paused.line !== 3) errors.push("breakpoint line " + (paused.paused && paused.paused.line));
    var stepped = resume(paused, "step", {});
    if (!stepped.paused) errors.push("step ended at " + JSON.stringify(stepped.results));
    else if (stepped.paused.line === 3) errors.push("step stayed on line 3");
    var done = resume(stepped, "continue", {});
    if (done.paused) errors.push("continue stayed paused");
    if (!done.results || !done.results[0] || done.results[0].actual !== 2) errors.push("continue result " + JSON.stringify(done.results));
    return errors;
  }

  var api = {
    parse: parse,
    runTests: runTests,
    resume: resume,
    formatValue: formatValue,
    selfTest: selfTest
  };
  root.Kotlite = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
