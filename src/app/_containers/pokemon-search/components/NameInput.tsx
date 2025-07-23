import { Input } from '@/components/input';

type NameInputProps = {
  value: string;
  onChange: (name: string) => void;
};

export function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold">名前</label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: ピカチュウ"
        className="w-full"
      />
    </div>
  );
}
