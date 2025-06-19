"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/select";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Search } from "lucide-react"
import { PokedexSelect } from "./PokedexSelect";
import type { PokedexGroup } from "./PokedexSelect";
import { Type } from "@prisma/client";

export type PokemonFilterDialogProps = {
  pokedexOptions: PokedexGroup[];
  typeOptions: Type[];
  initialSlug: string;
  initialType1: string;
  initialType2: string;
  initialName: string;
  onApply: (slug: string, type1: string, type2: string, name: string) => void;
};

export function PokemonFilterDialog({
  pokedexOptions,
  typeOptions,
  initialSlug,
  initialType1,
  initialType2,
  initialName,
  onApply,
}: PokemonFilterDialogProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [type1, setType1] = useState(initialType1);
  const [type2, setType2] = useState(initialType2);
  const [name, setName] = useState(initialName);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply(slug, type1, type2, name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white text-black border-gray-300">
          <Search className="h-4 w-4 mr-2" />
          フィルター
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>検索フィルター</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="block mb-1 font-semibold text-sm text-muted-foreground">図鑑</label>
            <PokedexSelect value={slug} onChange={setSlug} options={pokedexOptions} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-sm text-muted-foreground">タイプ1</label>
              <Select value={type1} onValueChange={setType1}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {typeOptions.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name_ja}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-sm text-muted-foreground">タイプ2</label>
              <Select value={type2} onValueChange={setType2}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {typeOptions.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.name_ja}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm text-muted-foreground">名前</label>
            <Input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: ピカチュウ"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <button type="button" onClick={handleApply} className="w-full font-semibold px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">適用</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
