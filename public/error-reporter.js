(() => {
  const DEBOUNCE_MS = 1000;
  const errorCache = new Map();

  function createErrorFingerprint(message, stack) {
    return message + (stack ? stack.split("\n")[0] : "");
  }

  function sendErrorToParent(message, stack, source) {
    const fingerprint = createErrorFingerprint(message, stack);
    const now = Date.now();

    if (errorCache.has(fingerprint)) {
      const lastSent = errorCache.get(fingerprint);
      if (now - lastSent < DEBOUNCE_MS) {
        return;
      }
    }

    errorCache.set(fingerprint, now);

    if (errorCache.size > 50) {
      const firstKey = errorCache.keys().next().value;
      errorCache.delete(firstKey);
    }

    try {
      window.parent.postMessage(
        {
          type: "sandbox-error",
          error: {
            message: message,
            stack: stack || null,
            source: source || "unknown",
            timestamp: now,
            url: window.location.href,
          },
        },
        "*"
      );
    } catch (_e) {
      // Ignore
    }
  }

  // 1. Uncaught JavaScript errors
  window.addEventListener("error", (event) => {
    if (event.target !== window) {
      return;
    }
    const message = event.message || event.error?.message || "Unknown error";
    const stack = event.error?.stack || null;
    sendErrorToParent(message, stack, "window.error");
  });

  // 2. Promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message =
      reason?.message || String(reason) || "Unhandled Promise Rejection";
    const stack = reason?.stack || null;
    sendErrorToParent(message, stack, "promise.rejection");
  });

  // 3. Console.error interception
  // biome-ignore lint/suspicious/noConsole: Intentionally intercepting console.error
  const originalError = console.error;
  console.error = (...args) => {
    const message = args
      .map((arg) => {
        if (arg instanceof Error) return arg.message;
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg);
          } catch (_e) {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    const errorArg = args.find((arg) => arg instanceof Error);
    const stack = errorArg?.stack || null;

    sendErrorToParent(message, stack, "console.error");
    originalError.apply(console, args);
  };

  // 4. Resource loading errors
  window.addEventListener(
    "error",
    (event) => {
      if (event.target !== window && event.target.src) {
        const target = event.target;
        const resourceType = target.tagName.toLowerCase();
        const message = `Failed to load ${resourceType}: ${target.src}`;
        sendErrorToParent(message, null, "resource.loading");
      }
    },
    true
  );

  // 5. Fetch failures
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).catch((error) => {
      const url =
        typeof args[0] === "string" ? args[0] : args[0]?.url || "unknown";
      sendErrorToParent(
        `Fetch failed: ${url} - ${error.message}`,
        error.stack,
        "fetch.error"
      );
      throw error;
    });
  };

  // 6. XMLHttpRequest failures
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url;
    this._method = method;
    return originalXHROpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("error", () => {
      sendErrorToParent(
        `XHR failed: ${this._method} ${this._url}`,
        null,
        "xhr.error"
      );
    });
    return originalXHRSend.apply(this, args);
  };
})();
