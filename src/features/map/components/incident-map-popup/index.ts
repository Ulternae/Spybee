import type { MapIncident } from "../../queries/get-active-project-map";
import styles from "./incident-map-popup.module.scss";

const createIncidentMapPopup = (incident: MapIncident) => {
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
  description.textContent = incident.locationDescription;
  status.textContent = incident.status;
  priority.textContent = incident.priority;

  meta.append(status, priority);
  popup.append(sequence, title, description, meta);

  return popup;
};

export { createIncidentMapPopup };
