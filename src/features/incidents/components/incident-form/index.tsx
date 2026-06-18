"use client";

import { useActionState, useEffect, useState } from "react";
import { IncidentPriority } from "@/generated/prisma/enums";
import { FormErrors } from "@/components/common/form-errors";
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
import type { IncidentFormState } from "../../types/form.types";
import { LocationPreview, type IncidentLocation } from "../location-preview";
import { IncidentFormSection } from "./components/incident-form-section";
import { IncidentTagsCombobox } from "./components/incident-tags-combobox";
import { IncidentUsersCombobox } from "./components/incident-users-combobox";
import styles from "./incident-form.module.scss";
import type { ActionsForm, ReadyDataForm } from "../../types/incident.types";

interface IncidentFormProps {
  data: ReadyDataForm;
  actions: ActionsForm;
}

const getInitialState = (location: IncidentLocation): IncidentFormState => ({
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
  },
});

const IncidentForm = ({ data, actions }: IncidentFormProps) => {
  const { location, options } = data;
  const { onSuccess, onChangeState } = actions;

  const [state, action, isPending] = useActionState<IncidentFormState, FormData>(
    createIncidentAction,
    getInitialState(location),
  );
  const [tagIds, setTagIds] = useState<string[]>(state.values.tagIds ?? []);
  const [assigneeIds, setAssigneeIds] = useState<string[]>(state.values.assigneeIds ?? []);
  const [observerIds, setObserverIds] = useState<string[]>(state.values.observerIds ?? []);

  const t = useTranslations("common");
  const locale = useLocale();
  const isCompleted = state.status === FORM_STATUS.SUCCESS;
  const isDisabled = isPending || isCompleted;
  const categoryNameKey = locale === "en" ? "nameEn" : "nameEs";

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
            : t("actions.create")}
        </Button>
      </div>
    </form>
  );
};

export { IncidentForm };
