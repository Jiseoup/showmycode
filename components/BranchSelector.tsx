"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  branches: string[];
  current: string;
};

export function BranchSelector({ branches, current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (branch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("branch", branch);
    // Reset file selection — the file may not exist on the new branch.
    params.delete("path");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger className="h-7 text-xs w-full focus:ring-0 focus:ring-offset-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {branches.map((b) => (
          <SelectItem key={b} value={b} className="text-xs">
            {b}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
