(function () {
  var storageKey = "arg-color-theme";
  var root = document.documentElement;
  var systemThemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function storedTheme() {
    try {
      var stored = window.localStorage.getItem(storageKey);
      return stored === "light" || stored === "dark" ? stored : null;
    } catch (error) {}

    return null;
  }

  function systemTheme() {
    return systemThemeQuery && systemThemeQuery.matches ? "dark" : "light";
  }

  function preferredTheme() {
    return storedTheme() || systemTheme();
  }

  function hasStoredTheme() {
    return storedTheme() !== null;
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    var toggle = document.getElementById("arg-theme-toggle");
    if (!toggle) {
      return;
    }

    var isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
    toggle.setAttribute("title", isDark ? "Modo claro" : "Modo oscuro");
  }

  applyTheme(preferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".navbar-nav");

    if (nav && !document.getElementById("arg-theme-toggle")) {
      var item = document.createElement("li");
      item.className = "nav-item theme-toggle-item";
      item.innerHTML = [
        '<button class="nav-link theme-toggle" id="arg-theme-toggle" type="button" aria-pressed="false">',
        '<span class="theme-toggle-track" aria-hidden="true">',
        '<i class="bi bi-brightness-high-fill"></i>',
        '<i class="bi bi-moon-stars-fill"></i>',
        '<span class="theme-toggle-thumb"></span>',
        "</span>",
        "</button>"
      ].join("");

      nav.insertBefore(item, nav.firstElementChild);
    }

    applyTheme(preferredTheme());

    var toggle = document.getElementById("arg-theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

        try {
          window.localStorage.setItem(storageKey, nextTheme);
        } catch (error) {}

        applyTheme(nextTheme);
      });
    }

    if (systemThemeQuery) {
      var handleSystemThemeChange = function () {
        if (!hasStoredTheme()) {
          applyTheme(systemTheme());
        }
      };

      if (systemThemeQuery.addEventListener) {
        systemThemeQuery.addEventListener("change", handleSystemThemeChange);
      } else if (systemThemeQuery.addListener) {
        systemThemeQuery.addListener(handleSystemThemeChange);
      }
    }
  });
})();
