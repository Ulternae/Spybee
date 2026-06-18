import type { MapIncident } from "../../queries/get-active-project-map";
import styles from "./incident-map-popup.module.scss";

const getCategoryName = (incident: MapIncident, locale: string) => {
  return locale === "en" ? incident.category.nameEn : incident.category.nameEs;
};

const createIncidentMapPopup = (incident: MapIncident, locale: string) => {
  const categoryName = getCategoryName(incident, locale);
  const popup = document.createElement("article");
  const sequence = document.createElement("span");
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const meta = document.createElement("div");
  const status = document.createElement("span");
  const priority = document.createElement("span");

  popup.className = styles.root;
  sequence.className = styles.sequence;
  meta.className = styles.meta;

  sequence.textContent = `#${incident.sequenceNo}`;
  title.textContent = incident.title;
  description.textContent = incident.locationDescription ?? categoryName;
  status.textContent = incident.status;
  priority.textContent = incident.priority;

  meta.append(status, priority);
  popup.append(sequence, title, description, meta);

  return popup;
};

export { createIncidentMapPopup };
