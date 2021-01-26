import $ from 'jquery';

const init = function(mode: number) {
  $("body").css("background-image", `url(${chrome.runtime.getURL("image/bg/body-bg.jpg")})`);
}

const update = function(element: HTMLElement, freshness: number, mode: number) {
  console.log(freshness);
  const f = freshness > 0 ? Math.min(freshness + 0.1, 1) : 0;
  $(element).css({
    "background-image": `url(${chrome.runtime.getURL("image/bg/list-bg.png")})`,
    "background-color": `rgba(255,255,255,${f})`,
    "background-blend-mode": "lighten"
  });

  /* 文字を滲ませる
  if (freshness >= 0) {
    $(element).find("span, cite, em").filter((i: number, e: HTMLSpanElement) => {
      return e.innerText.length > 0;
    }).each((i: number, e: HTMLSpanElement) => {
      const d = Math.round(((1-f)*4)*1000)/1000;
      let rgb = $(e).css("color").replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)\)/i);
      if (!rgb) rgb = $(e).css("text-shadow").match(/^rgba?\((\d+), (\d+), (\d+)/i);
      $(e).css({
        "color": "transparent",
        "text-shadow": `0 0 ${d}px rgba(${rgb?rgb[1]:0}, ${rgb?rgb[2]:0}, ${rgb?rgb[3]:0}, ${d>0?0.5:1.0})`
      });
    });
  }
  */
}

const getFreshness = function(targetTime: number, nowTime: number, baseTime: number): number {
  // return 1 - (Math.max(Math.min((nowTime - targetTime) / baseTime, 1), 0));
  return Math.pow(0.01, (Math.max(Math.min((nowTime - targetTime) / baseTime, 1), 0)));
}

const main = function(year: number, mode: number) {
  const baseYear = year;
  $("#baseYear").text(baseYear);
  const NOW = new Date();
  const OLDEST = new Date(NOW.getFullYear() - baseYear, NOW.getMonth(), NOW.getDate(), NOW.getHours(), NOW.getMinutes(), NOW.getSeconds(), NOW.getMilliseconds());
  const BASE = NOW.getTime() - OLDEST.getTime();

  $(".g").each(function(index: number, element: HTMLElement) {
    const span = $(element).find("span.f");
    let freshness = 0.0;
    if (span.length > 0) {
      let date: Date|null = null;
      const dateString = span[0].innerHTML;
      if (dateString.match(/\d{4}\/\d{2}\/\d{2}/)) {
        date = new Date(dateString.substring(0, 10));
      } else if (dateString.match(/\d* 日前/)) {
        const found = dateString.match(/(?<days>\d*) 日前/);
        const days = Number(found?.groups?.days || "0");
        date = new Date(NOW.getTime());
        date.setDate(NOW.getDate() - days);
      } else if (dateString.match(/\d* 時間前/)) {
        const found = dateString.substring(0, 5).match(/(?<hours>\d*) 時間前/);
        const hours = Number(found?.groups?.hours || "0");
        date = new Date(NOW.getTime());
        date.setHours(NOW.getHours() - hours);
      }

      if (date) {
        // 1に近ければ近いほど新しい
        freshness = getFreshness(date.getTime(), NOW.getTime(), BASE);
      }
    }

    update(element, freshness, mode);

    return;
  });
}

$(function() {
  $("<span>現在より<span id='baseYear'>0</span>年前までの情報を強調中..</span>").appendTo("#result-stats");
  chrome.storage.sync.get({"fsr-year": 5, "fsr-mode": 0}, function(res) {
    /*
    const range = $("<input>").attr({
      type: "range",
      id: "elapsedBaseYear",
      min: "1",
      max: "10",
      value: res["fsr-year"].toString()
    }).appendTo("#result-stats");
    range.on("input", () => {
      main(Number(range.val()), Number($("#result-stats").children('input[name="drawMode"]:checked').attr("value")));
      chrome.storage.sync.set({"fsr-year": Number(range.val())});
    });
    */

    init(res["fsr-mode"]);

    main(res["fsr-year"], res["fsr-mode"]);
  });
});