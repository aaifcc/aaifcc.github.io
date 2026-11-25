// 页面没有脚本也完整可用。脚本只做两件事：
// 1. 滚动时标出当前所在的分区；
// 2. 让首屏右侧的活动面板可以按城市切换（手动、自动轮转、可暂停）。

function initNav() {
  const bar = document.querySelector(".bar");
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  let queued = false;

  function update() {
    queued = false;
    const line = bar.offsetHeight + window.innerHeight * 0.32;
    let active = -1;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top <= line) active = i;
    });
    links.forEach((a, i) => {
      const on = i === active;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  addEventListener("load", schedule);
  update();
}

function initNextSet() {
  const set = document.querySelector("[data-nextset]");
  if (!set) return;

  const bar = set.querySelector(".nextset__bar");
  const tabs = [...set.querySelectorAll('[role="tab"]')];
  const slides = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  // 地标剪影与城市一一对应，顺序与标签相同；杭州没有剪影
  const arts = [...set.querySelectorAll(".art")];
  const toggle = set.querySelector(".nextset__toggle");
  const region = set.querySelector(".nextset__slides");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const isEn = (document.documentElement.lang || "").toLowerCase().startsWith("en");
  const LABEL_PAUSE = isEn ? "Pause automatic rotation" : "暂停自动切换";
  const LABEL_PLAY = isEn ? "Start automatic rotation" : "开始自动切换";
  const ROLE_DESC = isEn ? "Carousel" : "轮播面板";
  const INTERVAL = 7000;

  let index = 0;
  let timer = 0;
  // 是否要自动轮转。系统开启「减少动效」时默认不转，用户可以自己点开始。
  let auto = !reduce.matches;
  // 以下任一情况都临时停住，情况消失后继续
  let hover = false;
  let focus = false;
  let inView = true;

  function show(i) {
    index = (i + tabs.length) % tabs.length;
    tabs.forEach((tab, k) => {
      const on = k === index;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      slides[k].classList.toggle("is-on", on);
      slides[k].inert = !on;
      slides[k].setAttribute("aria-hidden", String(!on));
      if (arts[k]) arts[k].classList.toggle("is-on", on);
    });
  }

  function sync() {
    clearInterval(timer);
    timer = 0;
    if (auto && !hover && !focus && inView && !document.hidden) {
      timer = setInterval(() => show(index + 1), INTERVAL);
    }
    // 自动轮转时不打扰读屏；停下后，切换的内容会被读出
    region.setAttribute("aria-live", auto ? "off" : "polite");
    toggle.setAttribute("aria-label", auto ? LABEL_PAUSE : LABEL_PLAY);
    toggle.classList.toggle("is-paused", !auto);
  }

  // 用户自己选了城市，就不再自动转走
  function pick(i) {
    auto = false;
    show(i);
    sync();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => pick(i));
    tab.addEventListener("keydown", (e) => {
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      pick(to);
      tabs[index].focus();
    });
  });

  toggle.addEventListener("click", () => {
    auto = !auto;
    // 用键盘按下「开始」时焦点还在按钮上，这时不应因为焦点而停住
    if (auto) focus = false;
    sync();
  });

  // 只对鼠标生效：触屏点一下不会让面板一直停着
  set.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return;
    hover = true;
    sync();
  });
  set.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    hover = false;
    sync();
  });

  // 键盘焦点在面板里时停住，免得正在读的内容被换掉
  set.addEventListener("focusin", (e) => {
    focus = e.target.matches(":focus-visible");
    sync();
  });
  set.addEventListener("focusout", (e) => {
    if (set.contains(e.relatedTarget)) return;
    focus = false;
    sync();
  });

  document.addEventListener("visibilitychange", sync);
  reduce.addEventListener("change", () => {
    if (!reduce.matches) return;
    auto = false;
    sync();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }).observe(set);
  }

  set.setAttribute("aria-roledescription", ROLE_DESC);
  slides.forEach((slide, i) => {
    slide.setAttribute("role", "tabpanel");
    slide.setAttribute("aria-labelledby", tabs[i].id);
  });
  show(0);
  bar.hidden = false;
  set.classList.add("is-js");
  sync();
}

initNav();
initNextSet();
