import { Chart } from "./chart";
import { Data } from "./data";
import d3 = require("d3");

export class Controller {
  data: Data;

  charts: Array<Chart> = [];
  currentYear = 2005;
  selectedMetric = "Refugees";

  constructor() {
    this.attachListeners();
    this.data = new Data();
    this.data.parseData(() => {
      this.init();
    });
  }

  init() {
    this.charts.push(new Chart("first", this.data, this.currentYear - 1, "Refugees"));
    this.charts.push(new Chart("second", this.data, this.currentYear, "Refugees"));
    this.charts.push(new Chart("third", this.data, this.currentYear + 1, "Refugees"));
  }

  attachListeners() {
    window.addEventListener("load", () => {
      document.querySelectorAll("button").forEach(e => {
        e.addEventListener("click", (e) => this.onClick(e));
      });

      window.addEventListener("wheel", (e) => {
        let offset = 10;
        if (e["wheelDeltaY"] >= offset) {
          this.prev();
        } else if (e["wheelDeltaY"] <= -offset) {
          this.next();
        }
      }, false);
    });
  }

  onClick(e: Event) {
    let src: Element = e.srcElement;
    document.querySelectorAll("button").forEach(b => {
      b.removeAttribute("active");
    });
    src.setAttribute("active", "true");
    let action = src.getAttribute("data-action");
    let value = src.getAttribute("data-value");
    switch (action) {
      case "next":
        this.next();
        break;
      case "prev":
        this.prev();
        break;
      case "change-metric":
        this.changeMetric(value);
        break;
    }
  }

  next() {
    if (this.currentYear < 2012) {
      this.currentYear = this.currentYear + 1;
      this.charts[0].changeYear(this.currentYear - 1);
      this.charts[1].changeYear(this.currentYear);
      this.charts[2].changeYear(this.currentYear + 1);
    }
  }

  prev() {
    if (this.currentYear > 2003) {
      this.currentYear = this.currentYear - 1;
      this.charts[0].changeYear(this.currentYear - 1);
      this.charts[1].changeYear(this.currentYear);
      this.charts[2].changeYear(this.currentYear + 1);
    }
  }

  changeMetric(metric) {
    this.charts.forEach((c) => {
      c.changeMetric(metric);
    });
  }
}