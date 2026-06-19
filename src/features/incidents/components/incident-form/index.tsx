"use client";

import { useActionState, useEffect, useState } from "react";
import { IncidentPriority } from "@/generated/prisma/enums";
import { FormErrors } from "@/components/common/form-errors";
import {
  Calendar,
  type HandleDateChange,
  type HourOption,
} from "@/components/common/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useTranslations } from "next-intl";
import { FORM_STATUS } from "@/lib/forms/form-status";
import { createIncidentAction } from "../../actions/create-incident/create-incident.action";
import { updateIncidentAction } from "../../actions/update-incident/update-incident.action";
import type { IncidentFormInput } from "../../schemas/incident.schema";
import type { IncidentFormState } from "../../types/form.types";
import { LocationPreview, type IncidentLocation } from "../location-preview";
import { IncidentFormSection } from "./components/incident-form-section";
import { IncidentTagsCombobox } from "./components/incident-tags-combobox";
import { IncidentUsersCombobox } from "./components/incident-users-combobox";
import styles from "./incident-form.module.scss";
import type { ActionsForm, ReadyDataForm } from "../../types/incident.types";
import { HOURS } from "@/components/common/calendar/constants";

interface IncidentFormProps {
  data: ReadyDataForm;
  actions: ActionsForm;
  incidentId?: string;
  initialValues?: Partial<IncidentFormInput>;
  mode?: "create" | "edit";
}

const getDefaultDueDate = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate;
};

const getHourFromDate = (date: Date): HourOption => {
  const value = [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    "00",
  ].join(":");

  return HOURS.find((hour) => hour.value === value) ?? HOURS[0];
};

const getInitialState = (
  location: IncidentLocation,
  initialValues?: Partial<IncidentFormInput>,
): IncidentFormState => ({
  status: FORM_STATUS.IDLE,
  values: {
    title: "",
    description: "",
    categoryId: "",
    priority: IncidentPriority.MEDIUM,
    tagIds: [],
    assigneeIds: [],
    observerIds: [],
    latitude: location.latitude,
    longitude: location.longitude,
    locationDescription: "",
    dueDate: getDefaultDueDate(),
    ...initialValues,
  },
});

const IncidentForm = ({ data, actions, incidentId, initialValues, mode = "create" }: IncidentFormProps) => {
  const { location, options } = data;
  const { onSuccess, onChangeState } = actions;

  const formAction =
    mode === "edit" && incidentId
      ? updateIncidentAction.bind(null, incidentId)
      : createIncidentAction;
  const [state, action, isPending] = useActionState<IncidentFormState, FormData>(
    formAction,
    getInitialState(location, initialValues),
  );
  const [tagIds, setTagIds] = useState<string[]>(state.values.tagIds ?? []);
  const [assigneeIds, setAssigneeIds] = useState<string[]>(state.values.assigneeIds ?? []);
  const [observerIds, setObserverIds] = useState<string[]>(state.values.observerIds ?? []);
  const [dueDate, setDueDate] = useState<Date>(() => {
    return state.values.dueDate ? new Date(state.values.dueDate) : getDefaultDueDate();
  });
  const [dueHour, setDueHour] = useState<HourOption>(() => getHourFromDate(dueDate));

  const t = useTranslations("common");
  const locale = useLocale();
  const isCompleted = state.status === FORM_STATUS.SUCCESS;
  const isDisabled = isPending || isCompleted;
  const categoryNameKey = locale === "en" ? "nameEn" : "nameEs";
  const handleDueDateChange = ({ newDate, newHour }: HandleDateChange) => {
    const [hours, minutes, seconds] = newHour.value.split(":").map(Number);
    const nextDate = new Date(newDate);

    nextDate.setHours(hours, minutes, seconds, 0);
    setDueDate(nextDate);
    setDueHour(newHour);
  };

  useEffect(() => {
    if (state.status !== FORM_STATUS.SUCCESS) {
      return;
    }

    onSuccess();
  }, [onSuccess, state.status]);

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="latitude" value={location.latitude} />
      <input type="hidden" name="longitude" value={location.longitude} />
      <input type="hidden" name="dueDate" value={dueDate.toISOString()} />

      <div className={styles.fields}>
        <IncidentFormSection
          title={t("fields.groups.general")}
          description={t("fields.groups.general_description")}
        >
          <div className={styles.grid}>
            <Input
              name="title"
              placeholder={t("fields.title")}
              defaultValue={state.values.title}
              isInvalid={Boolean(state.fieldErrors?.title)}
              disabled={isDisabled}
              required
            />

            <Select
              name="categoryId"
              defaultValue={state.values.categoryId}
              disabled={isDisabled}
            >
              <SelectTrigger
                aria-invalid={Boolean(state.fieldErrors?.categoryId)}
                className={styles.select}
              >
                <SelectValue placeholder={t("fields.category")} />
              </SelectTrigger>
              <SelectContent>
                {options.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category[categoryNameKey]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              name="priority"
              defaultValue={state.values.priority ?? IncidentPriority.MEDIUM}
              disabled={isDisabled}
            >
              <SelectTrigger
                aria-invalid={Boolean(state.fieldErrors?.priority)}
                className={styles.select}
              >
                <SelectValue placeholder={t("fields.priority")} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(IncidentPriority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {t(`enums.incident_priority.${priority}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Calendar
              date={dueDate}
              hour={dueHour}
              onDateChange={handleDueDateChange}
            >
              <Input
                readOnly
                placeholder={t("fields.due_date")}
                value={dueDate.toLocaleString(locale)}
                isInvalid={Boolean(state.fieldErrors?.dueDate)}
                disabled={isDisabled}
              />
            </Calendar>
          </div>
        </IncidentFormSection>

        <IncidentFormSection
          title={t("fields.groups.description")}
          description={t("fields.groups.description_description")}
        >
          <div className={styles.grid}>
            <Textarea
              name="description"
              placeholder={t("fields.description")}
              defaultValue={state.values.description}
              aria-invalid={Boolean(state.fieldErrors?.description)}
              disabled={isDisabled}
              required
            />

            <Textarea
              name="locationDescription"
              placeholder={t("fields.location_description")}
              defaultValue={state.values.locationDescription}
              aria-invalid={Boolean(state.fieldErrors?.locationDescription)}
              disabled={isDisabled}
            />
          </div>
        </IncidentFormSection>

        <IncidentFormSection
          title={t("fields.groups.location")}
          description={t("fields.groups.location_description")}
        >
          <LocationPreview location={location} />
        </IncidentFormSection>

        <IncidentFormSection
          title={t("fields.groups.classification")}
          description={t("fields.groups.classification_description")}
        >
          <div className={styles.grid}>
            <IncidentTagsCombobox
              name="tagIds"
              tags={options.tags}
              value={tagIds}
              onValueChange={setTagIds}
              placeholder={t("fields.tags")}
              searchPlaceholder={t("fields.search.tags")}
              emptyMessage={t("fields.empty.tags")}
              disabled={isDisabled}
            />
          </div>
        </IncidentFormSection>

        <IncidentFormSection
          title={t("fields.groups.people")}
          description={t("fields.groups.people_description")}
        >
          <div className={styles.grid}>
            <IncidentUsersCombobox
              name="assigneeIds"
              users={options.members}
              value={assigneeIds}
              onValueChange={setAssigneeIds}
              placeholder={t("fields.assignees")}
              searchPlaceholder={t("fields.search.users")}
              emptyMessage={t("fields.empty.users")}
              disabled={isDisabled}
            />

            <IncidentUsersCombobox
              name="observerIds"
              users={options.members}
              value={observerIds}
              onValueChange={setObserverIds}
              placeholder={t("fields.observers")}
              searchPlaceholder={t("fields.search.users")}
              emptyMessage={t("fields.empty.users")}
              disabled={isDisabled}
            />
          </div>
        </IncidentFormSection>

        <FormErrors
          fieldErrors={state.fieldErrors}
          formError={state.formError}
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => onChangeState(false)}
          disabled={isDisabled}
        >
          {t("actions.cancel")}
        </Button>
        <Button type="submit" disabled={isDisabled}>
          {isPending || isCompleted
            ? t("actions.loading")
            : t(`actions.${mode === "edit" ? "update" : "create"}`)}
        </Button>
      </div>
    </form>
  );
};

export { IncidentForm };
