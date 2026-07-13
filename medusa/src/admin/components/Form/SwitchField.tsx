import { Label, Switch } from "@medusajs/ui";
import { useController } from "react-hook-form";

export interface SwitchFieldProps {
  className?: string;
  name: string;
  label: string;
  labelProps?: React.ComponentProps<typeof Label>;
  switchProps?: Omit<React.ComponentProps<typeof Switch>, "checked" | "id">;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  className,
  name,
  label,
  labelProps,
  switchProps,
}) => {
  const { field } = useController<{ __name__: boolean }, "__name__">({
    name: name as "__name__",
  });

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Switch
          {...switchProps}
          id={name}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
        />
        <Label {...labelProps} htmlFor={name}>
          {label}
        </Label>
      </div>
    </div>
  );
};
