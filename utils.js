
Date.prototype.format = function () {
  return this
    .toLocaleDateString('default', { day: '2-digit', month: '2-digit', year: '2-digit' }) + " " + this.toLocaleTimeString().slice(0, -3);
}

String.prototype.sanitize = function () {
  return this
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("BEGIN_QUOTE", "<div class='quote'>")
    .replaceAll("QUOTE_END", "</div>")
}
