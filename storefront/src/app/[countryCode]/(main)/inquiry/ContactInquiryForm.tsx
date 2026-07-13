"use client"

import * as React from "react"
import * as ReactAria from "react-aria-components"
import { useController, type UseFormReturn } from "react-hook-form"
import { Button } from "@/components/Button"
import { Form, InputField } from "@/components/Forms"
import { Icon } from "@/components/Icon"
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from "@/components/ui/Select"
import {
  inquiryContactSchema,
  type InquiryContactInput,
} from "@lib/inquiry/contact"

const requestTypeOptions = [
  { value: "business", label: "Business hardware" },
  { value: "store", label: "Store product request" },
  { value: "networking", label: "Networking and IT" },
  { value: "repair", label: "Repairs and service" },
  { value: "gaming", label: "Gaming products and setup" },
  { value: "web", label: "Web development" },
  { value: "quote", label: "Quote or bulk pricing" },
  { value: "other", label: "Other" },
] as const

const RequestTypeField = ({
  onChange,
}: {
  onChange: (value: InquiryContactInput["requestType"]) => void
}) => {
  const { field, fieldState } = useController<
    InquiryContactInput,
    "requestType"
  >({
    name: "requestType",
  })

  return (
    <div>
      <ReactAria.Select
        selectedKey={field.value}
        onSelectionChange={(key) => {
          const value = String(key) as InquiryContactInput["requestType"]
          field.onChange(value)
          onChange(value)
        }}
        onBlur={field.onBlur}
      >
        <ReactAria.Label className="mb-1.5 block text-sm font-medium">
          Request type
        </ReactAria.Label>
        <UiSelectButton className="h-11 px-4 text-sm">
          <UiSelectValue>
            {({ selectedText }) => selectedText || "Choose request type"}
          </UiSelectValue>
          <UiSelectIcon />
        </UiSelectButton>
        <ReactAria.Popover className="z-50 w-(--trigger-width)">
          <ReactAria.Dialog aria-label="Request type options">
            <UiSelectListBox
              items={requestTypeOptions}
              className="max-h-82 overflow-auto"
            >
              {(item) => (
                <UiSelectListBoxItem
                  id={item.value}
                  textValue={item.label}
                  className="flex items-center gap-3 p-3 text-sm"
                >
                  <span>{item.label}</span>
                  <Icon
                    name="check"
                    className="ml-auto hidden w-4 group-data-[selected]:block"
                  />
                </UiSelectListBoxItem>
              )}
            </UiSelectListBox>
          </ReactAria.Dialog>
        </ReactAria.Popover>
      </ReactAria.Select>
      {fieldState.error && (
        <p className="mt-2 text-xs text-red-primary">
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}

const OtherRequestTypeField = () => (
  <InputField
    name="otherRequestType"
    placeholder="What type of request?"
    className="animate-in fade-in slide-in-from-top-1 duration-150"
  />
)

const MessageField = () => {
  const { field, fieldState } = useController<InquiryContactInput, "message">({
    name: "message",
  })

  return (
    <div className="mt-2 border-t border-grayscale-100 pt-3 md:mt-3 md:pt-4">
      <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
        Project details
      </label>
      <textarea
        {...field}
        id="message"
        rows={2}
        className="w-full rounded-xs border border-grayscale-200 bg-transparent px-4 py-2 text-sm outline-none transition-colors placeholder:text-grayscale-400 hover:border-grayscale-500 focus:border-grayscale-500"
        placeholder="Tell us what products, quantities, service, timeline, or budget range you have in mind."
      />
      {fieldState.error && (
        <p className="mt-2 text-xs text-red-primary">
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}

export const ContactInquiryForm = () => {
  const [selectedRequestType, setSelectedRequestType] =
    React.useState<InquiryContactInput["requestType"]>("business")
  const [status, setStatus] = React.useState<
    | { state: "idle" }
    | { state: "success" }
    | { state: "error"; message: string }
  >({ state: "idle" })

  const onSubmit = async (
    values: InquiryContactInput,
    form: UseFormReturn<InquiryContactInput>
  ) => {
    setStatus({ state: "idle" })

    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const result = (await response.json().catch(() => null)) as {
      message?: string
    } | null

    if (!response.ok) {
      setStatus({
        state: "error",
        message:
          result?.message ||
          "We could not send the inquiry. Please email us directly.",
      })
      return
    }

    form.reset()
    setStatus({ state: "success" })
  }

  return (
    <Form
      schema={inquiryContactSchema}
      onSubmit={onSubmit}
      defaultValues={{
        name: "",
        email: "",
        phone: "",
        company: "",
        requestType: "business",
        otherRequestType: "",
        message: "",
      }}
      formProps={{ className: "block" }}
    >
      {(form) => (
        <div className="grid gap-4 md:gap-5 lg:gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <InputField
              name="name"
              placeholder="Name"
              inputProps={{ uiSize: "md" }}
            />
            <InputField
              name="email"
              type="email"
              placeholder="Email"
              inputProps={{ uiSize: "md" }}
            />
            <InputField
              name="phone"
              type="tel"
              placeholder="Phone"
              inputProps={{ uiSize: "md" }}
            />
            <InputField
              name="company"
              placeholder="Company"
              inputProps={{ uiSize: "md" }}
            />
          </div>

          <div className="grid gap-3">
            <RequestTypeField onChange={setSelectedRequestType} />
            {selectedRequestType === "other" && <OtherRequestTypeField />}
          </div>
          <MessageField />

          {status.state === "success" && (
            <p className="text-sm text-green-700">
              Inquiry sent. We will follow up as soon as possible.
            </p>
          )}
          {status.state === "error" && (
            <p className="text-sm text-red-primary">{status.message}</p>
          )}

          <Button
            type="submit"
            className="w-full md:w-fit"
            isLoading={form.formState.isSubmitting}
            loadingText="Sending"
          >
            Send inquiry
          </Button>
        </div>
      )}
    </Form>
  )
}
