import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useNotificationApi } from "../../../hooks/useNotificationApi";
import type {
  NotificationTemplateResponse,
  NotificationTemplateRequest,
} from "../../../types";

const schema = yup.object().shape({
  name: yup.string().required("Template name is required"),
  type: yup.string().required("Notification type is required"),
  subject: yup.string().required("Subject is required"),
  templateFile: yup.string().required("File path/HTML is required"),
  defaultLanguage: yup.string().required("Language is required"),
  priority: yup.number().min(0).max(10).required(),
});

interface NotificationTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: NotificationTemplateResponse | null;
}

export const NotificationTemplateModal: React.FC<
  NotificationTemplateModalProps
> = ({ isOpen, onClose, template }) => {
  const isEdit = !!template;
  const { createTemplate, updateTemplate } = useNotificationApi();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        type: template.type,
        subject: template.subject,
        templateFile: template.templateFile,
        defaultLanguage: template.defaultLanguage,
        priority: template.priority,
      });
    } else {
      reset({
        name: "",
        type: "EMAIL",
        subject: "",
        templateFile: "",
        defaultLanguage: "en",
        priority: 1,
      });
    }
  }, [template, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && template) {
        await updateTemplate.mutateAsync({
          id: template.id,
          data: data as NotificationTemplateRequest,
        });
      } else {
        await createTemplate.mutateAsync(data as NotificationTemplateRequest);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Template" : "Create New Template"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Template Name (Internal Reference)"
          {...register("name")}
          error={errors.name?.message}
          placeholder="e.g. WELCOME_EMAIL"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Type</label>
            <select
              {...register("type")}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="PUSH">Push Notification</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Language
            </label>
            <select
              {...register("defaultLanguage")}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="en">English (en)</option>
              <option value="vi">Vietnamese (vi)</option>
              <option value="fr">French (fr)</option>
            </select>
          </div>
        </div>

        <Input
          label="Subject / Title"
          {...register("subject")}
          error={errors.subject?.message}
          placeholder="e.g. Welcome to Antigravity Hotels!"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Content / Template Path
          </label>
          <textarea
            {...register("templateFile")}
            rows={5}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono"
            placeholder="<html><body>Hello {{name}}!</body></html>"
          />
          {errors.templateFile && (
            <p className="text-[11px] text-red-500">
              {errors.templateFile.message}
            </p>
          )}
        </div>

        <Input
          label="Priority (0-10)"
          type="number"
          {...register("priority")}
          error={errors.priority?.message}
        />

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createTemplate.isPending || updateTemplate.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
