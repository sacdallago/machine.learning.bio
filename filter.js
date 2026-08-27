/* Publication filtering. Progressive enhancement only:
   with JavaScript off the full list is already rendered and readable. */
(function () {
  "use strict";

  var host = document.getElementById("filters");
  var items = Array.prototype.slice.call(
    document.querySelectorAll(".pubs > li[data-theme]")
  );
  if (!host || !items.length) return;

  var THEMES = [
    { id: "all", name: "All" },
    { id: "repr", name: "Representation learning" },
    { id: "gen", name: "Generative design" },
    { id: "scale", name: "Search and scale" },
    { id: "eval", name: "Evaluation" }
  ];

  var list = document.createElement("ul");
  list.className = "filters";

  var status = document.createElement("p");
  status.className = "note mt";
  status.setAttribute("role", "status");

  function apply(theme) {
    var shown = 0;

    items.forEach(function (li) {
      var match =
        theme === "all" ||
        li.getAttribute("data-theme").split(/\s+/).indexOf(theme) !== -1;
      li.hidden = !match;
      if (match) shown++;
    });

    // A year heading with nothing under it is noise — hide the pair.
    document.querySelectorAll("main .pubs").forEach(function (ul) {
      var any = Array.prototype.some.call(ul.children, function (li) {
        return !li.hidden;
      });
      ul.hidden = !any;
      var h = ul.previousElementSibling;
      while (h && h.tagName !== "H2") h = h.previousElementSibling;
      if (h) h.hidden = !any;
    });

    list.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.theme === theme));
    });

    var label = THEMES.filter(function (t) {
      return t.id === theme;
    })[0].name;
    status.textContent =
      theme === "all"
        ? shown + " publications."
        : shown + " of " + items.length + " publications in " + label + ".";
  }

  THEMES.forEach(function (t) {
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = t.name;
    b.dataset.theme = t.id;
    b.setAttribute("aria-pressed", String(t.id === "all"));
    b.addEventListener("click", function () {
      apply(t.id);
    });
    li.appendChild(b);
    list.appendChild(li);
  });

  host.appendChild(list);
  host.appendChild(status);
  host.hidden = false;
  apply("all");
})();
