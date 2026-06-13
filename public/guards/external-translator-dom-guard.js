(function (g) {
  if (!g || typeof g.Node === "undefined") return;

  var proto = g.Node.prototype;
  var PATCH_FLAG =
    typeof Symbol === "function" && typeof Symbol.for === "function"
      ? Symbol.for("externalTranslatorDomGuardPatched")
      : "__xtDomGuardPatched";

  if (!proto || proto[PATCH_FLAG]) return;

  Object.defineProperty(proto, PATCH_FLAG, {
    value: true,
    configurable: true,
    enumerable: false,
    writable: false,
  });

  var cfg =
    g.__externalTranslatorDomGuard || (g.__externalTranslatorDomGuard = {});
  var policy = cfg.policy || "strict";
  var sampleRate = typeof cfg.sampleRate === "number" ? cfg.sampleRate : 0.01;
  var maxWarn = typeof cfg.maxWarn === "number" ? cfg.maxWarn : 3;
  var maxQueue = typeof cfg.maxQueue === "number" ? cfg.maxQueue : 100;

  var warnCount = 0;
  var counts = cfg.counts || (cfg.counts = { removeChild: 0, insertBefore: 0 });
  var queue = cfg.queue || (cfg.queue = []);

  var signalCache = { ts: 0, active: false, via: "" };
  var SIGNAL_TTL_MS = 1000;

  function isNotFoundError(err) {
    return !!err && (err.name === "NotFoundError" || err.code === 8);
  }

  function nt(n) {
    return n ? n.nodeType : 0;
  }

  function isElement(n) {
    return nt(n) === 1;
  }

  function isText(n) {
    return nt(n) === 3;
  }

  function isDocFrag(n) {
    return nt(n) === 11;
  }

  function tag(n) {
    return isElement(n) ? n.tagName : "";
  }

  function now() {
    return Date.now ? Date.now() : +new Date();
  }

  function computeTranslatorSignal() {
    var t = now();
    if (t - signalCache.ts < SIGNAL_TTL_MS) return signalCache;

    var doc = g.document;
    var active = false;
    var via = "";

    try {
      if (!doc || !doc.documentElement) {
        signalCache = { ts: t, active: false, via: "" };
        return signalCache;
      }

      var de = doc.documentElement;
      var body = doc.body;

      if (
        de.classList &&
        (de.classList.contains("translated-ltr") ||
          de.classList.contains("translated-rtl"))
      ) {
        active = true;
        via = "html.class.translated-*";
      } else if (
        body &&
        body.classList &&
        (body.classList.contains("translated-ltr") ||
          body.classList.contains("translated-rtl"))
      ) {
        active = true;
        via = "body.class.translated-*";
      }

      if (!active && doc.getElementById && doc.getElementById("goog-gt-tt")) {
        active = true;
        via = "#goog-gt-tt";
      }
    } catch {
      signalCache = { ts: t, active: false, via: "" };
      return signalCache;
    }

    signalCache = { ts: t, active: active, via: via };
    return signalCache;
  }

  function meta() {
    var ua = "";
    var locale = "";
    var path = "";

    try {
      ua = (g.navigator && g.navigator.userAgent) || "";
    } catch { }

    try {
      locale =
        (g.document &&
          g.document.documentElement &&
          g.document.documentElement.lang) ||
        "";
    } catch { }

    try {
      path =
        (g.location &&
          g.location.pathname + g.location.search + g.location.hash) ||
        "";
    } catch { }

    return { ua: ua, locale: locale, path: path };
  }

  function captureStack(err) {
    if (err && err.stack) return String(err.stack).slice(0, 2000);

    try {
      throw new Error("xt-dom-guard");
    } catch (e) {
      return e && e.stack ? String(e.stack).slice(0, 2000) : "";
    }
  }

  function isDescendantButNotDirectChild(parent, node) {
    try {
      return !!(
        parent &&
        node &&
        parent !== node &&
        typeof parent.contains === "function" &&
        parent.contains(node) &&
        node.parentNode !== parent
      );
    } catch {
      return false;
    }
  }

  function isRelevantNode(node) {
    return isElement(node) || isText(node) || isDocFrag(node);
  }

  function shouldGuardBase(parent, a, b) {
    if (!parent || !(isElement(parent) || isDocFrag(parent))) return false;
    if (!isRelevantNode(a) && a != null) return false;
    if (!isRelevantNode(b) && b != null) return false;
    return true;
  }

  function confidence(parent, a, b, mismatchKind) {
    var sig = computeTranslatorSignal();
    var score = 0;

    if (sig.active) score += 2;
    if (isText(a) || isText(b)) score += 1;
    if (
      isDescendantButNotDirectChild(parent, a) ||
      isDescendantButNotDirectChild(parent, b)
    ) {
      score += 2;
    }
    if (mismatchKind === "notfounderror") score += 1;

    if (score >= 4) return { level: "high", via: sig.via };
    if (score >= 2) return { level: "medium", via: sig.via };
    return { level: "low", via: sig.via };
  }

  function shouldGuard(parent, a, b) {
    if (!shouldGuardBase(parent, a, b)) return false;

    var sig = computeTranslatorSignal();
    var desc =
      isDescendantButNotDirectChild(parent, a) ||
      isDescendantButNotDirectChild(parent, b);
    var textish = isText(a) || isText(b);

    if (policy === "lenient") return true;
    if (policy === "strict") return !!(sig.active || desc);
    return !!(sig.active || desc || textish);
  }

  function emit(op, reason, err, parent, a, b, mismatchKind) {
    counts[op] = (counts[op] || 0) + 1;

    var doSample = sampleRate > 0 && Math.random() <= sampleRate;
    if (!doSample) return;

    var m = meta();
    var sig = computeTranslatorSignal();
    var conf = confidence(parent, a, b, mismatchKind);

    var ev = {
      event: "external_translator.dom_guard",
      op: op,
      reason: reason,
      count: counts[op],
      sampleRate: sampleRate,
      ua: m.ua,
      locale: m.locale,
      path: m.path,
      stack: captureStack(err),
      translated: sig.active,
      translatedVia: sig.via,
      confidence: conf.level,
      parentType: nt(parent),
      parentTag: tag(parent),
      aType: a ? nt(a) : null,
      aTag: tag(a),
      bType: b ? nt(b) : null,
      bTag: tag(b),
    };

    if (
      warnCount < maxWarn &&
      g.console &&
      typeof g.console.warn === "function"
    ) {
      warnCount++;
      g.console.warn("[external-translator-dom-guard]", ev);
    }

    var cb = cfg.onEvent || cfg.onTelemetry;
    if (typeof cb === "function") {
      try {
        cb(ev);
      } catch { }
    } else {
      queue.push(ev);
      if (queue.length > maxQueue) queue.shift();
    }
  }

  var originalRemoveChild = proto.removeChild;
  proto.removeChild = function (child) {
    if (child == null) return originalRemoveChild.call(this, child);

    if (child.parentNode !== this) {
      if (shouldGuard(this, child, null)) {
        emit(
          "removeChild",
          "parent_mismatch",
          null,
          this,
          child,
          null,
          "parent_mismatch",
        );
        return child;
      }

      return originalRemoveChild.call(this, child);
    }

    try {
      return originalRemoveChild.call(this, child);
    } catch (err) {
      if (isNotFoundError(err) && shouldGuard(this, child, null)) {
        emit(
          "removeChild",
          "notfounderror",
          err,
          this,
          child,
          null,
          "notfounderror",
        );
        return child;
      }

      throw err;
    }
  };

  var originalInsertBefore = proto.insertBefore;
  proto.insertBefore = function (newNode, referenceNode) {
    if (newNode == null)
      return originalInsertBefore.call(this, newNode, referenceNode);

    if (referenceNode && referenceNode.parentNode !== this) {
      if (shouldGuard(this, newNode, referenceNode)) {
        emit(
          "insertBefore",
          "reference_mismatch",
          null,
          this,
          newNode,
          referenceNode,
          "reference_mismatch",
        );
        return originalInsertBefore.call(this, newNode, null);
      }

      return originalInsertBefore.call(this, newNode, referenceNode);
    }

    try {
      return originalInsertBefore.call(this, newNode, referenceNode);
    } catch (err) {
      if (isNotFoundError(err) && shouldGuard(this, newNode, referenceNode)) {
        emit(
          "insertBefore",
          "notfounderror",
          err,
          this,
          newNode,
          referenceNode,
          "notfounderror",
        );
        return originalInsertBefore.call(this, newNode, null);
      }

      throw err;
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
