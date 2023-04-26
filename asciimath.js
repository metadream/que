/**
 * Modified from ASCIIMathML (http://asciimath.org)
 * 1. Remove browser compatibility checks
 * 2. Adjust and refine the code structure
 * 3. Fixed the mathvariant not working issue
 *
 * @Example
 * <p>`"Asciimath Examples"`</p>
 * <p>`E=mc^2`</p>
 * <p>`f(t)=(a_0)/2 + sum_(n=1)^ooa_ncos((npit)/L)+sum_(n=1)^oo b_nsin((npit)/L)`</p>
 * <p>`\oint_C \vec{B}\circ \d\vec{l} = \mu_0 (I_{enc} + \varepsilon_0 \frac{\d}{\d t} \int_S \vec{E} \circ \hat{n} \d a)`</p>
 * <p display="block">`x = (-b +- sqrt(b^2 – 4ac))/(2a)`</p>
 */

let nestingDepth, previousSymbol, currentSymbol, inputSymbolNames = [];
document.addEventListener('DOMContentLoaded', function() {
  initSymbols();
  translate();
});

function initSymbols() {
  for (const symbol of AM_SYMBOLS) {
    if (symbol.tex) {
      AM_SYMBOLS.push({
        input: symbol.tex,
        tag: symbol.tag,
        output: symbol.output,
        ttype: symbol.ttype,
        acc: symbol.acc || false
      });
    }
  }
  AM_SYMBOLS.sort((a, b) => a.input > b.input ? 1 : -1);
  for (const symbol of AM_SYMBOLS) {
    inputSymbolNames.push(symbol.input);
  }
}

function translate() {
  const html = document.body.innerHTML;
  if (/amath\b|\\begin{a?math}/i.test(html) ||
    html.indexOf(AM_DELIMITER + " ") != -1 || html.slice(-1) == AM_DELIMITER ||
    html.indexOf(AM_DELIMITER + "<") != -1 || html.indexOf(AM_DELIMITER + "\n") != -1) {
    processNode(document.body);
  }
}

function processNode(n) {
  if (n.childNodes.length == 0) {
    const parentNode = n.parentNode;
    if (n.nodeType != 8 && parentNode.nodeName != "FORM" && parentNode.nodeName != "TEXTAREA") {
      let str = n.nodeValue, mtch = false;
      if (str) {
        str = str.replace(/\r\n\r\n/g, "\n\n").replace(/\x20+/g, " ").replace(/\s*\r\n/g, " ");
        str = str.replace(new RegExp("\\\\" + AM_DELIMITER, "g"), () => { mtch = true; return "'"; });

        const arr = str.split(AM_DELIMITER);
        if (arr.length > 1 || mtch) {
          const display = parentNode.getAttribute("display");
          parentNode.replaceChild(createFragment(arr, display), n);
        }
      }
    }
  } else
  if (n.nodeName != "MATH") {
    for (const child of n.childNodes) processNode(child);
  }
}

function createFragment(arr, display) {
  const newFrag = document.createDocumentFragment();
  let expr = false;

  for (let i = 0; i < arr.length; i++) {
    if (expr) {
      newFrag.appendChild(parseMath(arr[i], display));
    } else {
      const arri = [arr[i]];
      newFrag.appendChild(document.createElement("span").appendChild(document.createTextNode(arri[0])));

      for (let j = 1; j < arri.length; j++) {
        newFrag.appendChild(document.createElement("p"));
        newFrag.appendChild(document.createElement("span").appendChild(document.createTextNode(arri[j])));
      }
    }
    expr = !expr;
  }
  return newFrag;
}

function parseMath(expr, display) {
  expr = expr.replace(/&nbsp;/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<");
  const frag = parseExpr(expr.replace(/^\s+/g, ""))[0];
  const root = createMathElement("math", frag);
  root.setAttribute("title", expr.replace(/\s+/g, " "));
  if (display) root.setAttribute("display", display);
  return root;
}

function parseExpr(str) {
  let symbol, node, result, i, newFrag = document.createDocumentFragment();
  do {
    str = removeCharsAndBlanks(str, 0);
    result = parseIexpr(str);
    node = result[0];
    str = result[1];
    symbol = getSymbol(str);

    if (symbol.ttype == INFIX && symbol.input == "/") {
      str = removeCharsAndBlanks(str, symbol.input.length);
      result = parseIexpr(str);

      if (result[0] == null) result[0] = createMathElement("mo", document.createTextNode("\u25A1"));
      else removeBrackets(result[0]);
      str = result[1];
      removeBrackets(node);
      node = createMathElement(symbol.tag, node);
      node.appendChild(result[0]);
      newFrag.appendChild(node);
      symbol = getSymbol(str);
    } else
    if (node != undefined) {
      newFrag.appendChild(node);
    }
  } while ((symbol.ttype != RIGHTBRACKET &&
      (symbol.ttype != LEFTRIGHT) ||
      nestingDepth == 0) && symbol != null && symbol.output != "");

  if (symbol.ttype == RIGHTBRACKET || symbol.ttype == LEFTRIGHT) {
    let len = newFrag.childNodes.length;
    if (len > 0 && newFrag.childNodes[len - 1].nodeName == "mrow" &&
      newFrag.childNodes[len - 1].lastChild &&
      newFrag.childNodes[len - 1].lastChild.firstChild) {

      let right = newFrag.childNodes[len - 1].lastChild.firstChild.nodeValue;
      if (right == ")" || right == "]") {
        let left = newFrag.childNodes[len - 1].firstChild.firstChild.nodeValue;
        if (left == "(" && right == ")" && symbol.output != "}" ||
          left == "[" && right == "]") {
          let pos = []; // positions of commas
          let matrix = true;
          let m = newFrag.childNodes.length;

          for (i = 0; matrix && i < m; i = i + 2) {
            pos[i] = [];
            node = newFrag.childNodes[i];
            if (matrix) matrix = node.nodeName == "mrow" &&
              (i == m - 1 || node.nextSibling.nodeName == "mo" &&
                node.nextSibling.firstChild.nodeValue == ",") &&
              node.firstChild.firstChild &&
              node.firstChild.firstChild.nodeValue == left &&
              node.lastChild.firstChild &&
              node.lastChild.firstChild.nodeValue == right;
            if (matrix)
              for (let j = 0; j < node.childNodes.length; j++)
                if (node.childNodes[j].firstChild.nodeValue == ",")
                  pos[i][pos[i].length] = j;
            if (matrix && i > 1) matrix = pos[i].length == pos[i - 2].length;
          }

          matrix = matrix && (pos.length > 1 || pos[0].length > 0);
          let columnlines = [];
          if (matrix) {
            let row, frag, n, k, table = document.createDocumentFragment();
            for (i = 0; i < m; i = i + 2) {
              row = document.createDocumentFragment();
              frag = document.createDocumentFragment();
              node = newFrag.firstChild; // <mrow>(-,-,...,-,-)</mrow>
              n = node.childNodes.length;
              k = 0;
              node.removeChild(node.firstChild); //remove (

              for (j = 1; j < n - 1; j++) {
                if (typeof pos[i][k] != "undefined" && j == pos[i][k]) {
                  node.removeChild(node.firstChild); //remove ,
                  if (node.firstChild.nodeName == "mrow" && node.firstChild.childNodes.length == 1 &&
                    node.firstChild.firstChild.firstChild.nodeValue == "\u2223") {
                    //is columnline marker - skip it
                    if (i == 0) { columnlines.push("solid"); }
                    node.removeChild(node.firstChild); //remove mrow
                    node.removeChild(node.firstChild); //remove ,
                    j += 2;
                    k++;
                  } else if (i == 0) { columnlines.push("none"); }
                  row.appendChild(createMathElement("mtd", frag));
                  k++;
                } else frag.appendChild(node.firstChild);
              }

              row.appendChild(createMathElement("mtd", frag));
              if (i == 0) { columnlines.push("none"); }
              if (newFrag.childNodes.length > 2) {
                newFrag.removeChild(newFrag.firstChild); //remove <mrow>)</mrow>
                newFrag.removeChild(newFrag.firstChild); //remove <mo>,</mo>
              }
              table.appendChild(createMathElement("mtr", row));
            }

            node = createMathElement("mtable", table);
            node.setAttribute("columnlines", columnlines.join(" "));
            if (typeof symbol.invisible == "boolean" && symbol.invisible) node.setAttribute("columnalign", "left");
            newFrag.replaceChild(node, newFrag.firstChild);
          }
        }
      }
    }

    str = removeCharsAndBlanks(str, symbol.input.length);
    if (typeof symbol.invisible != "boolean" || !symbol.invisible) {
      node = createMathElement("mo", document.createTextNode(symbol.output));
      newFrag.appendChild(node);
    }
  }
  return [newFrag, str];
}

function parseIexpr(str) {
  let symbol, sym1, sym2, node, result, underover;
  str = removeCharsAndBlanks(str, 0);
  sym1 = getSymbol(str);
  result = parseSexpr(str);
  node = result[0];
  str = result[1];
  symbol = getSymbol(str);

  if (symbol.ttype == INFIX && symbol.input != "/") {
    str = removeCharsAndBlanks(str, symbol.input.length);
    result = parseSexpr(str);
    if (result[0] == null) // show box in place of missing argument
      result[0] = createMathElement("mo", document.createTextNode("\u25A1"));
    else removeBrackets(result[0]);
    str = result[1];
    underover = (sym1.ttype == UNDEROVER || sym1.ttype == UNARYUNDEROVER);

    if (symbol.input == "_") {
      sym2 = getSymbol(str);
      if (sym2.input == "^") {
        str = removeCharsAndBlanks(str, sym2.input.length);
        let res2 = parseSexpr(str);
        removeBrackets(res2[0]);
        str = res2[1];
        node = createMathElement((underover ? "munderover" : "msubsup"), node);
        node.appendChild(result[0]);
        node.appendChild(res2[0]);
        node = createMathElement("mrow", node); // so sum does not stretch
      } else {
        node = createMathElement((underover ? "munder" : "msub"), node);
        node.appendChild(result[0]);
      }
    } else if (symbol.input == "^" && underover) {
      node = createMathElement("mover", node);
      node.appendChild(result[0]);
    } else {
      node = createMathElement(symbol.tag, node);
      node.appendChild(result[0]);
    }
    if (typeof sym1.func != 'undefined' && sym1.func) {
      sym2 = getSymbol(str);
      if (sym2.ttype != INFIX && sym2.ttype != RIGHTBRACKET &&
        (sym1.input.length > 1 || sym2.ttype == LEFTBRACKET)) {
        result = parseIexpr(str);
        node = createMathElement("mrow", node);
        node.appendChild(result[0]);
        str = result[1];
      }
    }
  }
  return [node, str];
}

function parseSexpr(str) { //parses str and returns [node,tailstr]
  let symbol, node, result, i, st, // rightvert = false,
    newFrag = document.createDocumentFragment();
  str = removeCharsAndBlanks(str, 0);
  symbol = getSymbol(str); //either a token or a bracket or empty
  if (symbol == null || symbol.ttype == RIGHTBRACKET && nestingDepth > 0) {
    return [null, str];
  }
  if (symbol.ttype == DEFINITION) {
    str = symbol.output + removeCharsAndBlanks(str, symbol.input.length);
    symbol = getSymbol(str);
  }
  switch (symbol.ttype) {
    case UNDEROVER:
    case CONST:
      str = removeCharsAndBlanks(str, symbol.input.length);
      return [createMathElement(symbol.tag, //its a constant
        document.createTextNode(symbol.output)), str];
    case LEFTBRACKET: //read (expr+)
      nestingDepth++;
      str = removeCharsAndBlanks(str, symbol.input.length);
      result = parseExpr(str, true);
      nestingDepth--;
      if (typeof symbol.invisible == "boolean" && symbol.invisible)
        node = createMathElement("mrow", result[0]);
      else {
        node = createMathElement("mo", document.createTextNode(symbol.output));
        node = createMathElement("mrow", node);
        node.appendChild(result[0]);
      }
      return [node, result[1]];
    case TEXT:
      if (symbol != AM_QUOTE) str = removeCharsAndBlanks(str, symbol.input.length);
      if (str.charAt(0) == "{") i = str.indexOf("}");
      else if (str.charAt(0) == "(") i = str.indexOf(")");
      else if (str.charAt(0) == "[") i = str.indexOf("]");
      else if (symbol == AM_QUOTE) i = str.slice(1).indexOf("\"") + 1;
      else i = 0;
      if (i == -1) i = str.length;
      st = str.slice(1, i);
      if (st.charAt(0) == " ") {
        node = createMathElement("mspace");
        node.setAttribute("width", "1ex");
        newFrag.appendChild(node);
      }
      newFrag.appendChild(
        createMathElement(symbol.tag, document.createTextNode(st)));
      if (st.charAt(st.length - 1) == " ") {
        node = createMathElement("mspace");
        node.setAttribute("width", "1ex");
        newFrag.appendChild(node);
      }
      str = removeCharsAndBlanks(str, i + 1);
      return [createMathElement("mrow", newFrag), str];
    case UNARYUNDEROVER:
    case UNARY:
      str = removeCharsAndBlanks(str, symbol.input.length);
      result = parseSexpr(str);

      if (result[0] == null) {
        if (symbol.tag == "mi" || symbol.tag == "mo") {
          return [createMathElement(symbol.tag,
            document.createTextNode(symbol.output)), str];
        } else {
          result[0] = createMathElement("mi", "");
        }
      }
      if (typeof symbol.func == "boolean" && symbol.func) { // functions hack
        st = str.charAt(0);
        if (st == "^" || st == "_" || st == "/" || st == "|" || st == "," ||
          (symbol.input.length == 1 && symbol.input.match(/\w/) && st != "(")) {
          return [createMathElement(symbol.tag,
            document.createTextNode(symbol.output)), str];
        } else {
          node = createMathElement("mrow",
            createMathElement(symbol.tag, document.createTextNode(symbol.output)));
          node.appendChild(result[0]);
          return [node, result[1]];
        }
      }
      removeBrackets(result[0]);
      if (symbol.input == "sqrt") { // sqrt
        return [createMathElement(symbol.tag, result[0]), result[1]];
      } else if (typeof symbol.rewriteleftright != "undefined") { // abs, floor, ceil
        node = createMathElement("mrow", createMathElement("mo", document.createTextNode(symbol.rewriteleftright[0])));
        node.appendChild(result[0]);
        node.appendChild(createMathElement("mo", document.createTextNode(symbol.rewriteleftright[1])));
        return [node, result[1]];
      } else if (symbol.input == "cancel") { // cancel
        node = createMathElement(symbol.tag, result[0]);
        node.setAttribute("notation", "updiagonalstrike");
        return [node, result[1]];
      } else if (typeof symbol.acc == "boolean" && symbol.acc) { // accent
        node = createMathElement(symbol.tag, result[0]);
        let accnode = createMathElement("mo", document.createTextNode(symbol.output));
        if (symbol.input == "vec" && (
            (result[0].nodeName == "mrow" && result[0].childNodes.length == 1 &&
              result[0].firstChild.firstChild.nodeValue !== null &&
              result[0].firstChild.firstChild.nodeValue.length == 1) ||
            (result[0].firstChild && result[0].firstChild.nodeValue !== null &&
              result[0].firstChild.nodeValue.length == 1))) {
          accnode.setAttribute("stretchy", false);
        }
        node.appendChild(accnode);
        return [node, result[1]];
      } else { // font change command
        if (typeof symbol.codes != "undefined") {
          for (i = 0; i < result[0].childNodes.length; i++)
            if (result[0].childNodes[i].nodeName == "mi" || result[0].nodeName == "mi") {
              st = (result[0].nodeName == "mi" ? result[0].firstChild.nodeValue :
                result[0].childNodes[i].firstChild.nodeValue);
              let newst = [];
              for (let j = 0; j < st.length; j++)
                if (st.charCodeAt(j) > 64 && st.charCodeAt(j) < 91)
                  newst = newst + symbol.codes[st.charCodeAt(j) - 65];
                else if (st.charCodeAt(j) > 96 && st.charCodeAt(j) < 123)
                newst = newst + symbol.codes[st.charCodeAt(j) - 71];
              else newst = newst + st.charAt(j);
              if (result[0].nodeName == "mi")
                result[0] = createMathElement("mo").
              appendChild(document.createTextNode(newst));
              else result[0].replaceChild(createMathElement("mo").appendChild(document.createTextNode(newst)),
                result[0].childNodes[i]);
            }
        }

        if (result[0].nodeName == "#text") {
          node = createMathElement(symbol.tag, result[0]);
        } else {
          node = result[0];
        }
        node.setAttribute(symbol.atname, symbol.atval);
        return [node, result[1]];
      }
    case BINARY:
      str = removeCharsAndBlanks(str, symbol.input.length);
      result = parseSexpr(str);
      if (result[0] == null) return [createMathElement("mo",
        document.createTextNode(symbol.input)), str];
      removeBrackets(result[0]);
      let result2 = parseSexpr(result[1]);
      if (result2[0] == null) return [createMathElement("mo",
        document.createTextNode(symbol.input)), str];
      removeBrackets(result2[0]);
      if (['color', 'class', 'id'].indexOf(symbol.input) >= 0) {

        // Get the second argument
        if (str.charAt(0) == "{") i = str.indexOf("}");
        else if (str.charAt(0) == "(") i = str.indexOf(")");
        else if (str.charAt(0) == "[") i = str.indexOf("]");
        st = str.slice(1, i);

        // Make a mathml node
        node = createMathElement(symbol.tag, result2[0]);

        // Set the correct attribute
        if (symbol.input === "color") node.setAttribute("mathcolor", st)
        else if (symbol.input === "class") node.setAttribute("class", st)
        else if (symbol.input === "id") node.setAttribute("id", st)
        return [node, result2[1]];
      }
      if (symbol.input == "root" || symbol.output == "stackrel")
        newFrag.appendChild(result2[0]);
      newFrag.appendChild(result[0]);
      if (symbol.input == "frac") newFrag.appendChild(result2[0]);
      return [createMathElement(symbol.tag, newFrag), result2[1]];
    case INFIX:
      str = removeCharsAndBlanks(str, symbol.input.length);
      return [createMathElement("mo", document.createTextNode(symbol.output)), str];
    case SPACE:
      str = removeCharsAndBlanks(str, symbol.input.length);
      node = createMathElement("mspace");
      node.setAttribute("width", "1ex");
      newFrag.appendChild(node);
      newFrag.appendChild(
        createMathElement(symbol.tag, document.createTextNode(symbol.output)));
      node = createMathElement("mspace");
      node.setAttribute("width", "1ex");
      newFrag.appendChild(node);
      return [createMathElement("mrow", newFrag), str];
    case LEFTRIGHT:
      //    if (rightvert) return [null,str]; else rightvert = true;
      nestingDepth++;
      str = removeCharsAndBlanks(str, symbol.input.length);
      result = parseExpr(str, false);
      nestingDepth--;
      st = "";
      if (result[0].lastChild != null)
        st = result[0].lastChild.firstChild.nodeValue;
      if (st == "|" && str.charAt(0) !== ",") { // its an absolute value subterm
        node = createMathElement("mo", document.createTextNode(symbol.output));
        node = createMathElement("mrow", node);
        node.appendChild(result[0]);
        return [node, result[1]];
      } else { // the "|" is a \mid so use unicode 2223 (divides) for spacing
        node = createMathElement("mo", document.createTextNode("\u2223"));
        node = createMathElement("mrow", node);
        return [node, str];
      }
    default:
      //alert("default");
      str = removeCharsAndBlanks(str, symbol.input.length);
      return [createMathElement(symbol.tag, //its a constant
        document.createTextNode(symbol.output)), str];
  }
}

function getSymbol(str) {
  //return maximal initial substring of str that appears in names
  //return null if there is none
  let k = 0, j = 0, mk, st, tagst, match = "", more = true;
  for (let i = 1; i <= str.length && more; i++) {
    st = str.slice(0, i); //initial substring of length i
    j = k;
    k = position(inputSymbolNames, st, j);
    if (k < inputSymbolNames.length && str.slice(0, inputSymbolNames[k].length) == inputSymbolNames[k]) {
      match = inputSymbolNames[k];
      mk = k;
      i = match.length;
    }
    more = k < inputSymbolNames.length && str.slice(0, inputSymbolNames[k].length) >= inputSymbolNames[k];
  }
  previousSymbol = currentSymbol;
  if (match != "") {
    currentSymbol = AM_SYMBOLS[mk].ttype;
    return AM_SYMBOLS[mk];
  }
  // if str[0] is a digit or - return maxsubstring of digits.digits
  currentSymbol = CONST;
  k = 1;
  st = str.slice(0, 1);
  let integ = true;
  while ("0" <= st && st <= "9" && k <= str.length) {
    st = str.slice(k, k + 1);
    k++;
  }
  if (st == ".") { // decimal sign
    st = str.slice(k, k + 1);
    if ("0" <= st && st <= "9") {
      integ = false;
      k++;
      while ("0" <= st && st <= "9" && k <= str.length) {
        st = str.slice(k, k + 1);
        k++;
      }
    }
  }
  if ((integ && k > 1) || k > 2) {
    st = str.slice(0, k - 1);
    tagst = "mn";
  } else {
    k = 2;
    st = str.slice(0, 1); //take 1 character
    tagst = (("A" > st || st > "Z") && ("a" > st || st > "z") ? "mo" : "mi");
  }
  if (st == "-" && str.charAt(1) !== ' ' && previousSymbol == INFIX) {
    currentSymbol = INFIX; //trick "/" into recognizing "-" on second parse
    return { input: st, tag: tagst, output: st, ttype: UNARY, func: true };
  }
  return { input: st, tag: tagst, output: st, ttype: CONST };
}

function position(arr, str, n) {
  // return position >=n where str appears or would be inserted
  // assumes arr is sorted
  if (n == 0) {
    let h, m;
    n = -1;
    h = arr.length;
    while (n + 1 < h) {
      m = (n + h) >> 1;
      if (arr[m] < str) n = m;
      else h = m;
    }
    return h;
  } else
    for (var i = n; i < arr.length && arr[i] < str; i++);
  return i; // i=arr.length || arr[i]>=str
}

function createMathElement(tag, frag) {
  const node = document.createElementNS("http://www.w3.org/1998/Math/MathML", tag);
  if (frag) node.appendChild(frag);
  return node;
}

function removeCharsAndBlanks(str, n) {
  let st;
  if (str.charAt(n) == "\\" && str.charAt(n + 1) != "\\" && str.charAt(n + 1) != " ")
    st = str.slice(n + 1);
  else st = str.slice(n);
  for (var i = 0; i < st.length && st.charCodeAt(i) <= 32; i = i + 1);
  return st.slice(i);
}

function removeBrackets(node) {
  let st;
  if (!node.hasChildNodes()) { return; }
  if (node.firstChild.hasChildNodes() && (node.nodeName == "mrow" || node.nodeName == "M:MROW")) {
    if (node.firstChild.nextSibling && node.firstChild.nextSibling.nodeName == "mtable") { return; }
    st = node.firstChild.firstChild.nodeValue;
    if (st == "(" || st == "[" || st == "{") node.removeChild(node.firstChild);
  }
  if (node.lastChild.hasChildNodes() && (node.nodeName == "mrow" || node.nodeName == "M:MROW")) {
    st = node.lastChild.firstChild.nodeValue;
    if (st == ")" || st == "]" || st == "}") node.removeChild(node.lastChild);
  }
}

// character lists for Mozilla/Netscape fonts
const AM_CAL = ["\uD835\uDC9C", "\u212C", "\uD835\uDC9E", "\uD835\uDC9F", "\u2130", "\u2131", "\uD835\uDCA2", "\u210B", "\u2110", "\uD835\uDCA5", "\uD835\uDCA6", "\u2112", "\u2133", "\uD835\uDCA9", "\uD835\uDCAA", "\uD835\uDCAB", "\uD835\uDCAC", "\u211B", "\uD835\uDCAE", "\uD835\uDCAF", "\uD835\uDCB0", "\uD835\uDCB1", "\uD835\uDCB2", "\uD835\uDCB3", "\uD835\uDCB4", "\uD835\uDCB5", "\uD835\uDCB6", "\uD835\uDCB7", "\uD835\uDCB8", "\uD835\uDCB9", "\u212F", "\uD835\uDCBB", "\u210A", "\uD835\uDCBD", "\uD835\uDCBE", "\uD835\uDCBF", "\uD835\uDCC0", "\uD835\uDCC1", "\uD835\uDCC2", "\uD835\uDCC3", "\u2134", "\uD835\uDCC5", "\uD835\uDCC6", "\uD835\uDCC7", "\uD835\uDCC8", "\uD835\uDCC9", "\uD835\uDCCA", "\uD835\uDCCB", "\uD835\uDCCC", "\uD835\uDCCD", "\uD835\uDCCE", "\uD835\uDCCF"];
const AM_FRK = ["\uD835\uDD04", "\uD835\uDD05", "\u212D", "\uD835\uDD07", "\uD835\uDD08", "\uD835\uDD09", "\uD835\uDD0A", "\u210C", "\u2111", "\uD835\uDD0D", "\uD835\uDD0E", "\uD835\uDD0F", "\uD835\uDD10", "\uD835\uDD11", "\uD835\uDD12", "\uD835\uDD13", "\uD835\uDD14", "\u211C", "\uD835\uDD16", "\uD835\uDD17", "\uD835\uDD18", "\uD835\uDD19", "\uD835\uDD1A", "\uD835\uDD1B", "\uD835\uDD1C", "\u2128", "\uD835\uDD1E", "\uD835\uDD1F", "\uD835\uDD20", "\uD835\uDD21", "\uD835\uDD22", "\uD835\uDD23", "\uD835\uDD24", "\uD835\uDD25", "\uD835\uDD26", "\uD835\uDD27", "\uD835\uDD28", "\uD835\uDD29", "\uD835\uDD2A", "\uD835\uDD2B", "\uD835\uDD2C", "\uD835\uDD2D", "\uD835\uDD2E", "\uD835\uDD2F", "\uD835\uDD30", "\uD835\uDD31", "\uD835\uDD32", "\uD835\uDD33", "\uD835\uDD34", "\uD835\uDD35", "\uD835\uDD36", "\uD835\uDD37"];
const AM_BBB = ["\uD835\uDD38", "\uD835\uDD39", "\u2102", "\uD835\uDD3B", "\uD835\uDD3C", "\uD835\uDD3D", "\uD835\uDD3E", "\u210D", "\uD835\uDD40", "\uD835\uDD41", "\uD835\uDD42", "\uD835\uDD43", "\uD835\uDD44", "\u2115", "\uD835\uDD46", "\u2119", "\u211A", "\u211D", "\uD835\uDD4A", "\uD835\uDD4B", "\uD835\uDD4C", "\uD835\uDD4D", "\uD835\uDD4E", "\uD835\uDD4F", "\uD835\uDD50", "\u2124", "\uD835\uDD52", "\uD835\uDD53", "\uD835\uDD54", "\uD835\uDD55", "\uD835\uDD56", "\uD835\uDD57", "\uD835\uDD58", "\uD835\uDD59", "\uD835\uDD5A", "\uD835\uDD5B", "\uD835\uDD5C", "\uD835\uDD5D", "\uD835\uDD5E", "\uD835\uDD5F", "\uD835\uDD60", "\uD835\uDD61", "\uD835\uDD62", "\uD835\uDD63", "\uD835\uDD64", "\uD835\uDD65", "\uD835\uDD66", "\uD835\uDD67", "\uD835\uDD68", "\uD835\uDD69", "\uD835\uDD6A", "\uD835\uDD6B"];

// token types
const CONST = 0, UNARY = 1, BINARY = 2, INFIX = 3, LEFTBRACKET = 4, RIGHTBRACKET = 5, SPACE = 6, UNDEROVER = 7, DEFINITION = 8, LEFTRIGHT = 9, TEXT = 10, BIG = 11, LONG = 12, STRETCHY = 13, MATRIX = 14, UNARYUNDEROVER = 15;
const AM_QUOTE = { input: "\"", tag: "mtext", output: "mbox", tex: null, ttype: TEXT };
const AM_DELIMITER = "`";

const AM_SYMBOLS = [
  // some greek symbols
  { input: "alpha", tag: "mi", output: "\u03B1", tex: null, ttype: CONST },
  { input: "beta", tag: "mi", output: "\u03B2", tex: null, ttype: CONST },
  { input: "chi", tag: "mi", output: "\u03C7", tex: null, ttype: CONST },
  { input: "delta", tag: "mi", output: "\u03B4", tex: null, ttype: CONST },
  { input: "Delta", tag: "mo", output: "\u0394", tex: null, ttype: CONST },
  { input: "epsi", tag: "mi", output: "\u03B5", tex: "epsilon", ttype: CONST },
  { input: "varepsilon", tag: "mi", output: "\u025B", tex: null, ttype: CONST },
  { input: "eta", tag: "mi", output: "\u03B7", tex: null, ttype: CONST },
  { input: "gamma", tag: "mi", output: "\u03B3", tex: null, ttype: CONST },
  { input: "Gamma", tag: "mo", output: "\u0393", tex: null, ttype: CONST },
  { input: "iota", tag: "mi", output: "\u03B9", tex: null, ttype: CONST },
  { input: "kappa", tag: "mi", output: "\u03BA", tex: null, ttype: CONST },
  { input: "lambda", tag: "mi", output: "\u03BB", tex: null, ttype: CONST },
  { input: "Lambda", tag: "mo", output: "\u039B", tex: null, ttype: CONST },
  { input: "lamda", tag: "mi", output: "\u03BB", tex: null, ttype: CONST },
  { input: "Lamda", tag: "mo", output: "\u039B", tex: null, ttype: CONST },
  { input: "mu", tag: "mi", output: "\u03BC", tex: null, ttype: CONST },
  { input: "nu", tag: "mi", output: "\u03BD", tex: null, ttype: CONST },
  { input: "omega", tag: "mi", output: "\u03C9", tex: null, ttype: CONST },
  { input: "Omega", tag: "mo", output: "\u03A9", tex: null, ttype: CONST },
  { input: "phi", tag: "mi", output: "\u03D5", tex: null, ttype: CONST },
  { input: "varphi", tag: "mi", output: "\u03C6", tex: null, ttype: CONST },
  { input: "Phi", tag: "mo", output: "\u03A6", tex: null, ttype: CONST },
  { input: "pi", tag: "mi", output: "\u03C0", tex: null, ttype: CONST },
  { input: "Pi", tag: "mo", output: "\u03A0", tex: null, ttype: CONST },
  { input: "psi", tag: "mi", output: "\u03C8", tex: null, ttype: CONST },
  { input: "Psi", tag: "mi", output: "\u03A8", tex: null, ttype: CONST },
  { input: "rho", tag: "mi", output: "\u03C1", tex: null, ttype: CONST },
  { input: "sigma", tag: "mi", output: "\u03C3", tex: null, ttype: CONST },
  { input: "Sigma", tag: "mo", output: "\u03A3", tex: null, ttype: CONST },
  { input: "tau", tag: "mi", output: "\u03C4", tex: null, ttype: CONST },
  { input: "theta", tag: "mi", output: "\u03B8", tex: null, ttype: CONST },
  { input: "vartheta", tag: "mi", output: "\u03D1", tex: null, ttype: CONST },
  { input: "Theta", tag: "mo", output: "\u0398", tex: null, ttype: CONST },
  { input: "upsilon", tag: "mi", output: "\u03C5", tex: null, ttype: CONST },
  { input: "xi", tag: "mi", output: "\u03BE", tex: null, ttype: CONST },
  { input: "Xi", tag: "mo", output: "\u039E", tex: null, ttype: CONST },
  { input: "zeta", tag: "mi", output: "\u03B6", tex: null, ttype: CONST },

  // binary operation symbols
  //{input:"-",  tag:"mo", output:"\u0096", tex:null, ttype:CONST},
  { input: "*", tag: "mo", output: "\u22C5", tex: "cdot", ttype: CONST },
  { input: "**", tag: "mo", output: "\u2217", tex: "ast", ttype: CONST },
  { input: "***", tag: "mo", output: "\u22C6", tex: "star", ttype: CONST },
  { input: "//", tag: "mo", output: "/", tex: null, ttype: CONST },
  { input: "\\\\", tag: "mo", output: "\\", tex: "backslash", ttype: CONST },
  { input: "setminus", tag: "mo", output: "\\", tex: null, ttype: CONST },
  { input: "xx", tag: "mo", output: "\u00D7", tex: "times", ttype: CONST },
  { input: "|><", tag: "mo", output: "\u22C9", tex: "ltimes", ttype: CONST },
  { input: "><|", tag: "mo", output: "\u22CA", tex: "rtimes", ttype: CONST },
  { input: "|><|", tag: "mo", output: "\u22C8", tex: "bowtie", ttype: CONST },
  { input: "-:", tag: "mo", output: "\u00F7", tex: "div", ttype: CONST },
  { input: "divide", tag: "mo", output: "-:", tex: null, ttype: DEFINITION },
  { input: "@", tag: "mo", output: "\u2218", tex: "circ", ttype: CONST },
  { input: "o+", tag: "mo", output: "\u2295", tex: "oplus", ttype: CONST },
  { input: "ox", tag: "mo", output: "\u2297", tex: "otimes", ttype: CONST },
  { input: "o.", tag: "mo", output: "\u2299", tex: "odot", ttype: CONST },
  { input: "sum", tag: "mo", output: "\u2211", tex: null, ttype: UNDEROVER },
  { input: "prod", tag: "mo", output: "\u220F", tex: null, ttype: UNDEROVER },
  { input: "^^", tag: "mo", output: "\u2227", tex: "wedge", ttype: CONST },
  { input: "^^^", tag: "mo", output: "\u22C0", tex: "bigwedge", ttype: UNDEROVER },
  { input: "vv", tag: "mo", output: "\u2228", tex: "vee", ttype: CONST },
  { input: "vvv", tag: "mo", output: "\u22C1", tex: "bigvee", ttype: UNDEROVER },
  { input: "nn", tag: "mo", output: "\u2229", tex: "cap", ttype: CONST },
  { input: "nnn", tag: "mo", output: "\u22C2", tex: "bigcap", ttype: UNDEROVER },
  { input: "uu", tag: "mo", output: "\u222A", tex: "cup", ttype: CONST },
  { input: "uuu", tag: "mo", output: "\u22C3", tex: "bigcup", ttype: UNDEROVER },

  // binary relation symbols
  { input: "!=", tag: "mo", output: "\u2260", tex: "ne", ttype: CONST },
  { input: ":=", tag: "mo", output: ":=", tex: null, ttype: CONST },
  { input: "lt", tag: "mo", output: "<", tex: null, ttype: CONST },
  { input: "<=", tag: "mo", output: "\u2264", tex: "le", ttype: CONST },
  { input: "lt=", tag: "mo", output: "\u2264", tex: "leq", ttype: CONST },
  { input: "gt", tag: "mo", output: ">", tex: null, ttype: CONST },
  { input: "mlt", tag: "mo", output: "\u226A", tex: "ll", ttype: CONST },
  { input: ">=", tag: "mo", output: "\u2265", tex: "ge", ttype: CONST },
  { input: "gt=", tag: "mo", output: "\u2265", tex: "geq", ttype: CONST },
  { input: "mgt", tag: "mo", output: "\u226B", tex: "gg", ttype: CONST },
  { input: "-<", tag: "mo", output: "\u227A", tex: "prec", ttype: CONST },
  { input: "-lt", tag: "mo", output: "\u227A", tex: null, ttype: CONST },
  { input: ">-", tag: "mo", output: "\u227B", tex: "succ", ttype: CONST },
  { input: "-<=", tag: "mo", output: "\u2AAF", tex: "preceq", ttype: CONST },
  { input: ">-=", tag: "mo", output: "\u2AB0", tex: "succeq", ttype: CONST },
  { input: "in", tag: "mo", output: "\u2208", tex: null, ttype: CONST },
  { input: "!in", tag: "mo", output: "\u2209", tex: "notin", ttype: CONST },
  { input: "sub", tag: "mo", output: "\u2282", tex: "subset", ttype: CONST },
  { input: "sup", tag: "mo", output: "\u2283", tex: "supset", ttype: CONST },
  { input: "sube", tag: "mo", output: "\u2286", tex: "subseteq", ttype: CONST },
  { input: "supe", tag: "mo", output: "\u2287", tex: "supseteq", ttype: CONST },
  { input: "-=", tag: "mo", output: "\u2261", tex: "equiv", ttype: CONST },
  { input: "~=", tag: "mo", output: "\u2245", tex: "cong", ttype: CONST },
  { input: "~~", tag: "mo", output: "\u2248", tex: "approx", ttype: CONST },
  { input: "~", tag: "mo", output: "\u223C", tex: "sim", ttype: CONST },
  { input: "prop", tag: "mo", output: "\u221D", tex: "propto", ttype: CONST },

  // logical symbols
  { input: "and", tag: "mtext", output: "and", tex: null, ttype: SPACE },
  { input: "or", tag: "mtext", output: "or", tex: null, ttype: SPACE },
  { input: "not", tag: "mo", output: "\u00AC", tex: "neg", ttype: CONST },
  { input: "=>", tag: "mo", output: "\u21D2", tex: "implies", ttype: CONST },
  { input: "if", tag: "mo", output: "if", tex: null, ttype: SPACE },
  { input: "<=>", tag: "mo", output: "\u21D4", tex: "iff", ttype: CONST },
  { input: "AA", tag: "mo", output: "\u2200", tex: "forall", ttype: CONST },
  { input: "EE", tag: "mo", output: "\u2203", tex: "exists", ttype: CONST },
  { input: "_|_", tag: "mo", output: "\u22A5", tex: "bot", ttype: CONST },
  { input: "TT", tag: "mo", output: "\u22A4", tex: "top", ttype: CONST },
  { input: "|--", tag: "mo", output: "\u22A2", tex: "vdash", ttype: CONST },
  { input: "|==", tag: "mo", output: "\u22A8", tex: "models", ttype: CONST },

  // grouping brackets
  { input: "(", tag: "mo", output: "(", tex: "left(", ttype: LEFTBRACKET },
  { input: ")", tag: "mo", output: ")", tex: "right)", ttype: RIGHTBRACKET },
  { input: "[", tag: "mo", output: "[", tex: "left[", ttype: LEFTBRACKET },
  { input: "]", tag: "mo", output: "]", tex: "right]", ttype: RIGHTBRACKET },
  { input: "{", tag: "mo", output: "{", tex: null, ttype: LEFTBRACKET },
  { input: "}", tag: "mo", output: "}", tex: null, ttype: RIGHTBRACKET },
  { input: "|", tag: "mo", output: "|", tex: null, ttype: LEFTRIGHT },
  { input: ":|:", tag: "mo", output: "|", tex: null, ttype: CONST },
  { input: "|:", tag: "mo", output: "|", tex: null, ttype: LEFTBRACKET },
  { input: ":|", tag: "mo", output: "|", tex: null, ttype: RIGHTBRACKET },
  //{input:"||", tag:"mo", output:"||", tex:null, ttype:LEFTRIGHT},
  { input: "(:", tag: "mo", output: "\u2329", tex: "langle", ttype: LEFTBRACKET },
  { input: ":)", tag: "mo", output: "\u232A", tex: "rangle", ttype: RIGHTBRACKET },
  { input: "<<", tag: "mo", output: "\u2329", tex: null, ttype: LEFTBRACKET },
  { input: ">>", tag: "mo", output: "\u232A", tex: null, ttype: RIGHTBRACKET },
  { input: "{:", tag: "mo", output: "{:", tex: null, ttype: LEFTBRACKET, invisible: true },
  { input: ":}", tag: "mo", output: ":}", tex: null, ttype: RIGHTBRACKET, invisible: true },

  // miscellaneous symbols
  { input: "int", tag: "mo", output: "\u222B", tex: null, ttype: CONST },
  { input: "dx", tag: "mi", output: "{:d x:}", tex: null, ttype: DEFINITION },
  { input: "dy", tag: "mi", output: "{:d y:}", tex: null, ttype: DEFINITION },
  { input: "dz", tag: "mi", output: "{:d z:}", tex: null, ttype: DEFINITION },
  { input: "dt", tag: "mi", output: "{:d t:}", tex: null, ttype: DEFINITION },
  { input: "oint", tag: "mo", output: "\u222E", tex: null, ttype: CONST },
  { input: "del", tag: "mo", output: "\u2202", tex: "partial", ttype: CONST },
  { input: "grad", tag: "mo", output: "\u2207", tex: "nabla", ttype: CONST },
  { input: "+-", tag: "mo", output: "\u00B1", tex: "pm", ttype: CONST },
  { input: "-+", tag: "mo", output: "\u2213", tex: "mp", ttype: CONST },
  { input: "O/", tag: "mo", output: "\u2205", tex: "emptyset", ttype: CONST },
  { input: "oo", tag: "mo", output: "\u221E", tex: "infty", ttype: CONST },
  { input: "aleph", tag: "mo", output: "\u2135", tex: null, ttype: CONST },
  { input: "...", tag: "mo", output: "...", tex: "ldots", ttype: CONST },
  { input: ":.", tag: "mo", output: "\u2234", tex: "therefore", ttype: CONST },
  { input: ":'", tag: "mo", output: "\u2235", tex: "because", ttype: CONST },
  { input: "/_", tag: "mo", output: "\u2220", tex: "angle", ttype: CONST },
  { input: "/_\\", tag: "mo", output: "\u25B3", tex: "triangle", ttype: CONST },
  { input: "'", tag: "mo", output: "\u2032", tex: "prime", ttype: CONST },
  { input: "tilde", tag: "mover", output: "~", tex: null, ttype: UNARY, acc: true },
  { input: "\\ ", tag: "mo", output: "\u00A0", tex: null, ttype: CONST },
  { input: "frown", tag: "mo", output: "\u2322", tex: null, ttype: CONST },
  { input: "quad", tag: "mo", output: "\u00A0\u00A0", tex: null, ttype: CONST },
  { input: "qquad", tag: "mo", output: "\u00A0\u00A0\u00A0\u00A0", tex: null, ttype: CONST },
  { input: "cdots", tag: "mo", output: "\u22EF", tex: null, ttype: CONST },
  { input: "vdots", tag: "mo", output: "\u22EE", tex: null, ttype: CONST },
  { input: "ddots", tag: "mo", output: "\u22F1", tex: null, ttype: CONST },
  { input: "diamond", tag: "mo", output: "\u22C4", tex: null, ttype: CONST },
  { input: "square", tag: "mo", output: "\u25A1", tex: null, ttype: CONST },
  { input: "|__", tag: "mo", output: "\u230A", tex: "lfloor", ttype: CONST },
  { input: "__|", tag: "mo", output: "\u230B", tex: "rfloor", ttype: CONST },
  { input: "|~", tag: "mo", output: "\u2308", tex: "lceiling", ttype: CONST },
  { input: "~|", tag: "mo", output: "\u2309", tex: "rceiling", ttype: CONST },
  { input: "CC", tag: "mo", output: "\u2102", tex: null, ttype: CONST },
  { input: "NN", tag: "mo", output: "\u2115", tex: null, ttype: CONST },
  { input: "QQ", tag: "mo", output: "\u211A", tex: null, ttype: CONST },
  { input: "RR", tag: "mo", output: "\u211D", tex: null, ttype: CONST },
  { input: "ZZ", tag: "mo", output: "\u2124", tex: null, ttype: CONST },
  { input: "f", tag: "mi", output: "f", tex: null, ttype: UNARY, func: true },
  { input: "g", tag: "mi", output: "g", tex: null, ttype: UNARY, func: true },

  // standard functions
  { input: "lim", tag: "mo", output: "lim", tex: null, ttype: UNDEROVER },
  { input: "Lim", tag: "mo", output: "Lim", tex: null, ttype: UNDEROVER },
  { input: "sin", tag: "mo", output: "sin", tex: null, ttype: UNARY, func: true },
  { input: "cos", tag: "mo", output: "cos", tex: null, ttype: UNARY, func: true },
  { input: "tan", tag: "mo", output: "tan", tex: null, ttype: UNARY, func: true },
  { input: "sinh", tag: "mo", output: "sinh", tex: null, ttype: UNARY, func: true },
  { input: "cosh", tag: "mo", output: "cosh", tex: null, ttype: UNARY, func: true },
  { input: "tanh", tag: "mo", output: "tanh", tex: null, ttype: UNARY, func: true },
  { input: "cot", tag: "mo", output: "cot", tex: null, ttype: UNARY, func: true },
  { input: "sec", tag: "mo", output: "sec", tex: null, ttype: UNARY, func: true },
  { input: "csc", tag: "mo", output: "csc", tex: null, ttype: UNARY, func: true },
  { input: "arcsin", tag: "mo", output: "arcsin", tex: null, ttype: UNARY, func: true },
  { input: "arccos", tag: "mo", output: "arccos", tex: null, ttype: UNARY, func: true },
  { input: "arctan", tag: "mo", output: "arctan", tex: null, ttype: UNARY, func: true },
  { input: "coth", tag: "mo", output: "coth", tex: null, ttype: UNARY, func: true },
  { input: "sech", tag: "mo", output: "sech", tex: null, ttype: UNARY, func: true },
  { input: "csch", tag: "mo", output: "csch", tex: null, ttype: UNARY, func: true },
  { input: "exp", tag: "mo", output: "exp", tex: null, ttype: UNARY, func: true },
  { input: "abs", tag: "mo", output: "abs", tex: null, ttype: UNARY, rewriteleftright: ["|", "|"] },
  { input: "norm", tag: "mo", output: "norm", tex: null, ttype: UNARY, rewriteleftright: ["\u2225", "\u2225"] },
  { input: "floor", tag: "mo", output: "floor", tex: null, ttype: UNARY, rewriteleftright: ["\u230A", "\u230B"] },
  { input: "ceil", tag: "mo", output: "ceil", tex: null, ttype: UNARY, rewriteleftright: ["\u2308", "\u2309"] },
  { input: "log", tag: "mo", output: "log", tex: null, ttype: UNARY, func: true },
  { input: "ln", tag: "mo", output: "ln", tex: null, ttype: UNARY, func: true },
  { input: "det", tag: "mo", output: "det", tex: null, ttype: UNARY, func: true },
  { input: "dim", tag: "mo", output: "dim", tex: null, ttype: CONST },
  { input: "mod", tag: "mo", output: "mod", tex: null, ttype: CONST },
  { input: "gcd", tag: "mo", output: "gcd", tex: null, ttype: UNARY, func: true },
  { input: "lcm", tag: "mo", output: "lcm", tex: null, ttype: UNARY, func: true },
  { input: "lub", tag: "mo", output: "lub", tex: null, ttype: CONST },
  { input: "glb", tag: "mo", output: "glb", tex: null, ttype: CONST },
  { input: "min", tag: "mo", output: "min", tex: null, ttype: UNDEROVER },
  { input: "max", tag: "mo", output: "max", tex: null, ttype: UNDEROVER },
  { input: "Sin", tag: "mo", output: "Sin", tex: null, ttype: UNARY, func: true },
  { input: "Cos", tag: "mo", output: "Cos", tex: null, ttype: UNARY, func: true },
  { input: "Tan", tag: "mo", output: "Tan", tex: null, ttype: UNARY, func: true },
  { input: "Arcsin", tag: "mo", output: "Arcsin", tex: null, ttype: UNARY, func: true },
  { input: "Arccos", tag: "mo", output: "Arccos", tex: null, ttype: UNARY, func: true },
  { input: "Arctan", tag: "mo", output: "Arctan", tex: null, ttype: UNARY, func: true },
  { input: "Sinh", tag: "mo", output: "Sinh", tex: null, ttype: UNARY, func: true },
  { input: "Cosh", tag: "mo", output: "Cosh", tex: null, ttype: UNARY, func: true },
  { input: "Tanh", tag: "mo", output: "Tanh", tex: null, ttype: UNARY, func: true },
  { input: "Cot", tag: "mo", output: "Cot", tex: null, ttype: UNARY, func: true },
  { input: "Sec", tag: "mo", output: "Sec", tex: null, ttype: UNARY, func: true },
  { input: "Csc", tag: "mo", output: "Csc", tex: null, ttype: UNARY, func: true },
  { input: "Log", tag: "mo", output: "Log", tex: null, ttype: UNARY, func: true },
  { input: "Ln", tag: "mo", output: "Ln", tex: null, ttype: UNARY, func: true },
  { input: "Abs", tag: "mo", output: "abs", tex: null, ttype: UNARY, notexcopy: true, rewriteleftright: ["|", "|"] },

  // arrows
  { input: "uarr", tag: "mo", output: "\u2191", tex: "uparrow", ttype: CONST },
  { input: "darr", tag: "mo", output: "\u2193", tex: "downarrow", ttype: CONST },
  { input: "rarr", tag: "mo", output: "\u2192", tex: "rightarrow", ttype: CONST },
  { input: "->", tag: "mo", output: "\u2192", tex: "to", ttype: CONST },
  { input: ">->", tag: "mo", output: "\u21A3", tex: "rightarrowtail", ttype: CONST },
  { input: "->>", tag: "mo", output: "\u21A0", tex: "twoheadrightarrow", ttype: CONST },
  { input: ">->>", tag: "mo", output: "\u2916", tex: "twoheadrightarrowtail", ttype: CONST },
  { input: "|->", tag: "mo", output: "\u21A6", tex: "mapsto", ttype: CONST },
  { input: "larr", tag: "mo", output: "\u2190", tex: "leftarrow", ttype: CONST },
  { input: "harr", tag: "mo", output: "\u2194", tex: "leftrightarrow", ttype: CONST },
  { input: "rArr", tag: "mo", output: "\u21D2", tex: "Rightarrow", ttype: CONST },
  { input: "lArr", tag: "mo", output: "\u21D0", tex: "Leftarrow", ttype: CONST },
  { input: "hArr", tag: "mo", output: "\u21D4", tex: "Leftrightarrow", ttype: CONST },

  // commands with argument
  { input: "sqrt", tag: "msqrt", output: "sqrt", tex: null, ttype: UNARY },
  { input: "root", tag: "mroot", output: "root", tex: null, ttype: BINARY },
  { input: "frac", tag: "mfrac", output: "/", tex: null, ttype: BINARY },
  { input: "/", tag: "mfrac", output: "/", tex: null, ttype: INFIX },
  { input: "stackrel", tag: "mover", output: "stackrel", tex: null, ttype: BINARY },
  { input: "overset", tag: "mover", output: "stackrel", tex: null, ttype: BINARY },
  { input: "underset", tag: "munder", output: "stackrel", tex: null, ttype: BINARY },
  { input: "_", tag: "msub", output: "_", tex: null, ttype: INFIX },
  { input: "^", tag: "msup", output: "^", tex: null, ttype: INFIX },
  { input: "hat", tag: "mover", output: "\u005E", tex: null, ttype: UNARY, acc: true },
  { input: "bar", tag: "mover", output: "\u00AF", tex: "overline", ttype: UNARY, acc: true },
  { input: "vec", tag: "mover", output: "\u2192", tex: null, ttype: UNARY, acc: true },
  { input: "dot", tag: "mover", output: ".", tex: null, ttype: UNARY, acc: true },
  { input: "ddot", tag: "mover", output: "..", tex: null, ttype: UNARY, acc: true },
  { input: "overarc", tag: "mover", output: "\u23DC", tex: "overparen", ttype: UNARY, acc: true },
  { input: "ul", tag: "munder", output: "\u0332", tex: "underline", ttype: UNARY, acc: true },
  { input: "ubrace", tag: "munder", output: "\u23DF", tex: "underbrace", ttype: UNARYUNDEROVER, acc: true },
  { input: "obrace", tag: "mover", output: "\u23DE", tex: "overbrace", ttype: UNARYUNDEROVER, acc: true },
  { input: "text", tag: "mtext", output: "text", tex: null, ttype: TEXT },
  { input: "mbox", tag: "mtext", output: "mbox", tex: null, ttype: TEXT },
  { input: "color", tag: "mstyle", ttype: BINARY },
  { input: "id", tag: "mrow", ttype: BINARY },
  { input: "class", tag: "mrow", ttype: BINARY },
  { input: "cancel", tag: "menclose", output: "cancel", tex: null, ttype: UNARY },
  AM_QUOTE,
  { input: "normal", tag: "mi", atname: "mathvariant", atval: "normal", output: "normal", tex: null, ttype: UNARY },
  { input: "bold", tag: "mi", atname: "mathvariant", atval: "bold", output: "bold", tex: null, ttype: UNARY },
  { input: "struck", tag: "mi", atname: "mathvariant", atval: "double-struck", output: "struck", tex: null, ttype: UNARY, codes: AM_BBB },
  { input: "script", tag: "mi", atname: "mathvariant", atval: "script", output: "script", tex: null, ttype: UNARY, codes: AM_CAL },
  { input: "fraktur", tag: "mi", atname: "mathvariant", atval: "fraktur", output: "fraktur", tex: null, ttype: UNARY, codes: AM_FRK },
];
