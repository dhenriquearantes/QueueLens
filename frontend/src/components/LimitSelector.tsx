import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const options = [
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
]

export const LimitSelector = ({ onChange }: { onChange: (limit: number) => void }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label className="text-sm font-medium text-white-700">
        Mostrar:
      </Label>
      <Select onValueChange={(value) => onChange(Number(value))}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={options[0].label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-white-500">itens</span>
    </div>
  );
};
